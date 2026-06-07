(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ThreeCDigitalSeatedWorkbench = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  const WORKBENCH = "3c-digital-seated-live-room-workbench";
  const PROJECT_NAME = "3C 数码坐播直播间提示词工作台｜独立专用版";
  const VERSION = "3c_digital_seated_live_room_random_style_pool_v04";

  const PRODUCT_TYPES = [
    {
      id: "power_bank",
      label: "充电宝",
      products: "one compact power bank held by the host, one central power bank on the table, one flat charging cable, one clean unbranded package box",
      productWords: "充电宝, 数显电量, 大容量, 出行可带"
    },
    {
      id: "fast_charger",
      label: "快充头",
      products: "one fast charger plug held by the host, one central charger set on the table, one braided cable, one unbranded package box",
      productWords: "快充头, 120W快充, 多设备兼容, 安全保护"
    },
    {
      id: "cable",
      label: "数据线",
      products: "one braided data cable held lightly by the host, one coiled cable display, one compact charger, one unbranded package box",
      productWords: "数据线, 耐用线材, 快速传输, 桌面常备"
    },
    {
      id: "wireless_charger",
      label: "无线充",
      products: "one slim wireless charging pad held by the host, one central wireless charger on the table, one phone stand prop without brand UI, one package box",
      productWords: "无线充, 桌面常备, 多设备兼容, 清爽收纳"
    },
    {
      id: "earbuds",
      label: "蓝牙耳机",
      products: "one wireless earbuds case held by the host, one open earbuds case on the table, one compact accessory pouch, one unbranded package box",
      productWords: "蓝牙耳机, 轻巧便携, 通勤好搭, 稳定连接"
    },
    {
      id: "storage",
      label: "数码收纳",
      products: "one digital organizer pouch held by the host, one open cable organizer on the table, one compact charger, one unbranded storage package box",
      productWords: "数码收纳, 出行整理, 小巧便携, 轻巧收纳"
    },
    {
      id: "phone_stand",
      label: "手机支架",
      products: "one folding phone stand held by the host, one central phone stand on the table, one cable, one package box, no phone UI",
      productWords: "手机支架, 桌面效率, 角度可调, 日常适用"
    },
    {
      id: "multi_port_charger",
      label: "多口快充设备",
      products: "one multi-port charging station on the table, one compact plug held by the host, two cables arranged neatly, one unbranded package box",
      productWords: "多口快充, 多设备同充, 桌面整洁, 稳定输出"
    },
    {
      id: "travel_kit",
      label: "出行数码套装",
      products: "one travel tech kit pouch held by the host, one power bank, one charger, one charging cable, one unbranded travel set package box",
      productWords: "出行数码, 旅行常备, 轻巧便携, 多款可选"
    },
    {
      id: "small_digital_appliance",
      label: "小家电数码周边",
      products: "one compact desktop digital accessory held by the host, one small smart desktop gadget on the table, one charging cable, one clean package box",
      productWords: "小家电数码, 桌面好物, 简洁实用, 日常常备"
    }
  ];

  const STYLE_VARIANTS = [
    {
      id: "tech_clean",
      label: "科技风",
      description: "clean technology-style digital livestream room with graphite gray walls, silver gray panels, cold blue luminous edge lines, white tech typography and shallow digital display niches"
    },
    {
      id: "light_esports",
      label: "电竞科技风",
      description: "restrained light esports technology livestream room, dark gray and cool blue accents, linear lighting, not an internet cafe, not cyberpunk, still professional and commercial"
    },
    {
      id: "minimal_premium",
      label: "极简高端数码风",
      description: "minimal premium digital room with matte graphite panels, silver trim, clean product shelves, calm lighting and high-end retail order"
    },
    {
      id: "digital_retail",
      label: "数码零售展示风",
      description: "modern digital retail livestream room with structured side display shelves, clean product wall, subtle battery icon graphics and clear live-selling atmosphere"
    },
    {
      id: "light_lab",
      label: "轻实验室科技风",
      description: "light lab-style digital livestream room with cool gray panels, soft white light, clean technical display board and small circuit-line background details"
    },
    {
      id: "urban_business",
      label: "都市轻商务数码风",
      description: "urban light-business digital room with silver gray, charcoal, restrained blue light strips, tidy desktop mood and professional live-commerce feel"
    }
  ];

  const TITLES = ["快充数码专场", "出行充电专场", "便携数码专场", "实用配件专场", "移动供电专场", "桌面效率专场", "数码好物专场", "通勤数码推荐", "智能配件专场", "小家电数码专场", "桌搭配件专场", "多口充电专场", "通勤装备专场", "智能穿戴专场", "数码收纳专场", "手机支架专场", "无线充电专场", "耳机音频专场", "户外电源专场", "轻办公数码专场"];
  const SUBTITLES = ["大容量随手即走 直播间推荐", "出门更省心 多场景适用", "轻巧便携 日常通勤好搭", "多设备兼容 充电更方便", "桌面更清爽 日常更顺手", "稳定续航 出行常备", "小巧好收纳 多款可选", "实用不花哨 直播间推荐", "多设备同充 省心高效", "数码周边 今日主推", "桌面升级 清爽高效", "多设备同充 稳定省心", "日常通勤 轻巧随行", "智能搭配 简洁实用", "线材收纳 出行更整洁", "稳固支撑 桌面好搭", "轻放即充 使用方便", "通勤听音 清爽随身", "户外应急 持久供电", "办公学习 实用推荐"];
  const SELLING_POINTS = ["120W快充", "小巧便携", "数显电量", "多设备兼容", "安全保护", "出行可带", "大容量", "稳定续航", "桌面常备", "轻巧收纳"];
  const OUTFITS = ["light gray fitted knit top, clean digital livestream seller styling", "cool gray simple top with neat collar, youthful 3C Douyin seller styling", "white-gray minimal blouse, fresh and professional digital host styling", "light blue-gray fitted top, clean modern tech livestream styling"];

  const STYLE_ROUTES = [
    {
      id: "cold_blue_tech_cabin",
      label: "冷蓝科技舱风",
      description: "cold blue tech cabin style with deep blue, cool gray, black and cold white light strips, a classic digital livestream cabin feeling, luminous borders, battery icons and circuit-line graphics",
      suitable: "power banks, fast chargers and hardcore digital accessories"
    },
    {
      id: "silver_white_minimal",
      label: "银白极简科技风",
      description: "silver-white minimal technology style with silver white, light gray, white light strips, matte metal, premium clean background and restrained light technology mood",
      suitable: "phone stands, earbuds, small accessories and desktop digital products"
    },
    {
      id: "black_gold_business",
      label: "黑金商务科技风",
      description: "black-gold business technology style with black, dark gray, champagne gold, metallic frames, stable premium business mood and high-ticket digital-product feeling",
      suitable: "business digital products, office digital products, portable drives and docking stations"
    },
    {
      id: "white_blue_office",
      label: "白蓝办公效率风",
      description: "white-blue office efficiency style with white, light gray and pale blue palette, fresh office productivity atmosphere and clear desk-efficiency structure",
      suitable: "desktop stands, docking stations, office accessories and chargers"
    },
    {
      id: "black_purple_gaming",
      label: "黑紫电竞风",
      description: "black-purple gaming style with black, blue-violet, restrained RGB light feeling, dark energetic background and youthful esports technology atmosphere",
      suitable: "keyboard, mouse, gaming headset, controller, cooling accessory and esports peripherals"
    },
    {
      id: "orange_black_utility",
      label: "橙黑机能风",
      description: "orange-black utility technology style with black, dark gray and orange accents, hardcore tool feeling, travel-equipment mood and functional outdoor digital energy",
      suitable: "outdoor power supply, car accessories and mobile charging equipment"
    },
    {
      id: "green_smart_home",
      label: "青绿智能生活风",
      description: "green smart-home technology style with white gray, light wood and cyan-green accents, friendly smart-living mood and approachable life-tech atmosphere",
      suitable: "smart small appliances, cameras, plugs, speakers and smart home accessories"
    },
    {
      id: "deep_space_geek",
      label: "深空银灰极客风",
      description: "deep-space silver-gray geek style with space black, silver gray, cold white light, parameter wall, rational review-like atmosphere and hardcore tech feeling",
      suitable: "high-parameter charging products, expansion devices and portable drives"
    },
    {
      id: "cream_light_digital",
      label: "奶油白轻数码风",
      description: "cream-light digital style with cream white, light beige, soft blue and rounded structures, gentle lifestyle-friendly light digital atmosphere",
      suitable: "female-oriented digital products, small desktop devices and small accessories"
    },
    {
      id: "bright_retail_digital",
      label: "明亮新零售数码店风",
      description: "bright new-retail digital store style with light gray-white palette, cold blue light strips, bright shelves and digital collection-store atmosphere without becoming a generic retail counter",
      suitable: "multi-category digital goods, in-stock shipping material and digital accessory bundles"
    }
  ];

  const STYLE_RANDOM_MODES = [
    { id: "fixed", label: "关闭随机（固定）" },
    { id: "route_random", label: "母版随机" },
    { id: "route_local_random", label: "母版 + 局部随机" },
    { id: "high_diversity", label: "高多样化随机" }
  ];

  const BACKGROUND_STRUCTURES = [
    "curved tech wall",
    "straight light-strip wall",
    "layered display shelves",
    "parameter screen area",
    "battery graphic screen",
    "circuit-texture back panel",
    "modular grid wall",
    "three-dimensional luminous frame",
    "local glowing wall niche",
    "dark glass display zone"
  ];

  const TABLE_MATERIALS = [
    "dark gray frosted metal livestream table",
    "graphite gray matte livestream table",
    "cool silver metal livestream table",
    "deep blue-gray technology table",
    "light gray premium frosted table"
  ];

  const INFO_CARD_STYLES = [
    { id: "deep_blue_solid", label: "深蓝实体牌", text: "deep blue-gray solid parameter placards with white icons and bright text" },
    { id: "black_silver_hardboard", label: "黑银硬板牌", text: "black-silver hardboard parameter placards with metallic edges and clear text" },
    { id: "modular_parameter", label: "模块参数牌", text: "modular opaque parameter cards with separated function blocks and light-blue outline" },
    { id: "vertical_function", label: "竖向功能牌", text: "vertical opaque function placards with thick edges and clear icon-text hierarchy" },
    { id: "rounded_tech_card", label: "圆角矩形科技牌", text: "rounded rectangle opaque tech cards with subtle blue edge glow and soft shadow" },
    { id: "horizontal_short_block", label: "横向短参数块", text: "horizontal short opaque parameter blocks with compact icon and short text" },
    { id: "thick_standing_board", label: "立式厚边说明牌", text: "standing thick-edge explanation boards made from solid graphite-blue material" },
    { id: "double_layer_board", label: "双层底板参数牌", text: "double-layer opaque parameter boards with solid base plate and raised text plate" }
  ];

  const TITLE_BOARD_STYLES = [
    { id: "luminous_lightbox", label: "发光灯箱", text: "luminous technology lightbox title board" },
    { id: "tech_hardboard", label: "科技硬板", text: "dark hardboard title panel with bright blue edge glow" },
    { id: "cut_corner_module", label: "切角模块牌", text: "cut-corner modular title frame with strong technology hierarchy" },
    { id: "integrated_wall", label: "一体嵌墙标题", text: "integrated wall-embedded title area with large white Chinese characters" },
    { id: "hanging_tech_board", label: "悬挂式科技标题板", text: "hanging physical tech title board with clean edges and soft blue rim light" },
    { id: "cabin_door_frame", label: "舱门式切角标题框", text: "cabin-door style angled title frame with premium digital-product atmosphere" }
  ];

  const BACKGROUND_DISPLAYS = [
    "phone model display",
    "earbuds and mini speaker display",
    "charging accessory display",
    "digital box package display",
    "lens and device ornament",
    "minimal equipment model",
    "electronic component style props"
  ];

  const ACCENT_COLORS = ["electric blue", "ice blue", "violet blue", "silver gray", "white light", "cyan blue", "cool purple", "steel blue"];

  const HOST_STYLES = [
    { id: "young_fresh", label: "年轻清爽", outfit: "light gray fitted knit top, young fresh 3C Douyin seller styling" },
    { id: "fashion_digital", label: "时尚数码", outfit: "cool gray fitted top with clean digital-fashion styling, youthful but not model-like" },
    { id: "light_business", label: "轻商务", outfit: "simple white-gray shirt or black light-business blazer, young clean tech seller styling" },
    { id: "minimal_tech", label: "极简科技", outfit: "minimal light blue-gray commuting top, fresh and modern 3C livestream styling" }
  ];

  const DEPTH_LEVELS = [
    { id: "low", label: "低", text: "moderate visible room depth, still clearly larger than a counter corner" },
    { id: "medium", label: "中", text: "clear background depth with layered rear tech wall and side display zones" },
    { id: "high", label: "高", text: "strong background depth, wide rear tech visual area and immersive layered room space" }
  ];

  const TECH_LEVELS = [
    { id: "light", label: "轻科技", text: "light technology mood with restrained blue lines and clean digital props" },
    { id: "standard", label: "标准科技", text: "standard technology mood with luminous lines, icons, circuit textures and frosted metal" },
    { id: "strong", label: "强科技", text: "strong technology mood with large curved tech wall, blue rim light, battery icons and digital interface patterns" },
    { id: "esports", label: "电竞科技", text: "esports technology mood with electric blue/violet-blue energy lines, angular cuts and backlit modules" }
  ];

  const COMMON_NEGATIVE = [
    "real brand",
    "real logo",
    "real trademark",
    "real price",
    "real product model name",
    "Apple logo",
    "Huawei logo",
    "Xiaomi logo",
    "Samsung logo",
    "DJI logo",
    "Sony logo",
    "platform UI",
    "shopping cart button",
    "comment area",
    "like icon",
    "livestream floating UI",
    "detail-page collage",
    "flat product poster",
    "advertising blockbuster",
    "showroom rendering",
    "exhibition hall",
    "standing host",
    "full-body host",
    "electronics store clerk",
    "retail store clerk",
    "Korean idol face",
    "Korean fashion model look",
    "fashion editorial model",
    "age drift",
    "older female host",
    "teen girl",
    "underage host",
    "over-polished beauty filter",
    "high camera angle",
    "strong wide angle",
    "obvious overhead view",
    "strong low angle",
    "tabletop too wide",
    "huge empty table",
    "product too small on huge table",
    "product flattened",
    "floating product",
    "giant product",
    "deformed packaging",
    "transparent acrylic sign",
    "transparent information card",
    "holographic UI",
    "floating parameter board",
    "glass information board",
    "complex transparent overlay",
    "cyberpunk room",
    "internet cafe",
    "living room interior",
    "messy shelves",
    "supermarket feeling",
    "visible light stand",
    "softbox",
    "filming equipment",
    "visible cables",
    "small cramped livestream corner",
    "shallow gray room",
    "ordinary counter room",
    "plain gray background",
    "weak technology atmosphere",
    "small shop counter feeling",
    "ordinary retail counter",
    "cramped digital store",
    "no background depth",
    "flat background wall",
    "title too small",
    "ordinary shop sign",
    "low-tech room",
    "dull gray room",
    "weak blue light",
    "overly simple placards",
    "crowded close-up crop",
    "host filling too much of frame",
    "background not visible",
    "same exact style every time",
    "repeated identical tech room",
    "cloned background layout",
    "same blue room repeated",
    "small cramped tech corner",
    "ordinary gray counter room",
    "generic retail counter",
    "overly simple background",
    "background too close to host",
    "no spatial layering",
    "messy gadget store",
    "floating UI panel",
    "restaurant-like signage",
    "home decor style",
    "beauty livestream room",
    "bakery style",
    "pharmacy style",
    "lifestyle studio unrelated to electronics",
    "dense small text",
    "garbled text",
    "unreadable text"
  ].join(", ");

  function pick(list, index) {
    return list[index % list.length];
  }

  function normalize(value) {
    return String(value || "").trim();
  }

  function oneLine(text) {
    return String(text || "").replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
  }

  function getSelection(list, value, index) {
    if (value && value !== "auto") {
      const found = list.find((item) => item.id === value || item.label === value);
      if (found) return found;
    }
    return pick(list, index);
  }

  function pickById(list, value, fallbackIndex = 0) {
    if (value && value !== "auto") {
      const found = list.find((item) => item.id === value || item.label === value);
      if (found) return found;
    }
    return pick(list, fallbackIndex);
  }

  function resolveRoute(options, index) {
    if (options.__styleRoute) return options.__styleRoute;
    if (options.__routeId) return pickById(STYLE_ROUTES, options.__routeId, index);
    const mode = options.styleRandomMode || "route_local_random";
    if (mode === "fixed") return pickById(STYLE_ROUTES, options.styleRoute || options.styleVariant, 0);
    if (mode === "route_random") return pickById(STYLE_ROUTES, options.styleRoute, index);
    if (mode === "high_diversity") return pick(STYLE_ROUTES, index * 7 + 3);
    return pickById(STYLE_ROUTES, options.styleRoute, index * 3 + 1);
  }

  function hasExplicitRoute(options = {}) {
    const value = normalize(options.styleRoute || options.styleVariant);
    return Boolean(value && value !== "auto");
  }

  function hashSeed(value) {
    const text = String(value || "3c-style-seed");
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function seededRandom(seed) {
    let state = hashSeed(seed);
    return function random() {
      state += 0x6D2B79F5;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function seededShuffle(list, seed) {
    const result = list.slice();
    const random = seededRandom(seed);
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function requiredUniqueStyleCount(count) {
    if (count <= 1) return 1;
    if (count <= 3) return 2;
    if (count <= 6) return 3;
    if (count <= 10) return 5;
    return Math.min(STYLE_ROUTES.length, count);
  }

  function buildStyleRouteSequence(options = {}, count = 1) {
    const mode = options.styleRandomMode || "route_local_random";
    if (hasExplicitRoute(options) || mode === "fixed") {
      const route = pickById(STYLE_ROUTES, options.styleRoute || options.styleVariant, 0);
      return Array.from({ length: count }, () => route);
    }

    const seed = options.seed || `${Date.now()}-${Math.random()}-${count}-${mode}-${options.productType || "auto"}`;
    const sequence = [];
    let cycle = 0;
    while (sequence.length < count) {
      let chunk = seededShuffle(STYLE_ROUTES, `${seed}-${cycle}`);
      if (sequence.length && chunk[0].id === sequence[sequence.length - 1].id) {
        chunk = chunk.slice(1).concat(chunk[0]);
      }
      for (const route of chunk) {
        if (sequence.length >= count) break;
        if (sequence.length && sequence[sequence.length - 1].id === route.id) continue;
        sequence.push(route);
      }
      cycle += 1;
    }

    const required = requiredUniqueStyleCount(count);
    const unique = new Set(sequence.map((route) => route.id));
    if (unique.size < required) {
      STYLE_ROUTES.forEach((route, index) => {
        if (unique.size >= required || index >= sequence.length) return;
        if (!unique.has(route.id)) {
          sequence[index] = route;
          unique.add(route.id);
        }
      });
    }

    return sequence;
  }

  function auditBatchStyleDistribution(items, settings = {}) {
    const ids = items.map((item) => item.styleRoute);
    const counts = ids.reduce((map, id) => {
      map[id] = (map[id] || 0) + 1;
      return map;
    }, {});
    const noAdjacentDuplicate = ids.every((id, index) => index === 0 || id !== ids[index - 1]);
    const uniqueStyleCount = Object.keys(counts).length;
    const minUniqueRequired = requiredUniqueStyleCount(items.length);
    const maxCount = Math.max(...Object.values(counts), 0);
    const maxShare = items.length ? maxCount / items.length : 0;
    const fixed = settings.styleRandomMode === "fixed" || settings.styleRoute !== "auto";
    const distributionPass = fixed || (
      uniqueStyleCount >= minUniqueRequired &&
      noAdjacentDuplicate &&
      maxShare <= 0.3
    );
    return {
      status: distributionPass ? "pass" : "fail",
      uniqueStyleCount,
      minUniqueRequired,
      noAdjacentDuplicate,
      maxShare: Number(maxShare.toFixed(3)),
      routeCounts: counts,
      notes: distributionPass ? [] : ["Batch style distribution does not meet the controlled diversity rules."]
    };
  }

  function pickMany(list, index, count) {
    const result = [];
    for (let i = 0; i < count; i += 1) {
      result.push(pick(list, index + i * 3));
    }
    return Array.from(new Set(result)).slice(0, count);
  }

  function resolveLocalModules(options, index, route) {
    const mode = options.styleRandomMode || "route_local_random";
    const fixed = mode === "fixed";
    const high = mode === "high_diversity";
    const localIndex = fixed ? 0 : high ? index * 5 + route.id.length : index + route.id.length;
    const structureCount = high ? 4 : mode === "route_random" ? 2 : 3;
    return {
      styleRandomMode: pickById(STYLE_RANDOM_MODES, mode, 2),
      backgroundStructures: pickMany(BACKGROUND_STRUCTURES, localIndex, structureCount),
      tableMaterial: pick(TABLE_MATERIALS, localIndex + 1),
      infoCardStyle: pickById(INFO_CARD_STYLES, options.infoCardStyle, localIndex + 2),
      titleBoardStyle: pickById(TITLE_BOARD_STYLES, options.titleBoardStyle, localIndex + 3),
      backgroundDisplay: pick(BACKGROUND_DISPLAYS, localIndex + 4),
      accentColor: pick(ACCENT_COLORS, localIndex + 5),
      hostStyle: pickById(HOST_STYLES, options.hostStyle, localIndex + 6),
      depthLevel: pickById(DEPTH_LEVELS, options.backgroundDepthLevel, high ? 2 : 1),
      techLevel: pickById(TECH_LEVELS, options.techAtmosphereLevel, high ? 2 : 1)
    };
  }

  function buildPromptItem(index, options = {}) {
    const product = getSelection(PRODUCT_TYPES, options.productType, index);
    const style = resolveRoute(options, index);
    const local = resolveLocalModules(options, index, style);
    const title = normalize(options.title) || pick(TITLES, index);
    const subtitle = normalize(options.subtitle) || pick(SUBTITLES, index);
    const outfit = normalize(options.outfit) || local.hostStyle.outfit || pick(OUTFITS, index);
    const sellingPointA = pick(SELLING_POINTS, index);
    const sellingPointB = pick(SELLING_POINTS, index + 3);
    const sellingPointC = pick(SELLING_POINTS, index + 6);
    const backgroundStructures = local.backgroundStructures.join(", ");

    const positivePrompt = [
      "Vertical 9:16 realistic Chinese Douyin 3C digital seated livestream room image, 1080x1920px. This is a dedicated 3C digital seated live-commerce room, not fashion, not beauty, not food, not fresh food, not a generic store scene. It is suitable for customer acquisition, proposal reference, style testing, batch image generation, cutout-friendly element analysis and product replacement.",
      "Live type lock: seated livestream, not standing livestream, not pure product poster, not showroom rendering, not advertising blockbuster, not detail-page collage. The scene must feel ready for real Douyin live selling, with clear commercial transaction atmosphere and realistic room depth.",
      "Camera logic lock: real seated livestream camera view. Camera height about 120-125cm, full-frame equivalent 35mm lens, slight downward angle 2-3 degrees. The viewer feels seated across from the host watching her explain. Keep full-frame equivalent 35mm lens, but the camera should be slightly pulled back to reveal more background space and technology atmosphere. The table should not become wider, and the host should not fill the frame too much. Maintain a balanced medium seated livestream shot with enough headroom, background depth, and product visibility. Do not use high camera angle, strong wide angle, obvious overhead view, exhibition-hall view or showroom perspective.",
      `Host lock: one adult Chinese Douyin female livestream host, age feeling stable around 23-28 years old, young, fresh, natural and trustworthy. She is seated behind the foreground livestream table, shown from head to waist or upper body. Her lower body is hidden by the table. She has natural facial features, healthy skin texture, clear eyes, a soft confident smile, neat long or medium-length hair, light natural makeup, and real live-selling explanation gestures. She is not a Korean idol, not a Korean fashion model, not a photo-shoot model, not overly polished, not too mature and not underage. Outfit: ${outfit}. A small lavalier microphone is allowed as the only subtle livestream signal.`,
      `Space scale lock: The 3C livestream room should feel like a medium-large professional digital tech livestream studio, not a small counter corner. Create a deeper and wider tech room with visible background depth, curved or layered dark tech walls, luminous blue edge lines, and a larger rear visual area. The host and table stay in the foreground/midground, while the background has enough space, depth, and atmosphere. Depth level: ${local.depthLevel.label}, ${local.depthLevel.text}. Do not make the room cramped, shallow, or like a small retail counter.`,
      `Technology atmosphere lock: Enhance the selected digital technology atmosphere for this style route. Use a professional tech-room palette, large curved or layered tech wall, soft luminous light strips, subtle digital interface patterns, battery icon graphics, circuit-line motifs, frosted metal, dark glass or route-matching retail materials, and clean rim lighting. Tech atmosphere level: ${local.techLevel.label}, ${local.techLevel.text}. Accent color: ${local.accentColor}. The scene should feel like a premium digital product live-selling studio, with strong technology mood and trustworthy parameter-display feeling.`,
      `Style route: ${style.id} | ${style.label}. ${style.description}. Suitable for ${style.suitable}. Local random modules: background structure uses ${backgroundStructures}; tabletop material is ${local.tableMaterial}; background display uses ${local.backgroundDisplay}; title board style is ${local.titleBoardStyle.label}; info card style is ${local.infoCardStyle.label}; host style is ${local.hostStyle.label}. The dominant palette, background material, lighting mood, shelf language, title-board form and technology decoration must follow this exact style route, not repeat one default cold-blue room. The room is clean, professional, modern, calm and technology-oriented, with route-matching luminous edge lines, physical digital signage and white or high-contrast technology typography. Behind the host, build a layered digital showroom background: a large central tech wall, side shelves with blurred generic digital products, a subtle battery or charging icon screen, and curved or linear route-matching light strips. Keep the background clean and professional, but more immersive than a normal gray room. Include a top title area, host explanation zone, left and right information zones, a few digital display shelves or wall niches, one auxiliary technology background area such as battery symbols, circuit-line graphics or digital icons, linear light strips and realistic room depth. Do not make it too cyberpunk, too gaming internet cafe, too home-like or too showroom-like.`,
      `Top title area shows two clear Chinese lines: first line "${title}", second line "${subtitle}". The top title should feel like a large integrated tech signboard inside the livestream room, not a small ordinary shop sign. Use ${local.titleBoardStyle.text}. Use a route-matching tech title panel with bright white or high-contrast Chinese characters and luminous or metallic edges. The title area should have strong visual presence, clear hierarchy, and premium digital-product atmosphere, while staying inside the safe area and not covering the host. The text should look like physical signage or printed wall text in the room, not floating platform UI. Keep the top area clean and readable.`,
      `Foreground table lock: the foreground table is a reusable livestream support system, not a huge desk and not the main subject. Use ${local.tableMaterial}. The tabletop width is moderate and controlled; visible tabletop area is modest, not too wide, not empty and not dominant. The front edge of the table is clear, with real thickness, clean contour and soft contact shadow, making it easy to cut out and reuse.`,
      `Product placement lock: ${product.products}. Default structure is one main product held by the host, one central main display product on the table, one flat auxiliary product, one package box, and optionally one supporting accessory. Product fronts must be clear, realistic in scale, with real landing points and contact shadows. Do not let products float, become giant, tilt severely, deform, or carry dense package text. Product words can be generic only: ${product.productWords}.`,
      `Opaque info card lock: All parameter cards must be opaque physical tech placards, not transparent acrylic. They should use ${local.infoCardStyle.text}. They should use solid route-matching tech material, clean rounded rectangle or modular shape, white icons, bright text, subtle luminous edge detail, slight thickness and soft shadow. They must look like removable physical tech information boards, easy to cut out and reuse. Parameter cards and selling-point cards must be opaque physical prop cards, not transparent acrylic cards. Use solid dark gray-blue cards with white text, silver-gray cards with dark text, black-gold solid cards, cream-light solid cards, or graphite-gray cards with light-blue outlines according to the selected route. Each card must have a full contour, clean edge, slight thickness and light cast shadow. They should be easy to cut out, replace, replicate and analyze. Right-side cards show short points such as "${sellingPointA}", "${sellingPointB}", "${sellingPointC}". Bottom table stickers may show "今日主推", "数码好物", "多款可选", "现货速发" as physical stickers attached to the table front panel.`,
      "Cutout-friendly final structure: clear foreground, middle ground and background. Product contour, info-card contour, sticker edge and table edge are clean. Avoid transparent materials, complex floating UI, hard-to-cut reflections, dense blur layers and overlapping edges. Final image should feel like a real Chinese Douyin 3C digital seated livestream room, ready to broadcast and easy to split into host, product, table, sign cards, title and background elements."
    ].join("\n\n");

    const negativePrompt = COMMON_NEGATIVE;
    const promptObject = {
      promptId: `3c-${String(index + 1).padStart(2, "0")}-${product.id}-${style.id}`,
      category: "3c_digital",
      sceneType: "seated_livestream",
      projectName: PROJECT_NAME,
      productType: product.id,
      productTypeCn: product.label,
      styleRoute: style.id,
      styleRouteCn: style.label,
      styleRouteId: style.id,
      styleVariant: style.label,
      title,
      subtitle,
      prompt: positivePrompt,
      positivePrompt,
      negativePrompt,
      lockedItems: [
        "3C 数码独立专用",
        "中国抖音坐播直播间",
        "成年女主播 23-28 岁",
        "120-125cm 机位",
        "35mm 等效焦段",
        "台面不过宽",
        "不透明实体信息牌",
        "可抠图可拆元素"
      ],
      replaceableVariables: {
        productType: product.label,
        productTypeId: product.id,
        title,
        subtitle,
        sellingPoints: [sellingPointA, sellingPointB, sellingPointC],
        styleRoute: style.id,
        styleRouteCn: style.label,
        styleRandomMode: local.styleRandomMode.label,
        backgroundStructures: local.backgroundStructures,
        tableMaterial: local.tableMaterial,
        titleBoardStyle: local.titleBoardStyle.label,
        infoCardStyle: local.infoCardStyle.label,
        backgroundDisplay: local.backgroundDisplay,
        accentColor: local.accentColor,
        backgroundDepthLevel: local.depthLevel.label,
        techAtmosphereLevel: local.techLevel.label,
        outfit,
        products: product.products
      },
      localModules: local,
      styleNote: `${style.label}：${style.description}`
    };
    promptObject.audit = auditPromptFor3CDigitalSeatedLiveRoom(promptObject);
    return promptObject;
  }

  function generateBatch(options = {}) {
    const count = Math.max(1, Math.min(30, Number(options.count || 10)));
    const settings = {
      productType: options.productType || "auto",
      styleRoute: options.styleRoute || options.styleVariant || "auto",
      styleRandomMode: options.styleRandomMode || "route_local_random",
      hostStyle: options.hostStyle || "auto",
      titleBoardStyle: options.titleBoardStyle || "auto",
      infoCardStyle: options.infoCardStyle || "auto",
      backgroundDepthLevel: options.backgroundDepthLevel || "medium",
      techAtmosphereLevel: options.techAtmosphereLevel || "standard",
      outputLanguage: "English image prompt with Chinese signage text"
    };
    const routeSequence = buildStyleRouteSequence(options, count);
    const items = Array.from({ length: count }, (_, index) => buildPromptItem(index, {
      ...options,
      __styleRoute: routeSequence[index]
    }));
    return {
      workbench: WORKBENCH,
      projectName: PROJECT_NAME,
      version: VERSION,
      count: items.length,
      settings,
      styleDistributionAudit: auditBatchStyleDistribution(items, settings),
      items
    };
  }

  function buildTxt(batch) {
    return batch.items.map((item, index) => {
      return `#${index + 1} 【生图提示词】 ${oneLine(item.positivePrompt)} 【负面提示词】 ${oneLine(item.negativePrompt)}`;
    }).join("\n");
  }

  function auditPromptFor3CDigitalSeatedLiveRoom(promptObject) {
    const positive = promptObject.positivePrompt || "";
    const negative = promptObject.negativePrompt || "";
    const positiveLower = positive.toLowerCase();
    const negativeLower = negative.toLowerCase();
    const notes = [];
    const audit = {
      projectIsolationPass: includesAll(positiveLower, ["dedicated 3c digital", "not fashion", "not beauty", "not food", "not fresh food"]),
      douyinSeatedLiveRoomPass: includesAll(positiveLower, ["chinese douyin", "seated livestream", "not standing livestream", "ready for real douyin live selling"]),
      hostAgePass: includesAll(positiveLower, ["adult chinese douyin female livestream host", "23-28 years old", "not too mature", "not underage"]),
      hostStylePass: includesAll(positiveLower, ["young", "fresh", "natural", "trustworthy"]) && includesAll(negativeLower, ["korean idol face", "korean fashion model look", "age drift"]),
      cameraPass: includesAll(positiveLower, ["120-125cm", "35mm", "slight downward angle 2-3 degrees"]) && includesAll(negativeLower, ["high camera angle", "strong wide angle", "obvious overhead view"]),
      pulledBackCameraPass: includesAll(positiveLower, ["slightly pulled back", "more background space", "host should not fill the frame too much", "balanced medium seated livestream shot"]),
      studioScalePass: includesAll(positiveLower, ["medium-large professional digital tech livestream studio", "deeper and wider tech room", "visible background depth", "larger rear visual area"]) && includesAll(negativeLower, ["small cramped livestream corner", "shallow gray room", "small shop counter feeling", "no background depth"]),
      techAtmospherePass: includesAll(positiveLower, ["selected digital technology atmosphere", "professional tech-room palette", "large curved or layered tech wall", "battery icon graphics", "circuit-line motifs", "clean rim lighting"]) && includesAll(negativeLower, ["weak technology atmosphere", "plain gray background", "low-tech room", "weak blue light"]),
      titleTechPanelPass: includesAll(positiveLower, ["large integrated tech signboard", "route-matching tech title panel", "bright white or high-contrast chinese characters", "strong visual presence"]) && includesAll(negativeLower, ["title too small", "ordinary shop sign"]),
      backgroundDepthPass: includesAll(positiveLower, ["layered digital showroom background", "large central tech wall", "side shelves with blurred generic digital products", "subtle battery or charging icon screen", "curved or linear route-matching light strips"]) && includesAll(negativeLower, ["background not visible", "flat background wall"]),
      tableWidthPass: includesAll(positiveLower, ["tabletop width is moderate", "not too wide", "not empty and not dominant"]) && includesAll(negativeLower, ["tabletop too wide", "huge empty table", "product too small on huge table"]),
      productPlacementPass: includesAll(positiveLower, ["one main product held by the host", "one central main display product on the table", "product fronts must be clear"]) && includesAll(negativeLower, ["floating product", "giant product", "deformed packaging"]),
      opaqueInfoCardsPass: includesAll(positiveLower, ["opaque physical tech placards", "solid route-matching tech material", "white icons", "subtle luminous edge detail", "removable physical tech information boards"]) && includesAll(negativeLower, ["transparent acrylic sign", "transparent information card", "holographic ui", "floating parameter board", "overly simple placards"]),
      styleRoutePass: includesAll(positiveLower, ["style route:", "local random modules", "background structure uses", "title board style", "info card style"]) && includesAll(negativeLower, ["same exact style every time", "repeated identical tech room", "cloned background layout", "same blue room repeated"]),
      localRandomPoolPass: includesAll(positiveLower, ["tabletop material is", "background display uses", "accent color:", "host style is"]) && includesAll(negativeLower, ["overly simple background", "no spatial layering", "messy gadget store"]),
      controlledStyleVariationPass: includesAll(positiveLower, ["dominant palette", "must follow this exact style route", "not repeat one default cold-blue room", "route-matching luminous edge lines"]),
      techRoomStylePass: includesAll(positiveLower, ["technology-oriented", "physical digital signage", "high-contrast technology typography"]) && includesAll(negativeLower, ["cyberpunk room", "internet cafe", "living room interior", "showroom rendering"]),
      cutoutFriendlyPass: includesAll(positiveLower, ["cutout-friendly", "clear foreground", "product contour", "info-card contour", "table edge"]),
      outputSchemaPass: promptObject.category === "3c_digital" && promptObject.sceneType === "seated_livestream" && Boolean(promptObject.styleRoute) && Boolean(promptObject.styleRouteCn) && Boolean(promptObject.productType) && Boolean(promptObject.prompt),
      negativePromptPass: includesAll(negativeLower, ["real brand", "real logo", "real price", "platform ui", "standing host", "transparent acrylic sign", "tabletop too wide"]),
      notes
    };
    const failed = Object.entries(audit)
      .filter(([key, value]) => typeof value === "boolean" && !value)
      .map(([key]) => key);
    audit.status = failed.length ? "fail" : "pass";
    if (failed.length) notes.push(`Failed checks: ${failed.join(", ")}`);
    return audit;
  }

  function includesAll(text, terms) {
    return terms.every((term) => text.includes(term.toLowerCase()));
  }

  return {
    WORKBENCH,
    PROJECT_NAME,
    VERSION,
    PRODUCT_TYPES,
    STYLE_VARIANTS,
    STYLE_ROUTES,
    STYLE_RANDOM_MODES,
    INFO_CARD_STYLES,
    TITLE_BOARD_STYLES,
    HOST_STYLES,
    DEPTH_LEVELS,
    TECH_LEVELS,
    TITLES,
    SUBTITLES,
    SELLING_POINTS,
    COMMON_NEGATIVE,
    generateBatch,
    buildTxt,
    auditPromptFor3CDigitalSeatedLiveRoom
  };
});
