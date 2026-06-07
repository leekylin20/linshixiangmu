from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
MEMORY_PATH = ROOT / "data" / "memory" / "investment_memory.jsonl"


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []

    records: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as file:
        for line in file:
            line = line.strip()
            if line:
                records.append(json.loads(line))
    return records


def flatten_text(record: dict[str, Any]) -> str:
    entities = record.get("entities", {})
    parts = [
        record.get("title", ""),
        record.get("summary", ""),
        record.get("source", ""),
        record.get("event_type", ""),
        " ".join(record.get("tags", [])),
        " ".join(entities.get("symbols", [])),
        " ".join(entities.get("companies", [])),
        " ".join(entities.get("industries", [])),
        " ".join(entities.get("topics", [])),
    ]
    return " ".join(parts).lower()


def search(records: list[dict[str, Any]], keyword: str) -> list[dict[str, Any]]:
    keyword = keyword.lower()
    return [record for record in records if keyword in flatten_text(record)]


def main() -> None:
    keyword = sys.argv[1] if len(sys.argv) > 1 else ""
    if not keyword:
        print("Usage: python src/query_memory.py <keyword>")
        raise SystemExit(2)

    records = read_jsonl(MEMORY_PATH)
    matches = search(records, keyword)

    print(f"Found {len(matches)} records for: {keyword}")
    for record in matches:
        print("-" * 72)
        print(f"[{record['date']}] {record['memory_type']} / {record['source']}")
        print(record["title"])
        print(record["summary"])
        print("tags:", ", ".join(record.get("tags", [])))


if __name__ == "__main__":
    main()

