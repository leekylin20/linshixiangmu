# Data Source Routing

Use this file when choosing how Codex should fetch data for A-share growth screening.

## Preferred Order

1. **Local MCP / app data source**
   - Use available MCP tools when exposed in the current thread.
   - For FinceptTerminal DataHub, discover live topics first:
     - `datahub_list_topics`
     - `datahub_request`
     - `datahub_peek`
     - `datahub_subscribe_briefly`
   - Common topic shapes:
     - `market:quote:<symbol>`
     - `market:history:<symbol>:<period>:<interval>`
     - `news:symbol:<symbol>`
2. **QuantDinger MCP**
   - Use when configured:
     - `search_symbols`
     - `get_price`
     - `get_klines`
     - `regime_detect`
     - `submit_backtest`
   - Good for price, kline, regime, and backtest checks.
3. **Local deterministic fallback**
   - Use `scripts/eastmoney_quote.ps1` for A-share quote snapshots.
   - It calls Eastmoney quote endpoints and returns code, name, price, change, PE, PB, and market cap.
4. **Web / filings**
   - Use web search for annual reports, quarterly reports, announcements, official operating data, and exchange filings.
   - Prefer CNINFO, SSE, SZSE, company IR, and official reports.

## Eastmoney Quote Script

Example:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\eastmoney_quote.ps1 -Symbols 600036,601088,000400,002028
```

Symbol market inference:

- `600`, `601`, `603`, `605`, `688`, `689` -> Shanghai `1.<code>`
- `000`, `001`, `002`, `003`, `300`, `301` -> Shenzhen `0.<code>`
- If inference fails, pass a fully qualified secid such as `1.600900` or `0.000400`.

## When Data Is Missing

If structured data cannot cover the full A-share universe:

- say the scan is a partial pass;
- show which source was used;
- do not pretend it is a complete all-market screen;
- use user-selected themes or candidate lists to narrow the run.

## Evidence Checks By Company Type

- Growth tech: revenue acceleration,扣非利润,研发投入,订单/合同负债,毛利率.
- Semiconductor/AI hardware: value-chain position, customer validation, capacity, inventory, export-control risk.
- Power/grid: installed capacity, utilization hours, tariffs, power demand, grid investment, orders.
- Innovative drugs: pipeline stage, license-out, approvals, R&D spend, sales growth, cash runway.
- High dividend/value: PB, ROE, dividend payout, asset quality, free cash flow.
