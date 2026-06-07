$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$NodeDir = Get-ChildItem -LiteralPath (Join-Path $ProjectRoot ".runtime") -Directory -Filter "node-v22.*-win-x64" |
  Sort-Object Name -Descending |
  Select-Object -First 1

if (-not $NodeDir) {
  throw "Node 22 runtime not found under .runtime"
}

$env:PATH = "$($NodeDir.FullName);$(Join-Path $ProjectRoot ".runtime\ffmpeg\bin");$env:PATH"
Set-Location -LiteralPath (Join-Path $ProjectRoot "frontend")
& (Join-Path $NodeDir.FullName "npm.cmd") run dev
