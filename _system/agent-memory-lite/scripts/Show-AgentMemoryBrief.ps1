param(
  [int]$Recent = 8
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$persona = Join-Path $root "persona\persona.md"
$scene = Join-Path $root "scenes\temporary-project.md"
$facts = Join-Path $root "facts\facts.jsonl"
$canvas = Join-Path $root "refs\current-canvas.md"

Write-Output "# Agent Memory Lite Brief"
Write-Output ""

if (Test-Path -LiteralPath $persona) {
  Write-Output "## Persona"
  Get-Content -LiteralPath $persona -Encoding UTF8 | Select-Object -First 80
  Write-Output ""
}

if (Test-Path -LiteralPath $scene) {
  Write-Output "## Scene"
  Get-Content -LiteralPath $scene -Encoding UTF8 | Select-Object -First 80
  Write-Output ""
}

if (Test-Path -LiteralPath $facts) {
  Write-Output "## Recent Facts"
  Get-Content -LiteralPath $facts -Encoding UTF8 | Select-Object -Last $Recent
  Write-Output ""
}

if (Test-Path -LiteralPath $canvas) {
  Write-Output "## Canvas"
  Get-Content -LiteralPath $canvas -Encoding UTF8 | Select-Object -First 60
}

