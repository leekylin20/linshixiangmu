param(
  [Parameter(Mandatory = $true)]
  [string]$Keyword
)

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
. "$PSScriptRoot\use_local_cache.ps1"

$LocalPython = Join-Path $ProjectRoot ".venv\Scripts\python.exe"
if (Test-Path $LocalPython) {
  & $LocalPython "$ProjectRoot\src\query_memory.py" $Keyword
  exit $LASTEXITCODE
}

$ConfiguredPython = $env:THIRD_BRAIN_PYTHON
if ($ConfiguredPython -and (Test-Path $ConfiguredPython)) {
  & $ConfiguredPython "$ProjectRoot\src\query_memory.py" $Keyword
  exit $LASTEXITCODE
}

$PythonCommand = Get-Command python -ErrorAction SilentlyContinue
if ($PythonCommand) {
  & $PythonCommand.Source "$ProjectRoot\src\query_memory.py" $Keyword
  exit $LASTEXITCODE
}

$PyCommand = Get-Command py -ErrorAction SilentlyContinue
if ($PyCommand) {
  & $PyCommand.Source "$ProjectRoot\src\query_memory.py" $Keyword
  exit $LASTEXITCODE
}

throw "No Python executable found. Set THIRD_BRAIN_PYTHON or create .venv inside E:\临时项目\第三大脑."
