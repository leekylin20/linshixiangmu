param(
  [Parameter(Mandatory = $true)]
  [string]$TargetDir,
  [switch]$Apply
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$monthChar = [char]0x6708
$dayChar = [char]0x65E5
$fullWidthColon = [char]0xFF1A
$quoteL = [char]0x201C
$quoteR = [char]0x201D
$qrText = [string]([char]0x4E8C) + [char]0x7EF4 + [char]0x7801
$allText = [string]([char]0x5168) + [char]0x90E8
$moreText = [string]([char]0x67E5) + [char]0x770B + [char]0x66F4 + [char]0x591A + [char]0x7CBE + [char]0x5F69 + [char]0x77AC + [char]0x95F4
$followText = [string]([char]0x5173) + [char]0x6CE8

$monthDayPattern = '^\d{1,2}' + [regex]::Escape([string]$monthChar) + '\d{1,2}' + [regex]::Escape([string]$dayChar) + '([ ]?\d{1,2}:\d{2})?$'
$relativeTimePattern = '^([0-9]{1,2}|[A-Za-z]+).{0,4}前$'

function Test-IsMetaLine {
  param([string]$Line)

  if (-not $Line) { return $true }
  if ($Line -match '^(#|\.jpg|\.png|\.jpeg|\.webp|\.gif|\.mp4|[0-9]+|[0-9]+[kK]?(\.[0-9]+)?|[0-9]+分享)$') { return $true }
  if ($Line -match '^\d{1,2}:\d{2}$') { return $true }
  if ($Line -match '^\d{4}[-/]\d{1,2}[-/]\d{1,2}([ T]\d{1,2}:\d{2})?$') { return $true }
  if ($Line -match $monthDayPattern) { return $true }
  if ($Line -match $relativeTimePattern) { return $true }
  if ($Line -eq $allText) { return $true }
  if ($Line -eq $followText) { return $true }
  if ($Line.Contains($moreText)) { return $true }
  if ($Line -match '^[A-Za-z0-9_-]{20,}$') { return $true }
  if ($Line -eq 'Soul') { return $true }
  if ($Line.Length -ge 2 -and $Line.ToLower().Contains('qr')) { return $true }
  if ($Line.Contains($qrText)) { return $true }
  if ($Line.StartsWith('#')) { return $true }
  return $false
}

function Get-ReadableTitle {
  param([string]$Path)

  $lines = Get-Content -LiteralPath $Path -Encoding UTF8
  $contentStart = [Array]::IndexOf($lines, '# Content')
  if ($contentStart -lt 0) { return $null }

  $candidates = New-Object System.Collections.Generic.List[string]
  $limit = [Math]::Min($lines.Length - 1, $contentStart + 18)
  $seenTimeMarker = $false

  for ($i = $contentStart + 1; $i -le $limit; $i++) {
    $line = $lines[$i].Trim()
    if (-not $line) { continue }
    $line = $line.Replace($fullWidthColon, ':')
    $line = $line.Replace($quoteL, '"').Replace($quoteR, '"')
    if (-not $seenTimeMarker) {
      if (($line -match '^\d{1,2}:\d{2}$') -or ($line -match $monthDayPattern) -or ($line -match $relativeTimePattern)) {
        $seenTimeMarker = $true
      }
      continue
    }
    if (Test-IsMetaLine -Line $line) { continue }
    $candidates.Add($line)
  }

  if ($candidates.Count -eq 0) { return $null }

  if ($candidates.Count -ge 2 -and $candidates[0].Length -le 14 -and $candidates[1].Length -le 20) {
    return ($candidates[0] + $candidates[1])
  }

  foreach ($candidate in $candidates) {
    if ($candidate.Length -ge 9) { return $candidate }
  }

  if ($candidates.Count -ge 2) {
    return ($candidates[0] + '_' + $candidates[1])
  }

  return $candidates[0]
}

function Clean-FileStem {
  param([string]$Title)

  if (-not $Title) { return $null }

  $clean = $Title.Replace($fullWidthColon, ':')
  $clean = $clean.Replace($quoteL, '"').Replace($quoteR, '"')
  $clean = $clean.Replace($moreText, '')
  $clean = $clean.Replace($allText, '')
  $clean = $clean.Replace($followText, '')
  $clean = $clean -replace '[<>:"/\\|?*]', ''
  $clean = $clean -replace '[`r`n`t]', ' '
  $clean = $clean -replace '\s+', ' '
  $clean = $clean -replace '^[\s\.\-_]+|[\s\.\-_]+$', ''
  $clean = $clean -replace '[,;]+$', ''
  $clean = $clean -replace $monthDayPattern, ''
  $clean = $clean -replace '^[0-9]{1,2}:\d{2}$', ''
  if (-not $clean) { return $null }
  if ($clean.Length -gt 36) { $clean = $clean.Substring(0, 36).Trim() }
  return $clean
}

function Get-UniqueFileName {
  param(
    [string]$Directory,
    [string]$BaseName,
    [hashtable]$Reserved
  )

  $candidate = "$BaseName.md"
  $index = 2
  while ($Reserved.ContainsKey($candidate) -or (Test-Path -LiteralPath (Join-Path $Directory $candidate))) {
    $candidate = "{0}_{1}.md" -f $BaseName, $index
    $index++
  }
  $Reserved[$candidate] = $true
  return $candidate
}

$files = Get-ChildItem -LiteralPath $TargetDir -File |
  Where-Object { $_.Name -match '^[0-9]+_[a-f0-9]{16,}\.md$' } |
  Sort-Object Name

$reserved = @{}
$plan = foreach ($file in $files) {
  if ($file.BaseName -notmatch '^(?<prefix>[0-9]+)_') { continue }
  $prefix = $Matches['prefix']
  $title = Get-ReadableTitle -Path $file.FullName
  $stem = Clean-FileStem -Title $title
  if (-not $stem) { $stem = 'pending_title' }
  $targetName = Get-UniqueFileName -Directory $TargetDir -BaseName "${prefix}_${stem}" -Reserved $reserved

  [pscustomobject]@{
    OldName = $file.Name
    NewName = $targetName
    Changed = ($file.Name -ne $targetName)
    Title   = $title
  }
}

if (-not $Apply) {
  $plan | Select-Object -First 60 OldName, NewName, Title | Format-Table -Wrap -AutoSize
  $changedCount = ($plan | Where-Object Changed).Count
  Write-Host ""
  Write-Host "Preview only. Planned renames: $changedCount / $($plan.Count)"
  exit 0
}

$renamed = 0
foreach ($item in $plan | Where-Object Changed) {
  Rename-Item -LiteralPath (Join-Path $TargetDir $item.OldName) -NewName $item.NewName
  $renamed++
}

$plan | Where-Object Changed | Select-Object OldName, NewName | Format-Table -Wrap -AutoSize
Write-Host ""
Write-Host "Renamed $renamed files."
