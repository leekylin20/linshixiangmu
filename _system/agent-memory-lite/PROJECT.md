# Agent Memory Lite

## 用途

- 给 `E:\临时项目` 提供轻量本地 Agent 记忆层。
- 沉淀项目规则、运行命令、事实、场景块和协作画像。
- 作为以后接入正式 Agent Memory / HTTP API / MCP 的本地数据底座。

## 当前状态

状态：reusable

## 创建或引入时间

- 2026-06-07

## 启动方式

```powershell
E:\临时项目\_system\agent-memory-lite\scripts\Show-AgentMemoryBrief.ps1
E:\临时项目\_system\agent-memory-lite\scripts\Search-AgentMemory.ps1 -Query "关键词"
```

## 关键路径

- 入口：`E:\临时项目\_system\agent-memory-lite\README.md`
- 协议：`E:\临时项目\_system\agent-memory-lite\SCHEMA.md`
- 启动画像：`E:\临时项目\_system\agent-memory-lite\persona\persona.md`
- 临时项目场景：`E:\临时项目\_system\agent-memory-lite\scenes\temporary-project.md`
- 原子事实：`E:\临时项目\_system\agent-memory-lite\facts\facts.jsonl`

## 依赖与运行时

- 只依赖 PowerShell。
- 不安装外部依赖。
- 不写入 C 盘。

## 最近结论

- 采用“L0 raw / L1 facts / L2 scenes / L3 persona / refs canvas”结构。
- 与 `_索引` 配合使用，索引仍是临时项目的主入口。

## 保留或删除判断

- 保留理由：解决 Agent 反复丢失本地规则、项目状态和启动命令的问题。
- 可删除条件：未来被正式记忆服务替代，并完成数据迁移。

## 下一步

- 如果使用频率高，再接 BM25/SQLite/embedding。
- 如果需要跨工具自动注入，再封装 MCP 或 HTTP 服务。

