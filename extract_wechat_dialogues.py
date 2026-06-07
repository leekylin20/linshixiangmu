from __future__ import annotations

import json
import subprocess
from collections import defaultdict
from datetime import datetime, timedelta
from pathlib import Path


WX = Path(r"E:\临时项目\_system\node-tools\wx-cli\node_modules\.bin\wx.cmd")
OUT = Path(r"E:\临时项目\wechat_extract")
OUT.mkdir(parents=True, exist_ok=True)

KEYWORDS = [
    "子木",
    "直播间",
    "报价",
    "搭建",
    "灯光",
    "调试",
    "绿幕",
    "直播灯",
    "设备租赁",
    "上门",
    "收费",
    "美颜",
    "采集卡",
]

RELEVANT = [
    "子木",
    "直播间",
    "报价",
    "搭建",
    "灯光",
    "调试",
    "绿幕",
    "直播灯",
    "设备",
    "租赁",
    "上门",
    "收费",
    "美颜",
    "采集卡",
    "方案",
    "设计",
]


def run_wx(args: list[str], timeout: int = 60) -> str:
    proc = subprocess.run(
        [str(WX), *args],
        cwd=str(OUT),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=timeout,
    )
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr or proc.stdout)
    return proc.stdout


def search(keyword: str) -> dict:
    text = run_wx(["search", keyword, "-n", "200", "--json"], timeout=90)
    start = text.find("{")
    return json.loads(text[start:])


def msg_key(msg: dict) -> tuple:
    return (msg.get("chat"), msg.get("timestamp"), msg.get("sender"), msg.get("content"))


def is_relevant(msg: dict) -> bool:
    content = msg.get("content") or ""
    chat = msg.get("chat") or ""
    return any(k in content or k in chat for k in RELEVANT)


def date_only(time_text: str) -> datetime:
    return datetime.strptime(time_text[:10], "%Y-%m-%d")


def main() -> None:
    all_results = {}
    dedup = {}
    for keyword in KEYWORDS:
        print("search", keyword)
        try:
            data = search(keyword)
        except Exception as exc:
            all_results[keyword] = {"error": repr(exc), "results": []}
            continue
        all_results[keyword] = data
        for msg in data.get("results", []):
            if is_relevant(msg):
                dedup[msg_key(msg)] = msg

    messages = sorted(dedup.values(), key=lambda x: x.get("timestamp", 0), reverse=True)
    by_chat: dict[str, list[dict]] = defaultdict(list)
    for msg in messages:
        by_chat[msg.get("chat") or "UNKNOWN"].append(msg)

    (OUT / "wechat_dialogue_search_raw.json").write_text(
        json.dumps(all_results, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    (OUT / "wechat_dialogue_search_dedup.json").write_text(
        json.dumps(messages, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    lines = ["# 微信对话原文关键词命中", ""]
    lines.append(f"关键词：{', '.join(KEYWORDS)}")
    lines.append(f"去重后命中：{len(messages)} 条")
    lines.append("")
    for chat, rows in sorted(by_chat.items(), key=lambda item: len(item[1]), reverse=True):
        lines.append(f"## {chat}（{len(rows)}条）")
        for msg in sorted(rows, key=lambda x: x.get("timestamp", 0)):
            sender = msg.get("sender") or "我/未知"
            lines.append(f"- {msg.get('time')} | {sender}：{msg.get('content')}")
        lines.append("")
    (OUT / "微信对话原文_关键词命中.md").write_text("\n".join(lines), encoding="utf-8")

    exports_dir = OUT / "dialogue_exports"
    exports_dir.mkdir(exist_ok=True)
    exported = []
    focus_chat_keywords = [
        "深圳自行车直播间",
        "长颈鹿",
        "A烟火",
        "摩吉直播间搭建",
        "叶芷",
        "乜乜",
        "MJ温",
        "喜庆",
        "Broccoli",
        "心若止水",
        "乐  尹晨达人",
        "广州陈皮直播间搭建",
        "图明索",
        "阿君",
    ]
    for chat, rows in sorted(by_chat.items(), key=lambda item: len(item[1]), reverse=True):
        if not any(token in chat for token in focus_chat_keywords):
            continue
        # Export only focused chats; skip very broad knowledge groups unless they mention 子木 or have multiple hits.
        joined = "\n".join((r.get("content") or "") for r in rows)
        if len(rows) < 2 and "子木" not in joined and "报价" not in joined:
            continue
        dates = [date_only(r["time"]) for r in rows if r.get("time")]
        if not dates:
            continue
        since = (min(dates) - timedelta(days=1)).strftime("%Y-%m-%d")
        until = (max(dates) + timedelta(days=1)).strftime("%Y-%m-%d")
        safe = "".join(c if c.isalnum() or c in "._- " else "_" for c in chat)[:80].strip() or "chat"
        output = exports_dir / f"{safe}_{since}_{until}.md"
        print("export", chat.encode("utf-8", "ignore").decode("utf-8"), since, until)
        try:
            run_wx(
                ["export", chat, "--since", since, "--until", until, "-n", "2000", "-f", "markdown", "-o", str(output)],
                timeout=120,
            )
            exported.append({"chat": chat, "since": since, "until": until, "output": str(output), "hits": len(rows)})
        except Exception as exc:
            exported.append({"chat": chat, "since": since, "until": until, "error": repr(exc), "hits": len(rows)})
    (OUT / "wechat_dialogue_exports_manifest.json").write_text(
        json.dumps(exported, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"done: {len(messages)} matched messages, {len(exported)} exports")


if __name__ == "__main__":
    main()
