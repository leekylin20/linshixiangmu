(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.BakeryPromptWorkbench = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  const WORKBENCH = "bakery-prompt-workbench";
  const TEMPLATE_NAME = "bakery_bread_video_master_unbranded_v01";

  const VARIABLES = {
    spaceDirections: {
      warm_bakery_store: "warm bakery storefront interior with cream walls, light wood shelves, arched openings, warm light strips, glass display cabinet, wood counter, woven baskets, baking trays, and bread display wall",
      handmade_bakery_workshop: "handmade bakery workshop with open back kitchen, brick oven, tray rack, flour bags, mixing counter, wooden worktable, fresh bread out of the oven, slight warm steam, and wheat decoration",
      french_bakery: "French bakery with cream white facade, arched glass door, awning, vintage wall lamps, wooden window frames, croissants, baguettes, toast, sweet bread, and small flowers",
      japanese_fresh_bakery: "Japanese fresh bakery with light wood, off-white wall, rounded shelves, neatly arranged small bread, transparent generic packaging, simple labels, soft natural light, and clean healing atmosphere",
      european_country_bakery: "European country bakery with red brick oven arch, dark wood shelves, wheat, woven baskets, stone wall, warm yellow pendant lamps, strong handmade bakery feeling",
      premium_dessert_bakery: "premium dessert bakery space with stone counter, glass cake display, cream gray wall, wave ceiling, subtle metal details, refined cakes, croissants, and dessert trays, luxurious but not exaggerated",
      bakery_storefront: "bakery storefront scene with exterior facade, arched door, display window, awning, warm light glowing from inside, small blackboard, flower box, small outdoor table, and foreground bread basket"
    },
    productFocus: ["吐司", "可颂", "法棍", "欧包", "贝果", "小餐包", "甜面包", "蛋糕甜品", "混合烘焙"],
    imageVersions: ["有人主播版", "无人空场版", "门店设计版", "前景产品版", "视频封面版"],
    colorMoods: {
      cream_light_wood: "cream white, light wood, caramel brown, appetizing warm bakery light",
      brick_warm_orange: "red brick, dark wood, warm orange-yellow bakery light",
      premium_cream_gray: "cream gray, champagne gold, refined dessert lighting",
      japanese_light_green: "light green plants, off-white wall, soft morning daylight",
      european_dark_wood: "vintage brown, wheat yellow, deep wood countryside bakery light",
      french_cream_white: "French cream white, light wood, warm orange interior light"
    },
    titleOptions: ["鲜烤面包专场", "今日现烤面包", "手作烘焙工坊", "慢烤面包时光", "面包店直播间", "新鲜出炉专场", "早餐面包专场", "烘焙好物专场", "门店现烤面包", "每日烘焙推荐"],
    subtitleOptions: ["新鲜现烤 多款可选", "慢火烘焙 香软好吃", "每日出炉 香气满满", "手作面包 用心烘焙", "早餐好搭配 全家都爱", "柔软细腻 麦香自然", "现烤现发 香气在线", "门店同款 直播推荐"],
    leftSignOptions: ["慢慢烘焙 用心生活", "每日现烤 香气满屋", "一口麦香 一份幸福", "早餐好味 从面包开始", "手作烘焙 温暖日常"],
    rightPoints: ["新鲜现烤", "柔软细腻", "手作匠心", "多款可选", "每日烘焙", "香气浓郁", "早餐好搭", "现货速发", "门店同款"],
    stickers: ["今日主推", "直播专享", "多款可选", "组合更划算", "现货速发", "早餐推荐", "门店同款"]
  };

  const BATCH_VARIABLES = {
    spaceDirections: ["温暖社区面包店", "手作烘焙工坊", "法式街角面包店", "日式清新烘焙店", "欧式乡村烘焙店", "高端甜品烘焙空间", "烘焙门前橱窗场景", "开放式后厨烘焙间", "亲子早餐面包店", "复古红砖烘焙店", "奶油风小面包屋", "自然植物系烘焙店", "商场烘焙专柜", "社区现烤吐司店", "精品面包集合店"],
    productOptions: ["吐司", "切片吐司", "可颂", "法棍", "欧包", "贝果", "奶香小餐包", "红豆面包", "肉松面包", "手撕面包", "菠萝包", "司康", "曲奇", "蛋挞", "蛋糕卷", "小蛋糕", "甜甜圈", "软欧包", "三明治", "早餐面包组合"],
    imageVersions: ["男店员直播讲解版", "女店员直播讲解版", "无人物空场版", "门店设计展示版", "前景产品强展示版", "烘焙工坊操作台版", "面包店门前橱窗版", "直播带货柜台版", "早餐组合推荐版", "手作现烤出炉版"],
    colorStyles: ["奶油白 + 浅木色 + 焦糖金", "米黄色 + 烤面包金 + 暖橙光", "红砖色 + 深木色 + 暖黄灯", "奶油灰 + 香槟金 + 高级甜品光", "浅绿植物 + 米白墙 + 自然晨光", "复古棕 + 麦穗黄 + 乡村烘焙光", "黑胡桃木 + 暖金灯带 + 精品店质感", "浅咖色 + 奶油拱门 + 柔和窗光", "杏仁白 + 原木色 + 清新日式光", "焦糖橙 + 米白墙 + 活力早餐感"],
    spaceElements: ["拱形门洞", "红砖烤炉", "开放式后厨", "玻璃展示柜", "木质货架", "藤编篮", "法棍篮", "烤盘架", "面粉袋", "麦穗装饰", "小黑板", "木质门头", "橱窗", "遮阳棚", "吊灯", "壁灯", "灯带", "波浪吊顶", "石材柜台", "木质操作台", "植物", "花束", "外摆小桌", "门口花箱", "面包陈列墙", "透明包装区", "纸袋包装区"],
    titles: ["鲜烤面包专场", "今日现烤面包", "手作烘焙工坊", "慢烤面包时光", "面包店直播间", "新鲜出炉专场", "早餐面包专场", "烘焙好物专场", "门店现烤面包", "每日烘焙推荐", "社区面包专场", "法式可颂专场", "吐司早餐专场", "手作欧包专场", "街角烘焙小店", "温暖面包小铺", "现烤贝果专场", "甜点烘焙专场", "乡村面包工坊", "小餐包推荐", "红砖烘焙时光", "奶油面包屋", "自然麦香专场", "精品面包集合", "亲子早餐面包", "门前面包橱窗", "暖光烘焙柜台", "每日现烤推荐", "手作吐司小店", "麦香早餐专场"],
    subtitles: ["新鲜现烤 多款可选", "慢火烘焙 香软好吃", "每日出炉 香气满满", "手作面包 用心烘焙", "早餐好搭配 全家都爱", "柔软细腻 麦香自然", "现烤现发 香气在线", "门店同款 直播推荐", "一口麦香 一份幸福", "慢烤时光 温暖日常", "暖光现烤 香气扑面", "多款面包 今日推荐", "麦香自然 早餐刚好", "手作现烤 新鲜可选", "门店好味 直播推荐", "可颂酥香 今日主推", "吐司柔软 早餐好搭", "欧包麦香 手作口感", "小餐包香软 家庭常备", "贝果扎实 多味可选", "甜点精致 下午茶搭", "红砖暖炉 新鲜出炉", "奶油浅木 温暖好拍", "自然清新 麦香满屋", "精品陈列 多款可选", "亲子早餐 轻松搭配", "橱窗暖光 香气在线", "柜台现烤 直播推荐", "每日新鲜 现货速发", "麦香早餐 全家都爱"],
    leftSigns: ["慢慢烘焙 用心生活", "每日现烤 香气满屋", "一口麦香 一份幸福", "早餐好味 从面包开始", "手作烘焙 温暖日常"],
    rightPoints: ["新鲜现烤", "柔软细腻", "手作匠心", "多款可选", "每日烘焙", "香气浓郁", "早餐好搭", "现货速发", "门店同款"],
    stickers: ["今日主推", "直播专享", "多款可选", "组合更划算", "现货速发", "早餐推荐", "门店同款"]
  };

  const NEGATIVE_PROMPT = "real brand, real logo, real trademark, real price, platform UI, shopping cart button, comment area, like icon, phone status bar, watermark, design company watermark, dense benefit area, full-screen promotion panel, empty room, ordinary restaurant rendering, no bakery products, wrong category, detail-page collage, flat poster, complex marketplace, messy full-wall shelves, dense small text, garbled text, deformed product package, floating bread, giant bread, plastic-looking bread, no crust texture, overly oily bread, burnt dirty bread, too many tabletop props, pasted host, host stealing product focus, multiple hosts, strong wide angle, strong top-down view, strong low-angle view, high camera angle, obvious overhead view, table top too visible, unclear product front, camera height above 140cm, broken perspective, table perspective conflicting with background, cold blue fog, sci-fi light streaks, heavy white mist, blurry title, warm wood color washed out, lower half overcrowded, complicated overlapping edges, difficult cutout, high retouching cost";
  const NEGATIVE_PROMPT_CN = "真实品牌、真实 LOGO、真实商标、真实价格、平台 UI、购物车按钮、评论区、点赞图标、手机状态栏、水印、设计公司水印、复杂福利区、满屏权益、空房间、普通餐厅效果图、无烘焙产品、错误品类、详情页拼贴、平面海报、复杂卖场、满墙杂乱货架、密集小字、乱码文字、产品包装变形、面包悬浮、面包巨物化、面包像塑料、表皮无纹理、过度油腻、焦黑脏污、桌面杂物过多、主播贴图感、主播抢产品、多人主播、强广角、强俯拍、强仰拍、高机位、明显俯拍、桌面上表面过大、产品正面不清楚、相机高度超过 140cm、透视混乱、桌台与背景透视冲突、顶部冷蓝雾层、科技感光带、厚重白雾、标题模糊、暖木色被冲淡、下半部分过满、复杂边缘交错、后期难抠图、修图成本高。";

  function pickDefault(list, index) {
    return list[index % list.length];
  }

  function generatePrompt(options) {
    const opts = {
      spaceDirection: "warm_bakery_store",
      productFocus: "混合烘焙",
      imageVersion: "有人主播版",
      colorMood: "cream_light_wood",
      title: "鲜烤面包专场",
      subtitle: "新鲜现烤 多款可选",
      leftSign: "每日现烤 香气满屋",
      ...options
    };

    const spaceDirection = VARIABLES.spaceDirections[opts.spaceDirection] || VARIABLES.spaceDirections.warm_bakery_store;
    const colorMood = VARIABLES.colorMoods[opts.colorMood] || VARIABLES.colorMoods.cream_light_wood;
    const hasPerson = opts.imageVersion !== "无人空场版";
    const productLine = productProducts(opts.productFocus);
    const personLine = hasPerson
      ? "Include one adult bakery clerk or livestream host in the middle zone, wearing a light shirt, apron, chef coat, or simple shop uniform. The person is natural, friendly, explaining bread with real selling gestures, not a fashion model, not over-retouched, not pasted into the scene, and not blocking the main products."
      : "No person in this version. Keep a complete ready-to-stream bakery space with foreground products, background shelves, warm store lighting, title area, and reusable table system. The image must not become an empty room.";
    const points = VARIABLES.rightPoints.slice(0, 3);
    const stickers = VARIABLES.stickers.slice(0, 3);

    const positivePrompt = [
      `Vertical 9:16 unbranded bakery bread shop video master image, 1080x1920px, for Douyin, Xiaohongshu, Video Channel, TikTok bakery short-video cover, livestream background, bakery store design display, and customer acquisition material. The image is a complete buildable bakery scene, ready for livestreaming and video shooting, not a simple rendering, not an ordinary restaurant, not a flat poster.`,
      "Use the uploaded bakery store or bread livestream reference only to extract space style, bakery product category, display method, main color system, lighting atmosphere, store structure, and recognizable bakery elements. Do not inherit any real brand, real logo, real trademark, real shop name, real platform UI, real price, or real packaging text.",
      "This is a generic unbranded bakery bread shop scene. Only generic bakery Chinese text may appear, such as 手作烘焙, 新鲜现烤, 每日出炉, 面包专场, 慢烤时光, 烘焙工坊, 多款可选, 现货速发. No real brand, no logo, no trademark, no price, no shopping button, no comment area, no livestream floating UI.",
      "Strict 1080x1920 vertical 9:16 safety layout: top 0-220px only ceiling, light strips, arches, pendant lamps, and warm atmosphere, no core text. Title area Y=260-460 has 1-2 large readable Chinese lines. Middle Y=500-1180 contains host or clerk, store depth, shelves, and bakery background. Product display area Y=900-1500 contains foreground bread, packaging, trays, baskets, and display table. Bottom Y=1600-1920 only table front panel, physical stickers, wood texture, and soft light, no core title or dense information. Keep 80-100px safe margins on both sides.",
      "Real front livestream or short-video camera view. Camera height about 120-135cm, close to seated host chest-to-shoulder height or natural clerk-behind-counter view. Full-frame equivalent 35-50mm lens, natural medium focal length, slight downward angle 2-4 degrees. The image feels like a customer standing in front of the bakery counter watching the clerk introduce bread. No high-angle overhead view, no strong wide-angle interior rendering. Table top visible around 25-40%. Counter, shelves, arches, oven, pendant lights, walls, bread trays, and foreground products share one consistent perspective system.",
      `Space direction: ${spaceDirection}. Color and light mood: ${colorMood}. Image version: ${opts.imageVersion}. Product focus: ${opts.productFocus}. The scene must first make space, storefront or interior structure, lighting, foreground bread, shelves, table, person or empty-ready livestream zone, perspective, and product landing points all work together.`,
      `Core bakery products: show 3-6 realistic bakery products, including ${productLine}. Products have real volume, real landing points, contact shadows, clear front-back layers, caramel color, golden baking marks, flaky layers, bread cracks, soft crumb texture, powdered sugar, sesame, and wheat decoration where suitable. Bread must not float, must not look like plastic, and must not become giant objects.`,
      "Foreground must include a reusable bakery display counter or wood table, not an ordinary empty table. Choose light wood counter, medium wood bakery worktable, cream rounded display table, stone dessert counter, vintage wood counter, or glass display cabinet front edge. The table is clean and layered, with 3-5 main foreground bread products and restrained props such as woven baskets, wooden trays, transparent generic bags, paper bread bags, dessert boxes, cake stand, cut toast, wheat, baking paper, wooden clips, bread knife, or cutting board.",
      personLine,
      `Top title area text: first line "${opts.title}", second line "${opts.subtitle}". Text is clear, readable, not garbled, and not covered by fog. Left small blackboard, wood sign, or hanging tag says "${opts.leftSign}". Right side has three short selling points: "${points[0]}", "${points[1]}", "${points[2]}". Bottom table front panel has 1-3 physical stickers: ${stickers.map((item) => `"${item}"`).join(", ")}. Stickers are attached to the table front with slight thickness, edge detail, and soft contact shadow, not floating UI.`,
      "Lighting is warm, clean, appetizing, and realistic. It highlights bread crust texture, product packaging, host face if present, and foreground table. Allow warm oven glow, shelf light strips, pendant lamps, and window daylight. Avoid blue-white cold fog, sci-fi light bands, overexposed strips, strong stage light, and fake filter look.",
      "Final image must be unbranded, no price, no platform UI, bakery category clear, realistic bakery space, clear livestream selling feeling, strong store design quality, prominent products, warm appetizing light, reusable foreground table, suitable for short-video cover, livestream background, bakery store design display, customer acquisition material, and suitable for later split into empty background layer, foreground bakery display layer, product layer, host or clerk layer, and top title layer."
    ].join("\n\n");

    const result = {
      workbench: WORKBENCH,
      templateName: TEMPLATE_NAME,
      positivePrompt,
      negativePrompt: NEGATIVE_PROMPT,
      options: opts
    };
    result.audit = auditPrompt(result);
    return result;
  }

  function generateBatchPrompts(count = 30) {
    const safeCount = Math.max(1, Math.min(30, Number(count) || 30));
    const items = Array.from({ length: safeCount }, (_, index) => buildBatchItem(index));
    return {
      workbench: WORKBENCH,
      templateName: "bakery_bread_video_master_batch_30_v01",
      mode: "auto_random_30_unbranded_bakery_video_master_prompts",
      count: items.length,
      items
    };
  }

  function generateBatchFromParameters(parameterList, options = {}) {
    const items = parameterList.map((raw, index) => {
      const params = normalizeBatchParameters(raw, index);
      const positivePrompt = buildBatchPositivePrompt(params);
      const promptObject = {
        promptId: raw.promptId || `bakery-optimized-${String(index + 1).padStart(2, "0")}`,
        schemeName: raw.schemeName || `${params.spaceDirection}｜${params.title}`,
        randomParameters: params,
        positivePrompt,
        negativePrompt: NEGATIVE_PROMPT_CN
      };
      promptObject.formattedText = formatBatchText(promptObject, index + 1);
      promptObject.audit = auditBatchPrompt(promptObject);
      return promptObject;
    });
    return {
      workbench: WORKBENCH,
      templateName: "bakery_bread_video_master_optimized_from_user_prompt_v01",
      mode: options.mode || "framework_review_optimized_txt",
      count: items.length,
      items
    };
  }

  function normalizeBatchParameters(raw, index) {
    const fallback = buildBatchParameters(index);
    return {
      spaceDirection: raw.spaceDirection || fallback.spaceDirection,
      productFocus: normalizeList(raw.productFocus, fallback.productFocus),
      imageVersion: raw.imageVersion || fallback.imageVersion,
      colorStyle: raw.colorStyle || fallback.colorStyle,
      spaceElements: normalizeList(raw.spaceElements, fallback.spaceElements),
      title: raw.title || fallback.title,
      subtitle: raw.subtitle || fallback.subtitle,
      leftSign: raw.leftSign || fallback.leftSign,
      rightPoints: normalizeList(raw.rightPoints, fallback.rightPoints).slice(0, 3),
      stickers: normalizeList(raw.stickers, fallback.stickers).slice(0, 3)
    };
  }

  function normalizeList(value, fallback) {
    if (Array.isArray(value) && value.length) return value.map((item) => String(item).trim()).filter(Boolean);
    if (typeof value === "string" && value.trim()) {
      return value.split(/[、,，]/).map((item) => item.trim()).filter(Boolean);
    }
    return fallback;
  }

  function buildBatchItem(index) {
    const params = buildBatchParameters(index);
    const positivePrompt = buildBatchPositivePrompt(params);
    const promptObject = {
      promptId: `bakery-batch-${String(index + 1).padStart(2, "0")}`,
      schemeName: `${params.spaceDirection}｜${params.title}`,
      randomParameters: params,
      positivePrompt,
      negativePrompt: NEGATIVE_PROMPT_CN
    };
    promptObject.formattedText = formatBatchText(promptObject, index + 1);
    promptObject.audit = auditBatchPrompt(promptObject);
    return promptObject;
  }

  function buildBatchParameters(index) {
    const productCount = 3 + (index % 4);
    const elementCount = 4 + (index % 5);
    return {
      spaceDirection: pickByStep(BATCH_VARIABLES.spaceDirections, index, 1),
      productFocus: pickMany(BATCH_VARIABLES.productOptions, index * 2, productCount, 3),
      imageVersion: pickByStep(BATCH_VARIABLES.imageVersions, index, 3),
      colorStyle: pickByStep(BATCH_VARIABLES.colorStyles, index, 7),
      spaceElements: pickMany(BATCH_VARIABLES.spaceElements, index * 4, elementCount, 5),
      title: BATCH_VARIABLES.titles[index % BATCH_VARIABLES.titles.length],
      subtitle: BATCH_VARIABLES.subtitles[index % BATCH_VARIABLES.subtitles.length],
      leftSign: pickByStep(BATCH_VARIABLES.leftSigns, index, 2),
      rightPoints: pickMany(BATCH_VARIABLES.rightPoints, index, 3, 2),
      stickers: pickMany(BATCH_VARIABLES.stickers, index, 3, 2)
    };
  }

  function buildBatchPositivePrompt(params) {
    const personRule = params.imageVersion.includes("无人物")
      ? "画面中部按无人物空场版处理，保留完整可开播空间，前景产品、背景货架、门店灯光、标题区和桌台仍然成立，画面不能变成空房间。"
      : "画面中部根据画面版本安排一位成年烘焙店员或主播，穿浅色衬衫、围裙、厨师服或简洁门店制服，表情亲和自然，有真实直播讲解感，手势可以展示面包、拿起包装或指向产品。人物不能遮挡主产品，不能像写真模特或贴图人物。";
    return [
      "生成一张竖版 9:16 烘焙类视频母版图，画幅 1080×1920px。画面为无品牌通用烘焙面包店场景，不出现真实品牌、真实 LOGO、真实商标、真实价格和平台 UI。每一份都是独立烘焙场景图，不是九宫格，不是合集图，不是拼贴排版，不是样机图，不是设计板，不是 PPT 页面。",
      `画面空间为「${params.spaceDirection}」，整体采用「${params.colorStyle}」。场景中包含「${params.spaceElements.join("、")}」，形成真实可落地的烘焙门店空间。画面必须有真实房间纵深、统一一点透视、自然前置直播机位和完整可开播的商业氛围。`,
      `顶部标题区显示两行清晰中文文字：第一行「${params.title}」，第二行「${params.subtitle}」。顶部 0-220px 只保留吊顶、灯带、拱形结构、吊灯、暖光氛围，不放核心文字。标题区 Y=260-460，清楚可读，不乱码。左右各预留 80-100px 安全区，不要让重要文字和主产品贴边。`,
      `${personRule} 画面版本为「${params.imageVersion}」。中部 Y=500-1180 放人物或可开播空间、门店纵深、货架和烘焙背景。`,
      `前景为可复用烘焙展示柜台或木质桌台，桌台有真实厚度、前挡板、接触阴影和柔和高光。桌面干净、宽阔、稳定，中央预留产品主陈列区。产品陈列区 Y=900-1500，桌面上摆放「${params.productFocus.join("、")}」，产品有真实体积、真实烘焙纹理、真实落点和前后层次。面包表皮要有焦糖色、金黄烤痕、酥皮层次、柔软组织、麦香质感。可以加入藤编篮、木托盘、透明包装袋、纸袋、纸盒、烘焙纸、麦穗、餐刀、砧板等少量辅助道具，但不能堆满桌面。`,
      `右侧设置 3 条短卖点，每条不超过 6 个字：「${params.rightPoints[0]}」「${params.rightPoints[1]}」「${params.rightPoints[2]}」。左侧设置小黑板或木牌，写「${params.leftSign}」。底部 Y=1600-1920 只放桌台前挡板、木质纹理、柔光收尾和 1-3 个实体贴画：「${params.stickers.join("」「")}」。贴画必须像贴在桌台前面的实体贴纸，有厚度、边缘和轻投影，不能像悬浮 UI。`,
      "画面采用真实前置直播/短视频机位，摄像机高度约 120-135cm，接近坐播主播胸口到肩部高度，或顾客站在柜台前看店员介绍产品的自然视角。镜头为全画幅等效 35-50mm，自然中焦段，轻微下俯 2-4°。桌面上表面可见比例控制在 25%-40%。禁止高机位俯拍、广角畸变和空间效果图视角。桌台、货架、拱门、砖炉、吊灯、墙面必须统一到同一套一点透视系统。",
      "最终画面必须无品牌、无价格、无平台 UI；面包品类清楚；烘焙空间真实；直播成交感明确；门店设计感强；产品突出；灯光温暖有食欲；前景桌台可复用；适合短视频封面、直播背景、烘焙门店设计展示和获客素材；适合后续拆成空背景层、前景桌台层、产品层、主播/店员层和顶部标题层。"
    ].join("\n\n");
  }

  function formatBatchText(item, number) {
    const p = item.randomParameters;
    return [
      `【第 ${number} 份｜${item.schemeName}】`,
      "",
      "【随机参数】",
      `空间方向：${p.spaceDirection}`,
      `产品重点：${p.productFocus.join("、")}`,
      `画面版本：${p.imageVersion}`,
      `色调风格：${p.colorStyle}`,
      `空间元素：${p.spaceElements.join("、")}`,
      `标题：${p.title}`,
      `副标题：${p.subtitle}`,
      "",
      "【生图提示词】",
      item.positivePrompt,
      "",
      "【负面提示词】",
      item.negativePrompt
    ].join("\n");
  }

  function auditBatchPrompt(promptObject) {
    const positive = promptObject.positivePrompt;
    const negative = promptObject.negativePrompt;
    const audit = {
      independentImagePass: includesAllRaw(positive, ["独立烘焙场景图", "不是九宫格", "不是合集图", "不是拼贴排版"]),
      unbrandedPass: includesAllRaw(positive, ["无品牌", "不出现真实品牌", "真实 LOGO", "真实商标", "真实价格", "平台 UI"]),
      safeAreaPass: includesAllRaw(positive, ["1080×1920px", "顶部 0-220px", "标题区 Y=260-460", "左右各预留 80-100px", "底部 Y=1600-1920"]),
      cameraPerspectivePass: includesAllRaw(positive, ["摄像机高度约 120-135cm", "35-50mm", "轻微下俯 2-4", "25%-40%", "一点透视系统"]),
      productDisplayPass: includesAllRaw(positive, ["产品陈列区 Y=900-1500", "真实体积", "真实烘焙纹理", "真实落点", "前后层次"]),
      tablePass: includesAllRaw(positive, ["可复用烘焙展示柜台", "真实厚度", "前挡板", "接触阴影"]),
      textAndStickerPass: includesAllRaw(positive, ["右侧设置 3 条短卖点", "左侧设置小黑板或木牌", "实体贴画", "不能像悬浮 UI"]),
      layerFriendlyPass: includesAllRaw(positive, ["空背景层", "前景桌台层", "产品层", "顶部标题层"]),
      negativePromptPass: includesAllRaw(negative, ["真实品牌", "真实 LOGO", "真实价格", "平台 UI", "九宫格"]) || includesAllRaw(negative, ["真实品牌", "真实 LOGO", "真实价格", "平台 UI", "平面海报"]),
      notes: []
    };
    const failed = Object.entries(audit)
      .filter(([key, value]) => key !== "notes" && value !== true)
      .map(([key]) => key);
    audit.status = failed.length ? "fail" : "pass";
    if (failed.length) audit.notes.push(`Failed checks: ${failed.join(", ")}`);
    return audit;
  }

  function productProducts(focus) {
    const mixed = "toast, sliced toast, croissant, baguette, rustic bread, bagel, floss bread, red bean bread, milk dinner roll, pull-apart bread, pineapple bun, donut, cake roll, scone, soft European bread, cookies, egg tart, and small cake";
    if (!focus || focus === "混合烘焙") return mixed;
    return `${focus}, plus 2-5 matching bakery products from toast, croissant, baguette, rustic bread, bagel, dinner roll, sweet bread, cookies, egg tart, and small cake`;
  }

  function auditPrompt(promptObject) {
    const positive = promptObject.positivePrompt.toLowerCase();
    const negative = promptObject.negativePrompt.toLowerCase();
    const audit = {
      unbrandedPass: includesAll(positive, ["unbranded", "no real brand", "no logo", "no trademark", "no price", "no platform ui"]),
      safeAreaPass: includesAll(positive, ["1080x1920", "vertical 9:16", "top 0-220px", "title area y=260-460", "product display area y=900-1500", "80-100px safe margins"]),
      cameraPerspectivePass: includesAll(positive, ["camera height about 120-135cm", "35-50mm lens", "slight downward angle 2-4 degrees", "table top visible around 25-40%", "consistent perspective system"]),
      bakeryProductPass: includesAll(positive, ["show 3-6 realistic bakery products", "real landing points", "contact shadows", "bread crust texture"]),
      foregroundTablePass: includesAll(positive, ["foreground must include a reusable bakery display counter or wood table", "3-5 main foreground bread products"]),
      personOrEmptyRoomPass: positive.includes("one adult bakery clerk") || positive.includes("no person in this version"),
      textPass: includesAll(positive, ["top title area text", "left small blackboard", "right side has three short selling points", "physical stickers"]),
      lightingPass: includesAll(positive, ["warm, clean, appetizing", "avoid blue-white cold fog"]),
      layerFriendlyPass: includesAll(positive, ["later split into empty background layer", "foreground bakery display layer", "product layer", "top title layer"]),
      negativePromptPass: includesAll(negative, ["real brand", "real logo", "real price", "platform ui", "ordinary restaurant rendering", "flat poster", "floating bread", "strong top-down view", "difficult cutout"]),
      notes: []
    };
    const failed = Object.entries(audit)
      .filter(([key, value]) => key !== "notes" && value !== true)
      .map(([key]) => key);
    audit.status = failed.length ? "fail" : "pass";
    if (failed.length) audit.notes.push(`Failed checks: ${failed.join(", ")}`);
    return audit;
  }

  function includesAll(text, terms) {
    return terms.every((term) => text.includes(term.toLowerCase()));
  }

  function includesAllRaw(text, terms) {
    return terms.every((term) => text.includes(term));
  }

  function pickByStep(list, index, step) {
    return list[(index * step) % list.length];
  }

  function pickMany(list, start, count, step = 1) {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push(list[(start + i * step) % list.length]);
    }
    return items;
  }

  return {
    WORKBENCH,
    TEMPLATE_NAME,
    VARIABLES,
    BATCH_VARIABLES,
    NEGATIVE_PROMPT,
    NEGATIVE_PROMPT_CN,
    generatePrompt,
    generateBatchPrompts,
    generateBatchFromParameters,
    auditPrompt
  };
});
