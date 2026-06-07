$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Set-Location -LiteralPath $PSScriptRoot
$Host.UI.RawUI.WindowTitle = "直播间背景生成器"

$env:LIVESTREAM_BG_API_BASE = "https://dm-fox.rjj.cc/codex"
$env:LIVESTREAM_BG_MODEL = "gpt-image-2"
$env:LIVESTREAM_BG_SIZE = "1536x1024"
$env:LIVESTREAM_BG_QUALITY = "high"

Write-Host "直播间背景生成器"
Write-Host "API: $env:LIVESTREAM_BG_API_BASE/v1/images/edits"
Write-Host ""

try {
  $node = (Get-Command node -ErrorAction Stop).Source
} catch {
  Write-Host "未找到 node 命令。"
  Read-Host "按回车退出"
  exit 1
}

if (Test-Path -LiteralPath (Join-Path $PSScriptRoot "api-config.local.json")) {
  Write-Host "已检测到本地 API 配置，将直接启动。"
} else {
  $env:LIVESTREAM_BG_API_KEY = Read-Host "请输入 API Key"
  if ([string]::IsNullOrWhiteSpace($env:LIVESTREAM_BG_API_KEY)) {
    Write-Host "未输入 API Key，已取消启动。"
    Read-Host "按回车退出"
    exit 1
  }
}

Start-Job -ScriptBlock {
  Start-Sleep -Seconds 1
  Start-Process "http://127.0.0.1:8732/"
} | Out-Null

try {
  & $node "server.js" "8732"
} catch {
  Write-Host ""
  Write-Host "服务启动失败：$($_.Exception.Message)"
}

Write-Host ""
Read-Host "服务已退出。按回车关闭窗口"
