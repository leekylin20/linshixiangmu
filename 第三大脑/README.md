# 第三大脑：投资知识操作系统

这是一个面向 A 股研究与第三大脑的本地项目骨架。它不是把行情、新闻、研报原样堆进资料库，而是把数据源整理成可检索、可追踪、可复用的投资知识层。

核心思路：

```text
数据源层 -> 处理层 -> 第三大脑层
```

- 数据源层：通达信、腾讯财经、AKShare、i问财、同花顺、财联社、巨潮资讯等。
- 处理层：清洗、去重、摘要、实体识别、事件抽取、题材归因、标签化。
- 第三大脑层：公司档案、行业档案、题材档案、研报库、公告事件库、新闻事件库、市场叙事库。

## 目录结构

```text
第三大脑/
  config/             数据源与数据层配置
  data/
    cache/            运行缓存，禁止散落到 C 盘
    raw/              原始数据落地，适合临时缓存
    processed/        清洗后的结构化数据
    memory/           第三大脑记忆库，JSONL 格式
  docs/               架构与封装说明
  examples/           示例输入
  schemas/            数据结构定义
  src/                最小可运行脚手架
```

## 快速运行

在当前目录执行：

```powershell
cd E:\临时项目\第三大脑
.\scripts\run_demo.ps1
```

运行后会生成：

```text
data/memory/investment_memory.jsonl
```

这个文件就是第三大脑的最小记忆库。真实项目里可以把它替换成 SQLite、PostgreSQL、向量数据库或你已有的 knowledge-memory 系统。

## 缓存规则

所有项目数据和缓存都收录在：

```text
E:\临时项目\第三大脑\data
```

统一缓存目录是：

```text
E:\临时项目\第三大脑\data\cache
```

运行脚本会自动设置这些环境变量，避免缓存散落到 C 盘：

- `XDG_CACHE_HOME`
- `PIP_CACHE_DIR`
- `PYTHONPYCACHEPREFIX`
- `MPLCONFIGDIR`
- `HF_HOME`
- `TRANSFORMERS_CACHE`
- `TORCH_HOME`
- `AKSHARE_CACHE_DIR`
- `TDX_CACHE_DIR`
- `REQUESTS_CACHE_DIR`

详细规则见 [docs/storage-policy.md](docs/storage-policy.md)。

检索本地记忆：

```powershell
.\scripts\search_memory.ps1 机器人
.\scripts\search_memory.ps1 重大合同
```

## 推荐优先级

先封装这些高价值、低噪音层：

1. 研报库
2. 公告事件库
3. 公司实体档案
4. 热点归因 / 题材库
5. 新闻事件库
6. 行情异动摘要

行情 K 线、盘口、逐笔成交等高频数据不建议直接进第三大脑。第三大脑只保存“被解释过的事件”，例如放量突破、换手率异常、估值变化、题材异动。
