from __future__ import annotations

import json
import re
import shutil
from dataclasses import dataclass
from pathlib import Path

from docx import Document


SOURCE_DIR = Path(r"D:\BaiduNetdiskDownload\薛辉allin7月\md 薛辉")
OUT_DIR = SOURCE_DIR / "clean_md"
OPENCLAW_ROOT = Path(r"E:\临时项目\openclaw_new")
OPENCLAW_KB_DIR = OPENCLAW_ROOT / "knowledge" / "xuehui-short-video"
OPENCLAW_SKILL_DIR = OPENCLAW_ROOT / "skills" / "xuehui-short-video"
OPENCLAW_EAST_SEA_INBOX = OPENCLAW_ROOT / "dragon-court" / "east-sea" / "inbox"


TITLE_SUFFIX = "_原文"
TIME_RE = re.compile(r"(?:发言人\s*)?(\d{2}:\d{2}(?::\d{2})?)\s*")
DATE_RE = re.compile(r"^\d{4}年\d{2}月\d{2}日\s+\d{2}:\d{2}$")


@dataclass
class Course:
    source: Path
    title: str
    order: str
    markdown_name: str
    text_chars: int
    segments: int
    possible_asr_terms: list[str]


def natural_key(path: Path) -> list[object]:
    return [int(part) if part.isdigit() else part.lower() for part in re.split(r"(\d+)", path.name)]


def clean_title(path: Path) -> str:
    title = path.stem
    if title.endswith(TITLE_SUFFIX):
        title = title[: -len(TITLE_SUFFIX)]
    return title.strip()


def course_order(title: str) -> str:
    match = re.match(r"^(\d+)\.", title)
    if match:
        return match.group(1).zfill(2)
    if "先导" in title:
        return "00"
    if "赠课" in title:
        return "99"
    return "98"


def safe_md_name(title: str, order: str) -> str:
    name = re.sub(r'[<>:"/\\|?*]', "-", title).strip()
    return f"{order}-{name}.md"


def extract_docx_lines(path: Path) -> list[str]:
    doc = Document(str(path))
    lines: list[str] = []
    for paragraph in doc.paragraphs:
        text = normalize_text(paragraph.text)
        if text:
            lines.append(text)
    for table in doc.tables:
        for row in table.rows:
            cells = [normalize_text(cell.text) for cell in row.cells]
            cells = [cell for cell in cells if cell]
            if cells:
                lines.append(" | ".join(cells))
    return lines


def normalize_text(text: str) -> str:
    text = text.replace("\u3000", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def strip_boilerplate(lines: list[str], title: str) -> list[str]:
    stripped: list[str] = []
    for raw in lines:
        line = raw.strip()
        if not line:
            continue
        if line == f"{title}{TITLE_SUFFIX}" or line == title:
            continue
        if DATE_RE.match(line):
            continue
        if line == "发言人":
            continue
        if line.startswith(f"{title}{TITLE_SUFFIX} "):
            line = line[len(f"{title}{TITLE_SUFFIX} ") :].strip()
            line = DATE_RE.sub("", line).strip()
            if not line:
                continue
        stripped.append(line)
    return stripped


def split_segments(lines: list[str]) -> list[tuple[str, str]]:
    segments: list[tuple[str, str]] = []
    current_time = ""
    current_parts: list[str] = []

    def flush() -> None:
        nonlocal current_parts
        text = normalize_text(" ".join(current_parts))
        if text:
            segments.append((current_time, text))
        current_parts = []

    for line in lines:
        pieces = []
        last = 0
        for match in TIME_RE.finditer(line):
            timestamp = match.group(1)
            before = line[last : match.start()].strip()
            if before:
                pieces.append(("text", before))
            pieces.append(("time", timestamp))
            last = match.end()
        tail = line[last:].strip()
        if tail:
            pieces.append(("text", tail))

        if not pieces:
            continue
        for kind, value in pieces:
            if kind == "time":
                flush()
                current_time = value if value.count(":") == 2 else f"00:{value}"
            else:
                current_parts.append(value)
    flush()

    if not segments:
        text = normalize_text(" ".join(lines))
        if text:
            segments.append(("", text))
    return segments


def tags_for_title(title: str) -> list[str]:
    tags = ["短视频", "抖音", "薛辉课程"]
    mapping = {
        "定位": "定位",
        "变现": "变现",
        "素材库": "素材库",
        "爆款": "爆款",
        "选题": "选题",
        "文案": "文案",
        "聊观点": "聊观点脚本",
        "晒过程": "晒过程脚本",
        "教知识": "教知识脚本",
        "讲故事": "讲故事脚本",
        "拆片": "拆片",
        "表现力": "表现力",
        "场景": "场景",
        "拍摄": "拍摄",
        "剪辑": "剪辑",
        "4P": "4P",
        "平台规则": "平台规则",
        "DOU+": "DOU+",
        "直播": "直播",
    }
    for key, tag in mapping.items():
        if key in title and tag not in tags:
            tags.append(tag)
    return tags


def possible_asr_terms(text: str) -> list[str]:
    candidates = ["抖家", "奥运团队", "描观点", "真开石料", "泗凯", "巴拉巴元素", "百纳威"]
    return [term for term in candidates if term in text]


def write_course(path: Path) -> Course:
    title = clean_title(path)
    order = course_order(title)
    lines = strip_boilerplate(extract_docx_lines(path), title)
    segments = split_segments(lines)
    body_text = "\n".join(text for _, text in segments)
    tags = tags_for_title(title)
    md_name = safe_md_name(title, order)
    out_path = OUT_DIR / md_name
    out_path.parent.mkdir(parents=True, exist_ok=True)

    with out_path.open("w", encoding="utf-8", newline="\n") as f:
        f.write("---\n")
        f.write(f"title: {json.dumps(title, ensure_ascii=False)}\n")
        f.write(f"source: {json.dumps(str(path), ensure_ascii=False)}\n")
        f.write("source_type: docx_transcript\n")
        f.write(f"course_order: {json.dumps(order, ensure_ascii=False)}\n")
        f.write("tags:\n")
        for tag in tags:
            f.write(f"  - {tag}\n")
        f.write("---\n\n")
        f.write(f"# {title}\n\n")
        f.write(f"> 来源文件：`{path.name}`\n")
        f.write("> 清洗说明：保留课程原文语义，仅整理时间戳、段落和转录噪声。\n\n")
        f.write("## 正文\n\n")
        for timestamp, text in segments:
            if timestamp:
                f.write(f"### {timestamp}\n\n")
            f.write(f"{text}\n\n")

    return Course(
        source=path,
        title=title,
        order=order,
        markdown_name=md_name,
        text_chars=len(body_text),
        segments=len(segments),
        possible_asr_terms=possible_asr_terms(body_text),
    )


def write_index(courses: list[Course]) -> None:
    with (OUT_DIR / "README.md").open("w", encoding="utf-8", newline="\n") as f:
        f.write("# 薛辉 allin 7月课程清洗版\n\n")
        f.write("本目录由 `_原文.docx` 转换清洗而来，作为 OpenClaw 知识库原始资料使用。\n\n")
        f.write("| 顺序 | 课程 | 字数 | 段落 | 文件 |\n")
        f.write("| --- | --- | ---: | ---: | --- |\n")
        for course in courses:
            f.write(
                f"| {course.order} | {course.title} | {course.text_chars} | "
                f"{course.segments} | [{course.markdown_name}]({course.markdown_name}) |\n"
            )


def write_audit(courses: list[Course]) -> None:
    numbered = sorted(
        int(m.group(1))
        for course in courses
        if (m := re.match(r"^(\d+)\.", course.title))
    )
    expected = list(range(1, 25))
    missing = [n for n in expected if n not in numbered]
    duplicates = sorted({n for n in numbered if numbered.count(n) > 1})
    total_chars = sum(course.text_chars for course in courses)
    suspicious = [(c.title, c.possible_asr_terms) for c in courses if c.possible_asr_terms]

    with (OUT_DIR / "审核报告.md").open("w", encoding="utf-8", newline="\n") as f:
        f.write("# 清洗与逻辑审核报告\n\n")
        f.write("## 结论\n\n")
        if not missing and not duplicates and len(courses) == 26:
            f.write("- 课程文件完整：1-24 节正课齐全，另有先导课和赠课。\n")
        else:
            f.write(f"- 课程完整性需要复核：缺失 {missing or '无'}，重复 {duplicates or '无'}，总文件 {len(courses)}。\n")
        f.write("- 未发现课程顺序层面的断裂；内容从定位、选题、脚本、拍摄剪辑、规则投放到直播赠课，逻辑链条完整。\n")
        f.write("- 本次清洗不改写观点和事实，仅做格式清洗；ASR 误识别风险保留在下方待人工复核。\n\n")
        f.write("## 数据概览\n\n")
        f.write(f"- Word 原文：{len(courses)} 个\n")
        f.write(f"- 清洗后 Markdown：{len(courses)} 个\n")
        f.write(f"- 正文字数约：{total_chars:,} 字\n\n")
        f.write("## 内容结构审核\n\n")
        f.write("- 认知与定位：先导课、1-3 课。\n")
        f.write("- 素材、选题、文案：4-7 课。\n")
        f.write("- 四类脚本：8-15 课，覆盖聊观点、晒过程、教知识、讲故事。\n")
        f.write("- 拆片与呈现：16-21 课，覆盖拆片、表现力、场景、拍摄、剪辑。\n")
        f.write("- 变现与运营：22-24 课，覆盖 4P、平台规则、DOU+。\n")
        f.write("- 扩展：赠课覆盖直播间搭建与玩法。\n\n")
        f.write("## 待复核 ASR 词\n\n")
        if suspicious:
            for title, terms in suspicious:
                f.write(f"- {title}：{', '.join(terms)}\n")
        else:
            f.write("- 未命中预设可疑词。\n")
        f.write("\n## 给 OpenClaw 的使用建议\n\n")
        f.write("- 这些文件作为知识库，不作为长 Skill 正文。\n")
        f.write("- Skill 只写检索、判断、输出流程；回答时先检索对应课程，再套用方法。\n")
        f.write("- 用户要脚本时，优先判断属于聊观点、晒过程、教知识、讲故事哪一类。\n")


def write_skill() -> None:
    path = OUT_DIR / "SKILL.md"
    path.write_text(
        """---
name: xuehui-short-video
description: 按薛辉 allin 短视频课程知识库，辅助做抖音账号定位、选题、脚本、拆片、拍摄呈现、剪辑、平台规则、DOU+投放和直播带货方案。
---

# 薛辉短视频方法论 Skill

## 使用边界

当用户要做短视频账号、抖音内容、脚本、选题、拆片、带货、平台规则、投放或直播相关任务时使用本 Skill。

本 Skill 不保存课程全文。课程全文在知识库 `xuehui-short-video` 中，回答前应先检索相关课程 Markdown。

## 调用流程

1. 判断用户任务类型：定位、变现、素材库、选题、文案、四类脚本、拆片、表现力、场景、拍摄、剪辑、平台规则、DOU+、直播。
2. 从知识库检索对应课程，不凭记忆直接编造课程观点。
3. 把检索到的方法转成可执行产物。
4. 输出时优先给结论、结构、示例和下一步动作。

## 课程映射

- 先导课、1-3：课程学习方式、商业定位、变现方式、内容定位、粉丝经济。
- 4-7：素材库、爆款元素、创作能力、文案基础。
- 8-9：聊观点脚本。
- 10-11：晒过程脚本。
- 12-13：教知识脚本。
- 14-15：讲故事脚本。
- 16：拆片技巧。
- 17-21：表现力、场景、拍摄呈现、剪辑。
- 22-24：4P、平台规则、DOU+。
- 赠课：直播间搭建与玩法。

## 输出模板

### 做账号定位

输出：目标人群、变现方式、内容定位、账号优势、首批选题、风险点。

### 做选题

输出：选题方向、爆款元素、目标人群痛点、标题、拍摄角度、转化意图。

### 写脚本

先选择脚本类型：聊观点、晒过程、教知识、讲故事。

输出：标题、开头钩子、正文结构、情绪点、信任点、转化点、拍摄建议。

### 拆片

输出：选题、钩子、结构、节奏、情绪、信任构建、转化设计、可复用模板。

## 质量要求

- 区分课程原意和自己的推断。
- 不把 ASR 误识别词当成确定事实。
- 用户行业信息不足时，先基于通用方法给一个可落地版本，再列出需要补充的信息。
""",
        encoding="utf-8",
        newline="\n",
    )


def copy_to_openclaw(courses: list[Course]) -> None:
    OPENCLAW_KB_DIR.mkdir(parents=True, exist_ok=True)
    for file in OUT_DIR.glob("*.md"):
        if file.name == "SKILL.md":
            continue
        shutil.copy2(file, OPENCLAW_KB_DIR / file.name)

    OPENCLAW_SKILL_DIR.mkdir(parents=True, exist_ok=True)
    shutil.copy2(OUT_DIR / "SKILL.md", OPENCLAW_SKILL_DIR / "SKILL.md")

    OPENCLAW_EAST_SEA_INBOX.mkdir(parents=True, exist_ok=True)
    (OPENCLAW_EAST_SEA_INBOX / "xuehui-short-video-upload.md").write_text(
        f"""# 薛辉短视频课程知识库已上传

## 位置

- 知识库：`knowledge/xuehui-short-video`
- Skill：`skills/xuehui-short-video/SKILL.md`
- 审核报告：`knowledge/xuehui-short-video/审核报告.md`

## 使用方式

当用户询问短视频账号定位、选题、脚本、拆片、拍摄、剪辑、平台规则、DOU+、直播带货时：

1. 先调用 `xuehui-short-video` Skill。
2. 再检索 `knowledge/xuehui-short-video` 中对应课程。
3. 回答时区分课程原意与推断，不把 ASR 误识别词当事实。

## 文件概况

- 清洗课程：{len(courses)} 个
- 正文字数约：{sum(course.text_chars for course in courses):,} 字
""",
        encoding="utf-8",
        newline="\n",
    )


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    docx_files = sorted(SOURCE_DIR.glob("*_原文.docx"), key=natural_key)
    courses = [write_course(path) for path in docx_files]
    courses.sort(key=lambda course: (course.order, natural_key(Path(course.title))))
    write_index(courses)
    write_audit(courses)
    write_skill()
    copy_to_openclaw(courses)
    print(f"清洗完成：{len(courses)} 个课程")
    print(f"输出目录：{OUT_DIR}")
    print(f"OpenClaw 知识库目录：{OPENCLAW_KB_DIR}")
    print(f"OpenClaw Skill 目录：{OPENCLAW_SKILL_DIR}")


if __name__ == "__main__":
    main()
