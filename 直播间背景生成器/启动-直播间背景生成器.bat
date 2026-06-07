@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 直播间背景生成器

set "LIVESTREAM_BG_API_BASE=https://dm-fox.rjj.cc/codex"
set "LIVESTREAM_BG_MODEL=gpt-image-2"
set "LIVESTREAM_BG_SIZE=1536x1024"
set "LIVESTREAM_BG_QUALITY=high"

echo 直播间背景生成器
echo API: %LIVESTREAM_BG_API_BASE%/v1/images/edits
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo 未找到 node 命令，请确认 Node.js 已安装并加入 PATH。
  echo.
  cmd /k
  exit /b 1
)

if exist "api-config.local.json" (
  echo 已检测到本地 API 配置，将直接启动。
  goto start_server
)

set /p "LIVESTREAM_BG_API_KEY=请输入 API Key: "

if "%LIVESTREAM_BG_API_KEY%"=="" (
  echo 未输入 API Key，已取消启动。
  echo.
  cmd /k
  exit /b 1
)

:start_server
start "" cmd /c "timeout /t 1 >nul & start http://127.0.0.1:8732/"
node server.js 8732
echo.
echo 服务已退出。上方如果有报错，请把报错内容发给我。
cmd /k
