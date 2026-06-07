# Agent Memory Lite

建立日期：2026-06-07

这是给 `E:\临时项目` 接入的轻量本地 Agent 记忆层。它借用 TencentDB Agent Memory 那套“原始记录 -> 原子事实 -> 场景块 -> 用户/项目画像”的思路，但不替换 Codex 内核，也不安装数据库服务。

## 目标

- 把临时项目里的关键规则、运行命令、项目状态、踩坑结论沉淀成可检索文件。
- 保持所有数据在 `E:\临时项目\_system\agent-memory-lite`。
- 和现有 `_索引` 工作流配合，避免新记忆层变成另一个垃圾堆。
- 后续如果要接正式 Memory 服务，可以从这里的 Markdown / JSONL 迁移。

## 分层结构

```text
agent-memory-lite/
  raw/       L0 原始事件：完整输入、工具结果、人工判断来源
  facts/     L1 原子事实：可复用、可检索、尽量一句一事
  scenes/    L2 场景块：按项目/主题聚合事实
  persona/   L3 画像：长期偏好、边界、协作规则
  refs/      短期画布：当前任务拓扑、Mermaid、临时引用
  scripts/   写入、搜索、启动摘要脚本
```

## 每次使用的最小流程

1. 开新任务时，先读：
   `E:\临时项目\_system\agent-memory-lite\scripts\Show-AgentMemoryBrief.ps1`
2. 需要找历史经验时，搜：
   `E:\临时项目\_system\agent-memory-lite\scripts\Search-AgentMemory.ps1 -Query "关键词"`
3. 跑通新项目、安装工具、确认启动命令、形成可复用结论后，写：
   `E:\临时项目\_system\agent-memory-lite\scripts\Add-AgentMemoryRecord.ps1`
4. 同步更新 `_索引\项目运行记忆.md`、`_索引\安装测试日志.md` 或 `_索引\清理候选.md`。

## 写入边界

适合写入这里：

- 临时项目目录规则、工具路径、启动方式、可复用流程。
- 项目运行状态、依赖位置、已验证命令。
- 反复出现的设计/开发偏好。
- 会影响后续 Agent 执行的约束和踩坑。

不适合写入这里：

- 长期业务知识、内容方法、客户洞察，这些进 `E:\obsidian`。
- 大段文章全文、学习笔记、网页转存。
- 密钥、账号密码、隐私数据。
- 一次性输出垃圾；这类只登记到 `_索引\清理候选.md`。

## 与 TencentDB Agent Memory 的关系

当前是“可套用部分”的本地实现：

- L0-L3 分层：已落地为目录。
- 原始数据可回溯：用 JSONL 和 Markdown 保留。
- 场景聚合：用 `scenes/*.md` 维护。
- 启动画像：用 `persona/persona.md` 维护。
- 检索增强：当前用本地关键词搜索；后续可加 BM25/embedding。
- Mermaid 短期画布：用 `refs/current-canvas.md` 维护。

当前没有做：

- 自动事实抽取。
- 向量库。
- 长期在线服务。
- Codex 内核级自动注入。

