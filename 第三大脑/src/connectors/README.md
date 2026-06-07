# Connectors

这里放真实数据源连接器。

建议一个数据源一个文件：

- `tdx.py`：通达信行情、K 线、公司基础信息。
- `tencent_finance.py`：腾讯财经估值、市值、换手率。
- `akshare_provider.py`：AKShare 研报、公告、新闻、财务补充。
- `iwencai.py`：i问财语义搜索。
- `ths_hotspot.py`：同花顺热点归因。
- `cls_news.py`：财联社快讯。
- `cninfo.py`：巨潮资讯公告。

连接器只负责“取数”，不要在这里写复杂判断。判断、摘要、归因放到 `src/processors/`。

