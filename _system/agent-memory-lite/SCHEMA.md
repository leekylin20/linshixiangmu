# Agent Memory Lite Schema

## 记录类型

```text
workspace_rule      工作区规则
project_status      项目状态
launch_command      已验证启动命令
install_note        安装/依赖/缓存记录
workflow_rule       可复用流程
design_preference   设计或协作偏好
pitfall             踩坑与规避方式
cleanup_candidate   清理候选
handoff             交接摘要
```

## JSONL 最小字段

```json
{
  "id": "AML-20260607-0001",
  "created_at": "2026-06-07T14:10:00+08:00",
  "record_type": "workspace_rule",
  "layer": "semantic",
  "summary": "一句话事实",
  "tags": ["workspace", "storage"],
  "source": "manual",
  "linked_docs": [],
  "importance": 0.9,
  "status": "active"
}
```

## layer 映射

```text
raw         L0 原始事件或来源
episodic    L1 单次事件事实
semantic    L1/L2 可复用规则、稳定知识
procedural  L2 工作流、步骤、检查清单
persona     L3 用户偏好、长期协作规则
relation    事实之间的关联
```

## 重要度

```text
0.90-1.00  启动时优先读取
0.70-0.89  常规检索优先
0.50-0.69  阶段性保留
0.00-0.49  低优先或归档候选
```

## 文件职责

- `raw/events.jsonl`：保留原始事件，尽量不改写。
- `facts/facts.jsonl`：保留去重后的原子事实。
- `scenes/*.md`：按主题聚合事实和入口。
- `persona/persona.md`：启动优先读取的长期偏好。
- `refs/current-canvas.md`：短期任务拓扑，不当成永久知识。

