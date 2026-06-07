#!/usr/bin/env python3
"""
Lana execution-layer matrix on same-day heat + OI signals.

Research only. No wallet, no trading, no exchange account actions.
"""

import bisect
import json
import math
import os
import sqlite3
from collections import defaultdict
from datetime import datetime, timezone
from statistics import median

WORKDIR = os.path.dirname(os.path.abspath(__file__))
OI_DB = os.path.join(WORKDIR, "lana_okx_oi_timeseries.db")
HEAT_DB = os.path.join(WORKDIR, "lana_heat_timeseries.db")
SYMBOL_MAP = os.path.join(WORKDIR, "lana_coingecko_symbol_map.json")
OUT_JSON = os.path.join(WORKDIR, "lana_execution_matrix_results.json")
OUT_MD = os.path.join(WORKDIR, "lana_execution_matrix_report.md")


def pct_change(a, b):
    if a is None or b is None or a == 0:
        return None
    return (b - a) / abs(a) * 100


def percentile(xs, q):
    xs = sorted(x for x in xs if x is not None and not math.isnan(x))
    if not xs:
        return 0.0
    pos = (len(xs) - 1) * q
    lo = math.floor(pos)
    hi = math.ceil(pos)
    if lo == hi:
        return xs[int(pos)]
    return xs[lo] * (hi - pos) + xs[hi] * (pos - lo)


def mean(xs):
    return sum(xs) / len(xs) if xs else 0.0


def win_rate(xs):
    return sum(1 for x in xs if x > 0) / len(xs) * 100 if xs else 0.0


def load_symbol_map():
    with open(SYMBOL_MAP, "r", encoding="utf-8") as f:
        raw = json.load(f)
    return {k: (v or "").upper() for k, v in raw.get("symbol_to_cgid", {}).items()}


def load_oi_rows():
    conn = sqlite3.connect(OI_DB)
    rows = conn.execute(
        """
        SELECT snapshot_ts, snapshot_ts_human, symbol, last, vol24h_usd, oi, oi_usd
        FROM snapshots
        WHERE last IS NOT NULL AND oi IS NOT NULL
        ORDER BY symbol, snapshot_ts
        """
    ).fetchall()
    conn.close()
    by_symbol = defaultdict(list)
    for ts, ts_human, sym, last, vol24h, oi, oi_usd in rows:
        by_symbol[sym].append(
            {
                "ts": int(ts),
                "ts_ms": int(ts) * 1000,
                "ts_iso": ts_human,
                "symbol": sym,
                "last": float(last),
                "vol24h_usd": float(vol24h or 0),
                "oi": float(oi),
                "oi_usd": float(oi_usd or 0),
            }
        )
    return by_symbol


def nearest_at_or_before(rows, ts):
    times = [r["ts"] for r in rows]
    idx = bisect.bisect_right(times, ts) - 1
    return rows[idx] if idx >= 0 else None


def nearest_at_or_after(rows, ts):
    times = [r["ts"] for r in rows]
    idx = bisect.bisect_left(times, ts)
    return rows[idx] if idx < len(rows) else None


def build_oi_events(by_symbol, lookback_sec=3600, max_gap_sec=450):
    events = []
    for sym, rows in by_symbol.items():
        for cur in rows:
            prev = nearest_at_or_before(rows, cur["ts"] - lookback_sec)
            if not prev:
                continue
            if abs(prev["ts"] - (cur["ts"] - lookback_sec)) > max_gap_sec:
                continue
            oi_delta = pct_change(prev["oi"], cur["oi"])
            price_delta = pct_change(prev["last"], cur["last"])
            vol_delta = pct_change(prev["vol24h_usd"], cur["vol24h_usd"])
            if oi_delta is None or price_delta is None:
                continue
            events.append(
                {
                    "event_ts": cur["ts"],
                    "event_ts_ms": cur["ts_ms"],
                    "event_ts_iso": cur["ts_iso"],
                    "symbol": sym,
                    "signal_price": cur["last"],
                    "oi_delta_pct": round(oi_delta, 4),
                    "price_delta_pct": round(price_delta, 4),
                    "divergence_score": round(oi_delta - price_delta, 4),
                    "vol24h_delta_pct": round(vol_delta, 4) if vol_delta is not None else None,
                }
            )
    return events


def load_heat_index():
    conn = sqlite3.connect(HEAT_DB)
    snap_rows = conn.execute(
        "SELECT DISTINCT ts_ms, ts_iso FROM trending_history ORDER BY ts_ms"
    ).fetchall()
    by_ts = {}
    for ts_ms, _ in snap_rows:
        rows = conn.execute(
            "SELECT UPPER(coin_id), UPPER(symbol), rank FROM trending_history WHERE ts_ms = ?",
            (ts_ms,),
        ).fetchall()
        by_ts[int(ts_ms)] = {coin_id: {"symbol": sym, "rank": rank} for coin_id, sym, rank in rows}
    conn.close()
    return [(int(ts), iso) for ts, iso in snap_rows], by_ts


def annotate_heat(events, symbol_to_cgid, heat_snaps, heat_by_ts, max_lag_ms=20 * 60 * 1000):
    heat_times = [ts for ts, _ in heat_snaps]
    for e in events:
        cgid = symbol_to_cgid.get(e["symbol"], "")
        e["cg_id"] = cgid
        e["heat_state"] = "UNMAPPED" if not cgid else "COLD"
        e["trending_rank"] = None
        e["heat_snapshot_ts_iso"] = None
        e["persist_2h"] = 0.0
        if not cgid or not heat_times:
            continue
        idx = bisect.bisect_right(heat_times, e["event_ts_ms"]) - 1
        if idx < 0:
            continue
        snap_ts, snap_iso = heat_snaps[idx]
        if e["event_ts_ms"] - snap_ts > max_lag_ms:
            continue
        e["heat_snapshot_ts_iso"] = snap_iso
        snap = heat_by_ts.get(snap_ts, {})
        if cgid in snap:
            e["heat_state"] = "TRENDING"
            e["trending_rank"] = snap[cgid]["rank"]
        start_ms = e["event_ts_ms"] - 2 * 3600 * 1000
        prior_times = [ts for ts in heat_times if start_ms <= ts <= e["event_ts_ms"]]
        if prior_times:
            appearances = sum(1 for ts in prior_times if cgid in heat_by_ts.get(ts, {}))
            e["persist_2h"] = round(appearances / len(prior_times), 4)
            if e["heat_state"] == "COLD" and e["persist_2h"] >= 0.5:
                e["heat_state"] = "PERSISTENT"
    return events


def apply_symbol_cooldown(events, cooldown_sec=3600):
    kept = []
    last_ts_by_symbol = {}
    for e in sorted(events, key=lambda x: (x["symbol"], x["event_ts"])):
        last_ts = last_ts_by_symbol.get(e["symbol"])
        if last_ts is None or e["event_ts"] - last_ts >= cooldown_sec:
            kept.append(e)
            last_ts_by_symbol[e["symbol"]] = e["event_ts"]
    return kept


def build_signal_set():
    symbol_to_cgid = load_symbol_map()
    by_symbol = load_oi_rows()
    raw_events = build_oi_events(by_symbol)

    oi_p90 = percentile([e["oi_delta_pct"] for e in raw_events], 0.90)
    price_p70 = percentile([e["price_delta_pct"] for e in raw_events], 0.70)
    div_p80 = percentile([e["divergence_score"] for e in raw_events], 0.80)
    price_p10 = percentile([e["price_delta_pct"] for e in raw_events], 0.10)

    for e in raw_events:
        e["is_b2_lite"] = (
            e["oi_delta_pct"] >= oi_p90
            and e["price_delta_pct"] <= price_p70
            and e["divergence_score"] >= div_p80
        )
        e["crash_guard_flag"] = e["price_delta_pct"] <= price_p10 and e["oi_delta_pct"] >= oi_p90

    b2_events = [e for e in raw_events if e["is_b2_lite"] and not e["crash_guard_flag"]]
    heat_snaps, heat_by_ts = load_heat_index()
    annotate_heat(b2_events, symbol_to_cgid, heat_snaps, heat_by_ts)
    heat_start = heat_snaps[0][0] if heat_snaps else 0
    overlap_guarded = [e for e in b2_events if e["event_ts_ms"] >= heat_start and e["heat_snapshot_ts_iso"]]
    overlap_guarded_cooldown = apply_symbol_cooldown(overlap_guarded)
    return by_symbol, overlap_guarded_cooldown, {
        "oi_delta_p90": round(oi_p90, 4),
        "price_delta_p70": round(price_p70, 4),
        "divergence_p80": round(div_p80, 4),
        "price_delta_p10_crash_guard": round(price_p10, 4),
    }


def future_path(rows, start_ts, hold_minutes):
    end_ts = start_ts + hold_minutes * 60
    return [r for r in rows if start_ts <= r["ts"] <= end_ts]


def next_snapshot(rows, ts, delay_minutes, max_slip_sec=450):
    target = ts + delay_minutes * 60
    nxt = nearest_at_or_after(rows, target)
    if not nxt:
        return None
    if abs(nxt["ts"] - target) > max_slip_sec:
        return None
    return nxt


def simulate_event(event, by_symbol, entry_mode, tp_pct, sl_pct, hold_minutes, cost_pct):
    rows = by_symbol.get(event["symbol"], [])
    if not rows:
        return None

    if entry_mode == "signal_now":
        entry_ts = event["event_ts"]
        entry_price = event["signal_price"]
    elif entry_mode == "confirm_5m_green":
        confirm = next_snapshot(rows, event["event_ts"], 5)
        if not confirm:
            return None
        pre_ret = pct_change(event["signal_price"], confirm["last"])
        if pre_ret is None or pre_ret < 0:
            return None
        entry_ts = confirm["ts"]
        entry_price = confirm["last"]
    else:
        raise ValueError(f"unknown entry_mode: {entry_mode}")

    path = future_path(rows, entry_ts, hold_minutes)
    if len(path) < 2:
        return None

    exit_reason = "time_stop"
    exit_row = path[-1]
    max_fav = -999.0
    max_adv = 999.0

    for row in path[1:]:
        ret = pct_change(entry_price, row["last"])
        if ret is None:
            continue
        max_fav = max(max_fav, ret)
        max_adv = min(max_adv, ret)
        if tp_pct is not None and ret >= tp_pct:
            exit_reason = "take_profit"
            exit_row = row
            break
        if sl_pct is not None and ret <= -sl_pct:
            exit_reason = "stop_loss"
            exit_row = row
            break

    gross_ret = pct_change(entry_price, exit_row["last"])
    if gross_ret is None:
        return None
    net_ret = gross_ret - cost_pct
    return {
        "symbol": event["symbol"],
        "heat_state": event["heat_state"],
        "entry_mode": entry_mode,
        "tp_pct": tp_pct,
        "sl_pct": sl_pct,
        "hold_minutes": hold_minutes,
        "entry_ts": entry_ts,
        "entry_price": entry_price,
        "exit_ts": exit_row["ts"],
        "exit_price": exit_row["last"],
        "exit_reason": exit_reason,
        "gross_return_pct": round(gross_ret, 4),
        "net_return_pct": round(net_ret, 4),
        "mae_pct": round(max_adv if max_adv != 999.0 else 0.0, 4),
        "mfe_pct": round(max_fav if max_fav != -999.0 else 0.0, 4),
    }


def summarize_trades(trades):
    xs = [t["net_return_pct"] for t in trades]
    if not xs:
        return {"n": 0}
    reasons = defaultdict(int)
    for t in trades:
        reasons[t["exit_reason"]] += 1
    return {
        "n": len(xs),
        "mean_pct": round(mean(xs), 4),
        "median_pct": round(median(xs), 4),
        "win_rate": round(win_rate(xs), 1),
        "p10_pct": round(sorted(xs)[max(0, int(len(xs) * 0.1))], 4),
        "p90_pct": round(sorted(xs)[min(int(len(xs) * 0.9), len(xs) - 1)], 4),
        "mean_mae_pct": round(mean([t["mae_pct"] for t in trades]), 4),
        "mean_mfe_pct": round(mean([t["mfe_pct"] for t in trades]), 4),
        "exit_reasons": dict(reasons),
    }


def run_matrix(by_symbol, events, subsets, cost_pct=0.3):
    configs = []
    for entry_mode in ["signal_now", "confirm_5m_green"]:
        for tp_pct in [0.8, 1.5, 2.5]:
            for sl_pct in [0.8, 1.2, 2.0]:
                for hold_minutes in [30, 60, 120]:
                    configs.append((entry_mode, tp_pct, sl_pct, hold_minutes))

    results = {}
    for subset_name, subset_events in subsets.items():
        rows = []
        for entry_mode, tp_pct, sl_pct, hold_minutes in configs:
            trades = []
            for event in subset_events:
                trade = simulate_event(
                    event,
                    by_symbol=by_symbol,
                    entry_mode=entry_mode,
                    tp_pct=tp_pct,
                    sl_pct=sl_pct,
                    hold_minutes=hold_minutes,
                    cost_pct=cost_pct,
                )
                if trade:
                    trades.append(trade)
            summary = summarize_trades(trades)
            summary.update(
                {
                    "entry_mode": entry_mode,
                    "tp_pct": tp_pct,
                    "sl_pct": sl_pct,
                    "hold_minutes": hold_minutes,
                }
            )
            rows.append(summary)
        ranked = sorted(
            [r for r in rows if r["n"] > 0],
            key=lambda r: (r["mean_pct"], r["median_pct"], r["win_rate"]),
            reverse=True,
        )
        results[subset_name] = {
            "all": rows,
            "top5": ranked[:5],
        }
    return results


def write_report(results, thresholds, subset_sizes):
    lines = []
    lines.append("# Lana Execution Matrix")
    lines.append("")
    lines.append(f"- Generated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")
    lines.append("- Signal base: same-day heat + B2-lite OI divergence + crash guard + 60m symbol cooldown")
    lines.append("- Cost assumption: 0.30% round-trip")
    lines.append("")
    lines.append("## Signal Thresholds")
    lines.append("")
    for k, v in thresholds.items():
        lines.append(f"- {k}: {v}")
    lines.append("")
    lines.append("## Subset Sizes")
    lines.append("")
    for k, v in subset_sizes.items():
        lines.append(f"- {k}: {v}")
    lines.append("")

    for subset_name, payload in results.items():
        lines.append(f"## {subset_name}")
        lines.append("")
        lines.append("| Entry | TP | SL | Hold | n | Mean | Median | WR | P10 | P90 | Mean MAE | Mean MFE | Exit Reasons |")
        lines.append("|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|")
        for row in payload["top5"]:
            lines.append(
                f"| {row['entry_mode']} | {row['tp_pct']}% | {row['sl_pct']}% | {row['hold_minutes']}m | "
                f"{row['n']} | {row['mean_pct']}% | {row['median_pct']}% | {row['win_rate']}% | "
                f"{row['p10_pct']}% | {row['p90_pct']}% | {row['mean_mae_pct']}% | {row['mean_mfe_pct']}% | {row['exit_reasons']} |"
            )
        lines.append("")

    with open(OUT_MD, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines) + "\n")


def main():
    by_symbol, events, thresholds = build_signal_set()
    warmish = [e for e in events if e["heat_state"] in ("TRENDING", "PERSISTENT")]
    cold = [e for e in events if e["heat_state"] == "COLD"]
    subsets = {
        "warmish_only": warmish,
        "cold_only": cold,
        "all_same_day": events,
    }
    results = run_matrix(by_symbol, events, subsets, cost_pct=0.3)
    payload = {
        "_meta": {
            "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
            "research_only": True,
            "cost_pct": 0.3,
        },
        "thresholds": thresholds,
        "subset_sizes": {k: len(v) for k, v in subsets.items()},
        "results": results,
    }
    with open(OUT_JSON, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, indent=2, ensure_ascii=False)
    write_report(results, thresholds, payload["subset_sizes"])
    print(json.dumps(payload["_meta"], ensure_ascii=False, indent=2))
    print(f"wrote: {OUT_JSON}")
    print(f"wrote: {OUT_MD}")


if __name__ == "__main__":
    main()
