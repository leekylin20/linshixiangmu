(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.GenericGreenscreenWorkbench = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  const WORKBENCH = "generic-category-greenscreen-live-room-workbench";
  const VERSION = "v1.2-youthful-host-lock";
  const MODE = "unbranded_category_customer_acquisition";

  const CATEGORY_ORDER = ["食品", "零食", "面食", "美妆", "护肤", "生鲜"];

  const CATEGORY_SLUGS = {
    "食品": "food",
    "零食": "snack",
    "面食": "noodle",
    "美妆": "makeup",
    "护肤": "skincare",
    "生鲜": "fresh"
  };

  const CATEGORY_VARIABLES = {
    "食品": {
      category: "食品",
      genericProductNames: ["速食汤品", "即食粥", "早餐谷物", "调味食品", "方便餐包", "罐装食品", "冲泡食品", "半成品菜"],
      packagingTypes: ["bowl cup packaging", "pouch packaging", "box packaging", "jar packaging", "combo pack"],
      safeSellingPoints: ["冲泡方便", "口味丰富", "家庭常备", "即开即享", "多款可选", "组合装"],
      sceneVariants: ["bright_home_kitchen", "warm_wood_food_counter", "cream_family_dining", "light_retail_food_shelf", "breakfast_table_room", "community_group_buying_counter", "clean_ingredient_kitchen", "soft_wood_live_room", "modern_food_display_room", "cozy_home_food_corner"],
      titleExamples: ["今日鲜食专场", "方便一餐轻松备"],
      subtitleExamples: ["方便一餐轻松备", "家庭常备多款选"],
      propSuggestions: ["ceramic bowl", "wooden spoon", "small ingredient tray", "linen placemat"],
      hostStyling: ["fresh cream short-sleeve knit top with a light modern livestream apron, youthful Chinese Douyin seller styling", "pale yellow fitted knit top with a light beige modern apron, fresh and youthful live-commerce styling", "soft cream blouse with clean youthful Douyin-commercial styling"],
      forbiddenClaims: ["治疗", "药效", "根治", "100%有效"],
      leftStandee: "方便一餐"
    },
    "零食": {
      category: "零食",
      genericProductNames: ["混合坚果", "膨化零食", "果干", "饼干", "糕点", "肉脯", "糖果", "小包装零食"],
      packagingTypes: ["snack bag", "stand-up pouch", "box pack", "jar pack", "family combo pack"],
      safeSellingPoints: ["独立小包", "多种口味", "休闲分享", "香脆口感", "下午茶", "组合更划算"],
      sceneVariants: ["snack_live_counter", "cream_snack_shop", "afternoon_tea_snack_table", "young_family_snack_room", "light_convenience_shelf", "warm_wood_snack_wall", "party_snack_display", "nut_and_fruit_snack_room", "office_snack_corner", "fresh_color_snack_counter"],
      titleExamples: ["休闲零食专场", "多口味分享更尽兴"],
      subtitleExamples: ["多口味分享更尽兴", "独立小包随手享"],
      propSuggestions: ["small snack bowl", "paper snack tray", "clear jar", "casual tea cup"],
      hostStyling: ["fresh casual light knit top, youthful Chinese Douyin seller styling", "cream short-sleeve knit top, fresh youthful live-commerce styling", "bright clean casual blouse, young Chinese Douyin seller styling"],
      forbiddenClaims: ["瘦身", "治疗", "100%有效", "无敌"],
      leftStandee: "休闲分享"
    },
    "面食": {
      category: "面食",
      genericProductNames: ["速食面", "汤面", "拌面", "米粉", "河粉", "方便面食", "地方风味粉面", "半干面"],
      packagingTypes: ["bowl cup", "pouch pack", "box pack", "multi-pack", "family combo"],
      safeSellingPoints: ["热水冲泡", "汤鲜味浓", "劲道口感", "多种口味", "一餐方便", "家庭囤货"],
      sceneVariants: ["warm_noodle_kitchen", "chinese_noodle_counter", "steam_food_live_room", "wooden_noodle_shop_window", "instant_noodle_display_counter", "home_late_night_noodle_room", "light_kitchen_noodle_table", "local_flavor_noodle_corner", "clean_white_bowl_noodle_room", "cozy_family_noodle_counter"],
      titleExamples: ["热汤面食专场", "冲泡方便一餐满足"],
      subtitleExamples: ["冲泡方便一餐满足", "热汤好味快速上桌"],
      propSuggestions: ["white noodle bowl", "wood chopsticks", "small sauce dish", "gentle steam prop"],
      hostStyling: ["fresh cream short-sleeve knit top with a light modern livestream apron, youthful Chinese Douyin seller styling", "pale yellow fitted knit top with a light beige modern apron, fresh and youthful live-commerce styling", "soft cream blouse with clean youthful food live-commerce styling"],
      forbiddenClaims: ["治疗", "药效", "100%有效", "根治"],
      leftStandee: "热汤好味"
    },
    "美妆": {
      category: "美妆",
      genericProductNames: ["口红", "粉底液", "彩妆盘", "睫毛膏", "腮红", "遮瑕", "定妆粉", "彩妆套装"],
      packagingTypes: ["tube", "bottle", "compact case", "palette", "gift box", "combo set"],
      safeSellingPoints: ["日常妆感", "轻薄服帖", "多色可选", "通勤适用", "易上妆", "组合装"],
      sceneVariants: ["cream_vanity_room", "soft_pink_makeup_counter", "modern_beauty_live_room", "mirror_light_makeup_table", "clean_retail_makeup_shelf", "elegant_dressing_table", "young_fashion_makeup_room", "white_gold_makeup_counter", "soft_glam_beauty_room", "compact_makeup_studio"],
      titleExamples: ["日常彩妆专场", "清透妆感轻松打造"],
      subtitleExamples: ["清透妆感轻松打造", "多色可选通勤适用"],
      propSuggestions: ["small mirror", "makeup brush cup", "soft vanity tray", "compact display riser"],
      hostStyling: ["soft cream blouse or fitted knit top, clean youthful beauty livestream styling", "soft pink fitted knit top, youthful Chinese Douyin beauty seller styling", "clean fresh blouse, bright Douyin-commercial beauty styling"],
      forbiddenClaims: ["医美", "治疗", "永久", "100%有效"],
      leftStandee: "日常妆感"
    },
    "护肤": {
      category: "护肤",
      genericProductNames: ["洁面乳", "爽肤水", "精华液", "面霜", "面膜", "乳液", "防晒霜", "护肤套装"],
      packagingTypes: ["pump bottle", "jar", "tube", "dropper bottle", "mask box", "skincare set"],
      safeSellingPoints: ["清爽肤感", "温和护理", "水润保湿", "日常护肤", "多肤质适用", "套装搭配"],
      sceneVariants: ["clean_bathroom_skincare", "water_glow_skincare_room", "cream_skincare_vanity", "botanical_skincare_counter", "white_gold_skincare_lab", "soft_window_skincare_table", "minimal_spa_skincare_room", "fresh_moisture_display", "gentle_daily_skincare_room", "premium_skincare_counter"],
      titleExamples: ["日常护肤专场", "水润清爽温和护理"],
      subtitleExamples: ["水润清爽温和护理", "日常护肤多肤质适用"],
      propSuggestions: ["clean towel", "water glass dish", "botanical branch", "minimal skincare tray"],
      hostStyling: ["light beige blouse or soft knit top, fresh clean skincare livestream styling", "white clean fitted knit top, youthful Chinese Douyin skincare seller styling", "cream soft blouse, fresh Douyin-commercial skincare styling"],
      forbiddenClaims: ["治疗", "修复疾病", "祛斑保证", "医美治疗", "100%有效", "药效", "根治"],
      leftStandee: "水润护理"
    },
    "生鲜": {
      category: "生鲜",
      genericProductNames: ["新鲜水果", "绿色蔬菜", "冷鲜肉", "海鲜水产", "鸡蛋", "牛排", "鲜切果蔬", "生鲜组合"],
      packagingTypes: ["tray pack", "vacuum pack", "fresh box", "net bag", "insulated box", "basket display"],
      safeSellingPoints: ["新鲜到家", "产地直采", "冷链配送", "当季优选", "家庭餐桌", "多款可选"],
      sceneVariants: ["fresh_market_counter", "clean_kitchen_fresh_food", "cold_chain_display_room", "fruit_and_vegetable_table", "seafood_fresh_counter", "premium_meat_counter", "farm_fresh_live_room", "home_cooking_fresh_room", "natural_wood_fresh_market", "bright_refrigerated_counter"],
      titleExamples: ["新鲜到家专场", "家庭餐桌安心选"],
      subtitleExamples: ["家庭餐桌安心选", "当季优选新鲜到家"],
      propSuggestions: ["wood crate", "ice tray hint", "fresh basket", "clean kitchen counter prop"],
      hostStyling: ["fresh cream short-sleeve knit top with a light modern livestream apron, youthful Chinese Douyin seller styling", "pale yellow fitted knit top with a light beige modern apron, fresh and youthful live-commerce styling", "fresh light green fitted knit top, clean youthful fresh-food Douyin seller styling"],
      forbiddenClaims: ["治疗", "药效", "100%有效", "绝对新鲜"],
      leftStandee: "新鲜到家"
    }
  };

  const SCENE_MODE_STYLES = {
    auto: {
      label: "自动匹配",
      materials: "category-matched walls, shallow shelves, soft display panels",
      colorMood: "clean commercial category colors",
      lighting: "soft livestream lighting with gentle ceiling glow",
      tableMaterial: "matte cream commercial display table"
    },
    clean_kitchen: {
      label: "干净厨房",
      materials: "clean tile wall, light cabinets, simple kitchen shelves",
      colorMood: "white, light gray, natural cream, fresh daylight",
      lighting: "soft kitchen window light and clean fill light",
      tableMaterial: "white stone-look livestream table with a front panel"
    },
    warm_wood: {
      label: "暖木柜台",
      materials: "warm wood wall panels, shallow product shelves, linen texture",
      colorMood: "warm wood, cream white, muted category accent colors",
      lighting: "warm softbox-like livestream light without visible equipment",
      tableMaterial: "warm wood display table with a matte front panel"
    },
    cream_retail: {
      label: "奶油零售",
      materials: "cream retail backdrop, shallow shelves, rounded display niches",
      colorMood: "cream white, soft beige, clean pastel accent",
      lighting: "bright retail fill light, no harsh glare",
      tableMaterial: "cream lacquer foreground livestream table"
    },
    fresh_natural: {
      label: "清新自然",
      materials: "natural textured wall, small greenery, fresh ingredient hints",
      colorMood: "fresh green, warm white, natural neutral tones",
      lighting: "natural soft daylight with gentle atmosphere",
      tableMaterial: "light oak table with clean front panel"
    },
    premium_counter: {
      label: "质感柜台",
      materials: "premium matte panels, refined vertical grooves, simple display shelf",
      colorMood: "white, champagne, restrained deep accent colors",
      lighting: "controlled premium counter lighting",
      tableMaterial: "matte stone livestream table with beveled front edge"
    },
    light_store: {
      label: "明亮小店",
      materials: "bright small-store shelf wall, clean aisle hint, simple category signage",
      colorMood: "bright white, soft category color, light wood",
      lighting: "clear store lighting with soft shadow",
      tableMaterial: "light foreground livestream table"
    },
    chinese_style: {
      label: "中式轻场景",
      materials: "restrained Chinese-style wood trim, light wall, simple lattice detail",
      colorMood: "warm walnut, cream beige, soft ink gray, restrained accent",
      lighting: "soft warm oriental interior light",
      tableMaterial: "warm walnut display table"
    },
    cold_chain: {
      label: "冷链清爽",
      materials: "clean refrigerated display hint, frosted glass, insulated box cue",
      colorMood: "cool white, pale blue, fresh green accent",
      lighting: "clean cool fill light, not sci-fi",
      tableMaterial: "white insulated livestream table with realistic front thickness"
    },
    vanity_room: {
      label: "梳妆台",
      materials: "soft vanity wall, mirror glow, cream drawers, small beauty tray",
      colorMood: "cream, soft pink, white gold, clean skin-tone accent",
      lighting: "soft mirror-side beauty light without visible bulbs dominating",
      tableMaterial: "cream vanity table with front panel"
    },
    skincare_lab: {
      label: "护肤轻实验室",
      materials: "clean skincare lab wall, frosted glass, simple white shelf",
      colorMood: "white, water blue, soft silver, botanical green accent",
      lighting: "clean clinical-soft light, not medical treatment style",
      tableMaterial: "white matte lab counter"
    }
  };

  const SCENE_PATTERNS = [
    { test: /kitchen|ingredient|cooking/, description: "clean practical kitchen-context seated livestream room with ingredient-prep depth, shallow wall shelves, and a foreground livestream table", materials: "light tile, cabinet lines, small ingredient trays", props: "restrained kitchen props" },
    { test: /counter|display/, description: "front-facing seated live-selling room with structured background display shelves and a clear product focus on the foreground table", materials: "matte display panels, shallow shelves, category signage", props: "small category display props" },
    { test: /dining|family|home/, description: "warm home dining livestream corner with family-use atmosphere and a practical tabletop sales setup", materials: "soft wall, dining shelf, warm fabric texture", props: "home dining props" },
    { test: /shelf|store|shop|convenience|retail/, description: "light category-shelf seated livestream room with shallow background shelves, clean depth, and category display order", materials: "soft shelf wall, simple category panels, clean floor depth", props: "small category display accents" },
    { test: /breakfast|tea|party|office/, description: "lifestyle table livestream room built around daily sharing moments and compact product presentation", materials: "soft wall, lifestyle table surface, light shelf", props: "restrained lifestyle props" },
    { test: /group_buying|market|fresh/, description: "community group-buying style seated livestream room with practical order-ready product display on the foreground table and approachable selling atmosphere", materials: "clean market-context panels, low crates, light hard-floor context", props: "small market props" },
    { test: /noodle|steam|flavor/, description: "warm noodle food livestream room with steam-friendly depth, bowl display logic, and a front-facing product table", materials: "warm wall, noodle shop wood trim, ceramic accents", props: "noodle bowl and chopstick accents" },
    { test: /vanity|makeup|beauty|glam|dressing/, description: "beauty vanity seated livestream room with mirror-side glow, compact product shelves, and a clean foreground cosmetics table", materials: "cream vanity wall, mirror panel, small beauty tray", props: "small mirror and brush props" },
    { test: /skincare|spa|moisture|botanical|lab|window/, description: "fresh skincare livestream room with water-light atmosphere, clean shelf order, and gentle daily-care mood", materials: "frosted panel, cream shelf, botanical detail", props: "minimal skincare tray and towel prop" },
    { test: /cold|refrigerated|seafood|meat/, description: "clean cold-chain fresh-food seated livestream room with refrigerated display cues, realistic fresh-product table logic, and no sci-fi lighting", materials: "white cold-chain panel, frosted glass hint, clean display surfaces", props: "fresh basket or tray prop" },
    { test: /wood|corner|room|studio/, description: "soft wood livestream room with shallow wall depth, practical display structure, and warm commercial atmosphere", materials: "light wood, matte wall, soft display shelves", props: "small category props" }
  ];

  const COMMON_NEGATIVE = "real brand, real logo, real trademark, real price, platform UI, shopping cart button, comment area, like icon, livestream floating UI, dense benefit panel, medical claim, exaggerated claim, cure claim, absolute promise, empty room, ordinary restaurant rendering, ordinary showroom, detail-page collage, flat poster, complex supermarket, full-wall shelves, dense small text, unreadable text, garbled text, wrong category, deformed package, floating product, giant product, product pasted onto scene, host pasted onto background, host blocking product, multiple hosts, standing host, full-body host, retail store clerk, bakery shop assistant, shopkeeper pose, host standing behind store counter, standing presenter in bakery shop, full-body presenter, store counter perspective, bakery counter full of products, restaurant counter, cashier counter, retail checkout counter, supermarket counter, shop interior photography, store promotional photo, product table overloaded, dozens of products on table, products covering entire table, host far behind products, host not seated, no foreground livestream table, table not blocking lower body, lower body visible, legs visible, walking pose, fashion pose, store aisle perspective, middle-aged host, older female host, auntie-style host, mature motherly host, housewife presenter, kitchen mom style, bakery auntie, supermarket auntie, mature shop assistant, tired face, aged face, heavy mature makeup, motherly styling, heavy kitchen apron, bakery uniform, supermarket clerk uniform, household cooking clothes, plain middle-aged sweater, mature family kitchen presenter, overly mature trustworthy face, teen girl, student girl, underage host, minor-looking host, Korean idol, Korean fashion model, glossy Korean influencer, strong wide angle, strong top-down view, high camera angle, obvious overhead view, table top too visible, package lid fully visible from above, round display base becoming a top-down disc, unclear product front label, camera height above 140cm, broken perspective, table perspective conflicting with background, heavy blue fog, cyan tech light streaks, sci-fi light bands, thick white mist, mask covering host face, mask covering product area, blurry title, warm wood color washed out, lower half overcrowded, too many table props, complicated overlapping edges, difficult cutout, high retouching cost, visible cables, light stand, softbox, filming equipment";

  const CATEGORY_NEGATIVES = {
    "食品": "raw unsafe food, messy restaurant kitchen, oily tabletop, excessive steam covering text, medical food claim",
    "零食": "chaotic supermarket aisle, childish candy overload, scattered crumbs everywhere, snack packages too dense, party poster collage",
    "面食": "overhead noodle bowl view, soup splashing, steam hiding product labels, restaurant menu board, greasy kitchen",
    "美妆": "luxury real cosmetics brand, celebrity endorsement, fashion editorial portrait, beauty tutorial UI, product too tiny",
    "护肤": "dermatology treatment room, hospital clinic, medical efficacy chart, before-after comparison, cure acne claim, whitening guarantee",
    "生鲜": "wet market mess, bloody meat display, raw fish odor visual, freezer fog covering product, unsafe food handling"
  };

  const PROMOTIONAL_STICKERS = ["今日主推", "直播专享", "多款可选", "组合更划算", "现货速发", "家庭常备", "新鲜到家", "日常适用"];

  const DEFAULT_PRODUCT_PROFILE = {
    productCategory: "",
    packagingType: "",
    mainColors: "",
    flavorOrType: "",
    comboSpec: "",
    genericSellingPoints: "",
    forbiddenBrandWords: ""
  };

  function normalize(value) {
    return String(value || "").trim();
  }

  function splitWords(value) {
    return normalize(value)
      .split(/[,，、;\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function pick(list, index) {
    return list[index % list.length];
  }

  function sanitizeText(value, forbiddenWords) {
    let text = normalize(value);
    const words = splitWords(forbiddenWords);
    words.forEach((word) => {
      text = text.replace(new RegExp(escapeRegExp(word), "gi"), "");
    });
    text = text
      .replace(/logo|brand|trademark/gi, "generic category")
      .replace(/旗舰店|官方店|专卖店|明星同款|达人同款/g, "通用品类")
      .replace(/[￥¥]\s*\d+(\.\d+)?/g, "")
      .replace(/\d+(\.\d+)?\s*元/g, "")
      .replace(/折扣价|到手价|秒杀价|全网最低/g, "通用优惠氛围")
      .replace(/\s+/g, " ")
      .trim();
    return text;
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function createProductProfile(category, index, inputProfile) {
    const vars = CATEGORY_VARIABLES[category];
    const input = { ...DEFAULT_PRODUCT_PROFILE, ...(inputProfile || {}) };
    const forbiddenWords = input.forbiddenBrandWords || "";
    const safePoints = splitWords(input.genericSellingPoints).length
      ? splitWords(input.genericSellingPoints)
      : vars.safeSellingPoints;

    return {
      productCategory: sanitizeText(input.productCategory, forbiddenWords) || pick(vars.genericProductNames, index),
      packagingType: sanitizeText(input.packagingType, forbiddenWords) || pick(vars.packagingTypes, index),
      mainColors: sanitizeText(input.mainColors, forbiddenWords) || "",
      flavorOrType: sanitizeText(input.flavorOrType, forbiddenWords) || "通用口味 / 类型",
      comboSpec: sanitizeText(input.comboSpec, forbiddenWords) || "3-5 piece category display set",
      genericSellingPoints: safePoints.map((point) => sanitizeText(point, forbiddenWords)).filter(Boolean).slice(0, 6),
      forbiddenBrandWords: forbiddenWords
    };
  }

  function getSceneStyle(sceneVariant, sceneMode, category, index, productProfile) {
    const selectedMode = SCENE_MODE_STYLES[sceneMode] || SCENE_MODE_STYLES.auto;
    const pattern = SCENE_PATTERNS.find((item) => item.test.test(sceneVariant)) || SCENE_PATTERNS[SCENE_PATTERNS.length - 1];
    const vars = CATEGORY_VARIABLES[category];
    const modeSuffix = sceneMode && sceneMode !== "auto"
      ? ` The selected scene mode adds ${selectedMode.label} styling.`
      : "";
    const mainColors = productProfile.mainColors ? ` Product color accents: ${productProfile.mainColors}.` : "";

    return {
      sceneVariantDescription: `${pattern.description}.${modeSuffix}${mainColors}`,
      materials: selectedMode.materials === SCENE_MODE_STYLES.auto.materials ? pattern.materials : selectedMode.materials,
      colorMood: productProfile.mainColors || selectedMode.colorMood,
      lighting: selectedMode.lighting,
      props: `${pattern.props}, ${pick(vars.propSuggestions, index)}`,
      tableMaterial: selectedMode.tableMaterial,
      auxiliaryItem: pick(vars.propSuggestions, index + 1),
      hostOutfit: pick(vars.hostStyling, index)
    };
  }

  function titleLines(category, index) {
    const vars = CATEGORY_VARIABLES[category];
    const first = vars.titleExamples[0];
    const second = pick(vars.subtitleExamples, index);
    return [first, second];
  }

  function sellingPoints(category, productProfile) {
    const vars = CATEGORY_VARIABLES[category];
    const points = productProfile.genericSellingPoints.length ? productProfile.genericSellingPoints : vars.safeSellingPoints;
    return [pick(points, 0), pick(points, 1), pick(points, 2)];
  }

  function stickerSet(category, index) {
    const base = category === "生鲜" ? ["新鲜到家"] : category === "护肤" || category === "美妆" ? ["日常适用"] : ["今日主推"];
    return [...base, pick(PROMOTIONAL_STICKERS, index + 1), pick(PROMOTIONAL_STICKERS, index + 3)].slice(0, 3);
  }

  function buildPositivePrompt(category, sceneVariant, productProfile, styleVariables, index) {
    const [titleLine1, titleLine2] = titleLines(category, index);
    const [point1, point2, point3] = sellingPoints(category, productProfile);
    const stickers = stickerSet(category, index);
    const vars = CATEGORY_VARIABLES[category];
    const leftStandee = vars.leftStandee;

    return [
      `Vertical 9:16 Douyin live-commerce green-screen room mother image, 1080x1920px composition, unbranded generic ${category} product display scene for customer acquisition material. No real brand, no logo, no trademark, no price, no platform UI. Product packages only show generic category name, flavor/type, and short safe selling points.`,
      "Strict safe area: 1080x1920 vertical 9:16 composition. Keep 90px safe margin on the left and right. Do not place core text, product package edges, brand marks, selling points, host face, hands, or key objects near the side edges. The top 0-260px area contains only ceiling, soft light, and atmosphere, no core information. The title area sits between Y=280 and Y=460, with only two lines of text. Host explanation zone sits around Y=520-1200. Main product display sits around Y=900-1500. Bottom Y=1600-1920 contains only table front panel, subtle physical stickers, soft light, and atmosphere, no core title or key selling points.",
      "Real seated Douyin live-commerce camera view, not a standing retail-store presenter view. Camera height about 115-125cm, full-frame equivalent 45-50mm lens, slight downward angle 2-3 degrees. The viewer feels seated across the table watching the host explain products. One young adult Chinese female Douyin livestream host sits behind the foreground livestream table, shown from head to waist or upper body. She appears around 24-30 years old, definitely adult but youthful. The host's lower body is hidden by the table. The host's hands and forearms are visible, naturally gesturing toward the products. Products are placed on the foreground table in front of the host, closer to the camera than the host. No full-body standing host, no store clerk pose, no bakery shop assistant pose, no retail counter perspective. No wide-angle distortion, no high camera angle, no overhead view. Tabletop visible area is controlled around 25-35%. Product fronts face the camera; only slight top surfaces are visible.",
      `Design a ${styleVariables.sceneVariantDescription} for ${category}. Use ${styleVariables.materials}, ${styleVariables.colorMood}, ${styleVariables.lighting}, and ${styleVariables.props}. The room includes a clear two-line title area, one young adult Chinese female Douyin livestream host, left and right information zones, a reusable foreground livestream table system, compact background context, and real room depth. Category atmosphere should stay mainly in the background and side display areas. Background shelves, bakery elements, kitchen props, beauty shelves or fresh-food props are allowed only as light context. They must not turn the scene into a real store, supermarket, bakery shop, restaurant counter, or showroom. The foreground table remains the main live-commerce stage. The scene is clean, commercial, airy, realistic, and suitable for seated live selling.`,
      `Top title has only two lines: first line "${titleLine1}", second line "${titleLine2}". The text is clear, readable, short, and not covered by fog or heavy mask.`,
      `One young adult Chinese female Douyin livestream host sits behind the foreground livestream table in the middle zone, shown as a realistic seated upper-body live-selling presenter. She appears around 24-30 years old, definitely adult but youthful, bright, fresh, attractive, friendly and commercially appealing. Her face has natural makeup, healthy skin texture, clear bright eyes, a soft smile, and a neat youthful hairstyle. Her face, shoulders, chest, forearms and hands are visible, while the lower body is hidden by the table. She speaks toward the camera with natural explanation gestures. Outfit: ${styleVariables.hostOutfit}. The outfit should be youthful, clean, fresh and Douyin-commercial, not household cooking clothes. If an apron is used, it should be a light modern livestream apron over a youthful blouse or fitted knit top, not a heavy kitchen apron, not a bakery uniform, not a supermarket clerk uniform, and not motherly homewear. She must not stand, must not appear full-body, and must not look like a retail store clerk, bakery shop assistant, middle-aged housewife, auntie-style host, or mature motherly kitchen presenter. The host does not block the product and does not look like a fashion model or pasted image.`,
      `The foreground livestream table is clean, wide, stable, and must visually separate the host and the product display area. The table front panel appears in the lower frame, with real thickness, contact shadows and soft highlights. Material: ${styleVariables.tableMaterial}. The products sit on the tabletop in the foreground, with clear landing points, contact shadows and frontal labels. The host stays behind the table. The table should feel like a reusable green-screen livestream foreground layer, not a bakery store counter, not a restaurant cashier counter, and not a retail checkout counter. A central product display area is clearly reserved. Optional round or rounded display base must keep front-facing livestream perspective, with visible front edge thickness, not a top-down disc.`,
      `Display 3-5 main unbranded generic ${category} product packages as ${productProfile.productCategory} in ${productProfile.packagingType} on the foreground table, arranged as a compact live-selling product group. Do not fill the whole table with dozens of products. Do not create a bakery shop counter full of bread, snacks or goods. The product group should be clean, centered, and easy to cut out as a product layer. Packages face the camera, realistic scale, clear front labels, contact shadows and real landing points. Labels only show generic product/category name, flavor/type "${productProfile.flavorOrType}", combo spec "${productProfile.comboSpec}", and short safe selling points such as "${point1}", "${point2}", "${point3}". Add at most one auxiliary display item: ${styleVariables.auxiliaryItem}. Keep props restrained.`,
      `Left small standee says "${leftStandee}". Right side has three short selling points: "${point1}", "${point2}", "${point3}". Add 1-3 physical promotional stickers attached to the front panel of the table: ${stickers.map((item) => `"${item}"`).join(", ")}. They have slight thickness, edge shadow, and realistic contact shadow, not floating UI.`,
      "Final image: unbranded, category clear, product prominent, host natural, real perspective, reusable layer-friendly composition, clean foreground live-commerce table, clear product display zone, reusable green-screen livestream room, suitable for later split into empty background layer, table layer, product layer, title/mask layer, and suitable for later splitting into empty background layer, foreground table layer, product layer, and title/mask layer."
    ].join("\n\n");
  }

  function buildNegativePrompt(category) {
    return `${COMMON_NEGATIVE}, ${CATEGORY_NEGATIVES[category] || ""}`.replace(/\s+/g, " ").trim();
  }

  function buildPromptItem(category, sceneVariant, index, options) {
    const productProfile = createProductProfile(category, index, options.productProfile);
    const styleVariables = getSceneStyle(sceneVariant, options.sceneMode || "auto", category, index, productProfile);
    const positivePrompt = buildPositivePrompt(category, sceneVariant, productProfile, styleVariables, index);
    const negativePrompt = buildNegativePrompt(category);
    const promptId = `${CATEGORY_SLUGS[category]}-${String(index + 1).padStart(2, "0")}-${sceneVariant}`;
    const promptObject = {
      promptId,
      category,
      sceneVariant,
      productProfile,
      positivePrompt,
      negativePrompt
    };
    promptObject.audit = auditPromptForGenericCategoryGreenscreen(promptObject);
    return promptObject;
  }

  function generateBatch(options) {
    const categoryInput = options && options.category ? options.category : "all";
    const countPerCategory = Math.max(1, Math.min(10, Number(options && options.countPerCategory ? options.countPerCategory : 10)));
    const categories = categoryInput === "all" ? CATEGORY_ORDER : [categoryInput].filter((item) => CATEGORY_VARIABLES[item]);
    const items = [];

    categories.forEach((category) => {
      const scenes = CATEGORY_VARIABLES[category].sceneVariants.slice(0, countPerCategory);
      scenes.forEach((sceneVariant, index) => {
        items.push(buildPromptItem(category, sceneVariant, index, options || {}));
      });
    });

    return {
      workbench: WORKBENCH,
      version: VERSION,
      mode: MODE,
      count: items.length,
      settings: {
        category: categoryInput,
        countPerCategory,
        brandMode: "unbranded",
        outputLanguage: "English prompt with Chinese text elements allowed",
        sceneMode: (options && options.sceneMode) || "auto"
      },
      items
    };
  }

  function auditPromptForGenericCategoryGreenscreen(promptObject) {
    const positive = promptObject.positivePrompt || "";
    const positiveLower = positive.toLowerCase();
    const negative = promptObject.negativePrompt || "";
    const categoryVars = CATEGORY_VARIABLES[promptObject.category] || {};
    const productProfile = promptObject.productProfile || {};
    const forbiddenClaims = categoryVars.forbiddenClaims || [];
    const forbiddenBrandWords = splitWords(productProfile.forbiddenBrandWords);
    const forbiddenClaimsDetected = forbiddenClaims.filter((claim) => positive.includes(claim));
    const forbiddenBrandTermsDetected = forbiddenBrandWords.filter((word) => word && positiveLower.includes(word.toLowerCase()));
    const notes = [];

    const audit = {
      category: Boolean(promptObject.category && CATEGORY_VARIABLES[promptObject.category] && positive.includes(promptObject.category)),
      unbrandedPass: includesAll(positiveLower, ["unbranded generic", "no real brand", "no logo", "no trademark"]),
      noPricePass: includesAll(positiveLower, ["no price"]) && !/[￥¥]\s*\d+|\d+(\.\d+)?\s*元|折扣价|到手价|秒杀价/i.test(positive),
      noPlatformUIPass: includesAll(positiveLower, ["no platform ui"]) && includesAll(negative.toLowerCase(), ["platform ui", "shopping cart button", "comment area", "like icon"]),
      safeAreaPass: includesAll(positiveLower, ["1080x1920", "90px safe margin", "top 0-260px", "title area sits between y=280 and y=460", "host explanation zone", "main product display", "bottom y=1600-1920"]),
      cameraPerspectivePass: includesAll(positiveLower, ["camera height about 115-125cm", "45-50mm lens", "slight downward angle 2-3 degrees", "no wide-angle distortion", "no overhead view"]),
      hostPass: includesAll(positiveLower, ["young adult chinese female douyin livestream host", "natural explanation gestures", "does not block the product"]),
      tablePass: includesAll(positiveLower, ["foreground livestream table is clean", "real thickness", "front panel", "tabletop visible area is controlled around 25-35%", "central product display area"]),
      productDisplayPass: includesAll(positiveLower, ["display 3-5 main unbranded generic", "packages face the camera", "clear front labels", "real landing points"]),
      seatedLivestreamPerspectivePass: includesAll(positiveLower, ["real seated douyin live-commerce camera view", "viewer feels seated across the table", "not a standing retail-store presenter view"]),
      noStandingHostPass: includesAll(positiveLower, ["no full-body standing host", "must not appear full-body"]) && (positiveLower.includes("host must not stand") || positiveLower.includes("she must not stand")) && !positiveLower.includes("sitting or standing"),
      foregroundTablePass: includesAll(positiveLower, ["foreground livestream table", "table front panel appears in the lower frame", "main live-commerce stage"]),
      hostBehindTablePass: includesAll(positiveLower, ["host sits behind the foreground livestream table", "host's lower body is hidden by the table", "host stays behind the table"]),
      productInFrontOfHostPass: includesAll(positiveLower, ["products are placed on the foreground table in front of the host", "closer to the camera than the host", "products sit on the tabletop in the foreground"]),
      notRetailStoreCounterPass: includesAll(positiveLower, ["not a bakery store counter", "not a restaurant cashier counter", "not a retail checkout counter", "no retail counter perspective"]) && includesAll(negative.toLowerCase(), ["standing host", "retail store clerk", "bakery shop assistant", "store counter perspective", "no foreground livestream table", "table not blocking lower body"]),
      youngAdultHostPass: includesAll(positiveLower, ["young adult chinese female douyin livestream host", "appears around 24-30 years old", "definitely adult but youthful"]),
      noMiddleAgedHostPass: includesAll(positiveLower, ["not look like a retail store clerk, bakery shop assistant, middle-aged housewife", "mature motherly kitchen presenter"]) && includesAll(negative.toLowerCase(), ["middle-aged host", "older female host", "mature motherly host", "housewife presenter"]),
      noAuntieStylePass: includesAll(positiveLower, ["auntie-style host"]) && includesAll(negative.toLowerCase(), ["auntie-style host", "bakery auntie", "supermarket auntie"]),
      hostOutfitYouthfulPass: includesAll(positiveLower, ["outfit should be youthful, clean, fresh and douyin-commercial", "not household cooking clothes", "not a heavy kitchen apron", "not a bakery uniform", "not a supermarket clerk uniform"]) && includesAll(negative.toLowerCase(), ["heavy kitchen apron", "bakery uniform", "supermarket clerk uniform", "household cooking clothes"]),
      textDensityPass: includesAll(positiveLower, ["top title has only two lines", "right side has three short selling points"]) && includesAll(negative.toLowerCase(), ["dense small text", "unreadable text", "garbled text"]),
      categoryScenePass: Boolean(promptObject.sceneVariant && positive.includes(promptObject.sceneVariant) === false && positiveLower.includes("design a") && positive.includes(promptObject.category)),
      layerFriendlyPass: includesAll(positiveLower, ["reusable layer-friendly composition", "later split into empty background layer", "table layer", "product layer", "title/mask layer"]),
      forbiddenClaimsDetected,
      forbiddenBrandTermsDetected,
      notes
    };

    if (!audit.categoryScenePass) {
      notes.push("Scene description or category context is missing.");
    }
    if (forbiddenClaimsDetected.length) {
      notes.push(`Forbidden claims detected: ${forbiddenClaimsDetected.join(", ")}`);
    }
    if (forbiddenBrandTermsDetected.length) {
      notes.push(`Forbidden brand terms detected: ${forbiddenBrandTermsDetected.join(", ")}`);
    }

    const booleanChecks = Object.entries(audit)
      .filter(([key, value]) => typeof value === "boolean" && key !== "status");
    const failed = booleanChecks.filter(([, value]) => !value).map(([key]) => key);
    audit.status = failed.length === 0 && forbiddenClaimsDetected.length === 0 && forbiddenBrandTermsDetected.length === 0 ? "pass" : "fail";
    if (failed.length) {
      notes.push(`Failed checks: ${failed.join(", ")}`);
    }
    return audit;
  }

  function includesAll(text, terms) {
    return terms.every((term) => text.includes(term.toLowerCase()));
  }

  return {
    WORKBENCH,
    VERSION,
    MODE,
    CATEGORY_ORDER,
    CATEGORY_VARIABLES,
    SCENE_MODE_STYLES,
    COMMON_NEGATIVE,
    DEFAULT_PRODUCT_PROFILE,
    generateBatch,
    auditPromptForGenericCategoryGreenscreen,
    sanitizeText
  };
});
