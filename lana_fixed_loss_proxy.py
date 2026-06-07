#!/usr/bin/env python3
"""
Lana fixed-loss sizing proxy on warmish same-day heat + OI divergence.

Research only. No trading or account actions.
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
OUT_JSON = os.path.join(WORKDIR, "lana_fixed_loss_proxy_results.json")
OUT_MD = os.path.join(WORKDIR, "lana_fixed_loss_proxy_report.md")


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
    by_symbol = load_oi_rows()
    symbol_to_cgid = load_symbol_map()
    raw_events = []
    for sym, rows in by_symbol.items():
        for cur in rows:
            prev = nearest_at_or_before(rows, cur["ts"] - 3600)
            if not prev or abs(prev["ts"] - (cur["ts"] - 3600)) > 450:
                continue
            oi_delta = pct_change(prev["oi"], cur["oi"])
            price_delta = pct_change(prev["last"], cur["last"])
            if oi_delta is None or price_delta is None:
                continue
            raw_events.append(
                {
                    "event_ts": cur["ts"],
                    "event_ts_ms": cur["ts_ms"],
                    "event_ts_iso": cur["ts_iso"],
                    "symbol": sym,
                    "signal_price": cur["last"],
                    "oi_delta_pct": round(oi_delta, 4),
                    "price_delta_pct": round(price_delta, 4),
                    "divergence_score": round(oi_delta - price_delta, 4),
                    "abs_price_delta_pct": round(abs(price_delta), 4),
                }
            )
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

    events = [e for e in raw_events if e["is_b2_lite"] and not e["crash_guard_flag"]]
    heat_snaps, heat_by_ts = load_heat_index()
    annotate_heat(events, symbol_to_cgid, heat_snaps, heat_by_ts)
    heat_start = heat_snaps[0][0] if heat_snaps else 0
    overlap = [e for e in events if e["event_ts_ms"] >= heat_start and e["heat_snapshot_ts_iso"]]
    cooldown = apply_symbol_cooldown(overlap)
    warmish = [e for e in cooldown if e["heat_state"] in ("TRENDING", "PERSISTENT")]
    vol_p75 = percentile([e["abs_price_delta_pct"] for e in warmish], 0.75) if warmish else 0.0
    for e in warmish:
        e["risk_bucket"] = "high_vol" if e["abs_price_delta_pct"] >= vol_p75 else "normal_vol"
    return by_symbol, warmish, {
        "oi_delta_p90": round(oi_p90, 4),
        "price_delta_p70": round(price_p70, 4),
        "divergence_p80": round(div_p80, 4),
        "price_delta_p10_crash_guard": round(price_p10, 4),
        "warmish_abs_price_delta_p75": round(vol_p75, 4),
    }


def path_until(rows, start_ts, hold_minutes):
    end_ts = start_ts + hold_minutes * 60
    return [r for r in rows if start_ts <= r["ts"] <= end_ts]


def simulate_trade(event, by_symbol, fixed_loss_usd, tp_pct, hold_minutes, cost_pct, stop_normal=2.0, stop_high=4.0):
    rows = by_symbol.get(event["symbol"], [])
    path = path_until(rows, event["event_ts"], hold_minutes)
    if len(path) < 2:
        return None
    entry = path[0]
    entry_price = entry["last"]
    stop_pct = stop_high if event["risk_bucket"] == "high_vol" else stop_normal
    position_notional = fixed_loss_usd / (stop_pct / 100.0)

    exit_reason = "time_stop"
    exit_row = path[-1]
    for row in path[1:]:
        ret = pct_change(entry_price, row["last"])
        if ret is None:
            continue
        if ret >= tp_pct:
            exit_reason = "take_profit"
            exit_row = row
            break
        if ret <= -stop_pct:
            exit_reason = "stop_loss"
            exit_row = row
            break

    gross_pct = pct_change(entry_price, exit_row["last"])
    if gross_pct is None:
        return None
    net_pct = gross_pct - cost_pct
    pnl_usd = position_notional * (net_pct / 100.0)
    return {
        "symbol": event["symbol"],
        "risk_bucket": event["risk_bucket"],
        "stop_pct": stop_pct,
        "position_notional_usd": round(position_notional, 2),
        "net_return_pct": round(net_pct, 4),
        "pnl_usd": round(pnl_usd, 4),
        "exit_reason": exit_reason,
    }


def summarize(trades):
    if not trades:
        return {"n": 0}
    pct_vals = [t["net_return_pct"] for t in trades]
    pnl_vals = [t["pnl_usd"] for t in trades]
    reasons = defaultdict(int)
    bucket_pnl = defaultdict(list)
    for t in trades:
        reasons[t["exit_reason"]] += 1
        bucket_pnl[t["risk_bucket"]].append(t["pnl_usd"])
    return {
        "n": len(trades),
        "mean_return_pct": round(mean(pct_vals), 4),
        "median_return_pct": round(median(pct_vals), 4),
        "win_rate": round(win_rate(pct_vals), 1),
        "mean_pnl_usd": round(mean(pnl_vals), 4),
        "median_pnl_usd": round(median(pnl_vals), 4),
        "total_pnl_usd": round(sum(pnl_vals), 4),
        "p10_pnl_usd": round(sorted(pnl_vals)[max(0, int(len(pnl_vals) * 0.1))], 4),
        "p90_pnl_usd": round(sorted(pnl_vals)[min(int(len(pnl_vals) * 0.9), len(pnl_vals) - 1)], 4),
        "exit_reasons": dict(reasons),
        "bucket_mean_pnl_usd": {k: round(mean(v), 4) for k, v in bucket_pnl.items()},
    }


def main():
    by_symbol, warmish, thresholds = build_signal_set()
    results = []
    for fixed_loss_usd in [50, 100, 200]:
        for tp_pct in [1.5, 2.5, 4.0]:
            trades = []
            for e in warmish:
                t = simulate_trade(
                    e,
                    by_symbol=by_symbol,
                    fixed_loss_usd=fixed_loss_usd,
                    tp_pct=tp_pct,
                    hold_minutes=120,
                    cost_pct=0.3,
                    stop_normal=2.0,
                    stop_high=4.0,
                )
                if t:
                    trades.append(t)
            s = summarize(trades)
            s.update({
                "fixed_loss_usd": fixed_loss_usd,
                "tp_pct": tp_pct,
                "hold_minutes": 120,
                "stop_normal_pct": 2.0,
                "stop_high_pct": 4.0,
            })
            results.append(s)

    ranked = sorted([r for r in results if r["n"] > 0], key=lambda r: (r["mean_pnl_usd"], r["total_pnl_usd"]), reverse=True)
    payload = {
        "_meta": {
            "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
            "research_only": True,
            "cost_pct": 0.3,
        },
        "thresholds": thresholds,
        "subset_size": len(warmish),
        "results": results,
        "top5": ranked[:5],
        "model_note": "Position size is backsolved from fixed USD loss and stop distance. This is a proxy for Lana-style fixed-loss sizing.",
    }
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    lines = []
    lines.append("# Lana Fixed Loss Proxy")
    lines.append("")
    lines.append(f"- Generated: {payload['_meta']['generated_at']}")
    lines.append("- Subset: warmish same-day heat + OI divergence")
    lines.append("- Position sizing: fixed USD loss / stop distance")
    lines.append("- Normal stop: 2.0% | High-vol stop: 4.0%")
    lines.append("- Hold: 120m")
    lines.append("")
    lines.append("| Fixed Loss | TP | n | Mean Ret | Mean PnL | Median PnL | Total PnL | Exit Reasons | Bucket Mean PnL |")
    lines.append("|---|---:|---:|---:|---:|---:|---:|---|---|")
    for row in payload["top5"]:
        lines.append(
            f"| {row['fixed_loss_usd']}U | {row['tp_pct']}% | {row['n']} | {row['mean_return_pct']}% | "
            f"{row['mean_pnl_usd']} | {row['median_pnl_usd']} | {row['total_pnl_usd']} | {row['exit_reasons']} | {row['bucket_mean_pnl_usd']} |"
        )
    with open(OUT_MD, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")

    print(json.dumps(payload["_meta"], ensure_ascii=False, indent=2))
    print(f"wrote: {OUT_JSON}")
    print(f"wrote: {OUT_MD}")


if __name__ == "__main__":
    main()
