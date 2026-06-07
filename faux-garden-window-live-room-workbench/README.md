# 仿真花园窗景直播间提示词生成器

独立工作台：`faux-garden-window-live-room-workbench`

只服务 route：

`faux_garden_window_scenic_livestream_room`

当前只保留两个 9:16 case：

- `empty_front_9x16`
- `host_final_9x16`

暂不接入：

- `wide_overview_16x9`
- 女装 route
- denim / dress / sunproof / large-corner-home 模板
- 总监层
- rewrite 层

## 使用

直接打开：

`E:\临时项目\faux-garden-window-live-room-workbench\index.html`

页面会按以下结构生成 prompt：

```text
positivePrompt = Shared Scene DNA + case-specific positivePrompt + style variables
negativePrompt = Common Negative + case-specific negativePrompt
```

Shared Scene DNA 和 Common Negative 会真实拼进最终 prompt。

## 文件

- `index.html`: 静态网页工作台
- `workbench.js`: 生成逻辑和 auditPromptForFauxGardenWorkbench
- `data/style-variants.json`: 6 个预置风格变量
- `templates/shared-scene-dna.md`: 共享 Scene DNA
- `templates/empty-front-9x16.md`: 空场景正面图模板
- `templates/host-final-9x16.md`: 带主播最终成片模板
- `templates/common-negative.md`: 共享负面词
- `audits/audit-rules.md`: 审计规则
- `output/faux-garden-two-9x16-default-test.json`: 默认测试输出
