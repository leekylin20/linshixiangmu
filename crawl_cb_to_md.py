from __future__ import annotations

import argparse
import json
import re
import socket
import sys
import time
from dataclasses import dataclass
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen


USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/135.0.0.0 Safari/537.36"
)

ROOT_URL = "https://cb.pages.dev/"
DEFAULT_START_URL = "https://cb.pages.dev/index-2.htm?page=1&kw=&sort=&role=-1"


def sanitize_name(name: str) -> str:
    name = re.sub(r"\s+", " ", name).strip()
    name = re.sub(r'[<>:"/\\|?*]', "_", name)
    name = name.rstrip(". ")
    return name or "untitled"


def normalize_markdown_links(markdown: str, base_url: str) -> str:
    def replace_md_link(match: re.Match[str]) -> str:
        prefix, target, suffix = match.groups()
        target = target.strip()
        if not target or target.startswith(("#", "mailto:", "javascript:")):
            return match.group(0)
        if re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", target):
            return match.group(0)
        return f"{prefix}{urljoin(base_url, target)}{suffix}"

    markdown = re.sub(
        r"(!?\[[^\]]*?\]\()([^)]+)(\))",
        replace_md_link,
        markdown,
    )
    markdown = re.sub(
        r'((?:href|src)\s*=\s*")([^"]+)(")',
        lambda m: (
            m.group(0)
            if not m.group(2)
            or m.group(2).startswith(("#", "mailto:", "javascript:"))
            or re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", m.group(2))
            else f'{m.group(1)}{urljoin(base_url, m.group(2))}{m.group(3)}'
        ),
        markdown,
        flags=re.IGNORECASE,
    )
    return markdown


@dataclass
class Link:
    href: str
    text: str
    title: str


class SimpleHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.links: list[Link] = []
        self.h1_texts: list[str] = []
        self.textareas: list[str] = []
        self.title_text: str = ""

        self._anchor_stack: list[dict[str, str | list[str]]] = []
        self._in_h1 = False
        self._h1_chunks: list[str] = []
        self._in_title = False
        self._title_chunks: list[str] = []
        self._in_textarea = False
        self._textarea_chunks: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = {key: value or "" for key, value in attrs}
        if tag == "a":
            self._anchor_stack.append(
                {
                    "href": attr_map.get("href", ""),
                    "title": attr_map.get("title", ""),
                    "text_chunks": [],
                }
            )
        elif tag == "h1":
            self._in_h1 = True
            self._h1_chunks = []
        elif tag == "title":
            self._in_title = True
            self._title_chunks = []
        elif tag == "textarea":
            self._in_textarea = True
            self._textarea_chunks = []

    def handle_endtag(self, tag: str) -> None:
        if tag == "a" and self._anchor_stack:
            anchor = self._anchor_stack.pop()
            text = normalize_text("".join(anchor["text_chunks"]))  # type: ignore[index]
            self.links.append(
                Link(
                    href=str(anchor["href"]).strip(),
                    title=normalize_text(str(anchor["title"])),
                    text=text,
                )
            )
        elif tag == "h1" and self._in_h1:
            self._in_h1 = False
            text = normalize_text("".join(self._h1_chunks))
            if text:
                self.h1_texts.append(text)
        elif tag == "title" and self._in_title:
            self._in_title = False
            self.title_text = normalize_text("".join(self._title_chunks))
        elif tag == "textarea" and self._in_textarea:
            self._in_textarea = False
            text = "".join(self._textarea_chunks)
            if text.strip():
                self.textareas.append(text)

    def handle_data(self, data: str) -> None:
        if self._anchor_stack:
            self._anchor_stack[-1]["text_chunks"].append(data)  # type: ignore[index]
        if self._in_h1:
            self._h1_chunks.append(data)
        if self._in_title:
            self._title_chunks.append(data)
        if self._in_textarea:
            self._textarea_chunks.append(data)


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", unescape(text)).strip()


class Fetcher:
    def __init__(self, delay: float, retries: int = 3, timeout: int = 30) -> None:
        self.delay = delay
        self.retries = retries
        self.timeout = timeout

    def get(self, url: str) -> str:
        last_error: Exception | None = None
        for attempt in range(1, self.retries + 1):
            request = Request(url, headers={"User-Agent": USER_AGENT})
            try:
                with urlopen(request, timeout=self.timeout) as response:
                    content = response.read()
                if self.delay > 0:
                    time.sleep(self.delay)
                return content.decode("utf-8", errors="replace")
            except HTTPError as exc:
                raise RuntimeError(f"HTTP {exc.code} for {url}") from exc
            except (URLError, TimeoutError, socket.timeout) as exc:
                last_error = exc
                if attempt == self.retries:
                    break
                time.sleep(min(2 * attempt, 5))
        raise RuntimeError(f"Network error for {url}: {last_error}")


def parse_html(html: str) -> SimpleHTMLParser:
    parser = SimpleHTMLParser()
    parser.feed(html)
    return parser


def unique_links(links: Iterable[Link]) -> list[Link]:
    seen: set[str] = set()
    result: list[Link] = []
    for link in links:
        href = link.href.strip()
        if not href or href in seen:
            continue
        seen.add(href)
        result.append(link)
    return result


def extract_projects(list_url: str, parser: SimpleHTMLParser) -> tuple[list[Link], list[Link], str | None]:
    projects = [
        link
        for link in unique_links(parser.links)
        if re.match(r"^project-\d+/index\.htm$", link.href)
    ]
    protected_projects = [
        link
        for link in unique_links(parser.links)
        if re.match(r"^check_viewcode/index(?:-\d+)?\.htm$", link.href)
    ]
    next_link = next(
        (
            urljoin(list_url, link.href)
            for link in parser.links
            if link.text == "下一页" and link.href and link.href != "javascript:;"
        ),
        None,
    )
    return projects, protected_projects, next_link


def extract_project_title(parser: SimpleHTMLParser, fallback: str) -> str:
    if parser.h1_texts:
        return parser.h1_texts[0]
    if parser.title_text:
        return parser.title_text.split(" - ")[0].strip()
    return fallback


def extract_doc_links(project_url: str, parser: SimpleHTMLParser) -> list[Link]:
    result: list[Link] = []
    for link in unique_links(parser.links):
        href = link.href
        full_url = urljoin(project_url, href)
        if re.search(r"/doc-\d+/index\.htm$", full_url):
            result.append(
                Link(
                    href=full_url,
                    text=link.text,
                    title=link.title or link.text,
                )
            )
    return result


def extract_doc_markdown(parser: SimpleHTMLParser) -> str:
    candidates = [item.strip("\ufeff\r\n") for item in parser.textareas if item.strip()]
    if not candidates:
        raise RuntimeError("No Markdown textarea found on document page")

    def score(text: str) -> tuple[int, int]:
        return (text.count("\n"), len(text))

    return max(candidates, key=score).strip() + "\n"


def build_output_path(root: Path, project_slug: str, doc_slug: str) -> Path:
    directory = root / project_slug
    directory.mkdir(parents=True, exist_ok=True)
    return directory / f"{doc_slug}.md"


def crawl(args: argparse.Namespace) -> int:
    output_dir = Path(args.output).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    fetcher = Fetcher(delay=args.delay)
    manifest: list[dict[str, str]] = []
    protected_manifest: list[dict[str, str]] = []
    empty_projects: list[dict[str, str]] = []
    list_url = args.start_url
    page_count = 0
    project_count = 0
    doc_count = 0
    written_count = 0
    skipped_projects = 0

    while list_url:
        page_count += 1
        print(f"[LIST] {list_url}")
        html = fetcher.get(list_url)
        parser = parse_html(html)
        projects, protected_projects, next_link = extract_projects(list_url, parser)

        for protected_link in protected_projects:
            protected_url = urljoin(list_url, protected_link.href)
            if any(item["project_url"] == protected_url for item in protected_manifest):
                continue
            print(f"[PROTECTED] {protected_url}")
            protected_manifest.append(
                {
                    "project_title": protected_link.title or protected_link.text or "protected_project",
                    "project_url": protected_url,
                    "reason": "requires_viewcode",
                }
            )

        for project_link in projects:
            if args.project_limit and project_count >= args.project_limit:
                next_link = None
                break

            project_count += 1
            project_url = urljoin(list_url, project_link.href)
            print(f"[PROJECT] {project_url}")
            try:
                project_html = fetcher.get(project_url)
                project_parser = parse_html(project_html)
            except RuntimeError as exc:
                print(f"  ! skip project: {exc}", file=sys.stderr)
                skipped_projects += 1
                continue

            project_title = extract_project_title(
                project_parser,
                fallback=project_link.title or project_link.text or f"project-{project_count}",
            )
            project_id = re.search(r"project-(\d+)", project_url)
            project_slug = sanitize_name(
                f"project-{project_id.group(1) if project_id else project_count}_{project_title}"
            )

            doc_links = extract_doc_links(project_url, project_parser)
            if not doc_links:
                print("  ! no accessible doc links, skipped", file=sys.stderr)
                skipped_projects += 1
                empty_projects.append(
                    {
                        "project_title": project_title,
                        "project_url": project_url,
                        "reason": "no_accessible_doc_links",
                    }
                )
                continue

            for index, doc_link in enumerate(doc_links, start=1):
                if args.doc_limit and doc_count >= args.doc_limit:
                    break

                doc_count += 1
                doc_url = doc_link.href
                print(f"  [DOC] {doc_url}")
                try:
                    doc_html = fetcher.get(doc_url)
                    doc_parser = parse_html(doc_html)
                    doc_title = (
                        doc_parser.h1_texts[0]
                        if doc_parser.h1_texts
                        else doc_link.title
                        or doc_link.text
                        or f"doc-{doc_count}"
                    )
                    markdown = extract_doc_markdown(doc_parser)
                    markdown = normalize_markdown_links(markdown, doc_url)
                except RuntimeError as exc:
                    print(f"    ! skip doc: {exc}", file=sys.stderr)
                    continue

                doc_id = re.search(r"doc-(\d+)", doc_url)
                doc_slug = sanitize_name(
                    f"{index:03d}_doc-{doc_id.group(1) if doc_id else doc_count}_{doc_title}"
                )
                output_path = build_output_path(output_dir, project_slug, doc_slug)
                output_path.write_text(markdown, encoding="utf-8-sig")
                written_count += 1

                manifest.append(
                    {
                        "project_title": project_title,
                        "project_url": project_url,
                        "doc_title": doc_title,
                        "doc_url": doc_url,
                        "file_path": str(output_path),
                    }
                )

            if args.doc_limit and doc_count >= args.doc_limit:
                next_link = None
                break

        if args.project_limit and project_count >= args.project_limit:
            break

        list_url = next_link

    manifest_path = output_dir / "manifest.json"
    manifest_path.write_text(
        json.dumps(
            {
                "start_url": args.start_url,
                "generated_at_unix": int(time.time()),
                "pages_visited": page_count,
                "projects_seen": project_count,
                "projects_skipped": skipped_projects,
                "docs_written": written_count,
                "protected_projects": protected_manifest,
                "empty_or_unlisted_projects": empty_projects,
                "items": manifest,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    print()
    print("Done")
    print(f"Output: {output_dir}")
    print(f"Pages visited: {page_count}")
    print(f"Projects seen: {project_count}")
    print(f"Projects skipped: {skipped_projects}")
    print(f"Docs written: {written_count}")
    print(f"Manifest: {manifest_path}")
    return 0


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Crawl cb.pages.dev list pages and save each article as a Markdown file."
    )
    parser.add_argument(
        "--start-url",
        default=DEFAULT_START_URL,
        help=f"List page URL to start from. Default: {DEFAULT_START_URL}",
    )
    parser.add_argument(
        "--output",
        default="output_md",
        help="Directory where Markdown files will be written.",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=0.2,
        help="Delay in seconds between HTTP requests.",
    )
    parser.add_argument(
        "--project-limit",
        type=int,
        default=0,
        help="Stop after this many projects. 0 means no limit.",
    )
    parser.add_argument(
        "--doc-limit",
        type=int,
        default=0,
        help="Stop after this many documents. 0 means no limit.",
    )
    return parser


if __name__ == "__main__":
    arguments = build_arg_parser().parse_args()
    raise SystemExit(crawl(arguments))
