$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$workspaceRoot = Split-Path -Parent $projectRoot
$systemRoot = Join-Path $workspaceRoot "_system"
$hfCache = Join-Path $systemRoot "hf-cache"

$env:PIP_CACHE_DIR = Join-Path $systemRoot "pip-cache"
$env:HF_HOME = $hfCache
$env:TRANSFORMERS_CACHE = Join-Path $hfCache "transformers"
$env:MODELSCOPE_CACHE = Join-Path $systemRoot "modelscope-cache"
$env:HF_HUB_DISABLE_SYMLINKS_WARNING = "1"
$env:NO_PROXY = "127.0.0.1,localhost,::1"
$env:no_proxy = "127.0.0.1,localhost,::1"

$ffmpegBin = Join-Path $systemRoot "ffmpeg\ffmpeg\ffmpeg-8.1.1-essentials_build\bin"
if (Test-Path $ffmpegBin) {
    $env:PATH = "$ffmpegBin;$env:PATH"
}

$python = Join-Path $projectRoot ".venv\Scripts\python.exe"
$modelPath = Join-Path $hfCache "models--openbmb--VoxCPM2\snapshots\bffb3df5a29440629464e5e839f4d214c8714c3d"

& $python (Join-Path $projectRoot "app.py") --model-id $modelPath --device cuda --port 8808
