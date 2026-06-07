# 通用品类绿幕直播间获客素材提示词生成器

独立工作台：`generic-category-greenscreen-live-room-workbench`

只做一件事：批量生成无品牌、无 LOGO、无价格、无平台 UI 的通用品类绿幕直播间获客素材提示词。

不接入：

- `female-photo-prompt-generator`
- 女装 skills
- `faux_garden_window_scenic_livestream_room`
- 总监层
- rewrite 层
- 外部 API
- 生图

## 默认批量

- 分类：全部
- 每类数量：10
- 总量：60 条 prompt
- 输出文件：`output/generic-category-greenscreen-batch-prompts.json`

## 使用

直接打开：

`E:\临时项目\generic-category-greenscreen-live-room-workbench\index.html`

页面支持：

- 选择品类
- 设置每类生成数量
- 输入通用产品信息
- 选择场景风格模式
- 生成批量 prompt
- 复制正向、负向、JSON
- 导出 JSON
- 查看审计结果

## 结构

- `index.html`: 静态网页工作台
- `workbench.js`: 生成、sanitize、audit、批量 JSON 逻辑
- `data/category-variables.json`: 六大品类变量
- `templates/`: 母规则文档
- `audits/audit-rules.md`: 审计规则
- `output/generic-category-greenscreen-batch-prompts.json`: 默认测试输出
