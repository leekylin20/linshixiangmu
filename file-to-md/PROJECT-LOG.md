# PROJECT-LOG

## 2026-04-20

- 从 `E:\子木的技能树\tools\file-to-md` 迁移 `file-to-md` 项目到 `E:\临时项目\file-to-md`
- 保留项目代码与依赖：`index.js`、`package.json`、`package-lock.json`、`README.md`、`node_modules/`
- 更新 README 中的运行目录路径，避免继续引用技能树目录
- 清理技能树内本次产生的 `output/file-to-md*` 测试目录，避免在技能树内留痕

## 当前状态

- PDF 批量转 Markdown 已验证可用
- 音视频链路依赖可用的 `ffmpeg.exe` 与支持转写接口的 API 网关

## 2026-04-20 修复补充

- 修复默认模型与 `response_format` 不兼容的问题：
  - `gpt-4o-transcribe` / `gpt-4o-mini-transcribe` 自动使用 `json`
  - `whisper-1` 自动使用 `verbose_json`
- 修复 `npm run scan` 缺少 `--input` 的问题，改为默认扫描当前目录
- 修复单请求超时参数传递位置，改为通过 OpenAI SDK 的第二个 `options` 参数传入
- 修复帮助文本示例路径乱码
- 修复迁移后的默认输出目录与 `.env` 读取路径，避免继续指向技能树外层路径

## 2026-04-21

- 路线决策：放弃纯本地离线转写，后续采用 `OpenAI` 音频转写接口
- 原因：比纯本地省时间、比部分商用方案更便宜，且接入当前脚本最顺
- 当前结论：
  - `PDF` 继续本地抽文本，不走 API
  - `音频 / 视频` 走 `OpenAI` 转写
  - 明天继续把 `OpenAI` 路线补成可直接批量跑的版本
- 待继续内容已同步到 `NEXT-STEPS.md`
