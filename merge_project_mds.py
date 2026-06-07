from __future__ import annotations

import argparse
import re
from pathlib import Path


def sanitize_name(name: str) -> str:
    name = re.sub(r'[<>:"/\\|?*]', "_", name)
    name = name.rstrip(". ").strip()
    return name or "untitled"


def project_display_name(folder_name: str) -> str:
    parts = folder_name.split("_", 1)
    if len(parts) == 2 and parts[1].strip():
        return parts[1].strip()
    return folder_name.strip()


def doc_display_name(file_path: Path) -> str:
    stem = file_path.stem
    parts = stem.split("_", 2)
    if len(parts) == 3 and parts[2].strip():
        return parts[2].strip()
    return stem


def merge_project(project_dir: Path, output_dir: Path) -> Path | None:
    md_files = sorted(p for p in project_dir.glob("*.md") if p.is_file())
    if not md_files:
        return None

    project_name = project_display_name(project_dir.name)
    output_path = output_dir / f"{sanitize_name(project_name)}.md"

    sections: list[str] = [f"# {project_name}", ""]
    for index, md_file in enumerate(md_files, start=1):
        title = doc_display_name(md_file)
        content = md_file.read_text(encoding="utf-8-sig").strip()
        sections.append(f"## {index:03d}. {title}")
        sections.append("")
        sections.append(content)
        sections.append("")

    output_path.write_text("\n".join(sections).rstrip() + "\n", encoding="utf-8-sig")
    return output_path


def main() -> int:
    parser = argparse.ArgumentParser(description="Merge each project folder in all_md into one Markdown file.")
    parser.add_argument("--input", default="all_md", help="Source directory containing project folders.")
    parser.add_argument("--output", default="all_md_merged", help="Output directory for merged Markdown files.")
    args = parser.parse_args()

    input_dir = Path(args.input).resolve()
    output_dir = Path(args.output).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    merged = 0
    for project_dir in sorted(p for p in input_dir.iterdir() if p.is_dir()):
        result = merge_project(project_dir, output_dir)
        if result is not None:
            merged += 1
            print(f"[OK] {result}")

    print(f"Merged projects: {merged}")
    print(f"Output: {output_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
