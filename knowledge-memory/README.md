---
title: 临时项目知识记忆层 README
date: 2026-05-06
version: v1.1
status: active
---

# 临时项目知识记忆层 README

## 一、定位

这套目录是叠加在 `E:\临时项目` 上的轻量知识记忆层。

它不替代 Obsidian，也不改动现有项目目录。它负责把当前工作中的“可复用经验”变成结构化记忆，方便后续 agent 检索、对照和持续写入。

```text
Obsidian = 人工整理后的主知识库
knowledge-memory = agent 执行时的结构化记忆层
E:\临时项目 = 工具、脚本、临时产物和执行现场
```

## 二、当前关联库

主知识库：

```text
E:\obsidian\娱乐直播图片
```

当前最重要入口：

```text
X人像提示词写法-增量提炼v1.md
光影提示词库-人像与直播视觉-v1.md
双层规则整合-Layer架构v1.md
元提示词框架-9段描写语法.md
直播主播肖像生成-工作流与资产-v1.0.md
```

## 三、目录说明

```text
knowledge-memory/
  README.md                 总说明
  active-memory.md          当前可用记忆索引
  memory-schema.md          结构化记忆字段规范
  image-sample-template.md  后续图片样本提取模板
  memory-records.jsonl      机器可读记忆记录入口
  执行日志.md               记忆层创建、更新、校验和后续执行日志
```

## 四、后续图片分析写入流程

用户给一张美颜调试 / 直播间图片后，按这个流程写记忆：

```text
1. 观察图片
2. 提取人物、房间、光影、发丝、妆面、构图、直播设备
3. 对照 active-memory.md 找可复用框架
4. 生成一条结构化样本记录
5. 如果发现新规律，追加到 Obsidian 主库或光影库
6. 如果只是一次性案例，只写入 memory-records.jsonl 或样本记录
```

## 五、写入边界

允许写入：

- 可复用提示词框架
- 光影、构图、妆发、房间布置规律
- 失败风险和负面限制
- 可迁移到直播视觉的工作流

不写入：

- 未授权真人身份复刻
- 低俗化、幼态化、擦边生成模板
- 真实平台伪造数据
- 真实用户、真实交易、真实背书

## 六、和 MemoryCoreClaw 的关系

这套目录使用 MemoryCoreClaw 兼容思路组织：

```text
working_memory：当前正在处理的图片和任务
episodic_memory：每张图片的样本记录
semantic_memory：可复用框架、光影规则、构图规则
procedural_memory：处理流程、检查清单、写入规范
relation_memory：样本与框架之间的对应关系
```

如果后续要接 MemoryCoreClaw，可以把 `memory-records.jsonl` 作为导入源。

当前 schema 已预留：

```text
memory_core.layer
memory_core.importance
memory_core.strength
memory_core.context_triggers
memory_core.relations
```

这样后续可以把本地 Markdown/JSONL 记忆迁移到正式记忆系统，而不需要重做图片样本结构。
