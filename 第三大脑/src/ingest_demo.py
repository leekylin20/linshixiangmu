from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
INPUT_PATH = ROOT / "examples" / "raw_items.jsonl"
OUTPUT_PATH = ROOT / "data" / "memory" / "investment_memory.jsonl"


MEMORY_TYPE_BY_LAYER = {
    "market": "event",
    "research": "research_note",
    "semantic_search": "query_note",
    "news": "event",
    "fundamental": "company_profile",
    "announcement": "event",
    "signal": "signal",
}


EVENT_KEYWORDS = {
    "重大合同": "order",
    "供货合同": "order",
    "政策": "policy",
    "业绩": "earnings",
    "回购": "buyback",
    "减持": "holding_change",
    "增持": "holding_change",
    "并购": "mna",
    "风险": "risk",
    "放量": "market_anomaly",
    "突破": "market_anomaly",
    "概念": "topic_catalyst",
    "题材": "topic_catalyst",
}


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as file:
        for line in file:
            line = line.strip()
            if line:
                items.append(json.loads(line))
    return items


def stable_id(item: dict[str, Any]) -> str:
    key = "|".join(
        [
            str(item.get("date", "")),
            str(item.get("source", "")),
            str(item.get("title", "")),
            str(item.get("raw_ref", "")),
        ]
    )
    return hashlib.sha1(key.encode("utf-8")).hexdigest()[:16]


def detect_event_type(text: str) -> str:
    for keyword, event_type in EVENT_KEYWORDS.items():
        if keyword in text:
            return event_type
    return "other"


def detect_impact(text: str) -> str:
    positive_words = ["积极", "上涨", "强势", "突破", "升温", "利好"]
    negative_words = ["下跌", "风险", "不及预期", "减持", "亏损"]
    if any(word in text for word in negative_words):
        return "negative"
    if any(word in text for word in positive_words):
        return "positive"
    return "unknown"


def summarize(text: str, limit: int = 120) -> str:
    text = " ".join(text.split())
    if len(text) <= limit:
        return text
    return text[:limit].rstrip() + "..."


def to_memory_record(item: dict[str, Any]) -> dict[str, Any]:
    layer = item.get("layer", "news")
    content = item.get("content", "")
    title = item.get("title", "")
    text = f"{title} {content}"

    return {
        "id": stable_id(item),
        "memory_type": MEMORY_TYPE_BY_LAYER.get(layer, "event"),
        "date": item.get("date", ""),
        "source": item.get("source", ""),
        "title": title,
        "summary": summarize(content),
        "entities": {
            "symbols": item.get("symbols", []),
            "companies": item.get("companies", []),
            "industries": item.get("industries", []),
            "topics": item.get("topics", []),
        },
        "event_type": detect_event_type(text),
        "impact": detect_impact(text),
        "confidence": "medium",
        "tags": sorted(set([layer, *item.get("industries", []), *item.get("topics", [])])),
        "raw_ref": item.get("raw_ref", ""),
        "metadata": {
            "layer": layer,
            "ingest_mode": "demo",
        },
    }


def write_jsonl(path: Path, records: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="\n") as file:
        for record in records:
            file.write(json.dumps(record, ensure_ascii=False) + "\n")


def main() -> None:
    raw_items = read_jsonl(INPUT_PATH)
    records = [to_memory_record(item) for item in raw_items]
    write_jsonl(OUTPUT_PATH, records)
    print(f"Wrote {len(records)} memory records to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()

