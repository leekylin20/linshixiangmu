$ErrorActionPreference = 'Stop'

$ProjectRoot = 'E:\临时项目'
$DashboardRoot = Join-Path $ProjectRoot 'skill-dashboard'
$IndexHtml = Join-Path $DashboardRoot 'index.html'
$SnapshotMd = Join-Path $ProjectRoot '_索引\技能目录快照.md'
$Roots = @(
  @{ Label = 'E 盘技能'; Path = Join-Path $ProjectRoot '_system\codex-skills' },
  @{ Label = '.agents'; Path = Join-Path $ProjectRoot '.agents\skills' }
)

function Get-FrontMatterValue {
  param(
    [string]$Text,
    [string]$Key
  )

  if ($Text -match "(?m)^$([regex]::Escape($Key)):\s*\|\s*$") {
    $lines = $Text -split "`r?`n"
    $start = -1
    for ($i = 0; $i -lt $lines.Count; $i++) {
      if ($lines[$i] -match "^$([regex]::Escape($Key)):\s*\|\s*$") {
        $start = $i + 1
        break
      }
    }
    if ($start -ge 0) {
      $body = New-Object System.Collections.Generic.List[string]
      for ($j = $start; $j -lt $lines.Count; $j++) {
        $line = $lines[$j]
        if ($line -match '^[A-Za-z0-9_-]+:\s*' -or $line -match '^---\s*$') { break }
        if ($line.Trim()) { $body.Add($line.Trim()) }
      }
      return (($body | Select-Object -First 3) -join ' ')
    }
  }

  $pattern = "(?m)^$([regex]::Escape($Key)):\s*(.+)$"
  if ($Text -match $pattern) {
    return $matches[1].Trim().Trim('"').Trim("'")
  }
  return $null
}

function Get-Category {
  param(
    [string]$Name,
    [string]$Dir,
    [string]$Description
  )

  $idText = (($Name, $Dir) -join ' ').ToLowerInvariant()
  if ($idText -match 'gmgn|moss-trade|trade-bot|token|wallet|swap|cooking|market|portfolio|track') { return '加密与量化' }
  if ($idText -match 'getnote|xhs-comment|笔记|评论采集') { return '笔记采集与知识库' }
  if ($idText -match 'emotion|conversation|情绪|沟通') { return '沟通与文案' }
  if ($idText -match 'hub|podcast|transcribe|语音|播客|转写') { return '语音音频与转写' }
  if ($idText -match 'card|slice|video|好看的卡片|小红书封面|封面|卡片|短视频') { return '卡片与短视频' }
  if ($idText -match 'imagegen|portrait|brand|photo|照片|人像|视觉') { return '视觉与生图' }
  if ($idText -match 'openai|plugin|skill|docs|installer|creator') { return '系统与开发' }

  $text = (($Name, $Dir, $Description) -join ' ').ToLowerInvariant()
  if ($text -match 'gmgn|token|wallet|swap|launchpad|crypto|meme|交易|回测|bot|k线|量化') { return '加密与量化' }
  if ($text -match 'podcast|transcribe|tts|voice|audio|dub|subtitle|语音|播客|转写|翻译|配音') { return '语音音频与转写' }
  if ($text -match 'get笔记|note|xhs-comment|comment|知识库|笔记|评论采集') { return '笔记采集与知识库' }
  if ($text -match 'emotion|conversation|reply|沟通|情绪|回复') { return '沟通与文案' }
  if ($text -match 'card|slice|video|小红书封面|图文|短视频|卡片|封面|poster') { return '卡片与短视频' }
  if ($text -match 'image|photo|portrait|brand|visual|comfyui|生图|人像|照片|视觉|背景') { return '视觉与生图' }
  if ($text -match 'openai|plugin|skill|docs|installer|creator|api') { return '系统与开发' }
  return '系统与开发'
}

function Get-Group {
  param([string]$Category)
  switch ($Category) {
    '视觉与生图' { 'visual' }
    '卡片与短视频' { 'content' }
    '语音音频与转写' { 'audio' }
    '笔记采集与知识库' { 'knowledge' }
    '沟通与文案' { 'conversation' }
    '加密与量化' { 'trading' }
    default { 'system' }
  }
}

function Get-CallName {
  param(
    [string]$Name,
    [string]$Dir
  )
  $base = ($Name -split '\s*/\s*')[0].Trim()
  if (-not $base) { $base = $Dir }
  return '$' + $base
}

$skills = New-Object System.Collections.Generic.List[object]

foreach ($root in $Roots) {
  if (-not (Test-Path -LiteralPath $root.Path)) { continue }
  $skillFiles = Get-ChildItem -LiteralPath $root.Path -Recurse -Filter SKILL.md -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notlike '*\female-portrait-director\skill\*' }

  foreach ($file in $skillFiles) {
    $dir = Split-Path (Split-Path $file.FullName -Parent) -Leaf
    $text = Get-Content -LiteralPath $file.FullName -Encoding UTF8 -Raw
    $name = Get-FrontMatterValue -Text $text -Key 'name'
    if (-not $name) { $name = $dir }
    $description = Get-FrontMatterValue -Text $text -Key 'description'
    if (-not $description) {
      $description = (($text -split "`r?`n") | Where-Object { $_.Trim() -and $_ -notmatch '^---' } | Select-Object -First 1).Trim()
    }

    $source = $root.Label
    if ($file.FullName -like '*\.system\*') { $source = '系统内置' }
    $category = Get-Category -Name $name -Dir $dir -Description $description
    $skills.Add([ordered]@{
      name = $name
      call = Get-CallName -Name $name -Dir $dir
      category = $category
      group = Get-Group -Category $category
      source = $source
      root = $root.Path
      path = $file.FullName
      desc = $description
    })
  }
}

$skillsSorted = $skills | Sort-Object category, name
$json = $skillsSorted | ConvertTo-Json -Depth 6
$html = Get-Content -LiteralPath $IndexHtml -Encoding UTF8 -Raw
$replacement = "const skills = $json;`r`n`r`n    const categoryOrder"
$html = [regex]::Replace($html, 'const skills = \[[\s\S]*?\];\s+const categoryOrder', [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $replacement }, 1)
Set-Content -LiteralPath $IndexHtml -Encoding UTF8 -Value $html

$now = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
$snapshot = New-Object System.Collections.Generic.List[string]
$snapshot.Add('# 临时项目技能目录快照')
$snapshot.Add('')
$snapshot.Add("更新时间：$now")
$snapshot.Add('')
$snapshot.Add("技能总数：$($skillsSorted.Count)")
$snapshot.Add('')

$categoryOrder = @('视觉与生图', '卡片与短视频', '语音音频与转写', '笔记采集与知识库', '沟通与文案', '加密与量化', '系统与开发')
foreach ($category in $categoryOrder) {
  $categorySkills = $skillsSorted | Where-Object { $_.category -eq $category }
  if (-not $categorySkills) { continue }
  $snapshot.Add("## $category")
  foreach ($skill in $categorySkills) {
    $snapshot.Add("- ``$($skill.call)`` $($skill.name)")
    $snapshot.Add("  - 来源：$($skill.source)")
    $snapshot.Add("  - 路径：``$($skill.path)``")
    $snapshot.Add("  - 用途：$($skill.desc)")
  }
  $snapshot.Add('')
}

Set-Content -LiteralPath $SnapshotMd -Encoding UTF8 -Value ($snapshot -join "`r`n")

Write-Output "Updated $IndexHtml"
Write-Output "Updated $SnapshotMd"
Write-Output "Skills: $($skillsSorted.Count)"


