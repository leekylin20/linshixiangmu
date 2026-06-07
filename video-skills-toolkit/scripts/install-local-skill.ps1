param(
    [Parameter(Mandatory = $true)]
    [string]$SkillPath,

    [Parameter(Mandatory = $true)]
    [string]$Name,

    [string]$DestinationRoot = "E:\临时项目\.agents\skills",

    [switch]$Force
)

$ErrorActionPreference = "Stop"

$toolkitRoot = Split-Path -Parent $PSScriptRoot
$source = Join-Path $toolkitRoot $SkillPath

if (-not (Test-Path -Path $source -PathType Container)) {
    throw "SkillPath does not exist: $source"
}

$skillFile = Join-Path $source "SKILL.md"
if (-not (Test-Path -Path $skillFile -PathType Leaf)) {
    throw "SKILL.md not found in source directory: $source"
}

New-Item -ItemType Directory -Force -Path $DestinationRoot | Out-Null
$destination = Join-Path $DestinationRoot $Name

if (Test-Path -Path $destination) {
    if (-not $Force) {
        throw "Destination already exists: $destination. Use -Force to overwrite."
    }

    $resolvedRoot = [IO.Path]::GetFullPath($DestinationRoot)
    $resolvedDest = [IO.Path]::GetFullPath($destination)
    if (-not $resolvedDest.StartsWith($resolvedRoot, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Refusing to delete destination outside DestinationRoot: $resolvedDest"
    }
    Remove-Item -Path $destination -Recurse -Force
}

Copy-Item -Path $source -Destination $destination -Recurse

[pscustomobject]@{
    Name = $Name
    Source = $source
    Destination = $destination
    Message = "Installed. Restart Codex to pick up the skill."
}
