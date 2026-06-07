[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$WorkspaceRoot = Split-Path -Parent $Root
$Repo = Join-Path $Root 'repos\skills'
$DestRoot = Join-Path $WorkspaceRoot '.agents\skills'
$Skills = @('browser-act', 'browser-act-skill-forge')

New-Item -ItemType Directory -Force -Path $DestRoot | Out-Null

foreach ($Skill in $Skills) {
    $Source = Join-Path $Repo $Skill
    $Dest = Join-Path $DestRoot $Skill

    if (-not (Test-Path -LiteralPath (Join-Path $Source 'SKILL.md'))) {
        throw "Missing skill source: $Source"
    }

    if (Test-Path -LiteralPath $Dest) {
        Write-Host "Already installed: $Skill -> $Dest"
        continue
    }

    Copy-Item -LiteralPath $Source -Destination $Dest -Recurse
    Write-Host "Installed: $Skill -> $Dest"
}

Write-Host "Restart Codex to pick up new skills."
