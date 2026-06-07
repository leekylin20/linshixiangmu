const fs = require("fs");
const path = require("path");
const wb = require("../workbench.js");

const outputDir = path.join(__dirname, "..", "output");
const positiveLabel = "【生图提示词】";
const negativeLabel = "【负面提示词】";

const titles = [
  ["端午粽香专场", "龙舟好礼 应景开播"],
  ["龙舟端午好礼", "粽香满桌 多味可选"],
  ["端午礼盒专场", "清爽节日 家庭分享"],
  ["粽子组合推荐", "龙舟氛围 现货速发"],
  ["端午鲜食直播", "竹叶粽香 节日好物"],
  ["龙舟节令好物", "多味粽子 礼盒组合"],
  ["端午家庭囤货", "粽子组合 全家分享"],
  ["粽香直播专场", "端午应景 多款可选"],
  ["龙舟粽礼推荐", "清新竹叶 节日氛围"],
  ["端午好味上新", "粽香满满 轻松开播"]
];

const dragonSentences = [
  "Add subtle Dragon Boat Festival dragon boat elements in the background and side display areas: a small stylized dragon boat ornament, bamboo leaves, calamus grass, zongzi wrapping leaves, and warm festival knots, all as light scenic context behind the seated host and foreground table.",
  "Use a clean Dragon Boat Festival livestream backdrop with soft bamboo-leaf green, cream white, rice-gold highlights, and a restrained red dragon boat accent; the dragon boat motif stays secondary and never becomes an outdoor river race scene.",
  "Place one small decorative dragon boat prop on a rear side shelf and a few bamboo-leaf accents around the title area, keeping the foreground table clean and focused on the unbranded zongzi gift set.",
  "Create a festive but commercial seated Douyin livestream room for Dragon Boat Festival, with layered bamboo leaves, zongzi baskets, a small dragon boat silhouette panel, and soft warm light, while the foreground livestream table remains the main product stage.",
  "The Dragon Boat Festival theme should feel fresh, clean and shoppable: bamboo leaf texture, zongzi wrapping leaves, small dragon boat ornament, calamus detail, and cream-green seasonal signage, all unbranded and without real logos.",
  "Add a light dragon boat festival wall accent behind the host, not a real outdoor event; include small zongzi and bamboo props on side shelves only, with product packages centered in front of the host on the table.",
  "Use a youthful Dragon Boat Festival visual mood with fresh green bamboo leaves, soft rice-gold light, subtle red dragon boat details, and clean holiday gift-box staging suitable for Douyin live-commerce.",
  "Keep dragon boat elements small and tasteful: one side dragon boat prop, a background wave-line pattern, bamboo leaves, and zongzi wrapping strings; no crowd, no river, no outdoor race, no folk-stage performance.",
  "Build a seated green-screen livestream mother image for a generic Dragon Boat Festival zongzi product set, with dragon boat and bamboo leaf elements only as background context, not as the main subject.",
  "Use Dragon Boat Festival elements to enrich the background: dragon boat ornament, bamboo leaf garland, calamus grass, zongzi basket, soft cream-green festival lighting; keep a modern commercial live-selling room."
];

const productProfile = {
  productCategory: "端午粽子礼盒 / 多味粽子组合",
  packagingType: "unbranded Dragon Boat Festival gift box packaging and pouch packs",
  mainColors: "fresh bamboo-leaf green, cream white, warm rice gold, subtle dragon-boat red accents",
  flavorOrType: "甜咸多口味粽子 / 端午礼盒",
  comboSpec: "3-5 piece Dragon Boat Festival zongzi product set",
  genericSellingPoints: "端午应景, 多味可选, 礼盒组合, 新鲜现发, 家庭分享, 节日好礼",
  forbiddenBrandWords: ""
};

const festivalNegative = [
  "outdoor dragon boat race",
  "real river scene",
  "crowd festival event",
  "folk performance stage",
  "oversized dragon boat",
  "dragon boat blocking host",
  "dragon boat blocking products",
  "traditional costume cosplay",
  "real brand zongzi box",
  "real festival logo",
  "real trademark gift box",
  "price tag",
  "platform UI",
  "standing festival host",
  "full-body presenter",
  "middle-aged housewife presenter",
  "auntie-style zongzi seller"
].join(", ");

function oneLine(text) {
  return String(text || "")
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function withDragonBoatTheme(prompt, index) {
  return prompt
    .replace(
      /Top title has only two lines: first line "[^"]+", second line "[^"]+"\./,
      `Top title has only two lines: first line "${titles[index][0]}", second line "${titles[index][1]}".`
    )
    .replace(
      "Category atmosphere should stay mainly in the background and side display areas.",
      `${dragonSentences[index]} Category atmosphere should stay mainly in the background and side display areas.`
    );
}

const batch = wb.generateBatch({
  category: wb.CATEGORY_ORDER[0],
  countPerCategory: 10,
  sceneMode: "auto",
  productProfile
});

const lines = batch.items.map((item, index) => {
  const positivePrompt = withDragonBoatTheme(item.positivePrompt, index);
  const negativePrompt = `${item.negativePrompt}, ${festivalNegative}`;
  return `#${index + 1} ${positiveLabel} ${oneLine(positivePrompt)} ${negativeLabel} ${oneLine(negativePrompt)}`;
});

const txtPath = path.join(outputDir, "dragon-boat-festival-seated-10-prompts.txt");
fs.writeFileSync(txtPath, lines.join("\n"), "utf8");

const audit = {
  workbench: wb.WORKBENCH,
  version: wb.VERSION,
  count: lines.length,
  status: batch.items.every((item) => item.audit.status === "pass") ? "pass" : "fail",
  theme: "Dragon Boat Festival / dragon boat elements / zongzi seated livestream prompts",
  lineFormat: {
    onePromptPerLine: true,
    prefixNumberStyle: "#1 #2 #3",
    noBlankLines: true,
    noSeparators: true,
    noRandomParametersBlock: true
  },
  items: batch.items.map((item, index) => ({
    number: index + 1,
    promptId: item.promptId,
    title: titles[index],
    audit: item.audit
  }))
};

const auditPath = path.join(outputDir, "dragon-boat-festival-seated-10-prompts.audit.json");
fs.writeFileSync(auditPath, JSON.stringify(audit, null, 2), "utf8");

console.log(JSON.stringify({
  txtPath,
  auditPath,
  count: lines.length,
  status: audit.status,
  version: wb.VERSION
}, null, 2));
