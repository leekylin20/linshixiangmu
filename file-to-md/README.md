# file-to-md

把目录里的 PDF、音频、视频批量转成 Markdown，并保持原目录结构。

## 当前能力

- PDF：直接提取可复制文本，输出 `xxx.pdf.md`
- 音频 / 视频：先转成 16k 单声道 mp3 小片段，再调用 OpenAI 转写，输出 `xxx.mp4.md`
- 批量处理：递归扫描目录，生成 `_run-summary.json` 记录成功 / 跳过 / 失败

## 当前限制

- 扫描版 PDF 没有做 OCR；如果 PDF 里本来没有文字，只会生成提示说明
- 音视频转写依赖 API Key，而且你使用的网关必须支持音频转写接口；不支持时会超时或失败
- 默认只处理 `pdf/mp3/wav/m4a/aac/flac/ogg/opus/wma/mp4/mov/mkv/flv/avi/webm/m4v`
- `gpt-4o-transcribe` / `gpt-4o-mini-transcribe` 会自动用 `json` 返回；`whisper-1` 会自动用 `verbose_json`

## 安装

```powershell
cd E:\临时项目\file-to-md
npm install
```

如果内置 `ffmpeg-static` 在你的 Windows 上不可执行，直接指定你本机的 `ffmpeg.exe`：

```powershell
$env:FFMPEG_PATH="C:\path\to\ffmpeg.exe"
```

## 先试跑扫描

```powershell
cd E:\临时项目\file-to-md
npm run scan
```

或者指定目标目录：

```powershell
cd E:\临时项目\file-to-md
node index.js --input "D:\下载\新建文件夹 (2)" --dry-run
```

## 正式运行

```powershell
cd E:\临时项目\file-to-md
$env:OPENAI_API_KEY="你的 key"
$env:OPENAI_BASE_URL="https://api.openai.com/v1"
node index.js --input "D:\下载\新建文件夹 (2)" --output "D:\下载\新建文件夹 (2)\_md" --concurrency 2
```

## 常用参数

```text
--types pdf,audio,video
--model gpt-4o-mini-transcribe
--base-url https://api.openai.com/v1
--ffmpeg-path C:\path\to\ffmpeg.exe
--language zh
--request-timeout-ms 15000
--max-files 10
--overwrite
--segment-seconds 1200
```

## 推荐执行顺序

1. 先 `--dry-run` 看数量
2. 再 `--max-files 3` 跑小样本
3. 确认输出格式没问题后，再全量跑
