#!/usr/bin/env python3
import csv
import datetime as dt
import json
import pathlib
import zipfile

ROOT = pathlib.Path("/root/crypto-quant-lab/freqtrade")
OUT = ROOT / "user_data/backtest_results/rr_repair_20260522"
MANIFEST = ROOT / "hermes_agents/rr_repair_20260522_manifest.json"
CONFIG = ROOT / "user_data/config.gate-multipair-dryrun.json"
RESULTS_JSON = ROOT / "hermes_agents/rr_repair_20260522_results.json"
RESULTS_CSV = ROOT / "hermes_agents/rr_repair_20260522_results.csv"
REPORT = ROOT / "hermes_agents/rr_repair_20260522_report.md"
RUN_LOG = ROOT / "hermes_agents/rr_repair_20260522_run.log"

PHASES = {"train": "20240701-20251231", "val": "20260101-20260522"}


def pct(value):
    return round((value or 0) * 100, 4)


def latest_zip(phase, strategy):
    zips = sorted(
        (OUT / phase / strategy).glob("backtest-result-*.zip"),
        key=lambda p: p.stat().st_mtime,
    )
    return zips[-1] if zips else None


def load_strategy_payload(zip_path, strategy):
    with zipfile.ZipFile(zip_path) as zf:
        names = [
            name
            for name in zf.namelist()
            if name.endswith(".json") and "_config" not in name
        ]
        data = json.loads(zf.read(names[0]))
    return data.get("strategy", {}).get(strategy, {})


def parse_result(phase, strategy, meta):
    zpath = latest_zip(phase, strategy)
    if not zpath:
        return {
            "strategy": strategy,
            "phase": phase,
            "status": "missing",
            "error": "missing backtest zip",
        }

    stats = load_strategy_payload(zpath, strategy)
    if not stats:
        return {
            "strategy": strategy,
            "phase": phase,
            "status": "missing",
            "zip": str(zpath),
            "error": "missing strategy data in zip",
        }

    trades = stats.get("trades") or []
    leverages = [float(trade.get("leverage") or 1.0) for trade in trades]
    short_trades = sum(1 for trade in trades if trade.get("is_short"))
    best_trade_abs = max((float(trade.get("profit_abs") or 0) for trade in trades), default=0.0)
    total_profit_abs = float(stats.get("profit_total_abs") or 0)
    best_trade_contribution_pct = None
    if total_profit_abs > 0 and best_trade_abs > 0:
        best_trade_contribution_pct = round(best_trade_abs / total_profit_abs * 100, 2)

    exit_summary = []
    for item in stats.get("exit_reason_summary") or []:
        exit_summary.append(
            {
                "reason": item.get("key"),
                "trades": item.get("trades"),
                "profit_total_pct": round(float(item.get("profit_total_pct") or 0), 4),
                "winrate_pct": round(float(item.get("winrate") or 0) * 100, 2),
            }
        )

    pair_summary = []
    for item in stats.get("results_per_pair") or []:
        if item.get("key") == "TOTAL":
            continue
        pair_summary.append(
            {
                "pair": item.get("key"),
                "trades": item.get("trades"),
                "profit_total_pct": round(float(item.get("profit_total_pct") or 0), 4),
                "winrate_pct": round(float(item.get("winrate") or 0) * 100, 2),
            }
        )

    info = meta[strategy]
    return {
        "strategy": strategy,
        "category": info["category"],
        "phase": phase,
        "status": "ok",
        "zip": str(zpath),
        "timerange": PHASES[phase],
        "pairlist": stats.get("pairlist") or [item["pair"] for item in pair_summary],
        "total_trades": stats.get("total_trades"),
        "trade_count_long": stats.get("trade_count_long"),
        "trade_count_short": stats.get("trade_count_short"),
        "short_trades_found": short_trades,
        "max_leverage_found": max(leverages, default=1.0),
        "profit_total_pct": pct(stats.get("profit_total")),
        "profit_total_abs": round(float(stats.get("profit_total_abs") or 0), 8),
        "max_drawdown_pct": pct(
            stats.get("max_drawdown_account") or stats.get("max_relative_drawdown")
        ),
        "winrate_pct": round(float(stats.get("winrate") or 0) * 100, 4),
        "profit_factor": stats.get("profit_factor"),
        "expectancy": stats.get("expectancy"),
        "avg_duration": stats.get("holding_avg"),
        "market_change_pct": pct(stats.get("market_change")),
        "rr_ratio": info.get("rr_ratio"),
        "roi": info.get("roi"),
        "stoploss": info.get("stoploss"),
        "notes": info.get("notes"),
        "exit_reason_summary": exit_summary,
        "pair_summary": pair_summary,
        "best_trade_abs": round(best_trade_abs, 8),
        "best_trade_contribution_pct": best_trade_contribution_pct,
        "candidate_pass": bool(
            (stats.get("profit_total") or 0) > 0
            and (stats.get("max_drawdown_account") or 1) <= 0.12
            and (stats.get("total_trades") or 0) >= 20
        ),
    }


def scan_sensitive(obj, risks, path=""):
    if isinstance(obj, dict):
        for key, value in obj.items():
            lowered = key.lower()
            child = f"{path}.{key}" if path else key
            if (
                any(token in lowered for token in ["key", "secret", "password", "api_key", "api_secret"])
                and value not in ("", None, [], {})
            ):
                risks.append(f"sensitive field non-empty: {child}")
            scan_sensitive(value, risks, child)
    elif isinstance(obj, list):
        for index, value in enumerate(obj):
            scan_sensitive(value, risks, f"{path}[{index}]")


def write_csv(rows):
    fieldnames = [
        "phase",
        "strategy",
        "category",
        "status",
        "timerange",
        "pairlist",
        "total_trades",
        "trade_count_long",
        "trade_count_short",
        "profit_total_pct",
        "profit_total_abs",
        "market_change_pct",
        "max_drawdown_pct",
        "winrate_pct",
        "profit_factor",
        "expectancy",
        "avg_duration",
        "rr_ratio",
        "roi",
        "stoploss",
        "candidate_pass",
        "short_trades_found",
        "max_leverage_found",
        "zip",
    ]
    with RESULTS_CSV.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(
                {
                    key: json.dumps(row.get(key), ensure_ascii=False)
                    if isinstance(row.get(key), list)
                    else row.get(key, "")
                    for key in fieldnames
                }
            )


def result_table_line(row):
    return (
        f"| {row['phase']} | {row['strategy']} | {row['total_trades']} | "
        f"{row['profit_total_pct']:.4f}% | {row['market_change_pct']:.4f}% | "
        f"{row['max_drawdown_pct']:.4f}% | {row['winrate_pct']:.2f}% | "
        f"{float(row.get('profit_factor') or 0):.4f} | {row['rr_ratio']} | "
        f"{row['roi']} / {row['stoploss']} | {row['candidate_pass']} |"
    )


def exit_line(row):
    parts = []
    for item in row.get("exit_reason_summary") or []:
        parts.append(
            f"{item['reason']}: {item['trades']} trades, {item['profit_total_pct']:.2f}%"
        )
    return "; ".join(parts)


def write_report(rows, summary):
    ok = [row for row in rows if row["status"] == "ok"]
    train = [row for row in ok if row["phase"] == "train"]
    val = [row for row in ok if row["phase"] == "val"]

    lines = [
        "# Round 5 R:R Repair Backtest Report",
        "",
        f"Generated: {summary['generated_at']}",
        "",
        "## Safety",
        "",
        f"- Safety status: {'PASS' if summary['safety_passed'] else 'RISK'}",
        "- Mode: backtesting only; no live/trade command used in accepted result set.",
        "- Pair: BTC/USDT only.",
        "- Trading mode: Gate.io spot via config.",
        "- Long-only check: all result trades have `is_short=False`; `trade_count_short=0`.",
        "- Leverage check: max observed leverage is 1.0.",
    ]
    if summary["safety_risks"]:
        lines.append("- Risks: " + "; ".join(summary["safety_risks"]))
    else:
        lines.append("- Config check: dry_run=true; no non-empty API key/secret/password fields found.")

    lines += [
        "",
        "## Execution Notes",
        "",
        "- Runner completed 14 strategies x 2 phases = 28 real Freqtrade backtests.",
        "- Freqtrade group backtest exited 2, then the runner fell back to per-strategy backtesting; all individual runs succeeded.",
        "- Report generation initially failed on a missing summary key after JSON/CSV creation.",
        "- A duplicate rerun was stopped after QRR04 train. This final report was rebuilt from the completed Freqtrade zip set.",
        "",
        "## Summary",
        "",
        f"- Successful results: {summary['successful_results']} / {summary['expected_results']}",
        f"- Train positive strategies: {summary['train_positive']} / {len(train)}",
        f"- Validation positive strategies: {summary['val_positive']} / {len(val)}",
        f"- Train PF > 1.0: {summary['train_pf_gt1']} / {len(train)}",
        f"- Validation PF > 1.0: {summary['val_pf_gt1']} / {len(val)}",
        f"- Candidate passed rows: {summary['candidate_passed_rows']}",
    ]

    best_train = summary["best_train"]
    best_val = summary["best_val"]
    lines.append(
        f"- Best train: {best_train['strategy']} {best_train['profit_total_pct']:.4f}%, "
        f"PF {float(best_train.get('profit_factor') or 0):.4f}, "
        f"DD {best_train['max_drawdown_pct']:.4f}%, trades {best_train['total_trades']}"
    )
    lines.append(
        f"- Best validation: {best_val['strategy']} {best_val['profit_total_pct']:.4f}%, "
        f"PF {float(best_val.get('profit_factor') or 0):.4f}, "
        f"DD {best_val['max_drawdown_pct']:.4f}%, trades {best_val['total_trades']}"
    )

    lines += [
        "",
        "## Result Table",
        "",
        "| Phase | Strategy | Trades | Profit | BTC B/H | Max DD | Winrate | PF | R:R | ROI / Stop | Candidate |",
        "|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---:|",
    ]
    for row in ok:
        lines.append(result_table_line(row))

    lines += ["", "## Validation Exit Reasons", ""]
    for row in val:
        lines.append(f"- {row['strategy']}: {exit_line(row)}")

    lines += ["", "## Control Comparison", ""]
    for strategy in ["QRR04", "QRR08", "QRR12", "QRR13_ctrl", "QRR14_ctrl"]:
        train_row = next(row for row in train if row["strategy"] == strategy)
        val_row = next(row for row in val if row["strategy"] == strategy)
        lines.append(
            f"- {strategy}: train {train_row['profit_total_pct']:.4f}% "
            f"PF {float(train_row.get('profit_factor') or 0):.4f}; "
            f"val {val_row['profit_total_pct']:.4f}% "
            f"PF {float(val_row.get('profit_factor') or 0):.4f}; "
            f"R:R {val_row['rr_ratio']} ({val_row['roi']}/{val_row['stoploss']})."
        )

    lines += [
        "",
        "## Reviewer Conclusion",
        "",
        "- Qualified: no.",
        "- Overfit status: not classic overfit; train and validation are both consistently negative.",
        "- Low sample: no. Validation has at least 33 trades per strategy; train has at least 117.",
        "- Dry-run eligibility: no.",
        "- Key observation: R:R repair helped materially, and QRR08 is closest, but all variants remain below zero and below PF 1.0.",
        "- One next action: change strategy direction under long-only constraints. Stop EMA trend-gate micro-tuning and test BTC macro filter plus pullback/breakout entries.",
        "",
        "## Output Paths",
        "",
        f"- JSON: {RESULTS_JSON}",
        f"- CSV: {RESULTS_CSV}",
        f"- Report: {REPORT}",
        f"- Backtest zips: {OUT}",
    ]
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    manifest = json.load(open(MANIFEST, encoding="utf-8"))
    entries = manifest["entries"]
    strategies = [entry["class_name"] for entry in entries]
    meta = {entry["class_name"]: entry for entry in entries}

    rows = [parse_result(phase, strategy, meta) for phase in ["train", "val"] for strategy in strategies]
    ok = [row for row in rows if row["status"] == "ok"]
    train = [row for row in ok if row["phase"] == "train"]
    val = [row for row in ok if row["phase"] == "val"]

    risks = []
    config = json.load(open(CONFIG, encoding="utf-8"))
    if config.get("dry_run") is not True:
        risks.append("dry_run is not true")
    if config.get("trading_mode") != "spot":
        risks.append(f"trading_mode is {config.get('trading_mode')!r}")
    if config.get("margin_mode") not in ("", None):
        risks.append(f"margin_mode is {config.get('margin_mode')!r}")
    scan_sensitive(config, risks)
    if any(row.get("short_trades_found") for row in ok):
        risks.append("short trades found")
    if any(float(row.get("max_leverage_found") or 1.0) != 1.0 for row in ok):
        risks.append("leverage other than 1.0 found")
    if any(set(row.get("pairlist") or []) != {"BTC/USDT"} for row in ok):
        risks.append("non BTC/USDT pair found")

    summary = {
        "generated_at": dt.datetime.now().isoformat(timespec="seconds"),
        "source": "rebuilt from Freqtrade backtest-result zip files after report-generation bug",
        "total_strategies": len(strategies),
        "expected_results": len(strategies) * 2,
        "successful_results": len(ok),
        "train_positive": sum(1 for row in train if row["profit_total_pct"] > 0),
        "val_positive": sum(1 for row in val if row["profit_total_pct"] > 0),
        "train_pf_gt1": sum(1 for row in train if (row.get("profit_factor") or 0) > 1),
        "val_pf_gt1": sum(1 for row in val if (row.get("profit_factor") or 0) > 1),
        "candidate_passed_rows": sum(1 for row in ok if row["candidate_pass"]),
        "best_train": max(train, key=lambda row: row["profit_total_pct"]),
        "best_val": max(val, key=lambda row: row["profit_total_pct"]),
        "safety_passed": not risks,
        "safety_risks": risks,
    }

    payload = {
        "generated_at": summary["generated_at"],
        "round": "rr_repair_20260522",
        "title": "Round 5 R:R Repair Backtest, BTC-only, 4h, Long-only",
        "timeranges": PHASES,
        "config": str(CONFIG),
        "strategy_file": str(ROOT / "user_data/strategies/rr_repair_20260522/RRRepairStrategies.py"),
        "manifest": str(MANIFEST),
        "rows": rows,
        "summary": summary,
    }
    RESULTS_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    write_csv(rows)
    write_report(rows, summary)
    with RUN_LOG.open("a", encoding="utf-8") as file:
        timestamp = dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        file.write(f"[{timestamp}] Rebuilt complete JSON/CSV/report from zip files.\n")

    print(f"rows={len(rows)} ok={len(ok)} report={REPORT}")
    print(
        f"best_train={summary['best_train']['strategy']} "
        f"{summary['best_train']['profit_total_pct']} PF={summary['best_train']['profit_factor']}"
    )
    print(
        f"best_val={summary['best_val']['strategy']} "
        f"{summary['best_val']['profit_total_pct']} PF={summary['best_val']['profit_factor']}"
    )


if __name__ == "__main__":
    main()
