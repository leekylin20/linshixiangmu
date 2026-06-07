const fs = require("fs/promises");
const path = require("path");

const REPO = "https://github.com/EvoLinkAI/awesome-gpt-image-2-API-and-Prompts";
const RAW = "https://raw.githubusercontent.com/EvoLinkAI/awesome-gpt-image-2-API-and-Prompts/main";
const EVOLINK_PAGE = "https://evolink.ai/gpt-image-2-prompts?utm_source=github&utm_medium=picture&utm_campaign=awesome-gpt-image-2-API-and-Prompts";
const TARGET_DIR = process.argv[2] || "E:\\obsidian\\娱乐直播图片";
const CAPTURE_DATE = process.argv[3] || new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

const OUT_MD = path.join(TARGET_DIR, `GitHub资料源-EvoLinkAI-awesome-gpt-image-2-人像提示词写法-${CAPTURE_DATE}.md`);
const OUT_JSONL = path.join(TARGET_DIR, `EvoLinkAI人像提示词写法索引-${CAPTURE_DATE}.jsonl`);
const OLD_NOTE = path.join(TARGET_DIR, "GitHub资料源-awesome-gpt-image-2-人像提示词提炼v1.md");

const FILES = [
  { category: "portrait", path: "cases/portrait.md", includeAll: true },
  { category: "character", path: "cases/character.md", includeAll: false },
  { category: "ui", path: "cases/ui.md", includeAll: false },
  { category: "ad-creative", path: "cases/ad-creative.md", includeAll: false },
];

const METHOD_DEFS = [
  { tag: "胶片/手机抓拍", rx: /35mm|film|grain|iPhone|phone|selfie|snapshot|flash|on-camera flash|POV|candid|handheld/i },
  { tag: "镜头/构图", rx: /35mm|50mm|85mm|wide[- ]?angle|low[- ]?angle|medium shot|close[- ]?up|full[- ]?body|composition|symmetrical|POV|fisheye/i },
  { tag: "光线/色彩", rx: /lighting|light|shadow|neon|fluorescent|sunset|golden hour|rim light|backlight|soft|harsh|gradient|color grading/i },
  { tag: "皮肤/五官细节", rx: /skin|pores|freckles|catchlights|eyes|eyelids|nose|lips|jawline|cheeks|makeup|hair strands|texture/i },
  { tag: "发型/妆造", rx: /hair|ponytail|bun|bangs|makeup|outfit|shirt|dress|skirt|yukata|fashion|fabric|wrinkles/i },
  { tag: "动作/姿势", rx: /pose|gesture|standing|sitting|leaning|holding|hand|leg|body|expression|gaze|smile|walking|grid|action/i },
  { tag: "同一身份/角色一致", rx: /consistent identity|same character|same person|reference|character sheet|multiple poses|grid|facial anatomy|all panels/i },
  { tag: "社媒/种草应用", rx: /social media|poster|editorial|magazine|lifestyle|commercial|ad|brand|product|cover|thumbnail|key visual/i },
  { tag: "直播/UI资产", rx: /\blivestream\b|\blive stream\b|\bstreaming\b|\bstreamer\b|\bchat\b|\bcomment\b|\bUI\b|\binterface\b|\bscreenshot\b|\bvertical phone\b|\bsocial feed\b/i },
  { tag: "负面限制", rx: /no plastic skin|no watermark|no text|no airbrushing|no distortion|avoid|without|no /i },
  { tag: "性感化风险", rx: /sexy|seductive|cleavage|mini skirt|tiny|barefoot|arched|temptation|hips|butt|revealing/i },
];

const RULES = {
  "胶片/手机抓拍": "真实抓拍不要只写 realistic；要加入设备、胶片颗粒、直闪、轻微色偏、压缩感或不完美构图。",
  "镜头/构图": "先定焦段、景别、机位和主体距离，再写人物外观；镜头语言会直接决定脸部比例和现场感。",
  "光线/色彩": "光线要写来源、质地和混光关系，例如室内冷光、霓虹、日落逆光、直闪高光。",
  "皮肤/五官细节": "人像写法要拆到眼睛、鼻梁、唇、肤质、毛孔、高光、发丝，避免只写漂亮或真实。",
  "发型/妆造": "发型、妆容、服装材质要和场景绑定；衣料褶皱、发丝凌乱、汗/水珠能增强真实度。",
  "动作/姿势": "动作要写身体重心、手的位置、视线方向和正在发生的行为，减少静态摆拍感。",
  "同一身份/角色一致": "多格图/角色表先锁定同一身份，再让每格变化表情、动作、角度或服装。",
  "社媒/种草应用": "种草图应把产品放进生活行为里，保留真实场景和人物状态，不做硬广海报。",
  "直播/UI资产": "直播资产要把主播、商品位、弹幕/评论、手机竖屏截图和互动状态一起定义。",
  "负面限制": "负面限制应放在变脸、塑料皮、过度锐化、商标错误、手部畸形、水印文字上。",
  "性感化风险": "带性感化词的案例只做结构参考；迁移到直播/种草时改成清爽、健康、成年、非性化表达。",
};

function stripMd(value) {
  return String(value || "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function excerpt(value, limit = 160) {
  const clean = stripMd(value);
  return clean.length > limit ? `${clean.slice(0, limit - 1)}…` : clean;
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      "accept": "text/plain,text/markdown,*/*",
      "user-agent": "Codex local research",
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`);
  return res.text();
}

function parseCases(markdown, fileInfo) {
  const caseRegex = /^### Case\s+(\d+):\s+\[([^\]]+)\]\(([^)]+)\)\s+\(by\s+\[(@[^\]]+)\]\(([^)]+)\)\)/gm;
  const starts = [...markdown.matchAll(caseRegex)].map((m) => ({
    index: m.index,
    case_no: Number(m[1]),
    title: m[2],
    source_url: m[3],
    author: m[4],
    author_url: m[5],
  }));
  const records = [];
  for (let i = 0; i < starts.length; i += 1) {
    const current = starts[i];
    const nextIndex = starts[i + 1]?.index ?? markdown.length;
    const block = markdown.slice(current.index, nextIndex);
    const prompt = block.match(/\*\*Prompt:\*\*\s*\n\s*```\s*\n([\s\S]*?)\n```/)?.[1]?.trim() || "";
    const image = block.match(/<img src="([^"]+)"/)?.[1] || "";
    records.push({ ...current, repo_file: fileInfo.path, source_category: fileInfo.category, prompt, image });
  }
  return records;
}

function classify(record) {
  const text = `${record.title}\n${record.prompt}`;
  const tags = METHOD_DEFS.filter((item) => item.rx.test(text)).map((item) => item.tag);
  const isPortraitLike = /portrait|selfie|girl|boy|woman|man|female|male|character|face|skin|hair|person|model|stream|anchor|profile|expression|gaze|makeup|outfit|pose/i.test(text);
  const isUsefulSideCase = /livestream|live stream|social media|phone screenshot|character sheet|consistent identity|grid|expression|FACS|facial anatomy|product.*model|model.*product/i.test(text);
  const include = record.source_category === "portrait" ? isPortraitLike : isUsefulSideCase;
  const risk = tags.includes("性感化风险") ? "candidate-review" : "candidate";
  const score = Math.min(14,
    (isPortraitLike ? 3 : 0) +
    (record.prompt.length > 180 ? 3 : 0) +
    (tags.includes("镜头/构图") ? 2 : 0) +
    (tags.includes("光线/色彩") ? 2 : 0) +
    (tags.includes("皮肤/五官细节") ? 2 : 0) +
    (tags.includes("同一身份/角色一致") ? 2 : 0) +
    (tags.includes("社媒/种草应用") || tags.includes("直播/UI资产") ? 1 : 0) +
    (tags.includes("负面限制") ? 1 : 0)
  );
  return {
    tags,
    include,
    score,
    status: include ? risk : "rejected",
    reusable_rules: tags.map((tag) => RULES[tag]).filter(Boolean),
  };
}

function derivePattern(record, tags) {
  const parts = [];
  if (tags.includes("胶片/手机抓拍")) parts.push("设备/胶片质感");
  if (tags.includes("镜头/构图")) parts.push("焦段/景别/机位");
  if (tags.includes("光线/色彩")) parts.push("光源/混光/色调");
  if (tags.includes("皮肤/五官细节")) parts.push("五官/皮肤/发丝");
  if (tags.includes("发型/妆造")) parts.push("发型/妆容/服装材质");
  if (tags.includes("动作/姿势")) parts.push("动作/视线/手势");
  if (tags.includes("同一身份/角色一致")) parts.push("身份锁定/多格一致");
  if (tags.includes("社媒/种草应用")) parts.push("生活行为/产品软植入");
  if (tags.includes("直播/UI资产")) parts.push("主播/商品位/评论层");
  if (tags.includes("负面限制")) parts.push("负面限制");
  return parts.join(" + ") || "主题 + 场景 + 风格";
}

function useCase(record, tags) {
  if (tags.includes("直播/UI资产")) return "直播封面/直播间 UI";
  if (tags.includes("同一身份/角色一致")) return "角色一致性/动作表/表情表";
  if (tags.includes("社媒/种草应用")) return "社媒种草/商业人像";
  if (tags.includes("胶片/手机抓拍")) return "生活方式抓拍/自拍";
  return "人像摄影/写真";
}

function buildJsonRecord(record) {
  const cls = classify(record);
  return {
    source: "EvoLinkAI awesome-gpt-image-2-API-and-Prompts",
    repo: REPO,
    evolink_page: EVOLINK_PAGE,
    case_no: record.case_no,
    title: record.title,
    source_url: record.source_url,
    author: record.author,
    author_url: record.author_url,
    repo_file: record.repo_file,
    image_url: record.image,
    source_category: record.source_category,
    method_tags: cls.tags,
    score: cls.score,
    status: cls.status,
    use_case: useCase(record, cls.tags),
    pattern: derivePattern(record, cls.tags),
    reusable_rules: [...new Set(cls.reusable_rules)],
    prompt_excerpt: excerpt(record.prompt, 180),
    include: cls.include,
  };
}

function summarizeBy(records, keyFn) {
  const map = new Map();
  for (const rec of records) {
    const keys = keyFn(rec);
    for (const key of Array.isArray(keys) ? keys : [keys]) {
      if (!key) continue;
      const item = map.get(key) || { key, count: 0, top: [] };
      item.count += 1;
      item.top.push(rec);
      map.set(key, item);
    }
  }
  return [...map.values()]
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key, "zh-Hans-CN"))
    .map((item) => ({
      ...item,
      top: item.top.sort((a, b) => b.score - a.score || a.case_no - b.case_no).slice(0, 5),
    }));
}

function mdTable(records, limit = 50) {
  const rows = records.slice(0, limit).map((rec, i) => `| ${i + 1} | [${rec.case_no} ${rec.title}](${rec.source_url}) | ${rec.author} | ${rec.source_category} | ${rec.score} | ${rec.status} | ${rec.use_case} | ${rec.method_tags.join(" / ")} | ${rec.pattern} |`);
  return [
    "| # | 案例 | 作者 | 来源类目 | 分 | 状态 | 用途 | 方法标签 | 写法骨架 |",
    "|---:|---|---|---|---:|---|---|---|---|",
    ...rows,
  ].join("\n");
}

function buildMarkdown(records, allRecords) {
  const sorted = records.slice().sort((a, b) => {
    const rank = (r) => r.status === "candidate" ? 0 : 1;
    return rank(a) - rank(b) || b.score - a.score || a.case_no - b.case_no;
  });
  const tagSummary = summarizeBy(sorted, (rec) => rec.method_tags);
  const useSummary = summarizeBy(sorted, (rec) => rec.use_case);
  const ruleLines = tagSummary.map((item) => {
    const rule = RULES[item.key] || "";
    const examples = item.top.map((rec) => `[${rec.case_no}](${rec.source_url})`).join("、");
    return `### ${item.key}（${item.count}）\n\n${rule}\n\n代表案例：${examples}`;
  }).join("\n\n");

  const useRows = useSummary.map((item) => `| ${item.key} | ${item.count} | ${item.top.map((rec) => `[${rec.case_no} ${rec.title}](${rec.source_url})`).join("<br>")} |`).join("\n");

  return `---\ntitle: EvoLinkAI awesome-gpt-image-2 人像提示词写法抓取 - ${CAPTURE_DATE}\ndate: ${CAPTURE_DATE}\ntags: [EvoLinkAI, GPT-Image-2, AI人像, Prompt样本, Layer5]\nsource_repo: ${REPO}\nsource_page: ${EVOLINK_PAGE}\n---\n\n# EvoLinkAI awesome-gpt-image-2 人像提示词写法抓取 - ${CAPTURE_DATE}\n\n## 采集范围\n\n- GitHub 仓库：<${REPO}>\n- Evolink 浏览入口：<${EVOLINK_PAGE}>\n- 主要文件：\`cases/portrait.md\`、\`cases/character.md\`、\`cases/ui.md\`、\`cases/ad-creative.md\`\n- 解析案例总数：${allRecords.length}\n- 入选人像/角色/直播相关案例：${sorted.length}\n- 本地 JSONL 索引：\`EvoLinkAI人像提示词写法索引-${CAPTURE_DATE}.jsonl\`\n\n说明：本笔记提炼“写法结构”和“可迁移规则”，不全文搬运原 prompt。完整原文请从案例链接或 GitHub 原文件回看。\n\n## 高价值案例索引\n\n${mdTable(sorted, 60)}\n\n## 用途分布\n\n| 用途 | 数量 | 代表案例 |\n|---|---:|---|\n${useRows}\n\n## 方法簇\n\n${ruleLines}\n\n## 可并入娱乐直播图片库的写法母版\n\n### 1. 真实抓拍/种草人像\n\n\`\`\`text\n成人主体 + 场景生活行为 + 产品/道具自然出现 + 设备质感 + 不完美抓拍 + 清晰负面限制\n\n推荐顺序：\n人物气质 -> 正在做什么 -> 道具如何被使用 -> 海边/街头/室内真实环境 -> iPhone/35mm/直闪/胶片颗粒 -> 光线 -> 皮肤/发丝/服装真实细节 -> 不要硬广/不要棚拍/不要塑料皮/不要商标错误。\n\`\`\`\n\n### 2. 直播主播/封面人像\n\n\`\`\`text\n成年主播身份 + 同一脸部识别点 + 镜头亲近感 + 直播界面/弹幕/商品位 + 屏幕可读性 + 封面留白\n\n重点不是把人物做成海报，而是保留“正在直播”的现场状态：视线、手势、商品位、评论层、手机竖屏截图或桌面屏幕截图。\n\`\`\`\n\n### 3. 多格动作/表情参考\n\n\`\`\`text\n同一角色一致性 + 统一光线/背景 + 多格网格 + 每格一个动作/表情 + 编号/标签 + 姿势差异\n\n适合做主播动作库、表情库、短视频分镜库。先锁身份，再枚举变化。\n\`\`\`\n\n### 4. 写实摄影人像\n\n\`\`\`text\n摄影类型 + 焦段/机位/景别 + 光源关系 + 人物五官/肤质/发型/服装 + 场景材质 + 胶片/色调锚点 + 负面限制\n\n仓库里最稳定的摄影写法是“镜头语言在前，人物细节居中，负面限制收尾”。\n\`\`\`\n\n## 风险过滤\n\n- 含明显性感化、未成年人、人身识别或名人肖像倾向的案例只保留结构，不直接迁移措辞。\n- 品牌和商品相关案例迁移到种草时，需要明确“商标准确、不过度抢戏、生活化使用”。\n- 人像 prompt 优先保留成人、自然、生活方式、真实质感，避免油腻写真化。\n`;
}

async function upsertOldNote(section) {
  let text = "";
  try {
    text = await fs.readFile(OLD_NOTE, "utf8");
  } catch {
    return;
  }
  const marker = /<!-- EVOLINKAI-AWESOME-GPT-IMAGE-2:START -->[\s\S]*?<!-- EVOLINKAI-AWESOME-GPT-IMAGE-2:END -->/;
  const next = marker.test(text)
    ? text.replace(marker, section)
    : `${text.trimEnd()}\n\n---\n\n${section}\n`;
  await fs.writeFile(OLD_NOTE, next, "utf8");
}

async function main() {
  await fs.mkdir(TARGET_DIR, { recursive: true });
  const all = [];
  for (const file of FILES) {
    const markdown = await fetchText(`${RAW}/${file.path}`);
    all.push(...parseCases(markdown, file));
  }
  const indexed = all.map(buildJsonRecord);
  const included = indexed.filter((rec) => rec.include);
  await fs.writeFile(OUT_JSONL, included.map((rec) => {
    const { include, ...rest } = rec;
    return JSON.stringify(rest);
  }).join("\n") + "\n", "utf8");
  await fs.writeFile(OUT_MD, buildMarkdown(included, all), "utf8");

  const section = `<!-- EVOLINKAI-AWESOME-GPT-IMAGE-2:START -->\n\n## EvoLinkAI 新仓库增量采集（${CAPTURE_DATE}）\n\n新来源：\n\n- <${REPO}>\n- <${EVOLINK_PAGE}>\n\n输出文件：\n\n- [[GitHub资料源-EvoLinkAI-awesome-gpt-image-2-人像提示词写法-${CAPTURE_DATE}.md]]\n- [[EvoLinkAI人像提示词写法索引-${CAPTURE_DATE}.jsonl]]\n\n采集结果：\n\n- 解析案例总数：${all.length}\n- 入选人像/角色/直播相关案例：${included.length}\n\n核心沉淀：EvoLinkAI 版本的人像案例更偏“可发布效果图 + 完整摄影参数 + 社媒应用”，适合并入 Layer 5 样本索引层。\n\n<!-- EVOLINKAI-AWESOME-GPT-IMAGE-2:END -->`;
  await upsertOldNote(section);

  console.log(JSON.stringify({
    parsed_cases: all.length,
    included_cases: included.length,
    out_md: OUT_MD,
    out_jsonl: OUT_JSONL,
    old_note: OLD_NOTE,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
