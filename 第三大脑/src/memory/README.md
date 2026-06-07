# Memory

这里放第三大脑存储与检索逻辑。

当前 demo 使用 `data/memory/investment_memory.jsonl` 作为最小记忆库。

后续可以升级为：

- SQLite：适合轻量本地结构化查询。
- DuckDB：适合本地分析和批处理。
- PostgreSQL：适合长期服务化。
- 向量数据库：适合研报、公告、行业逻辑的语义检索。
