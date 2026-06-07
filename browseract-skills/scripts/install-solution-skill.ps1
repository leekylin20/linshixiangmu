[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$Name
)

$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$WorkspaceRoot = Split-Path -Parent $Root
$Solutions = Join-Path $Root 'repos\skills\solutions'
$DestRoot = Join-Path $WorkspaceRoot '.agents\skills'

if (-not (Test-Path -LiteralPath $Solutions)) {
    throw "Solutions directory not found: $Solutions"
}

$Matches = Get-ChildItem -LiteralPath $Solutions -Directory -Recurse |
    Where-Object { $_.Name -eq $Name -and (Test-Path -LiteralPath (Join-Path $_.FullName 'SKILL.md')) }

if ($Matches.Count -eq 0) {
    throw "No solution skill found named '$Name'. See docs\INSTALLABLE_SKILLS.md."
}

if ($Matches.Count -gt 1) {
    $Paths = ($Matches | ForEach-Object { $_.FullName }) -join "`n"
    throw "Multiple solution skills matched '$Name':`n$Paths"
}

New-Item -ItemType Directory -Force -Path $DestRoot | Out-Null

$Source = $Matches[0].FullName
$Dest = Join-Path $DestRoot $Name

if (Test-Path -LiteralPath $Dest) {
    throw "Destination already exists: $Dest"
}

Copy-Item -LiteralPath $Source -Destination $Dest -Recurse
Write-Host "Installed: $Name -> $Dest"
Write-Host "Restart Codex to pick up new skills."
