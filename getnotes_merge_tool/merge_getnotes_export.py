from __future__ import annotations

import argparse
import html
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from bs4 import BeautifulSoup
from markdownify import MarkdownConverter


@dataclass
class Note:
    title: str
    created_at: str
    tags: list[str]
    source_url: str | None
    source_title: str | None
    body_markdown: str
    file_name: str


class GetNotesMarkdownConverter(MarkdownConverter):
    def convert_hr(self, el, text, parent_tags):
        return "\n\n---\n\n"

    def convert_img(self, el, text, parent_tags):
        src = (el.get("src") or "").strip()
        alt = (el.get("alt") or "").strip()
        if not src:
            return ""
        return f"![{alt}]({src})"

    def convert_pre(self, el, text, parent_tags):
        code = el.get_text("\n")
        code = code.rstrip("\n")
        language = ""
        code_tag = el.find("code")
        if code_tag:
            for class_name in code_tag.get("class", []):
                if class_name.startswith("language-"):
                    language = class_name.removeprefix("language-")
                    if language == "auto":
                        language = ""
                    break
        return f"\n\n```{language}\n{code}\n```\n\n"

    def convert_code(self, el, text, parent_tags):
        if el.parent and el.parent.name == "pre":
            return text
        return super().convert_code(el, text, parent_tags)


def normalize_whitespace(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = text.replace("\u00a0", " ")
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def fix_relative_urls(container: BeautifulSoup) -> None:
    for tag in container.find_all(src=True):
        src = tag.get("src", "").strip()
        if src.startswith("files/"):
            tag["src"] = f"notes/{src}"
    for tag in container.find_all(href=True):
        href = tag.get("href", "").strip()
        if href.startswith("files/"):
            tag["href"] = f"notes/{href}"


def parse_source_info(note_root: BeautifulSoup) -> tuple[str | None, str | None]:
    attachment = note_root.select_one(".attachment a")
    if not attachment:
        return None, None
    url = (attachment.get("href") or "").strip() or None
    title = normalize_whitespace(attachment.get_text(" ", strip=True)) or None
    return url, title


def parse_tags(note_root: BeautifulSoup) -> list[str]:
    tags = []
    for tag in note_root.select(".tag"):
        value = normalize_whitespace(tag.get_text(" ", strip=True))
        if value:
            tags.append(value)
    return tags


def extract_body(note_root: BeautifulSoup) -> BeautifulSoup:
    body_start = note_root.find("hr")
    if body_start:
        current = body_start.find_next_sibling()
    else:
        current = None

    body_nodes = []
    while current:
        body_nodes.append(current)
        current = current.find_next_sibling()

    body_html = "".join(str(node) for node in body_nodes).strip()
    return BeautifulSoup(body_html, "html.parser")


def extract_title(note_root: BeautifulSoup, soup: BeautifulSoup, body_soup: BeautifulSoup) -> str:
    h1 = note_root.find("h1")
    if h1:
        value = normalize_whitespace(h1.get_text(" ", strip=True))
        if value:
            return value

    if soup.title:
        value = normalize_whitespace(soup.title.get_text(" ", strip=True))
        if value:
            return value

    for tag_name in ("h1", "h2", "h3", "p", "li", "code"):
        for tag in body_soup.find_all(tag_name):
            value = normalize_whitespace(tag.get_text(" ", strip=True))
            if value:
                return value[:120]

    return note_root.get("data-note-id") or note_root.get("id") or "未命名笔记"


def parse_note(note_path: Path) -> Note:
    soup = BeautifulSoup(note_path.read_text(encoding="utf-8"), "html.parser")
    note_root = soup.select_one(".note")
    if note_root is None:
        raise ValueError(f"Cannot find .note container in {note_path}")

    created_at = ""
    for p in note_root.find_all("p", recursive=False):
        text = normalize_whitespace(p.get_text(" ", strip=True))
        if text.startswith("创建于："):
            created_at = text.removeprefix("创建于：").strip()
            break
    if not created_at:
        raise ValueError(f"Cannot find created_at in {note_path}")

    tags = parse_tags(note_root)
    source_url, source_title = parse_source_info(note_root)

    body_soup = extract_body(note_root)
    for attachment in body_soup.select(".attachment"):
        attachment.decompose()
    title = extract_title(note_root, soup, body_soup)
    fix_relative_urls(body_soup)

    converter = GetNotesMarkdownConverter(
        heading_style="ATX",
        bullets="-",
        strong_em_symbol="*",
        strip=["script", "style"],
    )
    body_markdown = converter.convert_soup(body_soup)
    body_markdown = html.unescape(body_markdown)
    body_markdown = normalize_whitespace(body_markdown)

    return Note(
        title=title,
        created_at=created_at,
        tags=tags,
        source_url=source_url,
        source_title=source_title,
        body_markdown=body_markdown,
        file_name=note_path.name,
    )


def sort_key(note: Note) -> tuple[str, str]:
    return (note.created_at, note.title)


def build_output(notes: Iterable[Note], archive_dir: Path) -> str:
    note_list = sorted(notes, key=sort_key, reverse=True)
    total = len(note_list)

    lines: list[str] = [
        "# Get笔记合并稿",
        "",
        f"- 导出目录：`{archive_dir}`",
        f"- 笔记总数：`{total}`",
        "",
        "## 目录",
        "",
    ]

    for index, note in enumerate(note_list, start=1):
        anchor = make_anchor(note.title)
        lines.append(f"{index}. [{note.title}](#{anchor})")

    for note in note_list:
        lines.extend(
            [
                "",
                "---",
                "",
                f"## {note.title}",
                "",
                f"- 创建时间：`{note.created_at}`",
                f"- 标签：{', '.join(f'`{tag}`' for tag in note.tags) if note.tags else '无'}",
                f"- 源文件：`notes/{note.file_name}`",
            ]
        )

        if note.source_url:
            source_text = note.source_title or note.source_url
            lines.append(f"- 原文链接：[{{source_text}}]({note.source_url})".format(source_text=source_text))

        lines.extend(["", note.body_markdown or "_空白笔记_", ""])

    return "\n".join(lines).strip() + "\n"


def make_safe_filename(value: str, max_length: int = 80) -> str:
    value = html.unescape(value).strip()
    value = re.sub(r'[<>:"/\\|?*]', " ", value)
    value = re.sub(r"[^\w\u4e00-\u9fff\-. ]+", " ", value)
    value = re.sub(r"\s+", " ", value).strip()
    value = value.rstrip(". ")
    if not value:
        value = "未命名笔记"
    if len(value) > max_length:
        value = value[:max_length].rstrip()
    return value


def make_note_basename(note: Note) -> str:
    timestamp = note.created_at.replace(":", "").replace(" ", "_").replace("-", "")
    title = make_safe_filename(note.title)
    stem = Path(note.file_name).stem[:12]
    return f"{timestamp}_{title}_{stem}"


def build_single_note_output(note: Note) -> str:
    lines = [
        f"# {note.title}",
        "",
        f"- 创建时间：`{note.created_at}`",
        f"- 标签：{', '.join(f'`{tag}`' for tag in note.tags) if note.tags else '无'}",
        f"- 源文件：`notes/{note.file_name}`",
    ]

    if note.source_url:
        source_text = note.source_title or note.source_url
        lines.append(f"- 原文链接：[{{source_text}}]({note.source_url})".format(source_text=source_text))

    lines.extend(["", note.body_markdown or "_空白笔记_", ""])
    return "\n".join(lines).strip() + "\n"


def write_split_notes(notes: Iterable[Note], archive_dir: Path, output_dir: Path) -> tuple[int, Path]:
    note_list = sorted(notes, key=sort_key, reverse=True)
    output_dir.mkdir(parents=True, exist_ok=True)

    index_lines = [
        "# Get笔记单篇索引",
        "",
        f"- 导出目录：`{archive_dir}`",
        f"- 笔记总数：`{len(note_list)}`",
        "",
        "## 列表",
        "",
    ]

    for index, note in enumerate(note_list, start=1):
        basename = make_note_basename(note)
        file_name = f"{basename}.md"
        file_path = output_dir / file_name
        file_path.write_text(build_single_note_output(note), encoding="utf-8")
        index_lines.extend(
            [
                f"{index}. [{note.title}]({file_name})",
                f"   - 时间：`{note.created_at}`",
                f"   - 标签：{', '.join(f'`{tag}`' for tag in note.tags) if note.tags else '无'}",
            ]
        )

    index_path = output_dir / "README.md"
    index_path.write_text("\n".join(index_lines).strip() + "\n", encoding="utf-8")
    return len(note_list), index_path


def make_anchor(title: str) -> str:
    anchor = title.strip().lower()
    anchor = html.unescape(anchor)
    anchor = re.sub(r"[^\w\u4e00-\u9fff\- ]+", "", anchor)
    anchor = re.sub(r"\s+", "-", anchor)
    return anchor


def main() -> None:
    parser = argparse.ArgumentParser(description="Merge Get notes export into a single markdown file.")
    parser.add_argument("archive_dir", type=Path, help="Path to the Get notes export directory")
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Output markdown file path. Defaults to <archive_dir>/Get笔记_合并.md",
    )
    parser.add_argument(
        "--split-dir",
        type=Path,
        default=None,
        help="Directory for per-note markdown files. Defaults to <archive_dir>/Get笔记_单篇MD",
    )
    args = parser.parse_args()

    archive_dir = args.archive_dir.resolve()
    notes_dir = archive_dir / "notes"
    output_path = args.output.resolve() if args.output else archive_dir / "Get笔记_合并.md"
    split_dir = args.split_dir.resolve() if args.split_dir else archive_dir / "Get笔记_单篇MD"

    note_paths = sorted(notes_dir.glob("*.html"))
    if not note_paths:
        raise SystemExit(f"No note HTML files found in {notes_dir}")

    notes = [parse_note(path) for path in note_paths]
    output = build_output(notes, archive_dir)

    output_path.write_text(output, encoding="utf-8")
    split_count, split_index_path = write_split_notes(notes, archive_dir, split_dir)
    print(f"written: {output_path}")
    print(f"notes: {len(notes)}")
    print(f"split_written: {split_count}")
    print(f"split_index: {split_index_path}")


if __name__ == "__main__":
    main()
