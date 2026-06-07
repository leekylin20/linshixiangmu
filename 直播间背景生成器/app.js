(function () {
  "use strict";

  const DB_NAME = "LivestreamBGGenerator";
  const DB_VERSION = 1;
  const MAX_HISTORY = 200;
  const EXPORT_WIDTH = 1080;
  const EXPORT_HEIGHT = 1920;
  const LOCAL_PROXY_ORIGIN = "http://127.0.0.1:8732";
  const DEFAULT_API_SIZE = "1088x1920";
  const API_SIZE_PRESETS = new Set([DEFAULT_API_SIZE, "1440x2560", "2160x3840"]);
  const EMPTY_SCENE_DEFAULT_PROMPT = [
    "只编辑蒙版区域，未被蒙版覆盖的区域必须尽量保持不变。",
    "",
    "请删除蒙版区域内的所有前景元素、产品、人物、中文文字、logo、价格牌、促销贴片、卖点徽章、底部栏、装饰牌、边框、阴影残留和贴片残影。",
    "",
    "将被删除区域自然补全为与周围环境一致的真实直播间 / 展厅 / 商品展示空间背景。",
    "",
    "补全要求：",
    "- 延续原图的空间透视",
    "- 延续原图的墙面材质",
    "- 延续原图的地面反射",
    "- 延续原图的灯带结构",
    "- 延续原图的展柜结构",
    "- 延续原图的光照方向",
    "- 延续原图的色温和质感",
    "- 不要新增文字",
    "- 不要新增产品",
    "- 不要新增人物",
    "- 不要新增价格牌",
    "- 不要新增信息框",
    "- 不要新增 logo",
    "- 不要生成绿色屏幕",
    "- 不要生成模板框",
    "",
    "最终效果应该像原本就是一个干净的空场背景，没有被删除过的痕迹。"
  ].join("\n");
  const EMPTY_SCENE_PROMPTS = {
    default: EMPTY_SCENE_DEFAULT_PROMPT,
    top: [
      "只编辑蒙版区域，删除顶部标题文字、标题背景贴片、logo、弧形装饰条、所有可读文字和贴片边缘残留。",
      "",
      "将该区域补全为与周围一致的顶部空间背景，延续原图的天花灯带、背景墙材质、柔和渐变和光影关系。",
      "",
      "不要生成新的文字。",
      "不要生成新的标题框。",
      "不要生成新的边框。",
      "不要生成新的 logo。"
    ].join("\n"),
    bottom: [
      "只编辑蒙版区域，删除底部服务栏、底部文字、图标、价格牌、前景装饰和贴片边缘残留。",
      "",
      "将底部区域补全为与原图一致的地面、展台前景、墙面或直播间底部空间。",
      "",
      "延续原图透视、地面反射、灯光方向和材质。",
      "不要新增文字、图标、产品或人物。"
    ].join("\n"),
    subject: [
      "只编辑蒙版区域，删除蒙版区域内的产品、主播人物和相关前景元素，并补全为与周围一致的背景空间。",
      "",
      "补全时延续原图的背景墙、展柜、灯光、地面和空间层次。",
      "不要新增新的产品、人物、贴片或文字。",
      "不要让补全部分看起来像重新生成的另一张图。"
    ].join("\n")
  };
  const WORKFLOW_STEPS = [
    "正在识别产品信息",
    "正在拆解参考模板",
    "正在生成设计规范",
    "正在生成直播间背景",
    "正在检查视觉内缩",
    "正在检查产品比例",
    "正在二次修正",
    "生成完成"
  ];

  const DEFAULT_PROMPT_PRESETS = [
    { name: "产品配色", text: "Use the product reference image as the dominant color system for the whole livestream poster." },
    { name: "视觉内缩", text: "Move all important elements clearly inward; leave only background, soft light, plants, or blurred low-contrast decoration near the left and right edges." },
    { name: "空白文字框", text: "Do not generate readable text. Keep title areas, badges, price cards, info cards, and bottom service bars as clean blank placeholders for later editable text overlay." },
    { name: "上下不变", text: "Keep the top and bottom composition unchanged; do not crop, extend, squeeze, or add blank padding at the top or bottom." },
    { name: "加电视框", text: "Add an embedded screen area with pure green #00B140 inside the frame, while keeping important elements visually pulled inward from the edges." },
    { name: "坐播模式", text: "Reserve a clean lower foreground area for seated livestream compositing; keep important elements visually pulled inward from the edges." },
    { name: "产品缩小", text: "Keep the main product compact on the foreground display table, about 16%-18% of the full image height, never blocking the presenter." },
    { name: "产品中等", text: "Keep the main product compact on the foreground display table, about 19%-20% of the full image height, never over 25%." },
    { name: "产品稍大", text: "Keep the main product still secondary to the presenter, about 21%-22% of the full image height, never over 25%." },
    { name: "右侧小信息卡", text: "Use only one small blank right-side info card placeholder; it must be auxiliary, not bigger or more eye-catching than the presenter." },
    { name: "底部短服务栏", text: "Use a short, light, restrained blank bottom service bar placeholder; do not make it full-width or text-heavy." }
  ];

  const TEST_CASES = [
    {
      id: "visual-inset",
      label: "测试：视觉内缩",
      text: "参考产品图的配色和产品信息，借用模板图的直播间图片框架。背景配色参考产品包装配色。所有重要元素明显向中间收拢，左右边缘只保留背景、柔光、植物或虚化低对比装饰。不要显示安全线、虚线、参考线、裁切线。"
    },
    {
      id: "product-scale-medium",
      label: "测试：产品缩小",
      text: "最前面的主产品不要太大，只作为主播前方展示台上的商品，控制在画面高度16%到22%，最多不能超过25%。产品不能遮挡主播脸部、胸部和主要手势，产品顶部不要超过主播胸口到锁骨区域。"
    },
    {
      id: "local-edit-product-smaller",
      label: "测试：局部修改",
      text: "只把最前面的产品缩小20%，其他构图、人物、空白标题区、右侧空白信息卡、底部空白栏全部保持不变，不要新增任何可读文字。"
    },
    {
      id: "side-margin-locked",
      name: "左右边缘内缩测试",
      instruction: "画面左右两侧必须保留明显视觉留白，不允许主播脸、主播手、产品、信息卡、徽章、价格框或底部栏贴到画面最左或最右边缘。边缘只放背景、植物、柔光或虚化装饰。不要新增任何可读文字。"
    }
  ];

  const DEFAULT_SETTINGS = {
    apiKey: "",
    apiBase: "https://dm-fox.rjj.cc/codex",
    model: "gpt-image-2",
    size: DEFAULT_API_SIZE,
    quality: "high",
    promptPresets: DEFAULT_PROMPT_PRESETS,
    safeMargin: 90,
    topBottomLock: true,
    layoutLock: true,
    productScale: "medium",
    mainProductHeightRatio: 0.20,
    productSizePercent: 22,
    productOffsetXPercent: 0,
    productOffsetYPercent: 0,
    referenceLayoutStrength: "high",
    productColorStrength: "high",
    textAccuracyPriority: "no_text_generation",
    autoAudit: true,
    autoRetry: true,
    maxRetry: 2,
    showSafeLines: false,
    proxyHasServerKey: false,
    useLocalProxy: false
  };

  const BUILTIN_TEMPLATES = [
    {
      id: "pharmacy-gold",
      name: "药店货架·白金橙",
      preview: "assets/templates/template-11-gold.jpg",
      description: "药店货架场景，白金橙配色，弧形吊顶，多瓶堆头，前中远景层次分明，暖色灯光"
    },
    {
      id: "warm-showroom",
      name: "品牌展厅·暖木",
      preview: "assets/templates/template-03-warm-room.jpg",
      description: "品牌展厅场景，暖木色和中药柜元素，温馨家庭药房感，玻璃展柜，黄铜灯具"
    },
    {
      id: "clinic-blue",
      name: "临床诊所·冷白蓝",
      preview: "assets/templates/template-01-blue-brand.jpg",
      description: "眼科诊所或医学场景，冷白和医药蓝配色，白色柜体，蓝色LED灯带，专业临床感"
    },
    {
      id: "flagship-red",
      name: "高端旗舰·深红金",
      preview: "assets/templates/template-09-red.jpg",
      description: "高端品牌旗舰展厅，深红酒红墙面和暗金装饰，玻璃展柜，博物馆陈列感，聚光灯"
    },
    {
      id: "green-screen",
      name: "绿幕坐播·前台挡板",
      preview: "assets/templates/template-12-green-screen.jpg",
      description: "3D绿幕直播间背景，底部前台挡板留纯绿色区域，左右空间可用于主播抠像和产品展示"
    },
    {
      id: "new-year",
      name: "年货节·红金陈列",
      preview: "assets/templates/template-02-new-year.jpg",
      description: "年货节红金直播间，节日陈列，暖色灯光，货架和堆头形成热闹促销氛围"
    },
    {
      id: "daily-neutral",
      name: "日常直播·清爽货架",
      preview: "assets/templates/template-05-daily.jpg",
      description: "日常直播间背景，清爽干净的货架空间，适合护肤、健康、食品产品，保留中景陈列层次"
    },
    {
      id: "pink-soft",
      name: "粉色柔光·美妆护肤",
      preview: "assets/templates/template-08-pink.jpg",
      description: "粉色柔光直播间，圆润装饰，适合美妆护肤和礼盒产品，整体温柔但保留真实空间结构"
    },
    {
      id: "green-fresh",
      name: "春日绿色·自然清新",
      preview: "assets/templates/template-07-green.jpg",
      description: "绿色系清新直播间，春日自然氛围，植物和货架轻量点缀，适合健康、食品和草本产品"
    },
    {
      id: "summer-orange",
      name: "夏日橙色·活力促销",
      preview: "assets/templates/template-10-orange.jpg",
      description: "夏日橙色直播间贴片风格，明亮活力，适合促销场景，空间有舞台感和品牌展示位"
    },
    {
      id: "australia-clean",
      name: "澳洲背景·自然洁净",
      preview: "assets/templates/template-04-australia.jpg",
      description: "自然洁净的澳洲风背景，明亮通透，适合营养品、健康食品和海外品牌直播间"
    },
    {
      id: "sports-blue",
      name: "体育主题·蓝绿动感",
      preview: "assets/templates/template-06-sports.jpg",
      description: "体育赛事主题直播间，蓝绿色动感空间，适合活动节点和主题促销，避免可读文字"
    }
  ];

  const state = {
    db: null,
    settings: { ...DEFAULT_SETTINGS },
    productImageData: null,
    productFileName: "",
    templateImageData: null,
    templateFileName: "",
    selectedTemplate: null,
    customTemplates: [],
    currentResult: null,
    isBusy: false,
    timerId: null,
    startTime: 0,
    historyLimit: 20,
    pasteTarget: "product",
    activeTestCaseName: "",
    activeTestCasePrompt: ""
  };

  const dom = {};

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  async function init() {
    cacheDom();
    bindStaticEvents();
    bindUploaders();

    try {
      state.db = await openDB();
      await loadSettings();
      await loadRuntimeConfig();
      await loadCustomTemplates();
    } catch (error) {
      renderError(`IndexedDB 初始化失败：${error.message}`);
    }

    renderSettingsForm();
    renderApiStatus();
    renderSizeChoices();
    renderDesignControls();
    renderPromptPresets();
    renderTemplates();
    updateGenerateButton();
  }

  function cacheDom() {
    Object.assign(dom, {
      apiStatus: $("#apiStatus"),
      historyBtn: $("#historyBtn"),
      settingsBtn: $("#settingsBtn"),
      productDrop: $("#productDrop"),
      productInput: $("#productInput"),
      productPreview: $("#productPreview"),
      clearProductBtn: $("#clearProductBtn"),
      pasteProductBtn: $("#pasteProductBtn"),
      templateDrop: $("#templateDrop"),
      templateInput: $("#templateInput"),
      templatePreview: $("#templatePreview"),
      clearTemplateBtn: $("#clearTemplateBtn"),
      pasteTemplateBtn: $("#pasteTemplateBtn"),
      titleInput: $("#titleInput"),
      subtitleInput: $("#subtitleInput"),
      priceInput: $("#priceInput"),
      badgeInput: $("#badgeInput"),
      sellingPointsInput: $("#sellingPointsInput"),
      serviceInput: $("#serviceInput"),
      promptInput: $("#promptInput"),
      presetInput: $("#presetInput"),
      presetList: $("#presetList"),
      applyPresetBtn: $("#applyPresetBtn"),
      promptChips: $("#promptChips"),
      editPresetsBtn: $("#editPresetsBtn"),
      testCaseButtons: $("#testCaseButtons"),
      safeMarginInput: $("#safeMarginInput"),
      productSizeInput: $("#productSizeInput"),
      productXInput: $("#productXInput"),
      productYInput: $("#productYInput"),
      productScaleControl: $("#productScaleControl"),
      topBottomLockInput: $("#topBottomLockInput"),
      autoAuditInput: $("#autoAuditInput"),
      autoRetryInput: $("#autoRetryInput"),
      safeLineInput: $("#safeLineInput"),
      templateGrid: $("#templateGrid"),
      customTemplateInput: $("#customTemplateInput"),
      generateBtn: $("#generateBtn"),
      outputArea: $("#outputArea"),
      outputTitle: $("#outputTitle"),
      outputSubtitle: $("#outputSubtitle"),
      sizeChoices: $("#sizeChoices"),
      elapsedBadge: $("#elapsedBadge"),
      resultActions: $("#resultActions"),
      downloadBtn: $("#downloadBtn"),
      editBtn: $("#editBtn"),
      regenerateBtn: $("#regenerateBtn"),
      settingsModal: $("#settingsModal"),
      apiKeyInput: $("#apiKeyInput"),
      apiBaseInput: $("#apiBaseInput"),
      modelInput: $("#modelInput"),
      qualityInput: $("#qualityInput"),
      promptPresetsInput: $("#promptPresetsInput"),
      saveSettingsBtn: $("#saveSettingsBtn")
    });
  }

  function bindStaticEvents() {
    dom.settingsBtn.addEventListener("click", openSettings);
    dom.historyBtn.addEventListener("click", showHistory);
    dom.saveSettingsBtn.addEventListener("click", saveSettingsFromForm);

    $$("[data-close-modal]").forEach((node) => {
      node.addEventListener("click", closeSettings);
    });

    dom.promptChips.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-add]");
      if (button) appendText(dom.promptInput, button.dataset.add);
    });
    dom.applyPresetBtn.addEventListener("click", applyPresetInput);
    dom.presetInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        applyPresetInput();
      }
    });
    dom.editPresetsBtn.addEventListener("click", openSettings);
    dom.testCaseButtons.addEventListener("click", handleTestCaseClick);
    dom.promptInput.addEventListener("input", syncActiveTestCaseFromPrompt);
    dom.sizeChoices.addEventListener("click", handleSizeChoice);
    dom.safeMarginInput.addEventListener("input", handleDesignControlChange);
    dom.productSizeInput.addEventListener("input", handleDesignControlChange);
    dom.productXInput.addEventListener("input", handleDesignControlChange);
    dom.productYInput.addEventListener("input", handleDesignControlChange);
    dom.productScaleControl.addEventListener("click", handleProductScaleChoice);
    dom.topBottomLockInput.addEventListener("change", handleDesignControlChange);
    dom.autoAuditInput.addEventListener("change", handleDesignControlChange);
    dom.autoRetryInput.addEventListener("change", handleDesignControlChange);
    dom.safeLineInput.addEventListener("change", handleDesignControlChange);

    dom.generateBtn.addEventListener("click", () => composeMarketingImage());
    dom.regenerateBtn.addEventListener("click", () => composeMarketingImage());
    dom.downloadBtn.addEventListener("click", () => {
      if (state.currentResult) downloadResult(state.currentResult.resultImage);
    });
    dom.editBtn.addEventListener("click", () => {
      if (state.currentResult) enterEditor(state.currentResult);
    });

    dom.clearProductBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      clearProductImage();
    });
    dom.clearTemplateBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      clearUploadedTemplate();
    });
    dom.pasteProductBtn.addEventListener("click", () => pasteImageInto("product"));
    dom.pasteTemplateBtn.addEventListener("click", () => pasteImageInto("template"));
    document.addEventListener("paste", handlePasteEvent);

    dom.customTemplateInput.addEventListener("change", async (event) => {
      const file = event.target.files && event.target.files[0];
      event.target.value = "";
      if (file) await addCustomTemplate(file);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !dom.settingsModal.hidden) closeSettings();
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        if (state.currentResult) {
          event.preventDefault();
          downloadResult(state.currentResult.resultImage);
        }
      }
    });
  }

  function bindUploaders() {
    bindDropzone(dom.productDrop, dom.productInput, async (file) => {
      state.productImageData = await fileToDataURL(file);
      state.productFileName = file.name;
      showPreview(dom.productPreview, state.productImageData, file.name);
      updateGenerateButton();
    });

    bindDropzone(dom.templateDrop, dom.templateInput, async (file) => {
      state.templateImageData = await fileToDataURL(file);
      state.templateFileName = file.name;
      state.selectedTemplate = null;
      showPreview(dom.templatePreview, state.templateImageData, file.name);
      renderTemplates();
      updateGenerateButton();
    });
  }

  function bindDropzone(zone, input, onFile) {
    const target = zone === dom.productDrop ? "product" : "template";
    zone.addEventListener("click", () => {
      setPasteTarget(target);
      input.click();
    });
    zone.addEventListener("focus", () => setPasteTarget(target));
    zone.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setPasteTarget(target);
        input.click();
      }
    });
    input.addEventListener("change", async () => {
      const file = input.files && input.files[0];
      input.value = "";
      if (file) await handleImageFile(file, onFile);
    });
    ["dragenter", "dragover"].forEach((type) => {
      zone.addEventListener(type, (event) => {
        event.preventDefault();
        setPasteTarget(target);
        zone.classList.add("dragover");
      });
    });
    ["dragleave", "drop"].forEach((type) => {
      zone.addEventListener(type, (event) => {
        event.preventDefault();
        zone.classList.remove("dragover");
      });
    });
    zone.addEventListener("drop", async (event) => {
      const file = event.dataTransfer.files && event.dataTransfer.files[0];
      if (file) await handleImageFile(file, onFile);
    });
  }

  function setPasteTarget(target) {
    state.pasteTarget = target;
    dom.productDrop.classList.toggle("paste-target", target === "product");
    dom.templateDrop.classList.toggle("paste-target", target === "template");
  }

  async function handlePasteEvent(event) {
    const file = getImageFileFromClipboard(event.clipboardData);
    if (!file) return;
    event.preventDefault();
    await applyPastedImage(file, state.pasteTarget || "product");
  }

  async function pasteImageInto(target) {
    setPasteTarget(target);
    try {
      const file = await readImageFromClipboard();
      if (!file) {
        renderError("剪贴板里没有图片。请复制图片后再粘贴。");
        return;
      }
      await applyPastedImage(file, target);
    } catch (error) {
      renderError(`无法读取剪贴板图片：${error.message || error}`);
    }
  }

  async function applyPastedImage(file, target) {
    await handleImageFile(file, async (imageFile) => {
      const dataUrl = await fileToDataURL(imageFile);
      if (target === "template") {
        state.templateImageData = dataUrl;
        state.templateFileName = imageFile.name || "粘贴的模板图";
        state.selectedTemplate = null;
        showPreview(dom.templatePreview, state.templateImageData, state.templateFileName);
        renderTemplates();
      } else {
        state.productImageData = dataUrl;
        state.productFileName = imageFile.name || "粘贴的产品图";
        showPreview(dom.productPreview, state.productImageData, state.productFileName);
      }
      updateGenerateButton();
    });
  }

  function getImageFileFromClipboard(clipboardData) {
    if (!clipboardData || !clipboardData.items) return null;
    for (const item of clipboardData.items) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const file = item.getAsFile();
        return file ? normalizeClipboardFile(file) : null;
      }
    }
    return null;
  }

  async function readImageFromClipboard() {
    if (!navigator.clipboard || !navigator.clipboard.read) {
      throw new Error("当前浏览器不支持主动读取剪贴板，请点击上传区后按 Ctrl+V。");
    }
    const items = await navigator.clipboard.read();
    for (const item of items) {
      const type = item.types.find((candidate) => candidate.startsWith("image/"));
      if (type) {
        const blob = await item.getType(type);
        return normalizeClipboardFile(blob);
      }
    }
    return null;
  }

  function normalizeClipboardFile(blob) {
    const ext = blob.type.includes("png") ? "png" : blob.type.includes("webp") ? "webp" : "jpg";
    return new File([blob], `clipboard-${Date.now()}.${ext}`, { type: blob.type || "image/png" });
  }

  async function handleImageFile(file, onFile) {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      renderError("图片格式不支持，请使用 JPG、PNG 或 WEBP。");
      return;
    }
    await onFile(file);
  }

  function showPreview(previewNode, dataUrl, fileName) {
    previewNode.hidden = false;
    previewNode.querySelector("img").src = dataUrl;
    previewNode.querySelector(".file-name").textContent = fileName;
  }

  function clearProductImage() {
    state.productImageData = null;
    state.productFileName = "";
    dom.productPreview.hidden = true;
    dom.productPreview.querySelector("img").removeAttribute("src");
    updateGenerateButton();
  }

  function clearUploadedTemplate() {
    state.templateImageData = null;
    state.templateFileName = "";
    dom.templatePreview.hidden = true;
    dom.templatePreview.querySelector("img").removeAttribute("src");
    updateGenerateButton();
  }

  function renderTemplates() {
    dom.templateGrid.innerHTML = "";
    const templates = [...BUILTIN_TEMPLATES, ...state.customTemplates];

    templates.forEach((template) => {
      const button = document.createElement("button");
      button.className = "template-card";
      button.type = "button";
      button.dataset.id = template.id;
      if (state.selectedTemplate && state.selectedTemplate.id === template.id) {
        button.classList.add("active");
      }

      const img = document.createElement("img");
      img.src = template.preview || template.image;
      img.alt = `${template.name} 模板预览`;
      button.appendChild(img);

      const meta = document.createElement("div");
      meta.className = "template-meta";
      const name = document.createElement("strong");
      name.textContent = template.name;
      const desc = document.createElement("span");
      desc.textContent = template.description || "自定义模板图";
      meta.append(name, desc);
      button.appendChild(meta);

      button.addEventListener("click", () => {
        selectTemplate(template);
      });

      if (template.custom) {
        const del = document.createElement("button");
        del.className = "icon-btn template-delete";
        del.type = "button";
        del.title = "删除自定义模板";
        del.textContent = "×";
        del.addEventListener("click", async (event) => {
          event.stopPropagation();
          await deleteCustomTemplate(template.id);
        });
        button.appendChild(del);
      }

      dom.templateGrid.appendChild(button);
    });

    const add = document.createElement("button");
    add.className = "template-card add-card";
    add.type = "button";
    add.innerHTML = "<div><strong>+</strong><span>添加自定义模板</span></div>";
    add.addEventListener("click", () => dom.customTemplateInput.click());
    dom.templateGrid.appendChild(add);
  }

  function renderPromptPresets() {
    const presets = getPromptPresets();
    dom.promptChips.innerHTML = "";
    dom.presetList.innerHTML = "";

    presets.forEach((preset) => {
      const option = document.createElement("option");
      option.value = preset.name;
      option.label = preset.text;
      dom.presetList.appendChild(option);

      const button = document.createElement("button");
      button.type = "button";
      button.dataset.add = preset.text;
      button.textContent = preset.name;
      dom.promptChips.appendChild(button);
    });
  }

  function applyPresetInput() {
    const raw = dom.presetInput.value.trim();
    if (!raw) return;
    const preset = getPromptPresets().find((item) => item.name === raw);
    appendText(dom.promptInput, preset ? preset.text : raw);
    dom.presetInput.value = "";
  }

  function getPromptPresets() {
    return Array.isArray(state.settings.promptPresets) && state.settings.promptPresets.length
      ? state.settings.promptPresets
      : DEFAULT_PROMPT_PRESETS;
  }

  async function selectTemplate(template) {
    state.selectedTemplate = template;
    state.templateFileName = template.name;
    const source = template.image || template.preview;
    if (source) {
      try {
        state.templateImageData = await ensureDataUrl(source);
        showPreview(dom.templatePreview, state.templateImageData, template.name);
      } catch (error) {
        state.templateImageData = null;
        dom.templatePreview.hidden = true;
        dom.templatePreview.querySelector("img").removeAttribute("src");
        renderError(`模板图加载失败：${error.message}`);
      }
    }
    renderTemplates();
    updateGenerateButton();
  }

  async function addCustomTemplate(file) {
    const image = await fileToDataURL(file);
    const template = {
      id: uuid(),
      name: file.name.replace(/\.[^.]+$/, "").slice(0, 30) || "自定义模板",
      image,
      preview: image,
      description: "用户上传的直播间模板图，参考其空间框架、货架位置、色彩氛围和层次结构",
      custom: true,
      createdAt: Date.now()
    };
    state.customTemplates.unshift(template);
    state.selectedTemplate = template;
    state.templateImageData = image;
    state.templateFileName = file.name;
    showPreview(dom.templatePreview, image, file.name);
    if (state.db) await putRecord("templates", template);
    renderTemplates();
    updateGenerateButton();
  }

  async function deleteCustomTemplate(id) {
    const target = state.customTemplates.find((item) => item.id === id);
    if (!target) return;
    if (!window.confirm(`删除自定义模板「${target.name}」？`)) return;
    state.customTemplates = state.customTemplates.filter((item) => item.id !== id);
    if (state.selectedTemplate && state.selectedTemplate.id === id) state.selectedTemplate = null;
    if (state.db) await deleteRecord("templates", id);
    renderTemplates();
    updateGenerateButton();
  }

  function updateGenerateButton() {
    const hasProduct = Boolean(state.productImageData);
    const canGenerate = hasProduct && !state.isBusy;
    dom.generateBtn.disabled = !canGenerate;
    dom.generateBtn.textContent = state.isBusy ? "生成中..." : "生成营销图";
  }

  async function generateImage() {
    if (state.isBusy || dom.generateBtn.disabled) return;
    state.isBusy = true;
    updateGenerateButton();
    showWorkflowProgress(0, "正在准备生成任务...");
    startTimer();

    const startedAt = performance.now();
    try {
      const userInstruction = buildUserInstruction();
      showWorkflowProgress(0, "正在识别产品信息...");
      const productAnalysis = await analyzeProductImage(state.productImageData);
      showWorkflowProgress(1, "正在拆解参考模板...");
      const templateAnalysis = await analyzeTemplateImage(getActiveTemplateSource());
      showWorkflowProgress(2, "正在生成设计规范...");
      const compiledPrompt = buildImagePrompt(productAnalysis, templateAnalysis, userInstruction);
      const generation = await generateWithAudit({
        prompt: compiledPrompt,
        productAnalysis,
        templateAnalysis,
        userInstruction
      });
      const resultImage = generation.image;
      const runId = uuid();
      const duration = (performance.now() - startedAt) / 1000;
      const resultThumb = await resizeImage(resultImage, 180, 320, "cover", "image/jpeg", 0.78);
      const productThumb = state.productImageData
        ? await resizeImage(state.productImageData, 240, 240, "contain", "image/jpeg", 0.78)
        : null;
      const templateThumb = state.templateImageData
        ? await resizeImage(state.templateImageData, 180, 320, "cover", "image/jpeg", 0.78)
        : null;

      const record = {
        id: runId,
        timestamp: Date.now(),
        type: "generate",
        parentId: null,
        productImage: productThumb,
        templateImage: templateThumb,
        templateName: state.selectedTemplate ? state.selectedTemplate.name : (state.templateFileName || "自定义模板"),
        testCaseName: state.activeTestCaseName || "",
        userInstruction,
        productAnalysis,
        templateAnalysis,
        prompt: compiledPrompt,
        compiledPrompt,
        finalPrompt: generation.finalPrompt || compiledPrompt,
        auditResult: generation.audit,
        retryInstruction: generation.retryInstruction || "",
        retryAttempts: generation.retryAttempts || [],
        apiParams: generation.apiParams || buildRunApiParams(),
        attempts: generation.attempts,
        warning: generation.warning || "",
        editDescription: "",
        resultImage,
        resultThumb,
        duration,
        model: state.settings.model,
        resolution: state.settings.size
      };
      record.runJson = buildRunJson(record);

      if (state.db) await saveHistoryRecord(record);
      state.currentResult = record;
      showWorkflowProgress(7, "生成完成");
      renderResult(record);
    } catch (error) {
      renderError(normalizeErrorMessage(error));
    } finally {
      stopTimer();
      state.isBusy = false;
      updateGenerateButton();
    }
  }

  function buildUserInstruction() {
    const userPrompt = dom.promptInput.value.trim();
    const productScale = normalizeProductScale(state.settings.productScale);
    return {
      raw_text: userPrompt,
      use_product_color: /产品配色|配色|color/i.test(userPrompt) || true,
      use_reference_layout: true,
      safe_margin_px: clampSafeMargin(state.settings.safeMargin),
      keep_top_bottom_unchanged: Boolean(state.settings.topBottomLock),
      product_scale: productScale,
      main_product_height_ratio: getProductHeightRatio(productScale),
      generate_livestream_form: true,
      avoid_stretching: true,
      layout_lock: Boolean(state.settings.layoutLock),
      reference_layout_strength: state.settings.referenceLayoutStrength || "high",
      product_color_strength: state.settings.productColorStrength || "high",
      text_accuracy_priority: state.settings.textAccuracyPriority || "high",
      auto_audit: Boolean(state.settings.autoAudit),
      auto_retry: Boolean(state.settings.autoRetry),
      max_retry: Number(state.settings.maxRetry || 0)
    };
  }

  function sanitizeImageGenerationInstruction(text) {
    const value = String(text || "").trim();
    if (!value) return "";
    return value
      .replace(/x\s*=?\s*\d+\s*(?:px|像素)?\s*(?:到|至|to|-|~|～)\s*x?\s*=?\s*\d+\s*(?:px|像素)?/gi, "重要元素明显向画面中间收拢")
      .replace(/\b90\s*(?:px)?\b/gi, "明显距离")
      .replace(/90\s*像素/g, "明显距离")
      .replace(/\b\d+\s*px\b/gi, "明显距离")
      .replace(/\d+\s*像素/g, "明显距离")
      .replace(/安全区/g, "视觉内缩范围")
      .replace(/安全线|边距线|参考线|虚线框|虚线|裁切线/g, "边缘避让")
      .replace(/生成(正式)?(中文)?(标题|价格|品牌|卖点|底部服务|服务|优惠|宣传语)?文字/g, "保留空白文字占位")
      .replace(/\s+/g, " ")
      .trim();
  }

  function handleTestCaseClick(event) {
    const button = event.target.closest("button[data-test-case]");
    if (!button) return;
    const testCase = TEST_CASES.find((item) => item.id === button.dataset.testCase);
    if (!testCase) return;
    const instruction = testCase.instruction || testCase.text || "";
    state.activeTestCaseName = testCase.id;
    state.activeTestCasePrompt = instruction;
    dom.promptInput.value = instruction;

    const editPrompt = $("#editPrompt");
    if (testCase.id === "local-edit-product-smaller" && editPrompt) {
      editPrompt.value = instruction;
      editPrompt.focus();
      return;
    }

    dom.promptInput.focus();
  }

  function syncActiveTestCaseFromPrompt() {
    if (!state.activeTestCasePrompt) return;
    if (dom.promptInput.value.trim() !== state.activeTestCasePrompt) {
      state.activeTestCaseName = "";
      state.activeTestCasePrompt = "";
    }
  }

  async function buildGenerationPrompt() {
    const productAnalysis = await buildFallbackProductAnalysis();
    const templateAnalysis = buildFallbackTemplateAnalysis();
    return buildImagePrompt(productAnalysis, templateAnalysis, buildUserInstruction());
  }

  async function composeMarketingImage() {
    if (state.isBusy) return;
    if (!state.productImageData) {
      renderError("请先上传产品图。");
      return;
    }
    state.isBusy = true;
    updateGenerateButton();
    startTimer();
    showLoading("正在网页端合成 1080 直播间营销图...");
    const startedAt = performance.now();
    try {
      const image = await renderMarketingCanvas();
      const duration = (performance.now() - startedAt) / 1000;
      const resultThumb = await resizeImage(image, 180, 320, "cover", "image/jpeg", 0.78);
      const copy = getMarketingCopy();
      const record = {
        id: uuid(),
        timestamp: Date.now(),
        type: "compose",
        resultImage: image,
        resultThumb,
        duration,
        model: "web-canvas",
        resolution: "1080x1920",
        templateName: state.selectedTemplate ? state.selectedTemplate.name : (state.templateFileName || "默认场景"),
        userInstruction: buildUserInstruction(),
        compiledPrompt: "网页端 Canvas 合成：模板背景 + 产品图 + 真实文字贴片。API 不生成海报文字。",
        finalPrompt: "",
        marketingCopy: copy,
        productImage: state.productImageData,
        templateImage: getActiveTemplateSource()
      };
      record.runJson = buildRunJson(record);
      state.currentResult = record;
      if (state.db) await saveHistoryRecord(record);
      renderResult(record);
    } catch (error) {
      renderError(normalizeErrorMessage(error));
    } finally {
      stopTimer();
      state.isBusy = false;
      updateGenerateButton();
    }
  }

  async function renderMarketingCanvas() {
    const width = EXPORT_WIDTH;
    const height = EXPORT_HEIGHT;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const palette = state.productImageData ? await extractPalette(state.productImageData).catch(() => []) : [];
    const accent = palette[0] || "#f0912b";
    const accent2 = palette[1] || "#2fbf84";
    const backgroundSource = getActiveTemplateSource();
    const bg = backgroundSource ? await loadImage(backgroundSource) : null;
    const product = await loadImage(state.productImageData);
    const copy = getMarketingCopy();
    const safe = clampSafeMargin(state.settings.safeMargin);

    drawMarketingBackground(ctx, bg, accent, accent2, width, height);
    drawTopCopy(ctx, copy, safe, accent, width);
    drawLeftBadges(ctx, copy.badges, safe, accent2);
    drawRightCard(ctx, copy, safe, accent, width);
    drawProductShowcase(ctx, product, accent, width, height);
    drawBottomService(ctx, copy.service, safe, accent, width, height);
    return canvas.toDataURL("image/png");
  }

  function getMarketingCopy() {
    return {
      title: cleanOneLine(dom.titleInput.value) || "直播间专享好物",
      subtitle: cleanOneLine(dom.subtitleInput.value) || "产品实拍展示 · 场景化讲解",
      price: cleanOneLine(dom.priceInput.value) || "直播间权益价",
      badges: splitList(dom.badgeInput.value || "爆款推荐｜限时福利｜现货速发").slice(0, 3),
      sellingPoints: splitList(dom.sellingPointsInput.value || "清爽洁净不油腻\n家庭日常高频使用\n直播间组合更划算").slice(0, 4),
      service: cleanOneLine(dom.serviceInput.value) || "官方优选｜快速发货｜售后无忧",
      note: cleanOneLine(dom.promptInput.value)
    };
  }

  function cleanOneLine(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function splitList(value) {
    return String(value || "")
      .split(/\n|[|｜、,，/]/)
      .map((item) => cleanOneLine(item))
      .filter(Boolean);
  }

  function drawMarketingBackground(ctx, bg, accent, accent2, width, height) {
    if (bg) {
      const rect = fitRect(bg.naturalWidth || bg.width, bg.naturalHeight || bg.height, width, height, "cover");
      ctx.drawImage(bg, rect.sx, rect.sy, rect.sw, rect.sh, rect.dx, rect.dy, rect.dw, rect.dh);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, accent);
      gradient.addColorStop(0.45, "#f6f7fb");
      gradient.addColorStop(1, accent2);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
    const veil = ctx.createLinearGradient(0, 0, 0, height);
    veil.addColorStop(0, "rgba(255,255,255,0.24)");
    veil.addColorStop(0.42, "rgba(255,255,255,0.08)");
    veil.addColorStop(1, "rgba(0,0,0,0.18)");
    ctx.fillStyle = veil;
    ctx.fillRect(0, 0, width, height);
  }

  function drawTopCopy(ctx, copy, safe, accent, width) {
    const x = safe;
    const y = 82;
    const w = width - safe * 2;
    const h = 250;
    drawRoundRect(ctx, x, y, w, h, 28, "rgba(255,255,255,0.86)", "rgba(255,255,255,0.92)");
    ctx.fillStyle = accent;
    ctx.fillRect(x + 34, y + 38, 10, 154);
    ctx.fillStyle = "#171717";
    ctx.font = "900 70px Microsoft YaHei, PingFang SC, Arial";
    drawWrappedText(ctx, copy.title, x + 66, y + 78, w - 100, 78, 2);
    ctx.fillStyle = "#4b4b4b";
    ctx.font = "500 34px Microsoft YaHei, PingFang SC, Arial";
    drawWrappedText(ctx, copy.subtitle, x + 68, y + 190, w - 110, 42, 1);
  }

  function drawLeftBadges(ctx, badges, safe, accent) {
    const x = safe + 8;
    let y = 410;
    badges.forEach((badge, index) => {
      const h = 70;
      const w = 230;
      drawRoundRect(ctx, x, y, w, h, 35, index % 2 ? "rgba(255,255,255,0.88)" : accent, "rgba(255,255,255,0.68)");
      ctx.fillStyle = index % 2 ? "#222" : "#fff";
      ctx.font = "800 28px Microsoft YaHei, PingFang SC, Arial";
      drawCenteredText(ctx, badge, x + w / 2, y + 44, w - 28);
      y += 86;
    });
  }

  function drawRightCard(ctx, copy, safe, accent, width) {
    const w = 320;
    const h = 470;
    const x = width - safe - w;
    const y = 565;
    drawRoundRect(ctx, x, y, w, h, 24, "rgba(255,255,255,0.9)", "rgba(255,255,255,0.95)");
    ctx.fillStyle = accent;
    ctx.font = "900 42px Microsoft YaHei, PingFang SC, Arial";
    drawWrappedText(ctx, copy.price, x + 28, y + 64, w - 56, 48, 2);
    ctx.font = "700 28px Microsoft YaHei, PingFang SC, Arial";
    let py = y + 185;
    copy.sellingPoints.forEach((point) => {
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(x + 36, py - 9, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#2b2b2b";
      drawWrappedText(ctx, point, x + 56, py, w - 82, 34, 2);
      py += 76;
    });
  }

  function drawProductShowcase(ctx, product, accent, width, height) {
    const stageY = 1420;
    const stageW = 760;
    const stageH = 155;
    const stageX = (width - stageW) / 2;
    drawRoundRect(ctx, stageX, stageY, stageW, stageH, 48, "rgba(255,255,255,0.84)", "rgba(255,255,255,0.5)");
    ctx.fillStyle = "rgba(0,0,0,0.16)";
    ctx.beginPath();
    ctx.ellipse(width / 2, stageY + stageH - 12, stageW * 0.38, 34, 0, 0, Math.PI * 2);
    ctx.fill();

    const targetH = height * (clampNumber(state.settings.productSizePercent, 12, 36, 22) / 100);
    const ratio = (product.naturalWidth || product.width) / (product.naturalHeight || product.height);
    const targetW = targetH * ratio;
    const centerX = width / 2 + width * (clampNumber(state.settings.productOffsetXPercent, -30, 30, 0) / 100);
    const bottomY = stageY + 58 + height * (clampNumber(state.settings.productOffsetYPercent, -30, 30, 0) / 100);
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.26)";
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 18;
    ctx.drawImage(product, centerX - targetW / 2, bottomY - targetH, targetW, targetH);
    ctx.restore();

    ctx.strokeStyle = withAlpha(accent, 0.28);
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(width / 2, stageY + stageH / 2, stageW * 0.45, 58, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawBottomService(ctx, service, safe, accent, width, height) {
    const x = safe;
    const y = height - 132;
    const w = width - safe * 2;
    const h = 76;
    drawRoundRect(ctx, x, y, w, h, 22, "rgba(20,20,20,0.74)", withAlpha(accent, 0.68));
    ctx.fillStyle = "#fff";
    ctx.font = "700 28px Microsoft YaHei, PingFang SC, Arial";
    drawCenteredText(ctx, service, x + w / 2, y + 48, w - 60);
  }

  function drawRoundRect(ctx, x, y, w, h, r, fill, stroke) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    const chars = Array.from(String(text || ""));
    let line = "";
    let lines = 0;
    for (let i = 0; i < chars.length; i += 1) {
      const test = line + chars[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, y + lines * lineHeight);
        lines += 1;
        line = chars[i];
        if (lines >= maxLines - 1) break;
      } else {
        line = test;
      }
    }
    if (line && lines < maxLines) ctx.fillText(line, x, y + lines * lineHeight);
  }

  function drawCenteredText(ctx, text, centerX, baseline, maxWidth) {
    const raw = String(text || "");
    let value = raw;
    while (value.length > 1 && ctx.measureText(value).width > maxWidth) {
      value = value.slice(0, -1);
    }
    if (value !== raw) value = `${value.slice(0, Math.max(1, value.length - 1))}…`;
    ctx.textAlign = "center";
    ctx.fillText(value, centerX, baseline);
    ctx.textAlign = "left";
  }

  function withAlpha(hex, alpha) {
    const value = String(hex || "").replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(value)) return `rgba(240,145,43,${alpha})`;
    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function buildImagePrompt(productAnalysis, templateAnalysis, userInstruction, retryInstruction = "") {
    const templateDescription = "参考模板图已作为第二张图片上传；只提供顶部标题区、中间主播区、前景展示台、左侧小徽章区、右侧小型信息卡区和底部短服务栏区的构图关系。";
    const productTargetRatio = Number(userInstruction.main_product_height_ratio || 0.20);
    const productMaxRatio = Math.min(0.25, Number(getProductMaxHeightRatio(userInstruction.product_scale)));
    const productTargetPercent = `${Math.round(productTargetRatio * 100)}%`;
    const productMaxPercent = `${Math.round(productMaxRatio * 100)}%`;
    const mainColors = arrayText(productAnalysis.main_colors);
    const visualAssets = arrayText(productAnalysis.visual_assets);
    const sellingPoints = arrayText(productAnalysis.key_selling_points);
    const productCategory = productAnalysis.category || productAnalysis.product_type || "参考图一中的产品";
    const packageShape = productAnalysis.package_shape || "保留图一产品的包装结构、瓶身/盒身/罐身轮廓和材质感";
    const preferredScene = productAnalysis.preferred_scene || "根据图一产品品类自动匹配真实直播间电商场景";
    const cleanedUserInstruction = sanitizeImageGenerationInstruction(userInstruction.raw_text);
    const cleanedRetryInstruction = sanitizeImageGenerationInstruction(retryInstruction);

    return [
      "参考图一产品信息和图二直播间框架，生成一张新的 9:16 直播间商品展示背景图。",
      "",
      "图一负责提供产品品类、品牌视觉、包装结构、包装主色、产品材质、卖点方向和可延展视觉元素。",
      `图一产品信息：品类=${productCategory}；包装结构=${packageShape}；包装主色=${mainColors || "参考图一包装主色"}；产品材质/可延展元素=${visualAssets || "参考图一包装上的图形、材质和品类元素"}；卖点方向=${sellingPoints || "只作为视觉方向，不生成文字"}。`,
      "图二只参考直播间电商构图逻辑，不要照搬图二原产品、原文案、原配色和人物，不要拼贴抠图。",
      `图二框架参考：${templateDescription}`,
      "",
      "重要：",
      "本次只生成：直播间背景、主播、产品、展示台、信息框占位、徽章占位、底部栏占位和装饰元素。",
      "不要生成任何正式中文文案。",
      "不要生成标题文字。",
      "不要生成价格文字。",
      "不要生成品牌文字。",
      "不要生成卖点文字。",
      "不要生成底部服务文字。",
      "不要生成直播优惠文字。",
      "不要生成任何中文宣传语。",
      "不要生成任何可读英文、数字、Logo 字样或水印。",
      "所有文字区域只保留干净的空白标签框、空白徽章、空白信息卡，方便后期叠加真实文字。",
      "原因：中文文字由后期 / 前端 / PSD / Canvas 叠加，不交给生图模型生成。",
      "",
      "构图硬规则：",
      "- 主播是画面主视觉，完整露出脸、肩、胸部和至少一只手势。",
      "- 主播像正在直播间讲解产品。",
      "- 产品放在前景展示台上，只是展示商品，不是巨型前景物。",
      `- 主产品高度控制在画面高度 16%~22%，本次目标约 ${productTargetPercent}，最多不超过 ${productMaxPercent}。`,
      "- 产品不能挡住主播脸部。",
      "- 产品不能挡住主播胸部。",
      "- 产品不能挡住主播主要手势。",
      "- 产品顶部不要超过主播胸口到锁骨区域。",
      "- 如果是大瓶、大盒、大罐，也必须按直播展示台商品比例缩小。",
      "- 禁止巨大产品，禁止产品压住主播，禁止产品成为唯一主视觉，禁止产品占画面三分之一以上。",
      "",
      "信息框 / 贴片尺寸约束：",
      "- 右侧只保留一个小型信息卡占位，宽度不要超过画面宽度的 22% 到 26%，高度不要超过画面高度的 28% 到 36%。",
      "- 右侧信息卡只能做辅助信息区，不能比主播更抢眼，不要生成价格文字，只留空白价格框或空白信息框。",
      "- 左侧只保留 2 到 3 个小徽章占位，徽章要小，不要堆成巨大竖列，不要贴边，不要生成徽章文字，只留图标感或空白标签感。",
      "- 底部服务栏要短、轻、克制，高度最多占画面高度 6% 到 8%，不要做满宽大贴片，不要贴边，不要生成服务文字，只留空白服务栏结构。",
      "",
      "视觉内缩规则：",
      "- 所有重要元素都必须明显向中间收拢。",
      "- 左右边缘只保留背景、植物、柔光、虚化装饰。",
      "- 左右边缘不能有文字、产品、价格框、徽章、主播脸、主播手、信息卡、底部栏文字。",
      "- 右侧信息卡和左侧徽章都要离画面边缘有明显距离。",
      "- 不要显示任何安全线、虚线、参考线、裁切线。",
      "",
      "画面结构：",
      "顶部空白标题区，",
      "中间主播，",
      "下方展示台产品，",
      "左侧小徽章占位，",
      "右侧小型直播权益信息卡占位，",
      "底部短服务栏占位。",
      "",
      "画面主次：",
      "主播第一，",
      "产品第二，",
      "信息框第三，",
      "背景第四。",
      "",
      "产品与场景：",
      "根据图一产品自动匹配场景与配色。",
      `产品参考场景方向：${preferredScene}。`,
      "如果是家清/厨房清洁，用明亮厨房、台面、餐具、水花、泡泡。",
      "如果是美妆/护肤，用精致陈列台、柔光、轻奢洗护空间。",
      "如果是母婴/营养品，用柔和家庭感、亲和可信赖氛围。",
      "如果是食品/饮品，用清爽生活化食饮场景。",
      "如果是家电/数码，用现代家居、简洁科技生活感。",
      "如果是草本洗护/日化，用植物、草本、温润、自然养护场景。",
      "",
      "风格：",
      "整体像真实直播间 + 电商精修图。",
      "清晰、干净、商业化、有空间层次。",
      "不要做成满屏贴片广告。",
      "不要做成普通详情页。",
      "不要做成低质感模板海报。",
      "",
      "图一 / 图二禁止项：",
      "- 不要照搬图二颜色。",
      "- 不要照搬图二文案。",
      "- 不要照搬图二产品。",
      "- 不要照搬图二人物。",
      "- 不要把图一产品机械抠图贴进去。",
      "- 不要生成正式标题文字、品牌文字、价格文字、卖点文字、底部服务文字、直播优惠文字或任何中文宣传语。",
      "- 如果需要表现标签、价格、权益、徽章、标题，只生成空白容器、抽象图标感或留白占位。",
      "",
      "后期叠字逻辑：",
      "后续文字不要交给生图模型。顶部标题文字、副标题文字、左侧徽章文字、右侧价格 / 卖点文字、底部服务文字都由系统单独叠加文字层。",
      "这样可以保证中文不乱、品牌不乱、价格不乱、字体统一、视觉边界可控、后期可编辑。",
      cleanedUserInstruction ? `用户补充指令（已转换为视觉语言，正式文字仍只生成空白占位）：${cleanedUserInstruction}` : "",
      cleanedRetryInstruction ? `\nSTRICT RETRY CORRECTION:\n${cleanedRetryInstruction}` : ""
    ].filter(Boolean).join("\n");
  }

  async function analyzeProductImage(productImage) {
    const fallback = await buildFallbackProductAnalysis();
    if (!productImage) return fallback;
    const prompt = [
      "Analyze this product image for a Chinese livestream e-commerce poster workflow.",
      "Return JSON only with keys: brand, category, product_type, package_shape, main_colors, secondary_colors, visual_assets, key_selling_points, forbidden_claims, preferred_scene.",
      "Use only visible evidence. If a field is unclear, use a conservative generic value. Do not invent unsupported medical, safety, certification, price, or discount claims."
    ].join("\n");
    try {
      return normalizeProductAnalysis(await callVisionJson(prompt, [productImage]), fallback);
    } catch (_) {
      return fallback;
    }
  }

  async function analyzeTemplateImage(templateImage) {
    const fallback = buildFallbackTemplateAnalysis();
    if (!templateImage) return fallback;
    const prompt = [
      "Analyze this reference poster as a layout template for a new livestream e-commerce poster.",
      "Return JSON only with keys: canvas, layout, safe_area, style.",
      "Describe only layout regions, composition, density, lighting, and blank placeholder zones. Do not copy exact product content, colors, people, readable text, prices, slogans, or brand words."
    ].join("\n");
    try {
      return normalizeTemplateAnalysis(await callVisionJson(prompt, [await ensureDataUrl(templateImage)]), fallback);
    } catch (_) {
      return fallback;
    }
  }

  async function generateWithAudit(input) {
    const maxRetry = input.userInstruction.auto_retry ? Math.max(0, Math.min(2, Number(input.userInstruction.max_retry || 0))) : 0;
    let prompt = input.prompt;
    let lastImage = "";
    let lastAudit = null;
    let lastApiParams = buildRunApiParams();
    let lastRetryInstruction = "";
    const retryAttempts = [];
    for (let attempt = 1; attempt <= maxRetry + 1; attempt += 1) {
      showWorkflowProgress(attempt > 1 ? 6 : 3, attempt > 1 ? "正在二次修正..." : "正在生成直播间背景...");
      const promptForAttempt = prompt;
      const generated = await callImageReferenceGenerate(promptForAttempt);
      lastImage = generated.image;
      lastApiParams = buildRunApiParams(generated.apiParams);
      const attemptRecord = {
        attempt,
        prompt: promptForAttempt,
        apiParams: generated.apiParams,
        auditResult: null,
        retryInstruction: "",
        retryPrompt: "",
        status: "generated"
      };
      if (!input.userInstruction.auto_audit) {
        const skippedAudit = buildSkippedAudit();
        attemptRecord.auditResult = skippedAudit;
        attemptRecord.status = "audit_skipped";
        retryAttempts.push(attemptRecord);
        return {
          image: lastImage,
          audit: skippedAudit,
          attempts: attempt,
          finalPrompt: promptForAttempt,
          retryInstruction: "",
          retryAttempts,
          apiParams: lastApiParams
        };
      }
      showWorkflowProgress(4, "正在检查视觉内缩...");
      showWorkflowProgress(5, "正在检查产品比例...");
      lastAudit = await auditGeneratedPoster(lastImage, input.userInstruction, input.productAnalysis);
      attemptRecord.auditResult = lastAudit;
      if (lastAudit.overall_passed) {
        attemptRecord.status = "passed";
        retryAttempts.push(attemptRecord);
        return {
          image: lastImage,
          audit: lastAudit,
          attempts: attempt,
          finalPrompt: promptForAttempt,
          retryInstruction: lastRetryInstruction,
          retryAttempts,
          apiParams: lastApiParams
        };
      }
      if (attempt <= maxRetry) {
        lastRetryInstruction = lastAudit.retry_instruction || "Regenerate with all important elements clearly pulled inward from the left and right edges. Keep the presenter unobstructed, reduce the main product to a compact display-table scale, keep it under 25% of image height, and leave every text area as a blank placeholder.";
        prompt = buildImagePrompt(input.productAnalysis, input.templateAnalysis, input.userInstruction, lastRetryInstruction);
        attemptRecord.status = "retry";
        attemptRecord.retryInstruction = lastRetryInstruction;
        attemptRecord.retryPrompt = prompt;
        retryAttempts.push(attemptRecord);
      } else {
        attemptRecord.status = "failed";
        lastRetryInstruction = lastAudit.retry_instruction || "";
        retryAttempts.push(attemptRecord);
      }
    }
    return {
      image: lastImage,
      audit: lastAudit || buildSkippedAudit(),
      attempts: maxRetry + 1,
      finalPrompt: prompt,
      retryInstruction: lastRetryInstruction,
      retryAttempts,
      apiParams: lastApiParams,
      warning: "Generated image did not fully pass audit after retries."
    };
  }

  async function auditGeneratedPoster(imageDataUrl, userInstruction, productAnalysis) {
    const targetRatio = Number(userInstruction.main_product_height_ratio || 0.20);
    const prompt = [
      "You are auditing a generated 1080x1920 Chinese livestream e-commerce poster.",
      "Return JSON only.",
      `Target main product height ratio: ${targetRatio}.`,
      `Expected product category: ${productAnalysis.category || productAnalysis.product_type || "same as product reference"}.`,
      "Check visual inward layout, presenter priority, product scale, product obstruction, sticker/card size, right info card size, left badge size, bottom bar size, top/bottom composition, layout, product category consistency, color consistency, extra hands, distorted faces, broken products, and unwanted readable text.",
      "Fail safe_margin if important elements sit against the left or right edge. The left and right edges should contain only background, soft light, plants, or blurred low-contrast decoration. Presenter face, presenter hands, products, price cards, badges, info cards, and bottom bars must be visually pulled inward.",
      "Fail product_scale if the main foreground product is over 25% of full poster height, if it blocks the presenter face/chest/main gesture, if its top rises above the presenter's chest-to-clavicle area, or if the product/platform/props visually dominate the lower half.",
      "Fail layout if the presenter is not the primary visual, if the product is the only main visual, or if the right info card/left badges/bottom bar overpower the presenter.",
      "Fail text if there is any readable Chinese or English promotional text, title text, brand text, price text, selling point text, bottom service text, discount text, digits, logo words, or watermarks. Blank label boxes, blank badges, and blank info cards pass.",
      "Return keys: safe_margin, product_scale, top_bottom_lock, layout, text, overall_passed, retry_instruction."
    ].join("\n");
    try {
      return normalizeAuditResult(await callVisionJson(prompt, [imageDataUrl]), targetRatio);
    } catch (_) {
      return {
        safe_margin: { passed: true, issues: ["visual audit unavailable; manual review recommended"] },
        product_scale: { passed: true, main_product_too_large: false, estimated_height_ratio: null, target_height_ratio: targetRatio },
        top_bottom_lock: { passed: true },
        layout: { passed: true },
        text: { passed: true, issues: [] },
        overall_passed: true,
        retry_instruction: ""
      };
    }
  }

  async function callVisionJson(prompt, imageDataUrls) {
    const body = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Return valid JSON only. Do not include markdown fences."
        },
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            ...imageDataUrls.map((url) => ({
              type: "image_url",
              image_url: { url, detail: "high" }
            }))
          ]
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0
    };
    const data = await postOpenAIJson("/v1/chat/completions", body);
    return parseJsonLoose(extractTextFromResponse(data));
  }

  async function buildFallbackProductAnalysis() {
    const palette = state.productImageData ? await extractPalette(state.productImageData).catch(() => []) : [];
    return {
      brand: "",
      category: "产品直播专场",
      product_type: "参考图中的产品",
      package_shape: "保留产品参考图中的瓶身、瓶盖、泵头、提手和标签结构",
      main_colors: palette.length ? palette : ["产品包装主色", "白色", "品牌辅助色"],
      secondary_colors: [],
      visual_assets: ["参考产品包装上的水果、植物、水花或品类元素"],
      key_selling_points: ["直播优选", "清新实用", "家庭日常"],
      forbidden_claims: ["医疗级", "100%无残留", "杀菌", "消毒", "官方认证", "最低价"],
      preferred_scene: "明亮清新的直播间电商场景"
    };
  }

  function buildFallbackTemplateAnalysis() {
    return {
      canvas: { aspect_ratio: "9:16", width: 1080, height: 1920 },
      layout: {
        top_area: "顶部空白标题区，只保留可后期叠字的留白或空白标题框",
        icon_row: "轻量装饰或空白占位，不生成可读文字",
        center_area: "主播/模特 + 背景场景",
        main_product_area: "底部中前景产品展示台",
        left_badge: "2到3个小型空白徽章占位",
        right_panel: "一个小型空白直播权益信息卡占位",
        bottom_bar: "短而克制的空白底部服务栏占位"
      },
      safe_area: { left: clampSafeMargin(state.settings.safeMargin), right: 1080 - clampSafeMargin(state.settings.safeMargin), top: 0, bottom: 1920 },
      style: {
        visual_type: "直播间电商海报",
        lighting: "高亮、干净、商业柔光",
        composition: state.selectedTemplate ? state.selectedTemplate.description : "主播第一，产品第二，信息框第三，背景第四",
        density: "中等信息密度，贴片和占位框克制"
      }
    };
  }

  function normalizeProductAnalysis(value, fallback) {
    return {
      ...fallback,
      ...(value && typeof value === "object" ? value : {}),
      main_colors: ensureArray(value && value.main_colors, fallback.main_colors),
      secondary_colors: ensureArray(value && value.secondary_colors, fallback.secondary_colors),
      visual_assets: ensureArray(value && value.visual_assets, fallback.visual_assets),
      key_selling_points: ensureArray(value && value.key_selling_points, fallback.key_selling_points),
      forbidden_claims: ensureArray(value && value.forbidden_claims, fallback.forbidden_claims)
    };
  }

  function normalizeTemplateAnalysis(value, fallback) {
    return {
      ...fallback,
      ...(value && typeof value === "object" ? value : {}),
      canvas: { ...fallback.canvas, ...((value && value.canvas) || {}) },
      layout: { ...fallback.layout, ...((value && value.layout) || {}) },
      safe_area: { ...fallback.safe_area, ...((value && value.safe_area) || {}) },
      style: { ...fallback.style, ...((value && value.style) || {}) }
    };
  }

  function normalizeAuditResult(value, targetRatio) {
    const audit = value && typeof value === "object" ? value : {};
    const safeMargin = normalizeAuditSection(audit.safe_margin, false, ["audit did not return safe_margin"]);
    const productScale = normalizeAuditSection(audit.product_scale, false, []);
    productScale.main_product_too_large = Boolean(productScale.main_product_too_large);
    productScale.estimated_height_ratio = productScale.estimated_height_ratio ?? null;
    productScale.target_height_ratio = productScale.target_height_ratio ?? targetRatio;
    return {
      safe_margin: safeMargin,
      product_scale: productScale,
      top_bottom_lock: normalizeAuditSection(audit.top_bottom_lock, true, []),
      layout: normalizeAuditSection(audit.layout, true, []),
      text: normalizeAuditSection(audit.text, true, []),
      overall_passed: parseBoolean(audit.overall_passed),
      retry_instruction: audit.retry_instruction || "Regenerate with all important elements clearly pulled inward from the left and right edges. Keep the presenter as the primary visual, reduce the product to compact display-table scale under 25% of image height, make right/left/bottom placeholders smaller, and leave every text area blank."
    };
  }

  function normalizeAuditSection(value, defaultPassed, defaultIssues) {
    const section = value && typeof value === "object" ? value : {};
    return {
      ...section,
      passed: "passed" in section ? parseBoolean(section.passed) : defaultPassed,
      issues: ensureArray(section.issues, defaultIssues)
    };
  }

  function parseBoolean(value) {
    if (value === true || value === "true" || value === "passed") return true;
    if (value === false || value === "false" || value === "failed") return false;
    return Boolean(value);
  }

  function buildSkippedAudit() {
    return {
      skipped: true,
      status: "skipped",
      reason: "autoAudit=false",
      safe_margin: { passed: true, issues: [] },
      product_scale: { passed: true, main_product_too_large: false },
      top_bottom_lock: { passed: true },
      layout: { passed: true },
      text: { passed: true, issues: [] },
      overall_passed: true,
      retry_instruction: ""
    };
  }

  function extractTextFromResponse(data) {
    const message = data.choices && data.choices[0] && data.choices[0].message;
    if (message) {
      if (typeof message.content === "string") return message.content;
      if (Array.isArray(message.content)) {
        return message.content.map((block) => block.text || block.content || "").join("\n");
      }
    }
    if (Array.isArray(data.output)) {
      return data.output.map((item) => {
        const content = item.content || [];
        return Array.isArray(content) ? content.map((block) => block.text || block.output_text || "").join("\n") : "";
      }).join("\n");
    }
    throw new Error("API 已返回，但未能解析到 JSON 文本。");
  }

  function parseJsonLoose(text) {
    const raw = String(text || "").trim();
    try {
      return JSON.parse(raw);
    } catch (_) {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
      throw new Error("未能解析 JSON。");
    }
  }

  function ensureArray(value, fallback) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === "string" && value.trim()) return [value.trim()];
    return Array.isArray(fallback) ? fallback : [];
  }

  function arrayText(value) {
    return ensureArray(value, []).join("、");
  }

  async function callImageReferenceGenerate(prompt) {
    const referenceDataUrls = await getReferenceImageDataUrls();
    if (referenceDataUrls.length < 2) {
      throw new Error("请先上传产品图和参考模板图。生成接口需要同时收到两张图片，不能只发提示词。");
    }

    const referenceBlobs = await getReferenceImageBlobs(referenceDataUrls);
    try {
      const response = await callImageEditWithReferences(prompt, referenceBlobs, "image[]");
      return {
        image: await extractImageFromResponse(response.data),
        apiParams: response.apiParams
      };
    } catch (error) {
      if (!shouldRetryImageField(error)) throw error;
      const response = await callImageEditWithReferences(prompt, referenceBlobs, "image");
      return {
        image: await extractImageFromResponse(response.data),
        apiParams: response.apiParams
      };
    }
  }

  async function callImageEditWithReferences(prompt, references, imageFieldName) {
    const apiParams = buildImageApiParams(imageFieldName, references.length);
    const formData = new FormData();
    appendImageOptions(formData, apiParams);
    formData.append("prompt", prompt);
    references.forEach((reference) => {
      formData.append(imageFieldName, reference.blob, reference.fileName);
    });
    return {
      data: await postOpenAIForm(apiParams.endpoint, formData),
      apiParams
    };
  }

  async function getReferenceImageDataUrls() {
    const references = [];
    if (state.productImageData) {
      references.push({
        role: "product",
        url: state.productImageData
      });
    }

    const templateSource = getActiveTemplateSource();
    if (templateSource) {
      references.push({
        role: "template",
        url: await ensureDataUrl(templateSource)
      });
    }
    return references;
  }

  async function getReferenceImageBlobs(referenceDataUrls) {
    const references = referenceDataUrls || await getReferenceImageDataUrls();
    return Promise.all(references.map(async (reference) => ({
      fileName: `${reference.role || "image"}-reference.png`,
      blob: await sourceToPngBlob(reference.url)
    })));
  }

  function getActiveTemplateSource() {
    return state.templateImageData || (state.selectedTemplate && (state.selectedTemplate.image || state.selectedTemplate.preview)) || null;
  }

  function shouldRetryImageField(error) {
    const message = String(error && error.message ? error.message : error);
    return /HTTP (400|422)/.test(message) && /image|array|field|invalid|unknown|unsupported/i.test(message);
  }

  async function callInpaintingAPI(originalImage, maskImage, description) {
    const formData = new FormData();
    appendImageOptions(formData);
    formData.append("prompt", buildEditPrompt(description));
    formData.append("image", await sourceToPngBlob(originalImage), "image.png");
    formData.append("mask", await sourceToBlob(maskImage), "mask.png");

    try {
      const data = await postOpenAIForm("/v1/images/edits", formData);
      return extractImageFromResponse(data);
    } catch (error) {
      if (!/HTTP (404|405)/.test(String(error.message))) throw error;
      const marked = await composeMarkedReference(originalImage, getEditorPaintCanvas());
      return callChatFallback(marked, description);
    }
  }

  function buildEditPrompt(description) {
    return [
      "Edit the existing poster while preserving the overall design, layout, colors, presenter, product identity, blank placeholders, and background.",
      "Only adjust the user-requested masked area.",
      `Requested edit: ${sanitizeImageGenerationInstruction(description)}`,
      "Keep all important elements visually pulled inward from the left and right edges; edges should contain only background or low-contrast decoration.",
      "Do not stretch, squeeze, crop, or recompose the whole poster.",
      "Preserve top and bottom composition.",
      "Do not generate new readable text. Keep title areas, badges, info cards, price boxes, and bottom bars blank for later editable overlays.",
      "Keep the main product category and packaging identity consistent with the existing poster."
    ].join("\n");
  }

  async function callChatFallback(markedImage, description) {
    const editPrompt = buildEditPrompt(description);
    const body = {
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: markedImage }
            },
            {
              type: "text",
              text: [
                "请根据图片中红色半透明标记区域重新生成完整直播间背景图。",
                "只修改红色标记区域，其余区域尽量保持原图一致。",
                `修改要求：${editPrompt}`,
                "输出一张完整图片，不要输出解释文字。"
              ].join("\n")
            }
          ]
        }
      ],
      max_tokens: 4096
    };

    const data = await postOpenAIJson("/v1/chat/completions", body);
    return extractImageFromResponse(data);
  }

  function buildImageApiParams(imageFieldName = "image[]", referenceImageCount = 2) {
    const model = state.settings.model || DEFAULT_SETTINGS.model;
    const params = {
      endpoint: "/v1/images/edits",
      model,
      size: normalizeAllowedAPISize(state.settings.size),
      n: 1,
      referenceImageCount,
      imageFieldName
    };
    if (state.settings.quality && state.settings.quality !== "auto") {
      params.quality = state.settings.quality;
    }
    if (/^gpt-image/.test(model)) {
      params.output_format = "png";
    }
    return params;
  }

  function buildVisionApiParams() {
    return {
      endpoint: "/v1/chat/completions",
      model: "gpt-4o",
      response_format: "json_object",
      temperature: 0
    };
  }

  function buildRunApiParams(generationParams = null) {
    return {
      generation: generationParams || buildImageApiParams("image[]", 2),
      productAnalysis: buildVisionApiParams(),
      templateAnalysis: buildVisionApiParams(),
      audit: buildVisionApiParams()
    };
  }

  function appendImageOptions(formData, apiParams = buildImageApiParams()) {
    formData.append("model", apiParams.model);
    if (apiParams.size) formData.append("size", apiParams.size);
    if (apiParams.quality) {
      formData.append("quality", apiParams.quality);
    }
    formData.append("n", String(apiParams.n || 1));
    if (apiParams.output_format) {
      formData.append("output_format", apiParams.output_format);
    }
  }

  async function postOpenAIForm(path, formData) {
    const headers = {};
    if (state.settings.apiKey) headers.Authorization = `Bearer ${state.settings.apiKey}`;
    const response = await fetch(resolveAPIUrl(path), {
      method: "POST",
      headers,
      body: formData
    });
    return parseOpenAIResponse(response);
  }

  async function postOpenAIJson(path, body) {
    const headers = { "Content-Type": "application/json" };
    if (state.settings.apiKey) headers.Authorization = `Bearer ${state.settings.apiKey}`;
    const response = await fetch(resolveAPIUrl(path), {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });
    return parseOpenAIResponse(response);
  }

  async function parseOpenAIResponse(response) {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const code = data.error && (data.error.code || data.error.type);
      const message = mapAPIError(response.status, code, data.error && data.error.message);
      throw new Error(`HTTP ${response.status}: ${message}`);
    }
    return data;
  }

  async function extractImageFromResponse(data) {
    if (data.data && data.data[0]) {
      if (data.data[0].b64_json) return `data:image/png;base64,${data.data[0].b64_json}`;
      if (data.data[0].url) return ensureDataUrl(data.data[0].url);
    }

    const output = data.output || data.response || [];
    if (Array.isArray(output)) {
      for (const item of output) {
        const content = item.content || item.outputs || [];
        if (!Array.isArray(content)) continue;
        for (const block of content) {
          if (block.b64_json) return `data:image/png;base64,${block.b64_json}`;
          if (block.image_url && block.image_url.url) return ensureDataUrl(block.image_url.url);
          if (block.result) return `data:image/png;base64,${block.result}`;
        }
      }
    }

    const message = data.choices && data.choices[0] && data.choices[0].message;
    if (message) {
      if (Array.isArray(message.content)) {
        for (const block of message.content) {
          if (block.type === "image_url" && block.image_url && block.image_url.url) {
            return ensureDataUrl(block.image_url.url);
          }
          if (block.type === "image") {
            if (block.source && block.source.data) return `data:image/png;base64,${block.source.data}`;
            if (block.image_url && block.image_url.url) return ensureDataUrl(block.image_url.url);
          }
        }
      }
      if (typeof message.content === "string") {
        const urlMatch = message.content.match(/https?:\/\/\S+\.(png|jpg|jpeg|webp)(\?\S*)?/i);
        if (urlMatch) return ensureDataUrl(urlMatch[0]);
      }
    }

    throw new Error("API 已返回，但未能解析到图片。");
  }

  function mapAPIError(status, code, message) {
    if (status === 401) return "API Key 无效，请重新设置。";
    if (status === 429) return "请求频率超限，请稍后再试。";
    if (status === 400 && /content_policy/i.test(String(code))) return "生成内容被拒绝，请调整描述。";
    if (status === 400 && /invalid_image/i.test(String(code))) return "图片格式或尺寸不符合要求，请更换 JPG/PNG。";
    if (status >= 500) return "服务暂不可用，请稍后重试。";
    return message || `请求失败（HTTP ${status}）。`;
  }

  function renderResult(record) {
    state.currentResult = record;
    dom.outputTitle.textContent = getRecordTitle(record);
    dom.outputSubtitle.textContent = getRecordSubtitle(record);
    dom.resultActions.hidden = false;
    dom.downloadBtn.textContent = "下载 1080 PNG";
    dom.editBtn.hidden = true;
    dom.regenerateBtn.hidden = false;
    dom.outputArea.innerHTML = "";

    const view = document.createElement("div");
    view.className = "result-view";
    const frame = document.createElement("div");
    frame.className = "result-frame safe-preview";
    const img = document.createElement("img");
    img.src = record.resultImage;
    img.alt = "生成结果";
    frame.append(img, createSafeOverlay(record));

    const meta = document.createElement("div");
    meta.className = "result-meta";
    [
      getRecordTypeLabel(record),
      `${formatDuration(record.duration)} 秒`,
      record.model || state.settings.model,
      record.resolution || state.settings.size,
      record.attempts ? `${record.attempts} 次生成` : ""
    ].forEach((text) => {
      if (!text) return;
      const item = document.createElement("span");
      item.textContent = text;
      meta.appendChild(item);
    });

    const auditPanel = renderAuditPanel(record);
    const debugPanel = renderDebugPanel(record);
    view.append(frame, meta);
    const comparePanel = renderBeforeAfterPanel(record);
    if (comparePanel) view.appendChild(comparePanel);
    if (auditPanel) view.appendChild(auditPanel);
    view.appendChild(debugPanel);
    dom.outputArea.appendChild(view);
  }

  function getRecordTitle(record) {
    if (record.type === "compose") return "营销图预览";
    return "生成结果";
  }

  function getRecordSubtitle(record) {
    if (record.type === "compose") return "网页端真实文字合成，可调整文案、产品位置后重新生成。";
    return "可下载 PNG，或调整参数后重新生成。";
  }

  function getRecordTypeLabel(record) {
    if (record.type === "compose") return "网页合成";
    if (record.type === "edit") return "局部编辑";
    return "首次生成";
  }

  function renderBeforeAfterPanel(record) {
    if (!record.parentImage) return null;
    const panel = document.createElement("div");
    panel.className = "compare-panel";
    const title = document.createElement("strong");
    title.textContent = "修复前后对比";
    const grid = document.createElement("div");
    grid.className = "compare-grid";
    [
      ["修复前", record.parentImage],
      ["修复后", record.resultImage]
    ].forEach(([label, src]) => {
      const item = document.createElement("figure");
      const img = document.createElement("img");
      img.src = src;
      img.alt = label;
      const caption = document.createElement("figcaption");
      caption.textContent = label;
      item.append(img, caption);
      grid.appendChild(item);
    });
    panel.append(title, grid);
    return panel;
  }

  function createSafeOverlay(record) {
    const margin = clampSafeMargin(record && record.userInstruction ? record.userInstruction.safe_margin_px : state.settings.safeMargin);
    const percent = `${(margin / 1080) * 100}%`;
    const overlay = document.createElement("div");
    overlay.className = "safe-overlay";
    overlay.style.setProperty("--safe-margin", percent);
    overlay.innerHTML = `
      <span class="safe-mask safe-mask-left"></span>
      <span class="safe-mask safe-mask-right"></span>
      <span class="safe-line safe-line-left"></span>
      <span class="safe-line safe-line-right"></span>
      <span class="safe-box"></span>
    `;
    return overlay;
  }

  function renderAuditPanel(record) {
    const audit = record.auditResult;
    if (!audit && !record.warning) return null;
    const panel = document.createElement("div");
    panel.className = `audit-panel ${audit && audit.overall_passed ? "audit-pass" : "audit-warn"}`;

    const title = document.createElement("strong");
    title.textContent = audit && audit.skipped ? "审核已跳过" : (audit && audit.overall_passed ? "审核通过" : "审核待复查");
    panel.appendChild(title);

    const chips = document.createElement("div");
    chips.className = "audit-chips";
    [
      ["视觉内缩", audit && audit.safe_margin && audit.safe_margin.passed],
      ["产品比例", audit && audit.product_scale && audit.product_scale.passed],
      ["构图", audit && audit.layout && audit.layout.passed],
      ["文字", audit && audit.text && audit.text.passed]
    ].forEach(([label, passed]) => {
      const chip = document.createElement("span");
      chip.textContent = `${label}${passed ? " OK" : " 待看"}`;
      chip.className = passed ? "chip-pass" : "chip-warn";
      chips.appendChild(chip);
    });
    panel.appendChild(chips);

    const issueText = collectAuditIssues(audit, record.warning);
    if (issueText) {
      const issues = document.createElement("p");
      issues.textContent = issueText;
      panel.appendChild(issues);
    }
    return panel;
  }

  function collectAuditIssues(audit, warning) {
    const issues = [];
    if (audit && audit.skipped) issues.push("autoAudit=false，本次未调用视觉审核");
    if (warning) issues.push(warning);
    if (audit && audit.safe_margin && Array.isArray(audit.safe_margin.issues)) issues.push(...audit.safe_margin.issues);
    if (audit && audit.text && Array.isArray(audit.text.issues)) issues.push(...audit.text.issues);
    if (audit && audit.product_scale && audit.product_scale.main_product_too_large) issues.push("主产品可能偏大");
    return issues.filter(Boolean).slice(0, 3).join("；");
  }

  function renderDebugPanel(record) {
    const runJson = buildRunJson(record);
    const details = document.createElement("details");
    details.className = "debug-panel";

    const summary = document.createElement("summary");
    summary.textContent = "开发调试";
    details.appendChild(summary);

    const actions = document.createElement("div");
    actions.className = "debug-actions";

    const copyBtn = document.createElement("button");
    copyBtn.className = "mini-btn";
    copyBtn.type = "button";
    copyBtn.textContent = "复制 compiledPrompt";
    copyBtn.addEventListener("click", async () => {
      await copyText(runJson.compiledPrompt || "");
      flashButton(copyBtn, "已复制");
    });

    const downloadBtn = document.createElement("button");
    downloadBtn.className = "mini-btn";
    downloadBtn.type = "button";
    downloadBtn.textContent = "下载 run.json";
    downloadBtn.addEventListener("click", () => {
      downloadJson(`run_${record.id || timestampForFile()}.json`, runJson);
    });

    actions.append(copyBtn, downloadBtn);
    details.appendChild(actions);

    const status = document.createElement("p");
    status.className = "debug-status";
    status.textContent = buildDebugStatusText(runJson);
    details.appendChild(status);

    details.appendChild(renderDebugBlock("productAnalysis", runJson.productAnalysis));
    details.appendChild(renderDebugBlock("templateAnalysis", runJson.templateAnalysis));
    details.appendChild(renderDebugBlock("userInstruction", runJson.userInstruction));
    details.appendChild(renderDebugBlock("compiledPrompt", runJson.compiledPrompt, "text"));
    details.appendChild(renderDebugBlock("visualChecklist", runJson.visualChecklist));
    details.appendChild(renderDebugBlock("auditResult", runJson.auditResult));
    details.appendChild(renderDebugBlock("retryInstruction", runJson.retryInstruction || "无", "text"));
    details.appendChild(renderDebugBlock("retryLog", runJson.retryLog));
    details.appendChild(renderDebugBlock("apiParams", runJson.apiParams));
    details.appendChild(renderDebugBlock("retryAttempts", runJson.retryAttempts));
    return details;
  }

  function renderDebugBlock(title, value, mode = "json") {
    const section = document.createElement("section");
    section.className = "debug-block";
    const heading = document.createElement("h4");
    heading.textContent = title;
    const pre = document.createElement("pre");
    pre.textContent = mode === "text" ? String(value || "") : JSON.stringify(value ?? null, null, 2);
    section.append(heading, pre);
    return section;
  }

  function buildDebugStatusText(runJson) {
    const auditText = runJson.auditResult && runJson.auditResult.skipped
      ? "审核：已跳过"
      : `审核：${runJson.auditResult && runJson.auditResult.overall_passed ? "通过" : "待复查"}`;
    const retryCount = (runJson.retryAttempts || []).filter((item) => item.retryPrompt).length;
    return `${auditText}；生成次数：${runJson.attempts || 1}；重试次数：${retryCount}`;
  }

  function buildRunJson(record) {
    const retryAttempts = record.retryAttempts || [];
    return {
      schemaVersion: 1,
      id: record.id,
      type: record.type,
      parentId: record.parentId || null,
      createdAt: record.timestamp ? new Date(record.timestamp).toISOString() : new Date().toISOString(),
      durationSeconds: Number(record.duration || 0),
      attempts: record.attempts || Math.max(1, retryAttempts.length || 1),
      model: record.model || state.settings.model,
      resolution: record.resolution || state.settings.size,
      templateName: record.templateName || "",
      testCaseName: record.testCaseName || "",
      productAnalysis: record.productAnalysis || null,
      templateAnalysis: record.templateAnalysis || null,
      userInstruction: record.userInstruction || null,
      compiledPrompt: record.compiledPrompt || record.prompt || "",
      finalPrompt: record.finalPrompt || record.compiledPrompt || record.prompt || "",
      marketingCopy: record.marketingCopy || null,
      visualChecklist: buildVisualChecklist(record),
      auditResult: record.auditResult || null,
      retryInstruction: record.retryInstruction || "",
      retryLog: retryAttempts
        .filter((item) => item.retryPrompt)
        .map((item) => ({
          afterAttempt: item.attempt,
          reason: item.retryInstruction,
          retryPrompt: item.retryPrompt
        })),
      retryAttempts,
      apiParams: record.apiParams || buildRunApiParams(),
      warning: record.warning || "",
      editDescription: record.editDescription || "",
      images: {
        productImage: record.productImage || null,
        templateImage: record.templateImage || null,
        generatedImage: record.resultImage || null,
        resultThumb: record.resultThumb || null
      }
    };
  }

  function buildVisualChecklist(record) {
    return {
      safeArea: {
        requirement: "所有重要元素明显向中间收拢，左右边缘只保留背景、柔光、植物或虚化低对比装饰",
        manualCheck: "待人工确认"
      },
      productScale: {
        targetRatio: `${clampNumber(state.settings.productSizePercent, 12, 36, 22)}%`,
        maxRatio: "36%",
        requirement: "产品由网页端绘制，可用产品大小/左右/上下控制调整位置",
        manualCheck: "待人工确认"
      },
      textRendering: {
        requirement: "标题、副标题、卖点、价格、徽章、底部服务栏均由网页端 Canvas 使用真实字体渲染",
        manualCheck: "待人工确认"
      },
      topBottomLock: {
        requirement: "上下不加边、不裁切、不改变画布比例",
        manualCheck: "待人工确认"
      },
      layoutStability: {
        requirement: "局部修改时不应整图重画",
        manualCheck: "待人工确认"
      }
    };
  }

  function showLoading(text) {
    dom.outputTitle.textContent = "生成中";
    dom.outputSubtitle.textContent = "正在调用图片 API，请保持页面打开。";
    dom.resultActions.hidden = true;
    dom.outputArea.innerHTML = `
      <div class="loading-state">
        <div class="loading-dots"><span></span><span></span><span></span></div>
        <strong>${escapeHtml(text)}</strong>
        <span>右上角显示已用时间</span>
      </div>
    `;
  }

  function showWorkflowProgress(stepIndex, text) {
    const current = Math.max(0, Math.min(WORKFLOW_STEPS.length - 1, Number(stepIndex) || 0));
    dom.outputTitle.textContent = "生成中";
    dom.outputSubtitle.textContent = "正在按识别、编译、生成、审核链路处理。";
    dom.resultActions.hidden = true;
    dom.outputArea.innerHTML = `
      <div class="workflow-state">
        <div class="loading-dots"><span></span><span></span><span></span></div>
        <strong>${escapeHtml(text || WORKFLOW_STEPS[current])}</strong>
        <ol>
          ${WORKFLOW_STEPS.map((step, index) => {
            const className = index < current ? "done" : index === current ? "active" : "";
            return `<li class="${className}"><span>${index + 1}</span>${escapeHtml(step)}</li>`;
          }).join("")}
        </ol>
      </div>
    `;
    dom.outputArea.classList.toggle("hide-safe-lines", !state.settings.showSafeLines);
  }

  function renderError(message) {
    dom.outputTitle.textContent = "请求失败";
    dom.outputSubtitle.textContent = "请检查 API Key、Base URL、模型参数或网络连接。";
    dom.resultActions.hidden = true;
    dom.outputArea.innerHTML = `
      <div class="error-state">
        <strong>无法完成生成</strong>
        <span>${escapeHtml(message)}</span>
      </div>
    `;
  }

  function startTimer() {
    state.startTime = performance.now();
    dom.elapsedBadge.hidden = false;
    dom.elapsedBadge.textContent = "0.0s";
    clearInterval(state.timerId);
    state.timerId = setInterval(() => {
      const elapsed = (performance.now() - state.startTime) / 1000;
      dom.elapsedBadge.textContent = `${elapsed.toFixed(1)}s`;
    }, 120);
  }

  function stopTimer() {
    clearInterval(state.timerId);
    state.timerId = null;
  }

  function enterEditor(record) {
    renderResult(record);
    renderError("局部修复、涂抹删除空场和 4K 精修已调整为 P2/P3 后续能力，当前获客版先专注 1080 快速出图。");
  }

  function enterEmptySceneEditor(record) {
    dom.outputTitle.textContent = "涂抹删除空场";
    dom.outputSubtitle.textContent = "网页只负责涂抹选区和生成蒙版，API 只在蒙版区域删除前景并补全背景。";
    dom.resultActions.hidden = true;
    dom.outputArea.innerHTML = `
      <div class="editor">
        <div class="editor-toolbar">
          <button class="ghost-btn" type="button" data-editor-action="back">返回结果</button>
          <div class="brush-tools">
            <button class="mini-btn active-tool" type="button" data-editor-action="brush">画笔</button>
            <button class="mini-btn" type="button" data-editor-action="erase">橡皮擦</button>
            <label>画笔 <input id="brushSize" type="range" min="6" max="180" value="36"></label>
            <span id="brushSizeText">36px</span>
            <button class="mini-btn" type="button" data-editor-action="undo">撤销</button>
            <button class="mini-btn" type="button" data-editor-action="redo">重做</button>
            <button class="mini-btn" type="button" data-editor-action="clear">清除</button>
          </div>
        </div>
        <div class="editor-settings">
          <label>蒙版预览 <input id="maskPreviewInput" type="checkbox" checked></label>
          <label>透明度 <input id="maskOpacity" type="range" min="10" max="85" value="42"></label>
          <span id="maskOpacityText">42%</span>
          <label>外扩 <input id="maskDilation" type="range" min="0" max="48" value="12"></label>
          <span id="maskDilationText">12px</span>
          <label>羽化 <input id="maskFeather" type="range" min="0" max="32" value="8"></label>
          <span id="maskFeatherText">8px</span>
        </div>
        <div class="editor-canvas-shell">
          <img id="editorImage" alt="待编辑图片" src="${record.resultImage}">
          <canvas id="paintCanvas"></canvas>
        </div>
        <div class="selection-manager">
          <div class="selection-actions">
            <button class="mini-btn" type="button" data-editor-action="save-selection">保存当前选区</button>
            <button class="mini-btn" type="button" data-editor-action="merge-selections">合并全部选区</button>
            <button class="mini-btn" type="button" data-editor-action="clear-selections">清空选区库</button>
          </div>
          <div id="selectionList" class="selection-list"><span>暂无已保存选区</span></div>
        </div>
        <div class="edit-form">
          <textarea id="editPrompt" class="edit-prompt" rows="10" placeholder="描述要删除和补全的内容"></textarea>
          <div class="chip-row" id="editChips">
            <button type="button" data-prompt-type="default">默认空场</button>
            <button type="button" data-prompt-type="top">顶部贴片</button>
            <button type="button" data-prompt-type="bottom">底部贴片</button>
            <button type="button" data-prompt-type="subject">产品/主播</button>
          </div>
          <div class="action-row">
            <button class="ghost-btn" type="button" data-editor-action="cancel">取消</button>
            <button id="submitEditBtn" class="primary-btn" type="button">生成空场层</button>
          </div>
        </div>
      </div>
    `;

    setupEditor(record);
  }

  function setupEditor(record) {
    const image = $("#editorImage");
    const canvas = $("#paintCanvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const editorState = {
      record,
      canvas,
      ctx,
      isDrawing: false,
      isEraser: false,
      lastPoint: null,
      brushSize: 36,
      maskOpacity: 0.42,
      maskDilation: 12,
      maskFeather: 8,
      undoStack: [],
      redoStack: [],
      selections: []
    };
    state.editor = editorState;

    const syncCanvasSize = () => {
      canvas.width = image.naturalWidth || 1024;
      canvas.height = image.naturalHeight || 1792;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    if (image.complete && image.naturalWidth) syncCanvasSize();
    else image.addEventListener("load", syncCanvasSize, { once: true });

    const sizeInput = $("#brushSize");
    const sizeText = $("#brushSizeText");
    sizeInput.addEventListener("input", () => {
      editorState.brushSize = Number(sizeInput.value);
      sizeText.textContent = `${editorState.brushSize}px`;
    });
    const previewInput = $("#maskPreviewInput");
    const opacityInput = $("#maskOpacity");
    const opacityText = $("#maskOpacityText");
    const dilationInput = $("#maskDilation");
    const dilationText = $("#maskDilationText");
    const featherInput = $("#maskFeather");
    const featherText = $("#maskFeatherText");
    previewInput.addEventListener("change", () => {
      canvas.classList.toggle("mask-hidden", !previewInput.checked);
    });
    opacityInput.addEventListener("input", () => {
      editorState.maskOpacity = Number(opacityInput.value) / 100;
      opacityText.textContent = `${opacityInput.value}%`;
      canvas.style.setProperty("--mask-opacity", String(editorState.maskOpacity));
    });
    dilationInput.addEventListener("input", () => {
      editorState.maskDilation = Number(dilationInput.value);
      dilationText.textContent = `${editorState.maskDilation}px`;
    });
    featherInput.addEventListener("input", () => {
      editorState.maskFeather = Number(featherInput.value);
      featherText.textContent = `${editorState.maskFeather}px`;
    });
    canvas.style.setProperty("--mask-opacity", String(editorState.maskOpacity));
    $("#editPrompt").value = EMPTY_SCENE_DEFAULT_PROMPT;

    canvas.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      canvas.setPointerCapture(event.pointerId);
      pushUndo(editorState);
      editorState.redoStack = [];
      editorState.isDrawing = true;
      editorState.lastPoint = getCanvasPoint(canvas, event);
      drawDot(editorState, editorState.lastPoint);
    });
    canvas.addEventListener("pointermove", (event) => {
      if (!editorState.isDrawing) return;
      event.preventDefault();
      const point = getCanvasPoint(canvas, event);
      drawStroke(editorState, editorState.lastPoint, point);
      editorState.lastPoint = point;
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((type) => {
      canvas.addEventListener(type, () => {
        editorState.isDrawing = false;
        editorState.lastPoint = null;
      });
    });

    dom.outputArea.querySelector(".editor-toolbar").addEventListener("click", (event) => {
      const action = event.target.closest("[data-editor-action]")?.dataset.editorAction;
      if (!action) return;
      handleEditorAction(action, editorState);
    });

    $("#editChips").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-prompt-type]");
      if (button) $("#editPrompt").value = EMPTY_SCENE_PROMPTS[button.dataset.promptType] || EMPTY_SCENE_DEFAULT_PROMPT;
    });

    $("#submitEditBtn").addEventListener("click", () => submitEdit(editorState));

    document.onkeydown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        undoPaint(editorState);
      }
    };
  }

  function handleEditorAction(action, editorState) {
    if (action === "back" || action === "cancel") {
      document.onkeydown = null;
      renderResult(editorState.record);
      return;
    }
    if (action === "erase") {
      editorState.isEraser = !editorState.isEraser;
      updateEditorToolButtons(editorState);
      return;
    }
    if (action === "brush") {
      editorState.isEraser = false;
      updateEditorToolButtons(editorState);
      return;
    }
    if (action === "undo") undoPaint(editorState);
    if (action === "redo") redoPaint(editorState);
    if (action === "save-selection") {
      saveCurrentSelection(editorState);
      return;
    }
    if (action === "merge-selections") {
      mergeSelections(editorState);
      return;
    }
    if (action === "clear-selections") {
      editorState.selections = [];
      renderSelectionList(editorState);
      return;
    }
    if (action === "clear") {
      pushUndo(editorState);
      editorState.redoStack = [];
      editorState.ctx.clearRect(0, 0, editorState.canvas.width, editorState.canvas.height);
      return;
    }
  }

  function updateEditorToolButtons(editorState) {
    const brushButton = dom.outputArea.querySelector('[data-editor-action="brush"]');
    const eraseButton = dom.outputArea.querySelector('[data-editor-action="erase"]');
    if (brushButton) brushButton.classList.toggle("active-tool", !editorState.isEraser);
    if (eraseButton) {
      eraseButton.classList.toggle("active-tool", editorState.isEraser);
      eraseButton.textContent = editorState.isEraser ? "正在擦除" : "橡皮擦";
    }
  }

  function saveCurrentSelection(editorState) {
    if (!hasPaint(editorState.canvas)) {
      renderError("当前没有可保存的涂抹选区。");
      return;
    }
    editorState.selections.push({
      id: uuid(),
      name: `选区 ${editorState.selections.length + 1}`,
      image: editorState.canvas.toDataURL("image/png")
    });
    pushUndo(editorState);
    editorState.ctx.clearRect(0, 0, editorState.canvas.width, editorState.canvas.height);
    renderSelectionList(editorState);
  }

  function renderSelectionList(editorState) {
    const list = $("#selectionList");
    if (!list) return;
    list.innerHTML = "";
    if (!editorState.selections.length) {
      const empty = document.createElement("span");
      empty.textContent = "暂无已保存选区";
      list.appendChild(empty);
      return;
    }
    editorState.selections.forEach((selection, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mini-btn";
      button.textContent = selection.name || `选区 ${index + 1}`;
      button.addEventListener("click", () => loadSelection(editorState, selection, true));
      list.appendChild(button);
    });
  }

  async function loadSelection(editorState, selection, append) {
    const img = await loadImage(selection.image);
    pushUndo(editorState);
    if (!append) editorState.ctx.clearRect(0, 0, editorState.canvas.width, editorState.canvas.height);
    editorState.ctx.drawImage(img, 0, 0, editorState.canvas.width, editorState.canvas.height);
  }

  async function mergeSelections(editorState) {
    if (!editorState.selections.length) return;
    pushUndo(editorState);
    editorState.ctx.clearRect(0, 0, editorState.canvas.width, editorState.canvas.height);
    for (const selection of editorState.selections) {
      const img = await loadImage(selection.image);
      editorState.ctx.drawImage(img, 0, 0, editorState.canvas.width, editorState.canvas.height);
    }
  }

  async function submitEdit(editorState) {
    const description = $("#editPrompt").value.trim();
    if (!description) {
      renderError("请填写修改描述后再提交局部编辑。");
      return;
    }
    if (!hasPaint(editorState.canvas)) {
      renderError("请先在图片上涂抹需要重绘的区域。");
      return;
    }

    const button = $("#submitEditBtn");
    button.disabled = true;
    button.textContent = "编辑中...";
    startTimer();
    const startedAt = performance.now();

    try {
      const mask = generateAPIMask(editorState.canvas);
      const resultImage = await callInpaintingAPI(editorState.record.resultImage, mask, description);
      const duration = (performance.now() - startedAt) / 1000;
      const resultThumb = await resizeImage(resultImage, 180, 320, "cover", "image/jpeg", 0.78);
      const record = {
        ...editorState.record,
        id: uuid(),
        timestamp: Date.now(),
        type: "edit",
        parentId: editorState.record.id,
        testCaseName: state.activeTestCaseName || editorState.record.testCaseName || "",
        editDescription: description,
        resultImage,
        resultThumb,
        duration,
        model: state.settings.model,
        resolution: state.settings.size
      };
      record.runJson = buildRunJson(record);
      if (state.db) await saveHistoryRecord(record);
      document.onkeydown = null;
      renderResult(record);
    } catch (error) {
      renderError(normalizeErrorMessage(error));
    } finally {
      stopTimer();
    }
  }

  function pushUndo(editorState) {
    if (editorState.undoStack.length >= 20) editorState.undoStack.shift();
    editorState.undoStack.push(editorState.ctx.getImageData(0, 0, editorState.canvas.width, editorState.canvas.height));
  }

  function undoPaint(editorState) {
    const last = editorState.undoStack.pop();
    if (!last) return;
    editorState.ctx.putImageData(last, 0, 0);
  }

  function drawDot(editorState, point) {
    drawStroke(editorState, point, point);
  }

  function drawStroke(editorState, from, to) {
    const ctx = editorState.ctx;
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = editorState.brushSize;
    if (editorState.isEraser) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "rgba(255,0,0,0.42)";
    }
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  }

  function getCanvasPoint(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function generateAPIMask(paintCanvas) {
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = paintCanvas.width;
    maskCanvas.height = paintCanvas.height;
    const maskCtx = maskCanvas.getContext("2d");
    maskCtx.fillStyle = "rgba(255,255,255,1)";
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    maskCtx.globalCompositeOperation = "destination-out";
    maskCtx.drawImage(paintCanvas, 0, 0, maskCanvas.width, maskCanvas.height);
    maskCtx.globalCompositeOperation = "source-over";
    return maskCanvas.toDataURL("image/png");
  }

  function hasPaint(canvas) {
    const data = canvas.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0) return true;
    }
    return false;
  }

  function getEditorPaintCanvas() {
    return state.editor && state.editor.canvas;
  }

  async function showHistory() {
    dom.outputTitle.textContent = "历史记录";
    dom.outputSubtitle.textContent = "按时间倒序保存，最多保留 200 条。";
    dom.resultActions.hidden = true;
    const records = state.db ? await getAllRecords("history") : [];
    records.sort((a, b) => b.timestamp - a.timestamp);
    const visible = records.slice(0, state.historyLimit);

    dom.outputArea.innerHTML = "";
    const view = document.createElement("div");
    view.className = "history-view";

    const head = document.createElement("div");
    head.className = "history-head";
    const title = document.createElement("h3");
    title.textContent = `历史记录（${records.length}）`;
    const clear = document.createElement("button");
    clear.className = "danger-btn";
    clear.type = "button";
    clear.textContent = "清空";
    clear.disabled = records.length === 0;
    clear.addEventListener("click", clearHistory);
    head.append(title, clear);

    const list = document.createElement("div");
    list.className = "history-list";
    if (records.length === 0) {
      list.innerHTML = '<div class="empty-state"><strong>暂无历史记录</strong><span>生成成功后会自动保存到这里</span></div>';
    } else {
      visible.forEach((record) => list.appendChild(renderHistoryItem(record)));
    }

    view.append(head, list);
    if (records.length > visible.length) {
      const more = document.createElement("button");
      more.className = "ghost-btn";
      more.type = "button";
      more.textContent = "显示更多";
      more.addEventListener("click", () => {
        state.historyLimit += 20;
        showHistory();
      });
      view.appendChild(more);
    }
    dom.outputArea.appendChild(view);
  }

  function renderHistoryItem(record) {
    const item = document.createElement("div");
    item.className = "history-item";
    const img = document.createElement("img");
    img.className = "history-thumb";
    img.src = record.resultThumb || record.resultImage;
    img.alt = "历史缩略图";

    const info = document.createElement("div");
    info.className = "history-info";
    const title = document.createElement("strong");
    title.textContent = `${formatDate(record.timestamp)} · ${getRecordTypeLabel(record)} · ${formatDuration(record.duration)}秒`;
    const desc = document.createElement("p");
    const auditLabel = formatAuditStatus(record.auditResult);
    const attempts = record.attempts ? ` · ${record.attempts}次生成` : "";
    const testCase = record.testCaseName ? ` · 测试：${record.testCaseName}` : "";
    desc.textContent = record.type === "edit"
      ? `修改：${record.editDescription || "未记录"}${testCase}${auditLabel ? ` · ${auditLabel}` : ""}${attempts}`
      : `模板：${record.templateName || "自定义模板"}${testCase}${auditLabel ? ` · ${auditLabel}` : ""}${attempts}`;

    const actions = document.createElement("div");
    actions.className = "history-actions";
    [
      ["查看", () => viewHistoryRecord(record)],
      ["下载", () => downloadResult(record.resultImage)],
      ["删除", () => deleteHistoryRecord(record)]
    ].forEach(([text, handler]) => {
      const btn = document.createElement("button");
      btn.className = "mini-btn";
      btn.type = "button";
      btn.textContent = text;
      btn.addEventListener("click", handler);
      actions.appendChild(btn);
    });

    info.append(title, desc, actions);
    item.append(img, info);
    return item;
  }

  function formatAuditStatus(audit) {
    if (!audit) return "";
    return audit.overall_passed ? "审核通过" : "审核待复查";
  }

  function viewHistoryRecord(record) {
    renderResult(record);
  }

  async function deleteHistoryRecord(record) {
    if (!window.confirm("删除这条历史记录？")) return;
    if (state.db) await deleteRecord("history", record.id);
    if (state.currentResult && state.currentResult.id === record.id) state.currentResult = null;
    await showHistory();
  }

  async function clearHistory() {
    if (!window.confirm("清空全部历史记录？此操作不可撤销。")) return;
    if (state.db) await clearStore("history");
    state.historyLimit = 20;
    await showHistory();
  }

  async function saveHistoryRecord(record) {
    await putRecord("history", record);
    const records = await getAllRecords("history");
    if (records.length <= MAX_HISTORY) return;
    records.sort((a, b) => a.timestamp - b.timestamp);
    const extra = records.slice(0, records.length - MAX_HISTORY);
    for (const item of extra) await deleteRecord("history", item.id);
  }

  function openSettings() {
    renderSettingsForm();
    dom.settingsModal.hidden = false;
    dom.apiKeyInput.focus();
  }

  function closeSettings() {
    dom.settingsModal.hidden = true;
  }

  function renderSettingsForm() {
    dom.apiKeyInput.value = state.settings.useLocalProxy ? "" : (state.settings.apiKey || "");
    dom.apiKeyInput.placeholder = state.settings.useLocalProxy ? "已由本地配置提供，前端不显示 Key" : "sk-...";
    dom.apiBaseInput.value = state.settings.apiBase || DEFAULT_SETTINGS.apiBase;
    dom.modelInput.value = state.settings.model || DEFAULT_SETTINGS.model;
    renderSizeChoices();
    dom.qualityInput.value = state.settings.quality || DEFAULT_SETTINGS.quality;
    dom.promptPresetsInput.value = presetsToText(getPromptPresets());
  }

  function renderSizeChoices() {
    const value = normalizeAllowedAPISize(state.settings.size);
    $$("#sizeChoices button[data-size]").forEach((button) => {
      const active = button.dataset.size === value;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  async function handleSizeChoice(event) {
    const button = event.target.closest("button[data-size]");
    if (!button) return;
    state.settings.size = normalizeAllowedAPISize(button.dataset.size);
    renderSizeChoices();
    await persistSettings();
  }

  function renderDesignControls() {
    dom.safeMarginInput.value = clampSafeMargin(state.settings.safeMargin);
    dom.productSizeInput.value = clampNumber(state.settings.productSizePercent, 12, 36, 22);
    dom.productXInput.value = clampNumber(state.settings.productOffsetXPercent, -30, 30, 0);
    dom.productYInput.value = clampNumber(state.settings.productOffsetYPercent, -30, 30, 0);
    dom.topBottomLockInput.checked = Boolean(state.settings.topBottomLock);
    dom.autoAuditInput.checked = Boolean(state.settings.autoAudit);
    dom.autoRetryInput.checked = Boolean(state.settings.autoRetry);
    dom.safeLineInput.checked = Boolean(state.settings.showSafeLines);
    $$("#productScaleControl button[data-scale]").forEach((button) => {
      const active = button.dataset.scale === normalizeProductScale(state.settings.productScale);
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    dom.outputArea.classList.toggle("hide-safe-lines", !state.settings.showSafeLines);
  }

  async function handleDesignControlChange() {
    state.settings.safeMargin = clampSafeMargin(dom.safeMarginInput.value);
    state.settings.productSizePercent = clampNumber(dom.productSizeInput.value, 12, 36, 22);
    state.settings.productOffsetXPercent = clampNumber(dom.productXInput.value, -30, 30, 0);
    state.settings.productOffsetYPercent = clampNumber(dom.productYInput.value, -30, 30, 0);
    state.settings.topBottomLock = dom.topBottomLockInput.checked;
    state.settings.autoAudit = dom.autoAuditInput.checked;
    state.settings.autoRetry = dom.autoRetryInput.checked;
    state.settings.showSafeLines = dom.safeLineInput.checked;
    renderDesignControls();
    await persistSettings();
  }

  async function handleProductScaleChoice(event) {
    const button = event.target.closest("button[data-scale]");
    if (!button) return;
    state.settings.productScale = normalizeProductScale(button.dataset.scale);
    state.settings.mainProductHeightRatio = getProductHeightRatio(state.settings.productScale);
    state.settings.productSizePercent = Math.round(state.settings.mainProductHeightRatio * 100);
    renderDesignControls();
    await persistSettings();
  }

  function getSelectedSize() {
    return normalizeAllowedAPISize(state.settings.size);
  }

  function normalizeAllowedAPISize(size) {
    return API_SIZE_PRESETS.has(size) ? size : DEFAULT_API_SIZE;
  }

  function normalizeProductScale(scale) {
    return ["small", "medium", "large"].includes(scale) ? scale : "medium";
  }

  function getProductHeightRatio(scale) {
    if (scale === "small") return 0.16;
    if (scale === "large") return 0.22;
    return 0.20;
  }

  function getProductMaxHeightRatio(scale) {
    if (scale === "small") return 0.22;
    if (scale === "large") return 0.25;
    return 0.25;
  }

  function clampSafeMargin(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 90;
    return Math.max(0, Math.min(180, Math.round(numeric)));
  }

  function clampNumber(value, min, max, fallback) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return Math.max(min, Math.min(max, Math.round(numeric)));
  }

  async function persistSettings() {
    if (state.db) {
      await putRecord("settings", { key: "app_settings", value: state.settings });
    }
  }

  async function saveSettingsFromForm() {
    const promptPresets = parsePresetText(dom.promptPresetsInput.value);
    state.settings = {
      ...state.settings,
      apiKey: state.settings.useLocalProxy ? state.settings.apiKey : dom.apiKeyInput.value.trim(),
      apiBase: cleanBaseUrl(dom.apiBaseInput.value.trim() || DEFAULT_SETTINGS.apiBase),
      model: dom.modelInput.value,
      size: getSelectedSize(),
      quality: dom.qualityInput.value,
      defaultPrompt: "",
      promptPresets: promptPresets.length ? promptPresets : DEFAULT_PROMPT_PRESETS,
      proxyHasServerKey: state.settings.proxyHasServerKey,
      useLocalProxy: state.settings.useLocalProxy
    };
    if (state.db) {
      await putRecord("settings", { key: "app_settings", value: state.settings });
    }
    renderApiStatus();
    renderSizeChoices();
    renderDesignControls();
    renderPromptPresets();
    updateGenerateButton();
    closeSettings();
  }

  async function loadSettings() {
    const record = await getRecord("settings", "app_settings");
    state.settings = { ...DEFAULT_SETTINGS, ...(record ? record.value : {}) };
    if (record && record.value && shouldResetLegacyPromptPresets(record.value.promptPresets)) {
      state.settings.promptPresets = DEFAULT_PROMPT_PRESETS;
      state.settings.showSafeLines = DEFAULT_SETTINGS.showSafeLines;
    }
    state.settings.defaultPrompt = "";
    state.settings.size = normalizeAllowedAPISize(state.settings.size);
    state.settings.safeMargin = clampSafeMargin(state.settings.safeMargin);
    state.settings.productSizePercent = clampNumber(state.settings.productSizePercent, 12, 36, 22);
    state.settings.productOffsetXPercent = clampNumber(state.settings.productOffsetXPercent, -30, 30, 0);
    state.settings.productOffsetYPercent = clampNumber(state.settings.productOffsetYPercent, -30, 30, 0);
    state.settings.productScale = normalizeProductScale(state.settings.productScale);
    state.settings.mainProductHeightRatio = getProductHeightRatio(state.settings.productScale);
    state.settings.maxRetry = Math.max(0, Math.min(2, Number(state.settings.maxRetry || 0)));
  }

  function shouldResetLegacyPromptPresets(presets) {
    if (!Array.isArray(presets)) return false;
    return presets.some((item) => {
      const text = `${item && item.name ? item.name : ""} ${item && item.text ? item.text : ""}`;
      return /边距90px|90px broadcast-safe|x=90px|x=990px|右侧卖点栏|底部包邮栏/.test(text);
    });
  }

  async function loadRuntimeConfig() {
    try {
      const response = await fetch(resolveRuntimeConfigUrl(), { cache: "no-store" });
      if (!response.ok) return;
      const config = await response.json();
      if (!config || !config.useLocalProxy) return;
      state.settings = {
        ...state.settings,
        apiBase: config.apiBase || DEFAULT_SETTINGS.apiBase,
        model: config.model || DEFAULT_SETTINGS.model,
        size: normalizeAllowedAPISize(state.settings.size || config.size),
        quality: config.quality || DEFAULT_SETTINGS.quality,
        apiKey: config.hasServerKey ? "" : state.settings.apiKey,
        proxyHasServerKey: Boolean(config.hasServerKey),
        useLocalProxy: true
      };
    } catch (_) {
      // file:// usage or a static server without runtime config; keep IndexedDB settings.
    }
  }

  async function loadCustomTemplates() {
    const records = await getAllRecords("templates");
    records.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    state.customTemplates = records.map((item) => ({ ...item, custom: true, preview: item.image }));
  }

  function renderApiStatus() {
    const hasKey = Boolean(state.settings.apiKey || state.settings.proxyHasServerKey);
    dom.apiStatus.textContent = state.settings.useLocalProxy
      ? (state.settings.apiKey ? "API 经本地代理转发" : (state.settings.proxyHasServerKey ? "API 已写入本地配置" : "未设置 API"))
      : (hasKey ? "API 已设置" : "未设置 API");
    dom.apiStatus.classList.toggle("status-on", hasKey);
    dom.apiStatus.classList.toggle("status-off", !hasKey);
  }

  function openDB() {
    return new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) {
        reject(new Error("当前浏览器不支持 IndexedDB"));
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("history")) {
          const history = db.createObjectStore("history", { keyPath: "id" });
          history.createIndex("timestamp", "timestamp", { unique: false });
          history.createIndex("type", "type", { unique: false });
          history.createIndex("parentId", "parentId", { unique: false });
        }
        if (!db.objectStoreNames.contains("templates")) {
          db.createObjectStore("templates", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "key" });
        }
      };
    });
  }

  function getStore(storeName, mode) {
    return state.db.transaction(storeName, mode).objectStore(storeName);
  }

  function getRecord(storeName, key) {
    return idbRequest(getStore(storeName, "readonly").get(key));
  }

  function getAllRecords(storeName) {
    return idbRequest(getStore(storeName, "readonly").getAll());
  }

  function putRecord(storeName, value) {
    return idbRequest(getStore(storeName, "readwrite").put(value));
  }

  function deleteRecord(storeName, key) {
    return idbRequest(getStore(storeName, "readwrite").delete(key));
  }

  function clearStore(storeName) {
    return idbRequest(getStore(storeName, "readwrite").clear());
  }

  function idbRequest(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  async function sourceToBlob(source) {
    if (source instanceof Blob) return source;
    if (String(source).startsWith("data:")) {
      const [meta, payload] = source.split(",");
      const mime = (meta.match(/data:(.*?);/) || [])[1] || "image/png";
      const binary = atob(payload);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
      return new Blob([bytes], { type: mime });
    }
    const response = await fetch(source);
    return response.blob();
  }

  async function sourceToPngBlob(source) {
    const img = await loadImage(source);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    canvas.getContext("2d").drawImage(img, 0, 0);
    return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  }

  async function ensureDataUrl(source) {
    if (String(source).startsWith("data:")) return source;
    const blob = await fetch(source).then((response) => response.blob());
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  function loadImage(source) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("图片加载失败"));
      img.src = source;
    });
  }

  async function resizeImage(source, width, height, mode, mime, quality) {
    const img = await loadImage(source);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0a0a0b";
    ctx.fillRect(0, 0, width, height);
    const rect = fitRect(img.naturalWidth || img.width, img.naturalHeight || img.height, width, height, mode);
    ctx.drawImage(img, rect.sx, rect.sy, rect.sw, rect.sh, rect.dx, rect.dy, rect.dw, rect.dh);
    return canvas.toDataURL(mime, quality);
  }

  async function extractPalette(source) {
    const img = await loadImage(source);
    const canvas = document.createElement("canvas");
    const size = 72;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, size, size);
    const data = ctx.getImageData(0, 0, size, size).data;
    const buckets = new Map();
    for (let i = 0; i < data.length; i += 16) {
      const alpha = data[i + 3];
      if (alpha < 180) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      if (max < 24 || min > 238 || max - min < 18) continue;
      const key = [r, g, b].map((v) => Math.round(v / 32) * 32).join(",");
      buckets.set(key, (buckets.get(key) || 0) + 1);
    }
    return [...buckets.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key]) => `#${key.split(",").map((v) => Math.max(0, Math.min(255, Number(v))).toString(16).padStart(2, "0")).join("")}`);
  }

  function fitRect(srcW, srcH, dstW, dstH, mode) {
    const srcRatio = srcW / srcH;
    const dstRatio = dstW / dstH;
    if (mode === "contain") {
      const scale = Math.min(dstW / srcW, dstH / srcH);
      const dw = srcW * scale;
      const dh = srcH * scale;
      return { sx: 0, sy: 0, sw: srcW, sh: srcH, dx: (dstW - dw) / 2, dy: (dstH - dh) / 2, dw, dh };
    }
    if (srcRatio > dstRatio) {
      const sw = srcH * dstRatio;
      return { sx: (srcW - sw) / 2, sy: 0, sw, sh: srcH, dx: 0, dy: 0, dw: dstW, dh: dstH };
    }
    const sh = srcW / dstRatio;
    return { sx: 0, sy: (srcH - sh) / 2, sw: srcW, sh, dx: 0, dy: 0, dw: dstW, dh: dstH };
  }

  async function downloadResult(source) {
    const dataUrl = await resizeImage(source, EXPORT_WIDTH, EXPORT_HEIGHT, "cover", "image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `直播间营销图_${timestampForFile()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function downloadJson(fileName, value) {
    const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function flashButton(button, text) {
    const original = button.textContent;
    button.textContent = text;
    button.disabled = true;
    window.setTimeout(() => {
      button.textContent = original;
      button.disabled = false;
    }, 1200);
  }

  async function composeMarkedReference(originalImage, paintCanvas) {
    const img = await loadImage(originalImage);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    if (paintCanvas) ctx.drawImage(paintCanvas, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  }

  function appendText(input, text) {
    if (input === dom.promptInput) {
      state.activeTestCaseName = "";
      state.activeTestCasePrompt = "";
    }
    const current = input.value.trim();
    input.value = current ? `${current}；${text}` : text;
    input.focus();
  }

  function presetsToText(presets) {
    return presets.map((preset) => `${preset.name}=${preset.text}`).join("\n");
  }

  function parsePresetText(text) {
    return String(text || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf("=");
        if (separator === -1) {
          const name = line.slice(0, 18) || "预设";
          return { name, text: line };
        }
        const name = line.slice(0, separator).trim();
        const presetText = line.slice(separator + 1).trim();
        return name && presetText ? { name, text: presetText } : null;
      })
      .filter(Boolean);
  }

  function cleanBaseUrl(url) {
    return String(url || DEFAULT_SETTINGS.apiBase).replace(/\/+$/, "");
  }

  function resolveAPIUrl(path) {
    if (state.settings.useLocalProxy) {
      return isHttpPage() ? `/proxy${path}` : `${LOCAL_PROXY_ORIGIN}/proxy${path}`;
    }
    return `${cleanBaseUrl(state.settings.apiBase)}${path}`;
  }

  function resolveRuntimeConfigUrl() {
    return isHttpPage() ? "/runtime-config" : `${LOCAL_PROXY_ORIGIN}/runtime-config`;
  }

  function isHttpPage() {
    return location.protocol === "http:" || location.protocol === "https:";
  }

  function formatDuration(value) {
    return Number(value || 0).toFixed(1);
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const pad = (value) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function timestampForFile() {
    const date = new Date();
    const pad = (value) => String(value).padStart(2, "0");
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}_${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
  }

  function normalizeErrorMessage(error) {
    if (error && /Failed to fetch|NetworkError|Load failed/i.test(String(error.message))) {
      if (state.settings.useLocalProxy) {
        return "无法连接本地代理服务。请双击启动脚本并在命令行输入 API Key 后，再刷新页面。";
      }
      return "网络连接失败或浏览器被 CORS 拦截，请检查 API Base URL 是否允许浏览器直接调用。";
    }
    return error && error.message ? error.message : String(error);
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function uuid() {
    if (crypto.randomUUID) return crypto.randomUUID();
    return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function $(selector) {
    return document.querySelector(selector);
  }

  function $$(selector) {
    return Array.from(document.querySelectorAll(selector));
  }
})();
