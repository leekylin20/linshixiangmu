(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PremiumMakeupLiveRoomWorkbench = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  const WORKBENCH = "premium-makeup-live-room-workbench";
  const PROJECT_NAME = "高端大牌彩妆直播间提示词工作台｜前景成交骨架锁定版｜35mm";
  const VERSION = "premium_makeup_foreground_transaction_space_integration_engine_v1_0";

  const CAMERA_GEOMETRY_LOCK = [
    "【Camera Geometry Lock｜透视母版锁定】",
    "This image must use one fixed front-facing seated livestream camera geometry. Vertical 9:16 frame, 35mm equivalent lens, camera height 125cm, slight downward tilt only 2 degrees, no wide-angle distortion, no high-angle view, no low-angle view.",
    "The viewer is sitting directly across from the beauty consultant at the same livestream desk. The camera is centered on the host and the main eyeshadow palette. Use one stable front-facing one-point perspective.",
    "The host eye line is around the upper-middle area of the frame. The host shoulders are horizontal and parallel to the front edge of the table. The black mirror livestream table front edge must be a clean horizontal line across the lower frame. The tabletop surface is visible only moderately, about 25%-30%, not a strong top-down view.",
    "All products, acrylic stands, brushes, palettes and auxiliary cosmetics must sit on the same tabletop plane with correct contact shadows and reflections. The main eyeshadow palette must stay in the front-center product zone, directly between the host and the camera.",
    "The host sits behind the table, not leaning too far forward, not standing, not floating. The background wall, display shelves, mirror lights and architectural frames must follow the same front-facing perspective. Vertical background lines remain vertical. No tilted room, no diagonal showroom view, no side-view boutique perspective, no product advertising flat lay.",
    "中文锁定理解：背景可以换风格，但不能换机位；前景可以换少量辅助产品，但不能换透视；主播动作可以小幅变化，但不能改变坐播几何关系。"
  ].join("\n\n");

  const FOREGROUND_ANCHOR_LOCK = [
    "【Foreground Anchor Lock｜前景锚点锁定】",
    "Foreground composition must remain fixed:",
    "1. The black mirror table front edge stays horizontal in the lower 15%-20% of the image.",
    "2. The main eyeshadow palette is centered on the table, placed in the lower-middle product zone.",
    "3. The host is seated behind the product, chest and shoulders visible, facing the camera.",
    "4. The host face stays above the main product, not too large, not too close to camera.",
    "5. Left and right auxiliary product groups must stay lower than the host chest and must not cross into the host face area.",
    "6. Acrylic display stands must be low and wide, not tall towers, not floating, not slanted.",
    "7. Product reflections on the black table must align vertically under each product.",
    "中文锁定理解：桌台前沿横平，眼影盘居中，主播在后面坐播，人物不要冲到镜头前，亚克力不要变成高塔，所有产品在同一个桌面上，反射方向要对。"
  ].join("\n\n");

  const SPACE_INTEGRATION_ENGINE = [
    "【Space Integration Engine｜空间一体化引擎】",
    "Build the image like a real C4D / product-photography livestream studio, not like a flat poster. The host, products, black mirror table, acrylic stands, background wall, display shelves, lights, shadows, reflections and depth of field must all belong to one continuous physical space.",
    "1. Camera module: vertical 9:16, 35mm equivalent lens, camera height 125cm, camera distance about 160-180cm from the host and about 70-90cm from the table front edge, slight downward pitch 2 degrees, single front-facing vanishing point, horizon line aligned near the host eye line, table front edge horizontal, host eye line upper-middle, product center lower-middle.",
    "2. Spatial layering module: foreground table edge in the lower 15%-20%, main eyeshadow palette in the lower-middle product zone, auxiliary cosmetics on the same tabletop plane, host seated in the midground behind the product, background wall and display elements behind the host on the same axis. Do not flatten these layers into a graphic poster.",
    "3. Lighting module: use one coherent beauty livestream studio lighting setup. Soft frontal key light for the host face, controlled fill light, subtle rim light on hair and shoulders, small product highlight on the eyeshadow palette, gentle edge highlights on acrylic and metal. Shadows must fall consistently on the same tabletop plane.",
    "4. Material module: black piano-lacquer mirror table with glossy reflection, transparent thick acrylic with real refraction edges, silver metal logo with cool highlights, pearl eyeshadow powder with fine shimmer, matte black or deep navy background surfaces, low-density premium display materials. Materials must react to the same light sources.",
    "5. Object landing module: every product, brush, palette, acrylic riser and auxiliary cosmetic must have a clear landing point, contact shadow and weight on the tabletop. Nothing floats, nothing cuts through the table, no product sits on a different invisible plane.",
    "6. Reflection module: reflections on the black mirror table must align vertically under each object, with soft falloff and correct intensity. The main eyeshadow palette has the strongest controlled reflection, auxiliary products have lighter reflections, acrylic edges create subtle refracted highlights.",
    "7. Depth-of-field module: use moderate product-photography depth of field. The main eyeshadow palette, host face and hands are sharp and readable; background is slightly softer but still structurally clear. Do not use heavy bokeh, flat poster sharpness, or mismatched focus planes.",
    "中文锁定理解：先搭一个真实直播棚空间，再生成品类内容。摄影机、空间分层、灯光、材质、物体落点、反射、景深必须统一；背景和风格只能在这个统一空间里变化。"
  ].join("\n\n");

  const SCENE_THEMES = [
    {
      id: "eyeshadow_palette_special",
      label: "眼影盘专场",
      title: "高端眼影盘专场",
      subtitle: "专业彩妆顾问讲解"
    }
  ];

  const BACKGROUND_ROUTES = [
    {
      id: "flagship_black_wall",
      label: "旗舰黑墙品牌型",
      description: "大面积哑光黑品牌主墙，低调金属字标，少量线性灯带，左右少量展示柜，稳重、高端、品牌感强",
      suitable: "眼影盘专场、高端新品发布、品牌主推款"
    },
    {
      id: "pro_backstage_mirror",
      label: "专业后台化妆镜型",
      description: "化妆镜灯作为主要背景符号，黑色镜面、冷白灯泡和后台彩妆顾问台氛围，专业讲解感强",
      suitable: "专业彩妆讲解、眼妆教程感、顾问推荐感"
    },
    {
      id: "arc_architecture_counter",
      label: "弧形建筑专柜型",
      description: "白色弧形建筑框、黑色主墙、冷白线性灯带、镜面边框，带旗舰店建筑感但仍服务坐播成交画面",
      suitable: "大牌专柜感、高端视觉参考、品牌空间感强化"
    },
    {
      id: "black_gold_evening_eye",
      label: "黑金晚宴眼妆型",
      description: "深黑主色，少量香槟金，珠光反射和晚宴妆氛围，更奢华、更成熟，但背景不能抢主产品",
      suitable: "晚宴眼妆、珠光眼影盘、节日妆容、高端礼盒感"
    },
    {
      id: "mirror_luxury_counter",
      label: "镜面奢华柜台型",
      description: "黑镜、银镜、玻璃、亚克力和丰富冷色反射，冷艳奢华，但不能变成探店图或空间展示图",
      suitable: "奢华专柜、黑白高级感、反射材质测试"
    },
    {
      id: "minimal_brand_lab",
      label: "极简品牌实验室型",
      description: "黑白极简、低密度陈列、干净现代、冷白光，更像新品发布实验室和专业配方讲解空间",
      suitable: "新品眼影盘、专业配方感、高级简洁直播间"
    },
    {
      id: "low_density_wall_niche",
      label: "低密度壁龛陈列型",
      description: "黑色壁龛、少量彩妆瓶罐、局部冷白灯带，背景干净但有货感，直播带货感稍强但仍保持大牌感",
      suitable: "直播带货感增强、低密度专柜陈列、高端彩妆顾问场景"
    }
  ];

  const BACKGROUND_RANDOM_MODES = [
    { id: "fixed", label: "关闭随机（固定）" },
    { id: "route_random", label: "背景路由随机" },
    { id: "route_balanced", label: "背景路由均衡打散" }
  ];

  const HOST_GESTURES = [
    "一手轻扶下巴，另一手轻指中央眼影盘，动作克制、专业、有顾问感",
    "一手轻拿小号化妆刷讲解，另一手自然停在桌台边缘，正面对镜头",
    "一手轻托眼影盘旁的亚克力台阶，另一手以小幅度手势指向珠光色盘",
    "双手动作克制地围绕中央眼影盘讲解，不遮挡产品，不夸张促销"
  ];

  const AUX_LAYOUTS = [
    "左侧辅助区放 1 个高光盘或粉饼与 1 支黑色睫毛膏，右侧放少量专业刷具、1 个小型辅助盘和透明亚克力刷具座",
    "左侧辅助区放 1 个黑色瓶装底妆单品和低矮亚克力托盘，右侧放少量黑色刷具与 1 个小型辅助眼影盘",
    "左侧辅助区放 1 个闭合外壳和少量粉饼，右侧放短柄专业眼影刷与透明亚克力刷具座",
    "左右各只保留少量辅助彩妆，中央眼影盘和闭合外壳保持最强视觉权重"
  ];

  const TITLES = [
    "高端眼影盘专场",
    "晚宴眼妆专场",
    "大牌彩妆顾问台",
    "珠光眼影主推",
    "高级黑白彩妆间",
    "专业眼妆讲解",
    "冷感大牌眼妆"
  ];

  const SUBTITLES = [
    "专业顾问讲解",
    "珠光粉质清晰",
    "冷感高级妆效",
    "主推眼影盘展示",
    "黑白高级直播画面",
    "专柜级彩妆陈列",
    "克制精致大牌感"
  ];

  const COMMON_NEGATIVE = [
    "普通卖货直播间",
    "低价清仓感",
    "红色大促氛围",
    "促销贴片",
    "价格标签",
    "买赠信息",
    "平台 UI",
    "购物车",
    "评论区",
    "点赞图标",
    "粉色网红化妆台",
    "少女卧室感",
    "美容院",
    "影楼化妆间",
    "普通美妆店",
    "商场专柜堆头",
    "满墙彩妆货架",
    "彩妆杂货铺",
    "产品过多",
    "桌面铺满产品",
    "口红成为第一主角",
    "一排口红占据中心",
    "眼影盘不突出",
    "眼影盘太小",
    "眼影盘变形",
    "产品悬浮",
    "产品巨大化",
    "外壳发灰",
    "金属字标不清晰",
    "粉质没有珠光",
    "背景过花",
    "背景抢产品",
    "背景抢主播",
    "空间展示大于直播关系",
    "专柜探店图",
    "广告大片视角",
    "主播不像直播讲解",
    "主播不看镜头",
    "主播像写真模特",
    "韩系女团风",
    "甜妹网红感",
    "普通店员感",
    "多人主播",
    "夸张促销手势",
    "强广角",
    "强俯拍",
    "高机位",
    "仰拍",
    "桌面上表面过大",
    "透视混乱",
    "灯光脏暗",
    "过曝高光",
    "赛博朋克",
    "电竞蓝科技风",
    "夜店灯光",
    "真实品牌 LOGO",
    "真实商标",
    "真实价格",
    "tilted table plane",
    "diagonal table front edge",
    "slanted tabletop",
    "mismatched product perspective",
    "products on different planes",
    "acrylic stand floating",
    "wrong reflection direction",
    "high-angle tabletop view",
    "low-angle host view",
    "showroom diagonal perspective",
    "boutique side-view angle",
    "wide-angle room distortion",
    "telephoto flat compression",
    "host too close to camera",
    "host head too large",
    "product not centered",
    "main palette off-center",
    "table front edge not horizontal",
    "background perspective not matching table",
    "vertical lines leaning",
    "room tilted",
    "camera rotated",
    "inconsistent vanishing point",
    "flat poster composition",
    "graphic layout instead of real studio",
    "no spatial layering",
    "objects without contact shadows",
    "missing table contact",
    "floating shadow",
    "wrong shadow direction",
    "inconsistent lighting direction",
    "multiple conflicting light sources",
    "material mismatch",
    "acrylic without refraction",
    "mirror table without reflection",
    "reflection not under object",
    "random reflection direction",
    "depth of field mismatch",
    "background sharper than main product",
    "heavy bokeh hiding structure",
    "products and host on different focus planes"
  ].join("、");

  function normalize(value) {
    return String(value || "").trim();
  }

  function oneLine(text) {
    return String(text || "").replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
  }

  function pick(list, index) {
    return list[index % list.length];
  }

  function pickById(list, value, fallbackIndex = 0) {
    if (value && value !== "auto") {
      const found = list.find((item) => item.id === value || item.label === value);
      if (found) return found;
    }
    return pick(list, fallbackIndex);
  }

  function buildBackgroundSequence(options = {}, count = 1) {
    const mode = options.backgroundRandomMode || "route_balanced";
    const explicit = normalize(options.backgroundRoute);
    if (mode === "fixed" || (explicit && explicit !== "auto")) {
      const route = pickById(BACKGROUND_ROUTES, explicit, 0);
      return Array.from({ length: count }, () => route);
    }
    const step = mode === "route_random" ? 3 : 1;
    const offset = mode === "route_random" ? 2 : 0;
    return Array.from({ length: count }, (_, index) => pick(BACKGROUND_ROUTES, index * step + offset));
  }

  function auditBackgroundDistribution(items, settings) {
    const ids = items.map((item) => item.backgroundRoute);
    const counts = ids.reduce((map, id) => {
      map[id] = (map[id] || 0) + 1;
      return map;
    }, {});
    const fixed = settings.backgroundRandomMode === "fixed" || settings.backgroundRoute !== "auto";
    const noAdjacentDuplicate = ids.every((id, index) => index === 0 || id !== ids[index - 1]);
    const uniqueBackgroundCount = Object.keys(counts).length;
    const expectedMin = fixed ? 1 : Math.min(BACKGROUND_ROUTES.length, items.length);
    const status = fixed || (uniqueBackgroundCount >= expectedMin && noAdjacentDuplicate) ? "pass" : "fail";
    return {
      status,
      uniqueBackgroundCount,
      expectedMin,
      noAdjacentDuplicate,
      routeCounts: counts,
      notes: status === "pass" ? [] : ["背景路由没有按多样化规则打散。"]
    };
  }

  function buildPromptItem(index, options = {}) {
    const theme = pickById(SCENE_THEMES, options.sceneTheme, 0);
    const background = options.__backgroundRoute || pickById(BACKGROUND_ROUTES, options.backgroundRoute, index);
    const title = normalize(options.title) || pick(TITLES, index);
    const subtitle = normalize(options.subtitle) || pick(SUBTITLES, index);
    const gesture = pick(HOST_GESTURES, index);
    const auxLayout = pick(AUX_LAYOUTS, index);

    const positivePrompt = [
      CAMERA_GEOMETRY_LOCK,
      FOREGROUND_ANCHOR_LOCK,
      SPACE_INTEGRATION_ENGINE,
      `生成一张竖版 9:16 高端大牌彩妆坐播直播间商品展示图，主题为${theme.label}。画面必须是中国抖音坐播直播间视角：35mm equivalent lens, normal front-facing seated livestream perspective, no wide-angle distortion, no telephoto compression, no showroom diagonal view. 摄像机高度固定 125cm，正面中近景构图，轻微下俯 2 度，观众像坐在彩妆顾问台对面，看主播讲解主推眼影盘。35mm 只是镜头感，不允许模型理解成探店广角、广告斜拍或空间展示视角。`,
      "前景直播成交骨架必须固定：一位成年女性高端品牌彩妆顾问坐在黑色镜面直播桌台后方，正面对镜头自然讲解。她年龄感约 28-35 岁，成熟、专业、冷静、可信赖，穿黑色西装或高级黑色顾问服，深色内搭，精致眼妆，高级底妆，自然高级唇色，利落盘发或精致低盘发。人物不能像韩系女团、甜妹网红、写真模特或普通店员，必须像高端品牌彩妆顾问。",
      `主播动作：${gesture}。动作必须克制、专业、有顾问感，不能夸张促销，不能遮挡主推眼影盘。`,
      "前景桌台为黑色高光镜面直播讲解桌台，黑色钢琴烤漆质感，台面干净克制，有清晰反射。桌面使用透明亚克力台阶、厚实亚克力展示岛、黑色镜面底座、黑色亮面圆台和银色金属细节，形成高端彩妆专柜陈列层次。桌面上表面可见比例控制在 25%-30%，不能强俯拍，不能让桌面铺满画面。桌台前沿必须水平，桌面消失线稳定，所有产品必须位于同一个黑色镜面桌面平面上，有统一接触阴影和反射。",
      "主推产品是高端眼影盘，眼影盘必须是整张画面的第一主角。中央最强展示位必须给眼影盘，不能被口红抢走。眼影盘打开或半打开，清楚露出珠光眼影色盘、深浅层次、晚宴眼妆配色和镜面反光。外壳为深海军蓝接近黑色的高光漆面，带银色金属字标和冷感镜面反射。可在前方辅助放一个闭合外壳或外盒，加强高端品牌感。",
      `${auxLayout}。所有辅助产品必须服务眼影盘，不能抢主体，不能铺满桌面，不能变成彩妆大杂烩。口红只能少量作为辅助点缀，不能成为中心主视觉。`,
      `Background style may vary, but only as a back-scene design variation within the same locked front-facing livestream camera geometry. Do not change the camera angle, table angle, host position, product center, or perspective system. The background is a style layer behind the fixed livestream foreground, not a new showroom camera view. 本条背景路由为 ${background.id}｜${background.label}：${background.description}。适合：${background.suitable}。背景主色为黑色、深海军蓝近黑、冷白、银色金属，可少量加入香槟金或珠光反射。背景要有品牌专柜感、专业彩妆后台感、低密度陈列和高级留白，但只能作为同一正面坐播透视母版内的后景换装，不能改变相机位置、桌台角度、主播位置和主产品中心点。背景后墙垂直线必须保持垂直，左右展示柜、镜灯、建筑框都必须跟随同一正面一点透视。`,
      "无论背景如何变化，前景直播关系必须稳定成立：主播正对镜头，产品在前景中心，眼影盘是第一主角，黑色镜面桌台清楚，画面像正在开播讲解，而不是专柜探店图、空间展示图或广告大片。",
      "灯光为高端彩妆直播灯光：人物脸部柔和均匀，眼影盘有局部高光，亚克力边缘清楚通透，黑色镜面桌台反射干净，银色金属字标有细腻冷感反光，眼影珠光粉质清楚。整体高级、冷静、精致、克制、专业、黑白大牌感强。",
      `顶部或背景实体标题可以出现清晰中文：${title}；副标题：${subtitle}。文字必须像实体品牌导视或直播间标题板，不是平台 UI，不出现真实品牌名、真实 LOGO、真实价格。`
    ].join("\n\n");

    const promptObject = {
      promptId: `premium-makeup-${String(index + 1).padStart(2, "0")}-${background.id}`,
      category: "premium_makeup",
      sceneType: "seated_livestream",
      projectName: PROJECT_NAME,
      templateVersion: VERSION,
      sceneTheme: theme.id,
      sceneThemeCn: theme.label,
      mainProduct: "eyeshadow_palette",
      mainProductCn: "高端眼影盘",
      backgroundRoute: background.id,
      backgroundRouteCn: background.label,
      title,
      subtitle,
      prompt: positivePrompt,
      positivePrompt,
      negativePrompt: COMMON_NEGATIVE,
      lockedItems: [
        "前景直播成交骨架",
        "Camera Geometry Lock 透视母版锁定",
        "Foreground Anchor Lock 前景锚点锁定",
        "Space Integration Engine 空间一体化引擎",
        "摄影机/空间分层/灯光/材质/物体落点/反射/景深七模块统一",
        "中国抖音坐播直播间",
        "35mm 正面中近景机位",
        "125cm 摄像机高度",
        "单一正面一点透视",
        "桌台前沿水平",
        "人物肩线水平",
        "背景垂直线保持垂直",
        "黑色高光镜面桌台",
        "中央主推眼影盘第一主角",
        "少量辅助彩妆",
        "亚克力 / 黑镜 / 银色金属陈列",
        "高端彩妆顾问人设",
        "背景只锁调性，不锁结构"
      ],
      replaceableVariables: {
        sceneTheme: theme.label,
        backgroundRoute: background.id,
        backgroundRouteCn: background.label,
        title,
        subtitle,
        hostGesture: gesture,
        auxLayout
      }
    };
    promptObject.audit = auditPromptForPremiumMakeupLiveRoom(promptObject);
    return promptObject;
  }

  function generateBatch(options = {}) {
    const count = Math.max(1, Math.min(30, Number(options.count || 7)));
    const settings = {
      sceneTheme: options.sceneTheme || "eyeshadow_palette_special",
      backgroundRoute: options.backgroundRoute || "auto",
      backgroundRandomMode: options.backgroundRandomMode || "route_balanced",
      outputFormat: "single-line TXT plus JSON"
    };
    const backgroundSequence = buildBackgroundSequence(options, count);
    const items = Array.from({ length: count }, (_, index) => buildPromptItem(index, {
      ...options,
      __backgroundRoute: backgroundSequence[index]
    }));
    return {
      workbench: WORKBENCH,
      projectName: PROJECT_NAME,
      version: VERSION,
      count: items.length,
      settings,
      backgroundDistributionAudit: auditBackgroundDistribution(items, settings),
      items
    };
  }

  function buildTxt(batch) {
    return batch.items.map((item, index) => `#${index + 1} 【生图提示词】 ${oneLine(item.positivePrompt)} 【负面提示词】 ${oneLine(item.negativePrompt)}`).join("\n");
  }

  function includesAll(text, terms) {
    return terms.every((term) => text.includes(term));
  }

  function auditPromptForPremiumMakeupLiveRoom(promptObject) {
    const positive = promptObject.positivePrompt || "";
    const negative = promptObject.negativePrompt || "";
    const notes = [];
    const audit = {
      cameraGeometryLockPass: includesAll(positive, ["Camera Geometry Lock", "one fixed front-facing seated livestream camera geometry", "camera height 125cm", "one stable front-facing one-point perspective", "Vertical background lines remain vertical"]),
      foregroundAnchorLockPass: includesAll(positive, ["Foreground Anchor Lock", "black mirror table front edge stays horizontal", "main eyeshadow palette is centered", "host is seated behind the product", "Product reflections on the black table must align vertically"]),
      spaceIntegrationEnginePass: includesAll(positive, ["Space Integration Engine", "C4D / product-photography livestream studio", "one continuous physical space", "Camera module", "Spatial layering module", "Lighting module", "Material module", "Object landing module", "Reflection module", "Depth-of-field module"]),
      cameraModulePass: includesAll(positive, ["camera distance about 160-180cm", "horizon line aligned near the host eye line", "product center lower-middle"]),
      spatialLayeringPass: includesAll(positive, ["foreground table edge", "host seated in the midground", "background wall and display elements behind the host", "Do not flatten these layers"]),
      lightingMaterialPass: includesAll(positive, ["Soft frontal key light", "controlled fill light", "subtle rim light", "Materials must react to the same light sources"]),
      objectLandingReflectionPass: includesAll(positive, ["clear landing point", "contact shadow", "Nothing floats", "reflections on the black mirror table must align vertically under each object"]),
      depthOfFieldPass: includesAll(positive, ["moderate product-photography depth of field", "main eyeshadow palette, host face and hands are sharp", "background is slightly softer"]),
      foregroundSkeletonPass: includesAll(positive, ["前景直播成交骨架必须固定", "黑色镜面直播桌台", "眼影盘必须是整张画面的第一主角"]),
      camera35mmPass: includesAll(positive, ["9:16", "35mm equivalent lens", "125cm", "正面中近景", "轻微下俯 2 度", "no telephoto compression"]),
      hostConsultantPass: includesAll(positive, ["成年女性高端品牌彩妆顾问", "28-35 岁", "成熟、专业、冷静、可信赖", "黑色西装"]),
      tableMaterialPass: includesAll(positive, ["黑色高光镜面", "黑色钢琴烤漆", "透明亚克力台阶", "黑色镜面底座", "银色金属细节"]),
      mainEyeshadowPriorityPass: includesAll(positive, ["主推产品是高端眼影盘", "第一主角", "中央最强展示位", "不能被口红抢走"]),
      auxProductDensityPass: includesAll(positive, ["辅助产品必须服务眼影盘", "不能铺满桌面", "口红只能少量作为辅助点缀"]),
      backgroundFlexiblePass: includesAll(positive, ["Background style may vary", "same locked front-facing livestream camera geometry", "not a new showroom camera view", "后景换装"]),
      perspectiveConsistencyPass: includesAll(positive, ["桌台前沿必须水平", "所有产品必须位于同一个黑色镜面桌面平面上", "统一接触阴影和反射", "背景后墙垂直线必须保持垂直"]),
      liveCommerceRelationPass: includesAll(positive, ["主播正对镜头", "产品在前景中心", "黑色镜面桌台清楚", "不是专柜探店图"]),
      negativePromptPass: includesAll(negative, ["普通卖货直播间", "口红成为第一主角", "专柜探店图", "广告大片视角", "强广角", "真实品牌 LOGO"]),
      perspectiveNegativePass: includesAll(negative, ["tilted table plane", "diagonal table front edge", "mismatched product perspective", "products on different planes", "background perspective not matching table", "inconsistent vanishing point"]),
      spaceNegativePass: includesAll(negative, ["flat poster composition", "no spatial layering", "objects without contact shadows", "inconsistent lighting direction", "reflection not under object", "depth of field mismatch"]),
      outputSchemaPass: promptObject.category === "premium_makeup" && promptObject.sceneType === "seated_livestream" && Boolean(promptObject.backgroundRoute) && Boolean(promptObject.prompt),
      notes
    };
    const failed = Object.entries(audit)
      .filter(([, value]) => typeof value === "boolean" && !value)
      .map(([key]) => key);
    audit.status = failed.length ? "fail" : "pass";
    if (failed.length) notes.push(`Failed checks: ${failed.join(", ")}`);
    return audit;
  }

  return {
    WORKBENCH,
    PROJECT_NAME,
    VERSION,
    CAMERA_GEOMETRY_LOCK,
    FOREGROUND_ANCHOR_LOCK,
    SPACE_INTEGRATION_ENGINE,
    SCENE_THEMES,
    BACKGROUND_ROUTES,
    BACKGROUND_RANDOM_MODES,
    COMMON_NEGATIVE,
    generateBatch,
    buildTxt,
    auditPromptForPremiumMakeupLiveRoom
  };
});
