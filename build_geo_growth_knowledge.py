from __future__ import annotations

import json
import re
import shutil
from collections import Counter
from pathlib import Path


SOURCE_DIR = Path("D:/\u4e0b\u8f7d/\u65b0\u5efa\u6587\u4ef6\u5939")
OUT_DIR = SOURCE_DIR / "geo_growth_clean"
LOCAL_OPENCLAW = Path("E:/\u4e34\u65f6\u9879\u76ee/openclaw_new")
LOCAL_KB = LOCAL_OPENCLAW / "knowledge" / "geo-growth"
LOCAL_SKILL = LOCAL_OPENCLAW / "skills" / "geo-growth"
OBSIDIAN_DIR = Path("E:/obsidian/_legacy/\u77e5\u8bc6\u7cfb\u7edf/GEO")


SOURCE_URL_RE = re.compile(r"原文地址:\s*\[.*?\]\((.*?)\)")
HTML_CSS_HINTS = (
    "{ margin:",
    "font-family:",
    "__page_content__",
    "__bottom-bar__",
    "text-size-adjust:",
    "sns_opr_btn",
)


def natural_key(path: Path) -> list[object]:
    return [int(part) if part.isdigit() else part.lower() for part in re.split(r"(\d+)", path.name)]


def safe_name(title: str, index: int) -> str:
    name = re.sub(r'[<>:"/\\|?*\n\r\t]', "_", title).strip(" ._")
    name = re.sub(r"_+", "_", name)
    return f"{index:03d}-{name[:90]}.md"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace").replace("\r\n", "\n").replace("\r", "\n")


def title_from_file(path: Path, text: str) -> str:
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        if any(hint in line for hint in HTML_CSS_HINTS):
            continue
        if line.startswith("> 原文地址"):
            continue
        line = re.sub(r"[*#=]+$", "", line).strip()
        return line[:120]
    return path.stem


def clean_lines(text: str, title: str) -> tuple[list[str], str]:
    source_url = ""
    cleaned: list[str] = []
    skip_footer = False
    body_started = False
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            if cleaned and cleaned[-1] != "":
                cleaned.append("")
            continue
        source_match = SOURCE_URL_RE.search(line)
        if source_match:
            source_url = source_match.group(1).replace("\\_", "_")
            cleaned.append(f"> 原文地址：{source_url}")
            continue
        if re.match(r"^原创\s+", line) and ("AI搜索老胡" in line or "老胡" in line):
            continue
        if any(hint in line for hint in HTML_CSS_HINTS):
            continue
        if line.startswith("!") and ("data:image/svg+xml" in line or "mmbiz.qpic.cn" in line):
            continue
        if "data:image/svg+xml" in line:
            continue
        if re.fullmatch(r"=+", line):
            continue
        if re.fullmatch(r"-{3,}", line):
            cleaned.append("---")
            continue
        if line in {"阅读", "赞", "分享", "推荐", "留言"}:
            continue
        if "阅读!" in line and "赞" in line and "分享" in line:
            continue
        if line.startswith("#") and ("AI搜索" in line or "GEO优化老胡" in line or "老胡流量" in line):
            continue
        if line.startswith("\\- GEO") or line.startswith("- GEO"):
            skip_footer = True
        if len(cleaned) > 20 and any(marker in line for marker in ["加我微信领取", "欢迎勾搭", "AI搜索老胡", "扫码加微信", "GEO代运营/GEO培训", "相关合作，欢迎联系"]):
            skip_footer = True
        if skip_footer:
            if line.startswith("#") and "GEO" in line:
                continue
            if len(line) < 120:
                continue
        if is_marketing_line(line, title, body_started):
            continue
        if line and not line.startswith("> 原文地址"):
            body_started = True
        cleaned.append(line)

    # Remove duplicate title if the export puts it in the body.
    while cleaned and cleaned[0] == "":
        cleaned.pop(0)
    if cleaned and normalize_title(cleaned[0]) == normalize_title(title):
        cleaned.pop(0)
    while cleaned and cleaned[0] == "":
        cleaned.pop(0)

    compact: list[str] = []
    for line in cleaned:
        if line == "" and compact and compact[-1] == "":
            continue
        compact.append(line)
    while compact and compact[-1] == "":
        compact.pop()
    return compact, source_url


def is_marketing_line(line: str, title: str, body_started: bool) -> bool:
    compact = re.sub(r"[*_`#>\[\]（）()【】\s]", "", line)
    if not compact:
        return True
    # Author self-introduction and personal brand footer.
    author_patterns = [
        "你好我是",
        "我是老胡目前",
        "朋友喊我老胡",
        "从事线上营销",
        "从事企业线上流量运营",
        "业余坚持流量实战",
        "三节课IP讲师",
        "鸟哥笔记",
        "人人都是产品经理",
        "项目已服务",
        "目前GEO项目已服务",
    ]
    if any(p in compact for p in author_patterns):
        return True
    # Direct sales, recruitment, community, course and CTA content.
    marketing_patterns = [
        "扫码加微信",
        "加微信",
        "欢迎加我微信",
        "私信",
        "欢迎联系",
        "欢迎勾搭",
        "报名",
        "入群",
        "转发本文",
        "凭截图",
        "免费领取",
        "领取",
        "限时299",
        "299元",
        "299.9元",
        "会员免费",
        "社群会员费用",
        "玩家俱乐部限时招募",
        "招募啦",
        "密训第一期",
        "版权课程",
        "课程大纲",
        "课程人群",
        "老胡亲自带教",
        "老胡GEO增长研习社",
        "GEO学习社群",
        "GEO合作",
        "小红书内容种草",
        "GEO代运营",
        "GEO培训",
        "GEO工具",
        "新闻发稿",
        "服务内容",
        "陪跑服务",
        "培训与陪跑",
        "实战落地找老胡",
        "扫码链接",
        "扫码即可加我微信",
        "扫码交流",
        "以上内容取材网络",
    ]
    if any(p in compact for p in marketing_patterns):
        return True
    if re.fullmatch(r"图\d+", compact):
        return True
    # Link-only recommendations to the author's other posts are navigation, not knowledge.
    if line.startswith("[") and "mp.weixin.qq.com" in line:
        return True
    # Keep legitimate discussion about how to evaluate service providers.
    return False


def normalize_title(text: str) -> str:
    return re.sub(r"\W+", "", text).lower()


def tags_for(title: str, body: str) -> list[str]:
    text = title + "\n" + body[:3000]
    tags = ["GEO", "AI搜索", "生成引擎优化"]
    mapping = {
        "SEO": "SEO对比",
        "AEO": "AEO",
        "关键词": "关键词",
        "内容": "内容优化",
        "合规": "合规",
        "315": "合规",
        "案例": "案例",
        "B2B": "B2B",
        "本地": "本地商家",
        "门店": "门店",
        "工厂": "制造业",
        "小家电": "小家电",
        "装修": "装修",
        "口腔": "医疗门诊",
        "教育": "教育",
        "酒店": "酒店",
        "机器人": "机器人",
        "RPA": "AI/RPA",
        "DeepSeek": "DeepSeek",
        "豆包": "豆包",
        "元宝": "元宝",
        "流程": "操作流程",
        "7个步骤": "操作流程",
        "百问": "百问手册",
        "误区": "误区",
        "投放": "投放",
        "获客": "获客",
    }
    for key, tag in mapping.items():
        if key in text and tag not in tags:
            tags.append(tag)
    return tags


def classify(title: str, body: str) -> str:
    text = title + "\n" + body[:3000]
    if "百问" in title:
        return "faq"
    if any(k in text for k in ["以", "为例", "案例", "门店", "工厂", "机构", "公司如何"]):
        return "case-playbook"
    if any(k in text for k in ["怎么做", "流程", "步骤", "实操", "方法论", "指南"]):
        return "method"
    if any(k in text for k in ["合规", "315", "灰产", "曝光", "误区", "割韭菜"]):
        return "risk-compliance"
    if any(k in text for k in ["SEO", "AEO", "是什么", "概念"]):
        return "concept"
    return "notes"


def build() -> list[dict[str, object]]:
    if OUT_DIR.exists():
        shutil.rmtree(OUT_DIR)
    OUT_DIR.mkdir(parents=True)
    records: list[dict[str, object]] = []
    files = sorted([p for p in SOURCE_DIR.iterdir() if p.is_file() and p.suffix.lower() in {".md", ".txt"}], key=natural_key)
    for index, path in enumerate(files, start=1):
        raw = read_text(path)
        title = title_from_file(path, raw)
        if should_skip_source(title, path.name):
            continue
        cleaned, source_url = clean_lines(raw, title)
        body = "\n".join(cleaned)
        category = classify(title, body)
        tags = tags_for(title, body)
        out_name = safe_name(title or path.stem, index)
        out_path = OUT_DIR / out_name
        with out_path.open("w", encoding="utf-8", newline="\n") as f:
            f.write("---\n")
            f.write(f"title: {json.dumps(title, ensure_ascii=False)}\n")
            f.write(f"source_file: {json.dumps(path.name, ensure_ascii=False)}\n")
            if source_url:
                f.write(f"source_url: {json.dumps(source_url, ensure_ascii=False)}\n")
            f.write(f"category: {category}\n")
            f.write("tags:\n")
            for tag in tags:
                f.write(f"  - {tag}\n")
            f.write("---\n\n")
            f.write(f"# {title}\n\n")
            if source_url:
                f.write(f"> 原文地址：{source_url}\n")
            f.write("> 清洗说明：保留公众号文章正文语义，去除导出 CSS、底部按钮、SVG 图标和明显推广页脚。\n\n")
            f.write("## 正文\n\n")
            f.write(body.strip())
            f.write("\n")
        records.append(
            {
                "title": title,
                "source_file": path.name,
                "file": out_name,
                "source_url": source_url,
                "category": category,
                "tags": tags,
                "chars": len(body),
            }
        )
    return records


def should_skip_source(title: str, filename: str) -> bool:
    text = title + "\n" + filename
    skip_keywords = [
        "招募啦",
        "限时299",
        "版权课程",
        "高转化GEO实战密训",
        "玩家俱乐部限时招募",
        "培训与陪跑服务",
        "增长研习社",
    ]
    return any(k in text for k in skip_keywords)


def write_readme(records: list[dict[str, object]]) -> None:
    category_counts = Counter(str(r["category"]) for r in records)
    tag_counts = Counter(tag for r in records for tag in r["tags"])
    with (OUT_DIR / "README.md").open("w", encoding="utf-8", newline="\n") as f:
        f.write("# GEO Growth 资料库\n\n")
        f.write("本资料库由公众号 GEO 文章与少量补充 txt 清洗而来，适合作为 OpenClaw 的 GEO 营销/AI 搜索优化知识库。\n\n")
        f.write("## 概览\n\n")
        f.write(f"- 文档数：{len(records)}\n")
        f.write(f"- 正文字数约：{sum(int(r['chars']) for r in records):,}\n")
        f.write("- 主要用途：GEO 概念解释、行业诊断、AI 搜索可见性审计、内容规划、案例方案、合规提醒。\n\n")
        f.write("## 分类统计\n\n")
        for category, count in category_counts.most_common():
            f.write(f"- {category}: {count}\n")
        f.write("\n## 高频标签\n\n")
        for tag, count in tag_counts.most_common(20):
            f.write(f"- {tag}: {count}\n")
        f.write("\n## 文档索引\n\n")
        f.write("| 分类 | 标题 | 字数 | 文件 |\n")
        f.write("| --- | --- | ---: | --- |\n")
        for r in records:
            f.write(f"| {r['category']} | {r['title']} | {r['chars']} | [{r['file']}]({r['file']}) |\n")


def write_audit(records: list[dict[str, object]]) -> None:
    empty = [r for r in records if int(r["chars"]) < 500]
    no_url = [r for r in records if not r["source_url"]]
    with (OUT_DIR / "审核报告.md").open("w", encoding="utf-8", newline="\n") as f:
        f.write("# GEO Growth 清洗与逻辑审核报告\n\n")
        f.write("## 结论\n\n")
        f.write("- 资料适合做知识库，不适合把全文直接塞进 Skill。\n")
        f.write("- 文章覆盖概念、SEO/AEO/GEO 对比、流程方法、行业案例、平台差异、合规风险与服务商业模式，逻辑面较完整。\n")
        f.write("- 本次清洗不改写观点，只去除导出噪声和明显页脚。\n")
        f.write("- GEO 领域变化快，涉及平台机制、模型能力、法规合规时，回答应结合最新信息复核。\n\n")
        f.write("## 数据概览\n\n")
        f.write(f"- 源文件：{len(records)} 个\n")
        f.write(f"- 清洗后 Markdown：{len(records)} 个\n")
        f.write(f"- 正文字数约：{sum(int(r['chars']) for r in records):,}\n")
        f.write(f"- 缺少原文链接：{len(no_url)} 个\n")
        f.write(f"- 低字数可疑文件：{len(empty)} 个\n\n")
        f.write("## 使用风险\n\n")
        f.write("- 部分文章是营销观点或服务商方法论，不应当作平台官方规则。\n")
        f.write("- 对“排名”“霸屏”“快速置顶”等表述要谨慎，输出时应转为合规、可验证的内容资产建设建议。\n")
        f.write("- 回答客户方案时，应先区分 B2B、B2C、本地门店、工厂、专业服务等业务类型。\n\n")
        f.write("## 已剔除内容\n\n")
        f.write("- 纯招募、课程售卖、密训推广、限时价格、加微信/扫码咨询等内容不进入知识库。\n")
        f.write("- 作者身份、个人品牌介绍、公众号标签、底部 CTA 与服务销售页脚已尽量清理。\n\n")
        if no_url:
            f.write("## 缺少原文链接文件\n\n")
            for r in no_url[:50]:
                f.write(f"- {r['title']} -> {r['file']}\n")


def write_skill() -> None:
    (OUT_DIR / "SKILL.md").write_text(
        """---
name: geo-growth
description: 基于 GEO Growth 资料库，辅助做生成引擎优化、AI 搜索可见性诊断、行业 GEO 方案、内容资产规划、平台差异优化、合规风险审查和客户提案。
---

# GEO Growth Skill

## 适用场景

当用户要做 GEO、AI 搜索优化、生成引擎优化、DeepSeek/豆包/元宝/Kimi 等平台可见性、品牌被 AI 推荐、行业 GEO 方案、GEO 客户提案、GEO 内容规划或合规审查时，使用本 Skill。

课程/文章全文不放在 Skill 里。回答前应检索知识库 `geo-growth` 中的相关文章。

## 工作流程

1. 先判断任务类型：概念解释、业务诊断、关键词/问题库、内容规划、平台适配、行业案例、合规审查、客户提案。
2. 检索 `geo-growth` 知识库中对应分类文章，优先引用方法论、案例、百问手册和合规文章。
3. 区分资料原文观点与自己的推断。平台机制、法规、模型能力属于高变化信息，必要时要求复核最新资料。
4. 输出可执行方案，不输出“保证排名”“快速霸屏”等不可验证承诺。

## 标准诊断框架

### 1. AI 可见性现状

- 品牌名搜索表现
- 核心产品/服务词表现
- 行业问题词表现
- AI 对品牌描述是否准确
- 竞品被推荐的原因

### 2. 需求词与问题库

- 高意向问题
- 比较型问题
- 价格/方案型问题
- 避坑/合规型问题
- 本地/行业场景问题

### 3. 内容资产建设

- 官网/落地页内容
- 公众号/长文内容
- FAQ/百问内容
- 案例与证据内容
- 对比评测与选型内容

### 4. 信源与可信度

- 企业资质
- 客户案例
- 数据来源
- 第三方背书
- 可验证链接与结构化信息

### 5. 平台适配

- DeepSeek：偏专业、结构化、证据链。
- 豆包：偏场景化、消费决策、生活化表达。
- 元宝/腾讯生态：关注微信生态与内容可信度。
- Kimi/长上下文模型：适合深度长文、白皮书、行业报告。

## 输出模板

### GEO 诊断

输出：当前问题、机会词、竞品差距、内容缺口、信源缺口、优先级、30 天动作。

### 行业方案

输出：目标人群、AI 搜索场景、问题库、内容矩阵、平台适配、证据链、合规风险、执行排期。

### 客户提案

输出：业务背景、为什么要做 GEO、阶段目标、交付物、周期、效果指标、风险边界。

### 内容规划

输出：选题、目标问题、搜索意图、推荐结构、证据素材、CTA、发布渠道。

## 质量要求

- 不承诺保证排名或霸屏。
- 不用虚假第三方背书。
- 不制造误导性竞品对比。
- 优先建设真实、结构化、可验证的内容资产。
""",
        encoding="utf-8",
        newline="\n",
    )


def copy_outputs() -> None:
    for target in [LOCAL_KB, OBSIDIAN_DIR]:
        if target.exists():
            shutil.rmtree(target)
        target.mkdir(parents=True, exist_ok=True)
        for file in OUT_DIR.glob("*.md"):
            if file.name == "SKILL.md" and target == LOCAL_KB:
                continue
            shutil.copy2(file, target / file.name)
    LOCAL_SKILL.mkdir(parents=True, exist_ok=True)
    shutil.copy2(OUT_DIR / "SKILL.md", LOCAL_SKILL / "SKILL.md")


def main() -> None:
    records = build()
    write_readme(records)
    write_audit(records)
    write_skill()
    copy_outputs()
    print(f"cleaned={len(records)}")
    print(f"out={OUT_DIR}")
    print(f"local_kb={LOCAL_KB}")
    print(f"local_skill={LOCAL_SKILL}")
    print(f"obsidian={OBSIDIAN_DIR}")


if __name__ == "__main__":
    main()
