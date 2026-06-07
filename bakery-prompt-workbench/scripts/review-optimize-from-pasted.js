const fs = require("fs");
const path = require("path");
const wb = require("../workbench.js");

const inputPath = process.argv[2];
if (!inputPath) {
  throw new Error("Usage: node scripts/review-optimize-from-pasted.js <pasted-text-path>");
}

const raw = fs.readFileSync(inputPath, "utf8");
const blocks = raw.split(/^\s*---\s*$/m).filter((block) => block.includes("【随机参数】"));

function field(block, name) {
  const re = new RegExp(`${name}：([^\\n\\r]+)`);
  const match = block.match(re);
  return match ? match[1].trim() : "";
}

function splitList(value) {
  return String(value || "")
    .split(/[、,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseLoose(block, patterns) {
  for (const pattern of patterns) {
    const match = block.match(pattern);
    if (match) return match[1].trim();
  }
  return "";
}

const parsed = blocks.map((block, index) => {
  const head = block.match(/【第\s*(\d+)\s*份｜([^】]+)】/);
  const rightRaw = parseLoose(block, [
    /右侧(?:设置)?(?:\s*3 条短卖点|卖点)?[：:]([^；。\n]+)/,
    /右侧设置\s*3\s*条短卖点[：:]([^；。\n]+)/
  ]);
  const stickerRaw = parseLoose(block, [
    /底部(?:桌台前挡板)?(?:贴实体贴画|贴画|前挡板贴画|桌台前挡板贴实体贴画)?[：:]([^。；\n]+)/,
    /底部[^：:]{0,20}[：:]([^。；\n]+)/
  ]);
  const leftRaw = parseLoose(block, [
    /左侧(?:设置)?(?:小黑板|小木牌|木牌|短句|小牌)?(?:短句)?[：:]([^；。\n]+)/,
    /左侧[^：:]{0,18}[：:]([^；。\n]+)/
  ]);

  return {
    promptId: `bakery-reviewed-${String(index + 1).padStart(2, "0")}`,
    schemeName: head ? head[2].trim() : `方案 ${index + 1}`,
    spaceDirection: field(block, "空间方向"),
    productFocus: splitList(field(block, "产品重点")),
    imageVersion: field(block, "画面版本"),
    colorStyle: field(block, "色调风格"),
    spaceElements: splitList(field(block, "空间元素")),
    title: field(block, "标题"),
    subtitle: field(block, "副标题"),
    leftSign: leftRaw,
    rightPoints: splitList(rightRaw.replace(/例如.*/, "")),
    stickers: splitList(stickerRaw.replace(/例如.*/, ""))
  };
});

const result = wb.generateBatchFromParameters(parsed, {
  mode: "framework_review_optimized_from_user_txt"
});

const failed = result.items.filter((item) => item.audit.status !== "pass");
if (failed.length) {
  console.error(JSON.stringify(failed.slice(0, 3).map((item) => ({
    id: item.promptId,
    audit: item.audit
  })), null, 2));
  process.exit(1);
}

const text = result.items.map((item) => item.formattedText).join("\n\n---\n\n");
const outputDir = path.resolve(__dirname, "../output");
const outTxt = path.join(outputDir, "bakery-reviewed-optimized-30-prompts.txt");
const outJson = path.join(outputDir, "bakery-reviewed-optimized-30-prompts.audit.json");

fs.writeFileSync(outTxt, text, "utf8");
fs.writeFileSync(outJson, JSON.stringify({
  source: inputPath,
  count: result.count,
  failed: failed.length,
  items: result.items.map((item) => ({
    promptId: item.promptId,
    schemeName: item.schemeName,
    audit: item.audit
  }))
}, null, 2), "utf8");

console.log(JSON.stringify({
  parsed: parsed.length,
  count: result.count,
  failed: failed.length,
  outTxt,
  outJson
}, null, 2));
