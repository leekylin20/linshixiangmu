# 低风险闭环样例：knowledge-memory 本地记忆层

日期：2026-05-15  
工具 ID：`knowledge-memory`  
状态：`verified`  
风险：`low`

## 1. 工具详情

```text
名称：knowledge-memory 本地记忆层
路径：E:\临时项目\knowledge-memory
入口：E:\临时项目\knowledge-memory\active-memory.md
文档：
  E:\临时项目\knowledge-memory\README.md
  E:\临时项目\knowledge-memory\active-memory.md
  E:\临时项目\knowledge-memory\memory-schema.md
  E:\临时项目\knowledge-memory\执行日志.md
联网：否
secret/API key：否
输出：Markdown / JSONL
```

用途：

```text
记录临时项目的活动记忆、召回规则、工具模块索引、产品方向和结构化 JSONL 记忆。
```

## 2. Codex 任务包

```text
# Codex 任务包：knowledge-memory 本地记忆层

## 目标
对 knowledge-memory 做一次低风险闭环验证，确认 JSONL 可解析、入口文档存在、记忆层边界清楚。

## 允许范围
- 读取 active-memory.md、memory-schema.md、memory-records.jsonl、执行日志.md。
- 校验 JSONL。
- 如需追加记录，必须生成待审核草稿，不直接污染 Obsidian 主库。

## 禁止事项
- 不批量重写主知识库。
- 不把单张图片观察直接写入主库。
- 不读取 secret/API key。
- 不删除历史记忆记录。

## 验收标准
- JSONL 可解析。
- schema 和 active memory 路径一致。
- 审核记录注明临时记忆层和 Obsidian 主库的边界。
```

## 3. 运行记录模板

```text
# 工具运行记录

建议文件名：20260515-HHMMSS_knowledge-memory_run.md
建议目录：E:\临时项目\toolbox-runs\

时间：待填写
工具：knowledge-memory 本地记忆层
版本/路径：E:\临时项目\knowledge-memory
调用方式：读取 Markdown / 校验 JSONL
运行状态：pending / success / partial / failed / blocked

## 输入

memory-records.jsonl：
active-memory.md：
memory-schema.md：

## 输出

校验摘要或待审核追加草稿。

## 参数

只读校验 / 草稿生成。

## 日志摘要

待填写。不要把未审核的隐私信息写入主库。

## 人工复核

□ JSONL 可解析
□ 召回规则清楚
□ 未污染 Obsidian 主库
□ 新增记录有来源路径
□ 单次观察和长期规则已区分
```

## 4. Open Design Brief

```text
# Open Design Brief：knowledge-memory 本地记忆层

## Surface
prototype / doc

## 目标
生成一个知识记忆层导航页，帮助用户理解 active memory、schema、JSONL 记录、执行日志和 Obsidian 主库之间的关系。

## 必须体现
- 当前主任务上下文。
- 高优先记忆 M001-M006。
- 工具箱可视化方向。
- memory-records.jsonl 的项目模块记录。
- 临时记忆层和长期主知识库的边界。

## 风格
知识索引页，适合扫描和后续 agent 召回，不做营销页。
```

## 5. 审核记录

```text
# 工具审核记录

工具名称：knowledge-memory 本地记忆层
工具 ID：knowledge-memory
路径：E:\临时项目\knowledge-memory
日期：2026-05-15

## 结论

状态：verified
风险等级：low

## P0

□ 本地路径存在：通过
□ 入口文件存在：通过
□ 不覆盖原文件：通过，当前只读校验
□ 不泄露 secret：通过，不需要 secret
□ 输出位置明确：通过，Markdown / JSONL

## P1

□ 有 schema：通过
□ 有执行日志：通过
□ JSONL 可解析：通过，当前 4 行可解析
□ 有召回规则：通过

## 下一步

可生成记忆层导航页，并和工具箱 manifest 建立更明确的索引关系。
```

## 6. 闭环结论

```text
工具详情 -> Codex 任务包 -> 运行记录模板 -> Open Design brief -> 审核记录
```

闭环已建立。当前只读校验通过：`memory-records.jsonl` 4 行可解析，未写入主库。

