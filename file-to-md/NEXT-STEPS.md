# NEXT-STEPS

## 2026-04-21 决策

- 已确定后续采用 `OpenAI` 作为音视频转写后端
- `PDF` 仍然本地提取文本，不调用 API

## 明天继续时直接做

1. 检查 `.env` 中 `OPENAI_API_KEY` 与 `OPENAI_BASE_URL` 是否为真实可用配置
2. 用 `1` 个最短音视频样本做端到端 smoke test
3. 确认 `gpt-4o-mini-transcribe` 的实际响应速度和成功率
4. 如果正常，再跑 `3-5` 个样本验证批处理稳定性
5. 最后再决定是否全量跑 `D:\下载\新建文件夹 (2)`

## 已知前提

- 项目目录：`E:\临时项目\file-to-md`
- 可用 ffmpeg：
  - `C:\Users\麒麟\Desktop\直播客户数据\OBS直播波形图和示波器小工具V1\ffmpeg\bin\ffmpeg.exe`
- 已修复问题：
  - `response_format` 与模型兼容性
  - `npm run scan` 缺参
  - 单请求超时参数位置错误
  - 默认输出目录与 `.env` 路径仍留在技能树的问题

## 建议起手命令

```powershell
cd E:\临时项目\file-to-md
node index.js --input "D:\下载\新建文件夹 (2)" --dry-run
```
