const fs = require("fs/promises");
const path = require("path");

const SITE = "https://www.meigen.ai";
const SITEMAP_URL = `${SITE}/sitemap.xml`;
const TARGET_DIR = process.argv[2] || "E:\\obsidian\\娱乐直播图片";
const CAPTURE_DATE = process.argv[3] || new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

const OUT_JSONL = path.join(TARGET_DIR, `MeiGen人像样本索引-${CAPTURE_DATE}.jsonl`);
const OUT_MD = path.join(TARGET_DIR, `MeiGen人像提示词方法索引-${CAPTURE_DATE}.md`);
const MAIN_NOTE = path.join(TARGET_DIR, "网站资料源-MeiGen-动态Prompt图库与API采集v1.md");
const CONCURRENCY = Number(process.env.MEIGEN_CONCURRENCY || 2);
const REQUEST_DELAY_MS = Number(process.env.MEIGEN_REQUEST_DELAY_MS || 250);

const PRIORITY_QUERIES = [
  { name: "portrait", rx: /\bportrait\b|headshot|beauty portrait|fashion editorial portrait|human portrait|profile photo/i },
  { name: "selfie", rx: /\bselfie\b|front camera|phone camera|snapshot|candid/i },
  { name: "same face", rx: /same face|same person|same original|identity|preserv\w+\s+(?:the\s+)?(?:original\s+)?(?:subject|identity|face)|match(?:es|ing)?\s+(?:the\s+)?(?:subject|face)/i },
  { name: "uploaded image + preserve", rx: /uploaded image|provided image|reference image|source image|strictly preserv|do not alter|not a recreated|original subject/i },
  { name: "livestream", rx: /livestream|live stream|streamer|anchor|broadcast|vtuber|webcam|profile avatar/i },
  { name: "hairstyle", rx: /hairstyle|hair\b|bangs|braid|ponytail|bob cut|long sleek|wind[- ]?blown/i },
  { name: "doodles + person", rx: /doodle|hand[- ]?drawn|annotation|mini version|alter[- ]?ego|chibi|same person/i },
  { name: "iPhone selfie", rx: /\biPhone\b|old phone|phone selfie|mirror selfie/i },
];

const METHOD_DEFS = [
  { tag: "身份保持", rx: /identity|same face|same person|preserv|original subject|do not alter|not a recreated|match(?:es|ing)?\s+(?:the\s+)?(?:subject|face)/i },
  { tag: "参考图编辑", rx: /reference image|uploaded image|provided image|source image|input image|analy[sz]e the uploaded/i },
  { tag: "自拍/随手拍", rx: /\bselfie\b|iPhone|phone camera|snapshot|candid|mirror selfie|photo dump/i },
  { tag: "镜头/景深", rx: /\b(?:24|35|50|85|105|135)mm\b|lens|depth of field|bokeh|telephoto|wide-angle|close[- ]?up|medium shot|full[- ]?body/i },
  { tag: "光线/电影感", rx: /lighting|cinematic|rim light|fill light|window light|tungsten|Rembrandt|backlight|soft light|shadow|glow|contrast/i },
  { tag: "妆造/发型", rx: /hair|hairstyle|makeup|skin|eyes|lips|outfit|dress|fashion|couture|facial features|body line/i },
  { tag: "商业/版式", rx: /advertisement|commercial|poster|banner|magazine|editorial|typography|layout|brand|barcode|cover|campaign/i },
  { tag: "涂鸦/叠加层", rx: /doodle|hand[- ]?drawn|annotation|overlay|UI marker|tracking point|arrows|stickers|caption/i },
  { tag: "分镜/网格", rx: /grid|panel|frame|sequence|storyboard|multi[- ]?frame|3x3|4x4|collage/i },
  { tag: "视频化/运动", rx: /video|motion|camera movement|slow motion|sequence|shot list|storyboard|Veo|Seedance|cinematic clip/i },
  { tag: "负向限制", rx: /avoid|do not|don't|no |must not|strictly|not alter|not change|without changing|not a recreated/i },
  { tag: "直播形象资产", rx: /livestream|streamer|anchor|profile avatar|webcam|broadcast|social media avatar/i },
];

const RISK_DEFS = [
  { tag: "过度磨皮/模板脸", rx: /porcelain skin|polished skin|high-end beauty retouching|idol|ultra high visual appeal/i },
  { tag: "性感化表达需审查", rx: /seductive|sensual|provocative|thin strap|off[- ]?shoulder|short skirt|high[- ]?slit|sheer stockings|thigh[- ]?high|fully exposed|exposed .*skin|lingerie/i },
  { tag: "品牌/商标", rx: /Nike|Xiaomi|Leica|Tropicana|Minute Maid|brand|logo/i },
  { tag: "名人/肖像权", rx: /celebrity|Michael Jackson|Taylor Swift|Elon Musk|Trump|Biden|Obama|Kardashian/i },
  { tag: "身份一致性难度高", rx: /same person|same face|identity|preserv|reference image|mini version/i },
  { tag: "手部/肢体风险", rx: /hand|fingers|limb|arms|pose|holding/i },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function decodeHtmlEntities(value) {
  return String(value || "")
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function stripHtml(value) {
  return decodeHtmlEntities(String(value || "").replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function extractScripts(html) {
  return [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => decodeHtmlEntities(m[1].trim()))
    .filter(Boolean);
}

function parseJsonLd(html) {
  const objects = [];
  for (const script of extractScripts(html)) {
    try {
      objects.push(JSON.parse(script));
    } catch {
      const cleaned = script.replace(/\n/g, "\\n");
      try {
        objects.push(JSON.parse(cleaned));
      } catch {
        // Ignore malformed structured data; the visible page can still be parsed.
      }
    }
  }
  return objects.flatMap((obj) => Array.isArray(obj["@graph"]) ? obj["@graph"] : [obj]);
}

function numberFromCompact(value) {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  const raw = String(value).replace(/,/g, "").trim();
  const match = raw.match(/^([\d.]+)\s*([KMB])?$/i);
  if (!match) return Number(raw) || 0;
  const n = Number(match[1]);
  const unit = (match[2] || "").toUpperCase();
  if (unit === "K") return Math.round(n * 1000);
  if (unit === "M") return Math.round(n * 1000000);
  if (unit === "B") return Math.round(n * 1000000000);
  return n;
}

function classify(text) {
  const matched_queries = PRIORITY_QUERIES.filter((q) => q.rx.test(text)).map((q) => q.name);
  const method_tags = METHOD_DEFS.filter((d) => d.rx.test(text)).map((d) => d.tag);
  const risk = RISK_DEFS.filter((d) => d.rx.test(text)).map((d) => d.tag);

  const hasHuman =
    /portrait|selfie|headshot|profile photo|profile avatar|face|facial|same face|same person|person|people|woman|women|female|girl|man|men|male|boy|human|skin|eyes|lips|hair|hairstyle|makeup|outfit|dress|chibi|mini version|idol|streamer|anchor|full[- ]?body|half[- ]?body|upper body|body language|facial features|female model|male model|model wearing/i.test(text);
  const hasCompletePrompt = text.trim().length >= 180;
  const hasIdentity = method_tags.includes("身份保持") || method_tags.includes("参考图编辑");
  const hasCamera = method_tags.includes("镜头/景深") || method_tags.includes("光线/电影感");
  const hasControl = method_tags.includes("负向限制");
  const hasApplication = method_tags.some((tag) => ["商业/版式", "涂鸦/叠加层", "分镜/网格", "视频化/运动", "直播形象资产", "自拍/随手拍"].includes(tag));

  let score = 0;
  if (hasHuman) score += 3;
  if (hasCompletePrompt) score += 3;
  if (hasIdentity) score += 2;
  if (hasCamera) score += 2;
  if (hasControl) score += 2;
  if (hasApplication) score += 1;
  if (matched_queries.length > 0) score += 1;
  if (method_tags.includes("妆造/发型")) score += 1;

  return {
    matched_queries,
    method_tags,
    risk,
    relevance_score: Math.min(score, 14),
    include: hasHuman && score >= 6,
  };
}

function reusableRules(tags) {
  const rules = [];
  if (tags.includes("身份保持")) rules.push("先锁定原主体/同一张脸，再开放场景、姿势、装饰层变化。");
  if (tags.includes("参考图编辑")) rules.push("把上传图定义为身份和构图参考，明确哪些能改、哪些不能改。");
  if (tags.includes("自拍/随手拍")) rules.push("用旧手机、前置镜头、抓拍缺陷和轻微失焦抵消 AI 精修感。");
  if (tags.includes("镜头/景深")) rules.push("用焦段、景深、机位和景别控制人像比例，比泛写 realistic 更稳。");
  if (tags.includes("光线/电影感")) rules.push("写清光源方向、光质、补光和阴影落点，避免只写 cinematic。");
  if (tags.includes("妆造/发型")) rules.push("把发型、妆容、皮肤、眼神、服装拆成可替换变量。");
  if (tags.includes("商业/版式")) rules.push("商业图要同时写主体、留白、标题、品牌信息和版式层级。");
  if (tags.includes("涂鸦/叠加层")) rules.push("叠加层要回应主体动作，而不是平均贴满画面。");
  if (tags.includes("分镜/网格")) rules.push("多格图要固定身份和色调，再让每格承担不同动作/场景。");
  if (tags.includes("视频化/运动")) rules.push("视频化写法要拆成镜头运动、动作连续性和关键帧状态。");
  if (tags.includes("负向限制")) rules.push("负向限制要放在身份、手部、漂脸、过度磨皮和重绘风险上。");
  if (tags.includes("直播形象资产")) rules.push("直播资产优先锁头像识别、镜头亲近感、屏幕可读性和封面转化。");
  return rules;
}

function layerMapping(tags, matchedQueries, id) {
  return {
    layer1_person: tags.filter((tag) => ["身份保持", "妆造/发型"].includes(tag)).join(" / "),
    layer2_camera: tags.filter((tag) => ["自拍/随手拍", "镜头/景深", "光线/电影感"].includes(tag)).join(" / "),
    layer3_scene: tags.filter((tag) => ["分镜/网格"].includes(tag)).join(" / "),
    layer35_control: tags.filter((tag) => ["参考图编辑", "负向限制"].includes(tag)).join(" / "),
    layer4_application: tags.filter((tag) => ["商业/版式", "涂鸦/叠加层", "直播形象资产"].includes(tag)).join(" / "),
    layer45_video: tags.filter((tag) => ["视频化/运动"].includes(tag)).join(" / "),
    layer5_index: [`MeiGen:${id}`, ...matchedQueries].join(" / "),
  };
}

function chooseCategory(tags, queries) {
  if (tags.includes("直播形象资产")) return "直播/头像资产";
  if (tags.includes("身份保持")) return "身份保持/同脸编辑";
  if (tags.includes("自拍/随手拍")) return "自拍/生活方式";
  if (tags.includes("涂鸦/叠加层")) return "涂鸦/叠加玩法";
  if (tags.includes("商业/版式")) return "商业人像/海报";
  if (tags.includes("分镜/网格")) return "多格/分镜人像";
  if (tags.includes("视频化/运动")) return "视频化人像";
  if (queries.includes("hairstyle")) return "妆造/发型";
  return "通用人像摄影";
}

function excerpt(text, limit = 180) {
  const cleaned = stripHtml(text).replace(/\s+/g, " ");
  return cleaned.length > limit ? `${cleaned.slice(0, limit - 1)}…` : cleaned;
}

function parseRecord(url, html) {
  const id = url.match(/\/prompt\/(\d+)/)?.[1] || "";
  const graph = parseJsonLd(html);
  const creative = graph.find((obj) => obj && obj["@type"] === "CreativeWork" && obj.text);
  const image = graph.find((obj) => obj && obj["@type"] === "ImageObject");
  if (!creative) return null;

  const text = String(creative.text || "").trim();
  const stats = Array.isArray(image?.interactionStatistic) ? image.interactionStatistic : [];
  const likes = stats.find((s) => /LikeAction/i.test(String(s.interactionType || "")))?.userInteractionCount ?? 0;
  const views = stats.find((s) => /ViewAction/i.test(String(s.interactionType || "")))?.userInteractionCount ?? 0;
  const creatorUrl = creative.creator?.url || image?.creator?.url || "";
  const username = creatorUrl.match(/x\.com\/([^/?#]+)/i)?.[1] || "";
  const cls = classify(text);
  const model = creative.about?.name || html.match(/<title>([^<]+?) Prompt/i)?.[1] || "";
  const tags = cls.method_tags;
  const needsReview = cls.risk.some((tag) => ["性感化表达需审查", "品牌/商标", "名人/肖像权"].includes(tag));

  return {
    source: "MeiGen",
    url,
    image_id: id,
    author: username ? `@${username}` : "",
    author_display_name: creative.creator?.name || image?.creator?.name || "",
    author_url: creatorUrl,
    model,
    likes: numberFromCompact(likes),
    views: numberFromCompact(views),
    created_at: creative.datePublished || image?.datePublished || "",
    thumbnail_url: image?.contentUrl || image?.url || "",
    category: chooseCategory(tags, cls.matched_queries),
    use_case: tags.includes("直播形象资产") ? "直播封面/头像/主播形象" : "人像提示词样本",
    prompt_type: tags.join(" / "),
    matched_queries: cls.matched_queries,
    relevance_score: cls.relevance_score,
    heat_score: Math.round(Math.log10(Math.max(1, numberFromCompact(views))) * 20 + Math.log10(Math.max(1, numberFromCompact(likes))) * 35),
    risk: cls.risk.join(" / ") || "低",
    status: cls.relevance_score >= 8 ? (needsReview ? "candidate-review" : "candidate") : "link-only",
    reusable_rule: reusableRules(tags),
    layer_mapping: layerMapping(tags, cls.matched_queries, id),
    prompt_excerpt: excerpt(text, 240),
    prompt_text: text,
    include: cls.include,
  };
}

async function fetchText(url) {
  let lastError = null;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(20000),
        headers: {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8",
          "cache-control": "no-cache",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        },
      });
      if (res.ok) return res.text();
      lastError = new Error(`${res.status} ${res.statusText}`);
      if (![408, 425, 429, 500, 502, 503, 504].includes(res.status)) break;
    } catch (error) {
      lastError = error;
    }
    await sleep(750 * attempt * attempt);
  }
  throw lastError || new Error("fetch failed");
}

async function mapLimited(items, concurrency, mapper) {
  const out = new Array(items.length);
  let cursor = 0;
  let attempted = 0;
  async function worker(workerId) {
    while (cursor < items.length) {
      const index = cursor++;
      try {
        out[index] = await mapper(items[index], index, workerId);
      } catch (error) {
        out[index] = { error: String(error), item: items[index] };
      }
      attempted += 1;
      if (attempted % 25 === 0) console.log(`Attempted ${attempted}/${items.length}`);
      await sleep(REQUEST_DELAY_MS);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, (_, i) => worker(i)));
  return out;
}

function buildMethodSummary(records) {
  const byTag = new Map();
  for (const rec of records) {
    for (const tag of rec.prompt_type.split(" / ").filter(Boolean)) {
      const item = byTag.get(tag) || { tag, count: 0, top: [] };
      item.count += 1;
      item.top.push(rec);
      byTag.set(tag, item);
    }
  }
  return [...byTag.values()]
    .sort((a, b) => b.count - a.count)
    .map((item) => ({
      ...item,
      top: item.top.sort((a, b) => (b.relevance_score + b.heat_score / 100) - (a.relevance_score + a.heat_score / 100)).slice(0, 3),
    }));
}

function sortRecords(records) {
  const rank = (rec) => rec.status === "candidate" ? 0 : rec.status === "candidate-review" ? 1 : 2;
  return records.slice().sort((a, b) =>
    (rank(a) - rank(b)) ||
    (b.relevance_score - a.relevance_score) ||
    (b.views - a.views) ||
    (b.likes - a.likes)
  );
}

function mdTable(records, limit = 30) {
  const rows = records.slice(0, limit).map((rec, index) => {
    const rules = rec.reusable_rule.slice(0, 2).join("；");
    return [
      index + 1,
      `[${rec.image_id}](${rec.url})`,
      rec.author || rec.author_display_name,
      rec.model.replace(/\|/g, "/"),
      rec.likes,
      rec.views,
      rec.relevance_score,
      rec.status,
      rec.category,
      rec.prompt_type.replace(/\|/g, "/"),
      rec.risk.replace(/\|/g, "/"),
      rules.replace(/\|/g, "/"),
    ].join(" | ");
  });
  return [
    "| # | ID | 作者 | 模型 | likes | views | 分 | 状态 | 类别 | 方法标签 | 风险 | 可迁移规则 |",
    "|---:|---|---|---|---:|---:|---:|---|---|---|---|---|",
    ...rows.map((row) => `| ${row} |`),
  ].join("\n");
}

function buildMarkdown(records, allCount, errors) {
  const sorted = sortRecords(records);
  const methodSummary = buildMethodSummary(sorted);
  const querySummary = PRIORITY_QUERIES.map((query) => {
    const count = records.filter((rec) => rec.matched_queries.includes(query.name)).length;
    return `- \`${query.name}\`：${count}`;
  }).join("\n");

  const methodBlocks = methodSummary.map((item) => {
    const examples = item.top
      .map((rec) => `  - [${rec.image_id}](${rec.url}) ${rec.author || rec.author_display_name}：${rec.category}，${rec.views} views`)
      .join("\n");
    const rules = [...new Set(item.top.flatMap((rec) => rec.reusable_rule))].slice(0, 3)
      .map((rule) => `  - ${rule}`)
      .join("\n");
    return `### ${item.tag}（${item.count}）\n\n高热样本：\n${examples || "  - 暂无"}\n\n可沉淀规则：\n${rules || "  - 暂无"}`;
  }).join("\n\n");

  const keywordExpansion = [
    "preserve original subject / preserve identity / do not alter identity",
    "same person / same face / match the subject's face",
    "provided reference image / uploaded image / source image",
    "front camera selfie / mirror selfie / old iPhone snapshot / candid capture",
    "85mm portrait lens look / telephoto compression / shallow depth of field",
    "soft window light / rim light / gentle facial fill / cinematic backlight",
    "hand-drawn doodles / annotations / playful captions / UI markers",
    "mini version characters / alter-egos / chibi collectible figurines",
    "profile avatar / streamer / livestream cover / social media headshot",
    "multi-frame grid / 3x3 / 4x4 / storyboard / same identity across frames",
  ].map((item) => `- \`${item}\``).join("\n");

  return `---\ntitle: MeiGen 人像提示词方法索引 - ${CAPTURE_DATE}\ndate: ${CAPTURE_DATE}\ntags: [MeiGen, AI人像, Layer5, prompt-index, 样本库]\nsource_site: ${SITE}\n---\n\n# MeiGen 人像提示词方法索引 - ${CAPTURE_DATE}\n\n## 本轮抓取范围\n\n- 来源：\`${SITEMAP_URL}\` + 公开 \`/prompt/{id}\` 页面 JSON-LD。\n- 公开 prompt 页面总数：${allCount}。\n- 入选人像相关样本：${records.length}。\n- 抓取失败页面：${errors.length}。\n- 批量抓取未使用 \`/api/\`；该路径在 \`robots.txt\` 中标记为 Disallow，保留为单条人工校验用途。\n\n## 优先搜索词覆盖\n\n${querySummary}\n\n## 高价值样本索引（按相关度、热度排序）\n\n${mdTable(sorted, 40)}\n\n## 方法簇沉淀\n\n${methodBlocks}\n\n## 可补全 X 漏搜的扩展词\n\n${keywordExpansion}\n\n## 入库字段说明\n\n完整字段已经写入同目录 JSONL：\`${path.basename(OUT_JSONL)}\`。\n每行包含：\`source/url/image_id/author/model/likes/views/category/use_case/prompt_type/matched_queries/relevance_score/heat_score/risk/layer_mapping/reusable_rule/prompt_text\`。\n`;
}

function buildMainNoteSection(records, allCount, errors) {
  const sorted = sortRecords(records);
  const topTags = buildMethodSummary(records)
    .slice(0, 10)
    .map((item) => `- ${item.tag}：${item.count}`)
    .join("\n");
  const topRows = mdTable(sorted, 15);
  const now = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  return `<!-- MEIGEN-PORTRAIT-CRAWL:START -->\n\n## 九、本轮公开页面采集结果（${CAPTURE_DATE}）\n\n采集时间：${now}（Asia/Shanghai）\n\n批量抓取范围：\`${SITEMAP_URL}\` + 公开 \`/prompt/{id}\` 页面 JSON-LD。由于 \`robots.txt\` 对 \`/api/\` 标记 Disallow，本轮批量采集没有走 API；API 仍可作为单条人工校验路径。\n\n输出文件：\n\n- [[MeiGen人像提示词方法索引-${CAPTURE_DATE}.md]]\n- [[MeiGen人像样本索引-${CAPTURE_DATE}.jsonl]]\n\n抓取结果：\n\n- 公开 prompt 页面总数：${allCount}\n- 入选人像相关样本：${records.length}\n- 抓取失败页面：${errors.length}\n\n方法簇数量：\n\n${topTags}\n\n### 高价值样本 Top 15\n\n${topRows}\n\n### 本轮新增判断\n\n1. MeiGen 的人像样本可以直接承担 Layer 5 样本索引：ID、作者、热度、模型、原 prompt 和图像 URL 都能稳定落点。\n2. 人像库最值得优先沉淀的不是单个风格词，而是“身份保持 + 参考图编辑 + 镜头/光线 + 负向限制 + 应用容器”的组合写法。\n3. 对 X 漏搜补全，优先扩展 \`same person\`、\`preserve original subject\`、\`provided reference image\`、\`old iPhone selfie\`、\`hand-drawn doodles\`、\`multi-frame grid\` 这几组词。\n\n<!-- MEIGEN-PORTRAIT-CRAWL:END -->`;
}

async function upsertMainNote(section) {
  let text = "";
  try {
    text = await fs.readFile(MAIN_NOTE, "utf8");
  } catch {
    text = "";
  }

  const marker = /<!-- MEIGEN-PORTRAIT-CRAWL:START -->[\s\S]*?<!-- MEIGEN-PORTRAIT-CRAWL:END -->/;
  const next = marker.test(text)
    ? text.replace(marker, section)
    : `${text.trimEnd()}\n\n---\n\n${section}\n`;
  await fs.writeFile(MAIN_NOTE, next, "utf8");
}

async function main() {
  await fs.mkdir(TARGET_DIR, { recursive: true });
  const sitemap = await fetchText(SITEMAP_URL);
  const urls = [...sitemap.matchAll(/<loc>(https:\/\/www\.meigen\.ai\/prompt\/(\d+))<\/loc>/g)].map((m) => m[1]);
  console.log(`Found ${urls.length} prompt URLs`);

  let done = 0;
  const raw = await mapLimited(urls, CONCURRENCY, async (url) => {
    const html = await fetchText(url);
    const rec = parseRecord(url, html);
    done += 1;
    if (done % 50 === 0) console.log(`Fetched ${done}/${urls.length}`);
    return rec;
  });

  const errors = raw.filter((item) => item && item.error);
  const records = raw
    .filter((item) => item && !item.error && item.include)
    .map((item) => {
      const { include, ...rest } = item;
      return rest;
    })
    .sort((a, b) => {
      const rank = (rec) => rec.status === "candidate" ? 0 : rec.status === "candidate-review" ? 1 : 2;
      return (rank(a) - rank(b)) || (b.relevance_score - a.relevance_score) || (b.views - a.views) || (b.likes - a.likes);
    });

  if (errors.length > urls.length * 0.3) {
    throw new Error(`Too many fetch errors (${errors.length}/${urls.length}); refusing to overwrite output files.`);
  }

  await fs.writeFile(OUT_JSONL, records.map((rec) => JSON.stringify(rec)).join("\n") + "\n", "utf8");
  await fs.writeFile(OUT_MD, buildMarkdown(records, urls.length, errors), "utf8");
  await upsertMainNote(buildMainNoteSection(records, urls.length, errors));

  console.log(JSON.stringify({
    prompt_pages: urls.length,
    portrait_records: records.length,
    errors: errors.length,
    out_jsonl: OUT_JSONL,
    out_md: OUT_MD,
    main_note: MAIN_NOTE,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
