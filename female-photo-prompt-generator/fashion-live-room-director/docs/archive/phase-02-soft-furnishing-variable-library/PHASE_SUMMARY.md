# Phase 02 - Soft Furnishing & Decor Variable Library

## 阶段目标

在最终模板稳定后，通过受控软装、摆件、材质变量提升女装直播间空间质感。

## 完成内容

- 新增 `soft-furnishing-library.md`
- 新增 `prop-accessory-library.md`
- 新增 `material-palette-library.md`
- 新增 `visual-enrichment-rules.md`
- 新增 `selectVisualEnrichmentPreset`
- 最终模板支持三个短变量注入
- 新增 `visualEnrichmentAudit`

## 核心原则

- 不改最终模板主骨架
- 不新增总监层
- 不新增 rewrite 层
- 不回到规则拼接
- 每次只注入少量变量
- 空间丰富不能抢服装主体

## 验证摘要

4 组 prompt-only audit 均通过：

- 牛仔裤｜中高客单｜深木小奢转角：`denim_premium_winter`
- 连衣裙｜居家软装窗景｜精致裙装空间：`dress_soft_french`
- 防晒服｜夏季清爽｜绿色增强：`sunproof_summer_green`
- 棉麻女装｜自然舒适｜居家直播间：`linen_natural_home`

注入后 positivePrompt 词数均 <= 260，且变量段均低于限制。
