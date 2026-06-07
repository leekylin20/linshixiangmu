[CmdletBinding()]
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$BrowserActArgs
)

$ErrorActionPreference = 'Stop'

$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$WorkspaceRoot = Split-Path -Parent $ProjectRoot
$SystemRoot = Join-Path $WorkspaceRoot '_system'
$UvBin = Join-Path $SystemRoot 'uv-bin'
$BrowserActExe = Join-Path $UvBin 'browser-act.exe'

$env:UV_CACHE_DIR = Join-Path $SystemRoot 'uv-cache'
$env:UV_TOOL_DIR = Join-Path $SystemRoot 'uv-tools'
$env:UV_TOOL_BIN_DIR = $UvBin
$env:UV_PYTHON_INSTALL_DIR = Join-Path $SystemRoot 'uv-python'
$env:BROWSERACT_DATA_DIR = Join-Path $SystemRoot 'browseract-data'
$env:PATH = "$UvBin;$env:PATH"

New-Item -ItemType Directory -Force -Path `
    $env:UV_CACHE_DIR, `
    $env:UV_TOOL_DIR, `
    $env:UV_TOOL_BIN_DIR, `
    $env:UV_PYTHON_INSTALL_DIR, `
    $env:BROWSERACT_DATA_DIR | Out-Null

if (-not (Test-Path -LiteralPath $BrowserActExe)) {
    throw "browser-act.exe not found: $BrowserActExe"
}

& $BrowserActExe @BrowserActArgs
exit $LASTEXITCODE
