# Processors

这里放数据清洗、事件抽取、摘要、标签归因逻辑。

推荐拆分：

- `normalize_symbol.py`：股票代码标准化。
- `event_extractor.py`：新闻和公告事件分类。
- `research_summarizer.py`：研报摘要、核心假设、风险提示抽取。
- `topic_resolver.py`：题材和产业链标签归因。
- `deduplicate.py`：多来源重复事件合并。

