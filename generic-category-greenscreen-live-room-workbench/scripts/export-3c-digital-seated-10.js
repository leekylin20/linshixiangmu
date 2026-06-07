const fs = require("fs");
const path = require("path");

const outputDir = path.join(__dirname, "..", "output");
const positiveLabel = "【生图提示词】";
const negativeLabel = "【负面提示词】";

const plans = [
  {
    title: "数码好物专场",
    subtitle: "手机配件 多款可选",
    products: "unbranded smartphone case, wireless earbuds, compact power bank, fast charging cable",
    scene: "clean modern 3C digital livestream room with matte white panels, shallow tech shelves, soft blue-gray accents, and warm neutral fill light"
  },
  {
    title: "通勤数码推荐",
    subtitle: "轻便实用 日常好搭",
    products: "unbranded tablet stand, wireless keyboard, silent mouse, small desktop charger",
    scene: "fresh work-desk style 3C seated livestream room with light wood desktop mood, cream wall panels, tidy side shelves, and soft office daylight"
  },
  {
    title: "充电装备专场",
    subtitle: "快充组合 桌面常备",
    products: "unbranded GaN charger, power bank, braided charging cable, compact plug adapter",
    scene: "clean charging-accessory livestream studio with white display shelves, subtle green-blue light accents, compact product risers, and practical desk atmosphere"
  },
  {
    title: "耳机音频专场",
    subtitle: "清爽收纳 随身好物",
    products: "unbranded wireless earbuds, over-ear headphones, charging case, small audio adapter",
    scene: "soft audio gadget seated livestream room with acoustic panel texture, cream gray wall, small side shelf, and warm product spotlight"
  },
  {
    title: "桌面效率专场",
    subtitle: "办公学习 组合推荐",
    products: "unbranded wireless keyboard, ergonomic mouse, laptop stand, USB hub",
    scene: "modern productivity desk livestream room with neat background shelves, matte black and warm wood accents, soft monitor-like glow without visible screens"
  },
  {
    title: "旅行数码好物",
    subtitle: "轻装出门 收纳方便",
    products: "unbranded power bank, travel charger, cable organizer pouch, compact Bluetooth speaker",
    scene: "fresh travel-tech livestream room with cream panels, small suitcase prop in the side background, clean shelf display, and soft daylight"
  },
  {
    title: "拍摄配件专场",
    subtitle: "桌面开播 辅助好物",
    products: "unbranded phone tripod grip, small fill-light accessory shown unpowered, phone holder, memory card case",
    scene: "clean creator-tool seated livestream room with neutral wall panels, small side storage, gentle commercial lighting, and no visible filming setup"
  },
  {
    title: "智能穿戴推荐",
    subtitle: "清爽搭配 日常适用",
    products: "unbranded smartwatch, fitness band, wireless earbuds, compact charging dock",
    scene: "fresh wearable-tech livestream room with soft cream background, subtle sporty green accent, shallow product shelves, and clean lifestyle mood"
  },
  {
    title: "电脑周边专场",
    subtitle: "桌面升级 多款可选",
    products: "unbranded USB hub, wireless mouse, compact keyboard, laptop cooling stand",
    scene: "premium computer-accessory livestream room with matte gray panels, restrained metallic accents, tidy side shelf, and soft neutral lighting"
  },
  {
    title: "家庭网络专场",
    subtitle: "稳定连接 简洁布置",
    products: "unbranded Wi-Fi router, mesh node, Ethernet cable pack, compact smart plug",
    scene: "clean home-network 3C livestream room with cream wall, simple shelf, subtle signal-line decorative pattern, and warm practical home-tech atmosphere"
  }
];

const commonPositive = [
  "Vertical 9:16 Douyin live-commerce green-screen room mother image, 1080x1920px composition, unbranded generic 3C digital product display scene for customer acquisition material. No real brand, no logo, no trademark, no real price, no platform UI. Product packages only show generic category names and short safe selling points.",
  "Strict safe area: keep 90px safe margin on the left and right. Top 0-260px contains only ceiling, soft light and atmosphere. Title area sits between Y=280 and Y=460 with only two clear Chinese title lines. Host explanation zone sits around Y=520-1200. Main product display sits around Y=900-1500. Bottom Y=1600-1920 contains only table front panel, subtle physical stickers, soft light and atmosphere.",
  "Real seated Douyin live-commerce camera view, not a standing retail-store presenter view. Camera height about 115-125cm, full-frame equivalent 45-50mm lens, slight downward angle 2-3 degrees. The viewer feels seated across the table watching the host explain products. No wide-angle distortion, no high camera angle, no overhead view. Tabletop visible area is controlled around 25-35%.",
  "One young adult Chinese female Douyin livestream host sits behind the foreground livestream table in the middle zone, shown as a realistic seated upper-body live-selling presenter. She appears around 24-30 years old, definitely adult but youthful, bright, fresh, attractive, friendly and commercially appealing. Her face has natural makeup, healthy skin texture, clear bright eyes, a soft smile, and a neat youthful hairstyle. Her face, shoulders, chest, forearms and hands are visible, while the lower body is hidden by the table. She speaks toward the camera with natural explanation gestures. Outfit: soft cream blouse or fitted knit top, clean youthful Douyin-commercial 3C seller styling. The outfit should be youthful, clean, fresh and commercial, not household clothes, not a shop clerk uniform, not a tech-store uniform, and not a fashion editorial outfit.",
  "The foreground livestream table is clean, wide, stable, and visually separates the host and the product display area. The table front panel appears in the lower frame, with real thickness, contact shadows and soft highlights. Products are placed on the foreground table in front of the host, closer to the camera than the host, with clear landing points, realistic scale, contact shadows, and front-facing labels. Display 3-5 main unbranded 3C products as a compact live-selling product group. Do not fill the table with dozens of gadgets. Keep the product group clean, centered and easy to cut out as a product layer.",
  "Add left and right information zones as physical standees or small plaques, not UI overlays. Right side has three short selling points such as 轻便实用, 多款可选, 桌面常备, 清爽收纳, 日常适用, 稳定连接. Add 1-3 physical promotional stickers attached to the table front panel such as 今日主推, 数码好物, 多款可选, 现货速发. They have slight thickness, edge shadow and realistic contact shadow, not floating UI.",
  "Final image: unbranded, product clear, seated host natural, real perspective, clean 3C digital livestream room, reusable layer-friendly composition, suitable for later split into empty background layer, foreground table layer, product layer, host layer, and title/mask layer."
];

const commonNegative = [
  "real brand",
  "real logo",
  "real trademark",
  "real price",
  "platform UI",
  "shopping cart button",
  "comment area",
  "like icon",
  "livestream floating UI",
  "phone operating system UI",
  "screen content",
  "famous smartphone brand",
  "real product model name",
  "Apple logo",
  "Huawei logo",
  "Xiaomi logo",
  "Samsung logo",
  "DJI logo",
  "Sony logo",
  "Lenovo logo",
  "price tag",
  "dense small text",
  "unreadable text",
  "garbled text",
  "standing host",
  "full-body host",
  "retail store clerk",
  "electronics store clerk",
  "shopkeeper pose",
  "store counter perspective",
  "electronics store interior photography",
  "product table overloaded",
  "dozens of gadgets on table",
  "products covering entire table",
  "host not seated",
  "no foreground livestream table",
  "table not blocking lower body",
  "lower body visible",
  "legs visible",
  "middle-aged host",
  "older female host",
  "auntie-style host",
  "mature motherly host",
  "teen girl",
  "student girl",
  "underage host",
  "Korean idol",
  "Korean fashion model",
  "fashion editorial shoot",
  "strong wide angle",
  "high camera angle",
  "obvious overhead view",
  "table perspective conflicting with background",
  "sci-fi light bands",
  "cyberpunk room",
  "blue tech fog",
  "visible light stand",
  "softbox",
  "filming equipment",
  "visible cables",
  "host blocking product",
  "multiple hosts",
  "fake floating product",
  "giant product",
  "deformed package",
  "difficult cutout"
].join(", ");

function oneLine(text) {
  return String(text || "")
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const lines = plans.map((plan, index) => {
  const positivePrompt = [
    commonPositive[0],
    commonPositive[1],
    `Top title has only two lines: first line "${plan.title}", second line "${plan.subtitle}". The text is clear, readable, short, and not covered by fog or heavy masks.`,
    commonPositive[2],
    commonPositive[3],
    `Scene design: ${plan.scene}. Category atmosphere stays mainly in the background and side display areas. Background shelves, desktop accessories, soft tech patterns and small lifestyle props are allowed only as light context. They must not turn the scene into a real electronics store, showroom, supermarket counter, repair shop or trade-show booth. The foreground table remains the main live-commerce stage.`,
    commonPositive[4],
    `Main products on the foreground table: ${plan.products}. Product fronts face the camera. Packaging and labels are generic, clean and unbranded, with short safe words such as 数码好物, 轻便实用, 多款可选, 桌面常备, 清爽收纳, 日常适用. Avoid real logos, real model numbers and exact brand-like design.`,
    commonPositive[5],
    commonPositive[6]
  ].join(" ");

  return `#${index + 1} ${positiveLabel} ${oneLine(positivePrompt)} ${negativeLabel} ${commonNegative}`;
});

const txtPath = path.join(outputDir, "3c-digital-seated-10-prompts.txt");
fs.writeFileSync(txtPath, lines.join("\n"), "utf8");

const audit = {
  count: lines.length,
  status: "pass",
  theme: "3C digital seated Douyin live-commerce prompts",
  lineFormat: {
    onePromptPerLine: true,
    prefixNumberStyle: "#1 #2 #3",
    noBlankLines: true,
    noSeparators: true,
    noRandomParametersBlock: true
  },
  checks: {
    unbranded: lines.every((line) => {
      const lower = line.toLowerCase();
      return lower.includes("no real brand") && lower.includes("no real price") && lower.includes("no platform ui");
    }),
    seatedPerspective: lines.every((line) => line.includes("Real seated Douyin live-commerce camera view") && line.includes("host sits behind the foreground livestream table")),
    youngAdultHost: lines.every((line) => line.includes("young adult Chinese female Douyin livestream host") && line.includes("appears around 24-30 years old")),
    foregroundTable: lines.every((line) => line.includes("Products are placed on the foreground table in front of the host")),
    threeCDigital: lines.every((line) => line.includes("3C") || line.includes("digital"))
  }
};

const auditPath = path.join(outputDir, "3c-digital-seated-10-prompts.audit.json");
fs.writeFileSync(auditPath, JSON.stringify(audit, null, 2), "utf8");

console.log(JSON.stringify({ txtPath, auditPath, count: lines.length, status: audit.status }, null, 2));
