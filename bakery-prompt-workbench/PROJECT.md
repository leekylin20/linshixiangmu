# bakery-prompt-workbench

## 用途

- 独立归档并生成「烘焙面包店视频母版生成提示词｜无品牌可复用版」。
- 用于烘焙短视频封面、直播背景、门店设计展示和获客素材 prompt。

## 当前状态

状态：reusable

## 创建或引入时间

- 2026-06-05

## 启动方式

```powershell
Start-Process 'E:\临时项目\bakery-prompt-workbench\index.html'
```

## 关键路径

- 页面入口：`E:\临时项目\bakery-prompt-workbench\index.html`
- 入档模板：`E:\临时项目\bakery-prompt-workbench\templates\bakery-bread-video-master-unbranded-v01.md`
- 默认输出：`E:\临时项目\bakery-prompt-workbench\output\default-bakery-bread-video-master-prompt.json`

## 依赖与运行时

- 静态 HTML/JS，无外部依赖。

## 最近结论

- 已生成默认提示词输出。
- 默认输出文件：`output\default-bakery-bread-video-master-prompt.json`。
- 默认 audit 状态为 pass。
- 已合并「自动随机生成 30 份提示词调度指令」。
- 批量输出文件：`output\bakery-batch-30-prompts.json`。
- 30 条批量 prompt audit 全部 pass。
- 已新增 `scripts\review-optimize-from-pasted.js`，可解析用户粘贴的 30 份烘焙 prompt 并按工作台框架重编译。
- 本轮审查优化输出：`output\bakery-reviewed-optimized-30-prompts.txt`，30 条 audit 全部 pass。

## 保留或删除判断

- 保留理由：烘焙类视频母版 prompt 可复用，适合独立于通用品类绿幕工作台保存。
- 可删除条件：该模板迁移到正式提示词系统且确认独立工作台不再需要。

## 下一步

- 后续如需更细，可为 30 条批量输出增加图片验收记录字段。
