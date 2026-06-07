$ErrorActionPreference = "Stop"

$projectDir = Join-Path $PSScriptRoot "wechat-article-exporter-master"

if (-not (Test-Path -LiteralPath $projectDir)) {
    throw "Project directory not found: $projectDir"
}

Set-Location -LiteralPath $projectDir
corepack yarn dev
