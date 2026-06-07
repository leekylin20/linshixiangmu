---
name: a-share-growth-scanner
description: Use this skill when the user asks Codex to scan, screen, rank, or build a watchlist of A-share growth stocks; find high-return A-share candidates; use local data sources for China stock screening; combine quote/fundamental data with Serenity-style investment reasoning; or decide how to deploy available capital into A-share growth themes. Research support only, no trade execution.
metadata:
  short-description: A-share growth stock scanner and data-source router
---

# A-share Growth Scanner

Use this skill to turn a broad A-share stock question into a repeatable screening workflow:

`data first -> screen -> verify filings -> score -> rank -> position framework`

Do not answer by memory when the request is current. Always try live/local data first, then use source-backed reasoning.

## Routing

1. **If MCP/data tools are available**, prefer them over web search:
   - FinceptTerminal DataHub: list topics, request/peek `market:quote:<symbol>` and related quote/history/news topics.
   - QuantDinger MCP: use `search_symbols`, `get_price`, `get_klines`, `regime_detect`, and backtest tools when configured.
2. **If local MCP data is unavailable**, use `scripts/eastmoney_quote.ps1` for A-share quote snapshots.
3. **For company evidence**, use primary/public sources: annual reports, quarterly reports, exchange announcements, CNINFO/SSE/SZSE, investor relations, and official operating data.
4. **For thesis quality**, use `serenity-skill` after data collection to judge value-chain position, evidence strength, risks, and what could prove the idea wrong.
5. **Do not use GMGN skills for A-shares.** GMGN skills are crypto-only.

Read `references/data-source-routing.md` when deciding which data source to call.

## Default Scan Workflow

### 1. Define Scope

Infer reasonable defaults:

- Market: A-share.
- Style: growth unless user says dividend/value/cycle.
- Time window: next 6-24 months.
- Output: ranked research candidates, not buy/sell orders.

Ask only if the missing scope materially changes the scan, such as stock universe, excluded sectors, or risk tolerance.

### 2. Build Candidate Pool

Use one or more of these entry points:

- User theme: AI hardware, semiconductor, power grid, robotics, innovative drugs, energy storage, consumer recovery, etc.
- Current market list: 52-week lows/highs, strong earnings, large turnover, sector leaders.
- Financial screen:
  - revenue growth preferably > 15%;
  - deducting non-recurring profit growth preferably > 20%;
  - gross margin stable or improving;
  - operating cash flow not structurally worse than profit;
  - no obvious delisting, ST, governance, pledge, or refinancing red flags.

Aim for 20-80 initial names for a broad scan, then filter to 5-10.

### 3. Pull Quote Snapshot

For each candidate, collect:

- latest price;
- change percent;
- market cap;
- PE and PB when available;
- recent 20/60/250-day trend if a kline source is available.

If only Eastmoney quote snapshot is available, say it is a quote snapshot, not a complete valuation model.

### 4. Verify Fundamentals

For final candidates, check at least:

- latest annual report and quarterly report;
- revenue, profit,扣非净利,毛利率,现金流;
- industry demand evidence;
- orders/backlog/contract liabilities when relevant;
- valuation vs growth;
- why the market may not fully price the change yet.

Avoid ranking a company highly if the thesis relies only on price action or social discussion.

### 5. Score Candidates

Score 0-5 on each factor:

- demand inflection;
- company moat or value-chain position;
- revenue/profit verification;
- cash-flow quality;
- valuation reasonableness;
- catalyst timing;
- downside/risk controllability.

Deduct for:

- weak cash flow;
- receivables/inventory rising faster than revenue;
- one-off profit;
- governance or ST risk;
- over-crowded theme valuation;
- unclear customer/order evidence.

### 6. Output Format

Lead with judgment:

- the best 3-5 research priorities;
- which names are only watchlist;
- which popular names to avoid and why;
- suggested tranche framework, not direct trading instruction;
- exact next checks.

For user capital allocation, keep sizing conservative:

- 3-4 names maximum for small accounts;
- 2-3 tranches;
- no single growth name > 25%-30% of the growth sleeve unless the user explicitly wants concentration;
- keep cash for earnings confirmation or pullbacks.

## Risk Boundary

This skill produces research, screening, and position frameworks. It must not guarantee returns or issue direct buy/sell orders. Use wording such as "research priority", "watch zone", "tranche framework", and "what would make the thesis weaker".
