# RUN CRYPTO BACKTEST NOW

Project Agent task.

## Task Package

Read the uploaded package:

```text
/root/.openclaw/hermes-outbox/crypto-backtest/crypto-backtest-gmgn-lana-2026-05-24/
```

Start from:

```text
AGENT_PROMPT.md
strategy-spec/strategy_spec.md
strategy-spec/data_schema.md
strategy-spec/backtest_requirements.md
deliverables/output_contract.md
```

## Mission

Run a research backtest for GMGN/Lana-style crypto strategies.

Main question:

> Do GMGN smart-money, KOL, early-buyer, contract-security, and sentiment-overheat fields improve a crypto momentum strategy by reducing drawdown or increasing forward returns?

## Rules

- Do not trade.
- Do not connect wallets.
- Do not output buy/sell advice.
- Use public data only.
- If GMGN data is not available through API/export, implement the OHLCV/OI/funding baseline first and create schema-compatible placeholders for GMGN fields.
- Write results back to:

```text
/root/.openclaw/hermes-outbox/crypto-backtest/crypto-backtest-gmgn-lana-2026-05-24/results/
```

## Required Results

```text
results/
  README.md
  backtest_report.md
  metrics.csv
  trades.csv
  signals.csv
  data_sources.md
  failure_modes.md
  next_experiments.md
```

Be blunt. If the strategy fails, say it failed.
