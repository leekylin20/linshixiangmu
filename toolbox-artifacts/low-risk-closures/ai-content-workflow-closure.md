# 低风险闭环样例：AI 内容工作流

日期：2026-05-15  
工具 ID：`ai-content-workflow`  
状态：`verified`  
风险：`low`

## 1. 工具详情

```text
名称：AI 内容工作流
路径：E:\临时项目\ai-content-workflow
入口：E:\临时项目\ai-content-workflow\index.html
文档：E:\临时项目\ai-content-workflow\README.md
联网：否
secret/API key：否
输出：Markdown / JSON
```

用途：

```text
面向高价值客群内容生产的本地工作台，覆盖卖点、买点、蓝海机会、爆文结构、选题矩阵、批量笔记、发布、复盘和内容资产分类。
```

## 2. Codex 任务包

```text
# Codex 任务包：AI 内容工作流

## 目标
对 E:\临时项目\ai-content-workflow 做一次低风险闭环验证和说明整理。

## 允许范围
- 只读检查 index.html、README.md、data/workflow.json、prompts、templates。
- 如需生成新材料，只写入 E:\临时项目\toolbox-runs 或 E:\临时项目\toolbox-artifacts。
- 不改动用户已有内容生产数据。

## 禁止事项
- 不执行外部上传。
- 不读取 secret/API key。
- 不自动发布内容。
- 不批量生成真实待发布笔记。

## 验收标准
- 确认入口文件存在。
- 确认 README 说明和 manifest 条目一致。
- 生成一条运行记录模板。
- 生成一条 Open Design brief。
- 生成一条审核记录。
```

## 3. 运行记录模板

```text
# 工具运行记录

建议文件名：20260515-HHMMSS_ai-content-workflow_run.md
建议目录：E:\临时项目\toolbox-runs\

时间：待填写
工具：AI 内容工作流
版本/路径：E:\临时项目\ai-content-workflow
调用方式：浏览器打开 index.html
运行状态：pending / success / partial / failed / blocked

## 输入

待填写。本工具默认不读取 secret/API key。

## 输出

Markdown / JSON 导出文件路径待填写。

## 参数

本地浏览器；不联网；不自动发布。

## 日志摘要

待填写。不要粘贴账号、隐私或未审核客户资料。

## 人工复核

□ 文件能打开
□ 中文显示正常
□ 导出内容无乱码
□ 没有自动发布
□ 没有上传文件
```

## 4. Open Design Brief

```text
# Open Design Brief：AI 内容工作流

## Surface
prototype / doc

## 目标
把 AI 内容工作流整理成一个可交付的本地内容生产工作台页面。

## 受众
个人内容生产者、Codex 使用者、后续审核者。

## 必须体现
- 10 个阶段：卖点、买点、蓝海、爆文结构、选题、批量笔记、发布、复盘、裂变、资产分类。
- 本地数据保存和 Markdown/JSON 导出。
- 不自动发布、不上传、不读取 secret。
- 复盘结果回流选题矩阵。

## 风格
工作台式、信息密度高、适合反复使用，不做营销 landing page。
```

## 5. 审核记录

```text
# 工具审核记录

工具名称：AI 内容工作流
工具 ID：ai-content-workflow
路径：E:\临时项目\ai-content-workflow
日期：2026-05-15

## 结论

状态：verified
风险等级：low

## P0

□ 本地路径存在：通过
□ 入口文件存在：通过
□ 不覆盖原文件：通过，当前只生成模板
□ 不泄露 secret：通过，工具不需要 secret
□ 输出位置明确：通过，Markdown / JSON 导出

## P1

□ 有说明文档：通过
□ 有运行方式：通过
□ 有边界说明：通过
□ 有运行记录模板：通过

## 下一步

可进入 Open Design 样例交付，生成工具说明页或工作台优化稿。
```

## 6. 闭环结论

```text
工具详情 -> Codex 任务包 -> 运行记录模板 -> Open Design brief -> 审核记录
```

闭环已建立。当前未执行真实工具、未写入业务数据、未上传、未发布。

