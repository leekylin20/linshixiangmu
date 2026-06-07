$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Set-Location -LiteralPath $PSScriptRoot
$Host.UI.RawUI.WindowTitle = "直接生成一次"

$apiBase = "https://dm-fox.rjj.cc/codex"
$endpoint = "$apiBase/v1/images/generations"
$model = "gpt-image-2"
$size = "1088x1920"
$quality = "high"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$outputPath = Join-Path $PSScriptRoot "output_direct_$timestamp.png"
$statusPath = Join-Path $PSScriptRoot "output_direct_status.json"

$prompt = @"
为“超能食品用洗洁精”生成一张 9:16 竖版直播间背景图。

产品参考：厨房清洁/食品用洗洁精品类，包装主视觉为明亮黄橙色西柚、清新绿色柠檬、粉色桃子等水果色系，泵头瓶造型，品牌感干净明亮。

直播间背景要求：
1. 真实直播间空间，不要平面海报；有前景、中景、远景层次。
2. 主题为厨房清洁直播间，干净白色厨房台面、柔和自然光、水槽或清洁场景元素。
3. 画面保留主播主视觉，完整露出脸、肩、胸部和至少一只手势，像正在直播间讲解产品。
4. 产品只放在前景展示台上作为小型展示商品，主产品高度控制在画面高度 16% 到 22%，最多不超过 25%，不能遮挡主播脸部、胸部和主要手势。
5. 右侧只保留一个小型空白信息卡占位，左侧只保留 2 到 3 个小徽章占位，底部只保留短而克制的空白服务栏占位。
6. 画面保留产品展示区，货架或展示台可摆放少量同类洗洁精，占位瓶身使用黄橙、绿色、粉色水果色系。
7. 背景色参考产品配色：黄橙、柠檬绿、浅粉、白色，整体清爽、明亮、适合直播带货。
8. 不要生成任何正式标题文字、品牌文字、价格文字、卖点文字、底部服务文字、直播优惠文字或中文宣传语；所有文字区域只保留干净的空白标签框、空白徽章、空白信息卡，方便后期叠加真实文字。
9. 所有重要元素明显向中间收拢，左右边缘只保留背景、植物、柔光或虚化装饰；不要显示安全线、虚线、参考线、裁切线。
10. 输出竖版 9:16，适合后续导出为 1080x1920 PNG。
"@

Write-Host "直接生成一次"
Write-Host "API: $endpoint"
Write-Host "Model: $model"
Write-Host "Size: $size"
Write-Host ""

$apiKey = Read-Host "请输入 API Key"
if ([string]::IsNullOrWhiteSpace($apiKey)) {
  Write-Host "未输入 API Key，已取消。"
  Read-Host "按回车退出"
  exit 1
}

$body = @{
  model = $model
  prompt = $prompt
  size = $size
  quality = $quality
  n = 1
} | ConvertTo-Json -Depth 5

try {
  Write-Host "正在请求图片生成..."
  $response = Invoke-RestMethod -Method Post -Uri $endpoint -Headers @{
    Authorization = "Bearer $apiKey"
    "Content-Type" = "application/json"
  } -Body $body -TimeoutSec 180

  $image = $null
  if ($response.data -and $response.data[0].b64_json) {
    $image = $response.data[0].b64_json
  } elseif ($response.data -and $response.data[0].url) {
    $url = [string]$response.data[0].url
    Write-Host "正在下载返回图片..."
    Invoke-WebRequest -Uri $url -OutFile $outputPath -TimeoutSec 180 | Out-Null
  } else {
    throw "API 返回中没有 b64_json 或 url。"
  }

  if ($image) {
    [IO.File]::WriteAllBytes($outputPath, [Convert]::FromBase64String($image))
  }

  @{
    ok = $true
    output = $outputPath
    endpoint = $endpoint
    model = $model
    size = $size
    createdAt = (Get-Date).ToString("s")
  } | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $statusPath -Encoding UTF8

  Write-Host ""
  Write-Host "生成完成：$outputPath"
  Start-Process $outputPath
} catch {
  @{
    ok = $false
    error = $_.Exception.Message
    endpoint = $endpoint
    model = $model
    size = $size
    createdAt = (Get-Date).ToString("s")
  } | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $statusPath -Encoding UTF8

  Write-Host ""
  Write-Host "生成失败：$($_.Exception.Message)"
}

Write-Host ""
Read-Host "按回车关闭窗口"
