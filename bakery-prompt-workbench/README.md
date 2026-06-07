# 烘焙提示词工作台

入档模板：

`烘焙面包店视频母版生成提示词｜无品牌可复用版`

目录：`bakery-prompt-workbench`

## 用途

- 生成竖版 9:16 烘焙面包店视频母版提示词。
- 支持有人主播版、无人空场版、门店设计版、前景产品版、视频封面版。
- 只做无品牌、无 LOGO、无价格、无平台 UI 的可复用烘焙空间提示词。

## 文件

- `index.html`: 中文页面入口
- `workbench.js`: 生成和审计逻辑
- `data/bakery-variables.json`: 变量库
- `templates/bakery-bread-video-master-unbranded-v01.md`: 入档模板
- `templates/bakery-batch-30-scheduler-v01.md`: 30 份批量调度模板
- `audits/audit-rules.md`: 审计规则
- `scripts/review-optimize-from-pasted.js`: 解析用户粘贴的 30 份烘焙 prompt，并按工作台框架重编译优化
- `output/default-bakery-bread-video-master-prompt.json`: 默认测试输出
- `output/bakery-batch-30-prompts.json`: 默认 30 份批量输出
- `output/bakery-reviewed-optimized-30-prompts.txt`: 审查优化后的可复制生图提示词

## 边界

- 不生图。
- 不调用外部 API。
- 不继承用户参考图里的真实品牌、LOGO、价格、平台 UI 或包装文字。
