$ProjectRoot = Split-Path -Parent $PSScriptRoot
$CacheRoot = Join-Path $ProjectRoot "data\cache"

New-Item -ItemType Directory -Force -Path `
  $CacheRoot, `
  (Join-Path $CacheRoot "pip"), `
  (Join-Path $CacheRoot "python"), `
  (Join-Path $CacheRoot "matplotlib"), `
  (Join-Path $CacheRoot "models"), `
  (Join-Path $CacheRoot "akshare"), `
  (Join-Path $CacheRoot "tdx"), `
  (Join-Path $CacheRoot "http") | Out-Null

$env:THIRD_BRAIN_HOME = $ProjectRoot
$env:THIRD_BRAIN_CACHE = $CacheRoot

$env:XDG_CACHE_HOME = $CacheRoot
$env:PIP_CACHE_DIR = Join-Path $CacheRoot "pip"
$env:PYTHONPYCACHEPREFIX = Join-Path $CacheRoot "python"
$env:MPLCONFIGDIR = Join-Path $CacheRoot "matplotlib"

$env:HF_HOME = Join-Path $CacheRoot "models\huggingface"
$env:TRANSFORMERS_CACHE = Join-Path $CacheRoot "models\huggingface\transformers"
$env:TORCH_HOME = Join-Path $CacheRoot "models\torch"

$env:AKSHARE_CACHE_DIR = Join-Path $CacheRoot "akshare"
$env:TDX_CACHE_DIR = Join-Path $CacheRoot "tdx"
$env:REQUESTS_CACHE_DIR = Join-Path $CacheRoot "http"

