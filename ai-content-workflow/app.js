const workflow = {
  stages: [
    {
      id: "offer",
      title: "产品卖点提炼",
      summary: "从产品、服务、案例和个人经验里提炼核心卖点。",
      outputs: ["核心卖点清单", "可信证据", "差异化表达"],
      prompt: "01_offer_extraction.md",
    },
    {
      id: "buyer",
      title: "买点映射",
      summary: "把卖点翻译成用户真实在意的需求、场景和阻力。",
      outputs: ["目标人群", "需求分层", "购买触发点"],
      prompt: "02_buyer_mapping.md",
    },
    {
      id: "opportunity",
      title: "蓝海机会分析",
      summary: "找到低竞争、高意图的搜索词、话题入口和曝光方向。",
      outputs: ["搜索词池", "内容角度", "竞争弱点"],
      prompt: "03_opportunity_analysis.md",
    },
    {
      id: "structure",
      title: "爆文结构拆解",
      summary: "拆解高转化内容的标题、开头、主体、证据和转化方式。",
      outputs: ["标题结构", "正文结构", "转化结构"],
      prompt: "04_viral_structure.md",
    },
    {
      id: "matrix",
      title: "选题矩阵",
      summary: "用用户需求、流量入口和内容结构组合成可生产选题。",
      outputs: ["选题库", "优先级", "验证批次"],
      prompt: "05_topic_matrix.md",
    },
    {
      id: "production",
      title: "批量笔记生产",
      summary: "按已验证结构批量生成可发布笔记。",
      outputs: ["笔记草稿", "封面文案", "发布标签"],
      prompt: "06_batch_note.md",
    },
    {
      id: "publish",
      title: "发布",
      summary: "按发布检查清单完成小红书或其他渠道发布。",
      outputs: ["发布时间", "发布链接", "初始标签"],
      prompt: "06_batch_note.md",
    },
    {
      id: "review",
      title: "数据复盘",
      summary: "分析发布效果，判断方向有效性。",
      outputs: ["曝光", "点击", "收藏", "评论", "转化线索"],
      prompt: "07_review_iteration.md",
    },
    {
      id: "iterate",
      title: "验证裂变",
      summary: "有效内容结构重写、扩写、换人群、换场景并放大效果。",
      outputs: ["裂变选题", "复用结构", "二次发布计划"],
      prompt: "07_review_iteration.md",
    },
    {
      id: "asset",
      title: "内容资产分类",
      summary: "按主题、用户阶段和转化价值分类，辅助战略判断。",
      outputs: ["资产库", "主题标签", "下一轮重点"],
      prompt: "07_review_iteration.md",
    },
  ],
};

const storageKey = "ai-content-workflow-state";
const fields = [
  "offerInput",
  "audienceInput",
  "sellingPointsInput",
  "needsInput",
  "trafficInput",
  "structuresInput",
];

let state = {
  activeStage: "offer",
  completed: {},
  topics: [],
  fields: {},
};

const demo = {
  offerInput: "高客单内容咨询 / 小红书选题陪跑 / AI 内容工作流搭建",
  audienceInput: "知识型创业者\n咨询师、教练、课程主理人\n想用小红书稳定获得精准咨询的人",
  sellingPointsInput:
    "把零散经验整理成可复用内容资产\n从用户买点反推选题，而不是凭感觉发内容\n用 AI 批量生成草稿，但保留真人判断和案例证据",
  needsInput:
    "不知道高客单产品怎么表达才不硬广\n发了很多内容但没有咨询\n想把案例变成可持续选题\n需要一套可以重复执行的内容流程",
  trafficInput:
    "小红书高客单转化\n知识博主选题\n咨询师小红书获客\n内容复盘怎么做\n小红书低粉变现",
  structuresInput: "避坑清单\n案例复盘\n问题诊断\n对比拆解\n步骤教程",
};

const promptCache = {};
const promptTexts = {
  "01_offer_extraction.md": `你是一个内容策略顾问。请基于我提供的产品、服务、案例、用户反馈和个人经验，提炼适合小红书内容表达的核心卖点。

请输出：
1. 核心卖点清单，每条卖点用一句用户听得懂的话表达。
2. 每条卖点对应的证据，包括案例、数据、过程、对比或经验。
3. 这条卖点最适合吸引的人群。
4. 不适合夸大的部分，避免虚假承诺。
5. 可直接用于标题或开头的表达。`,
  "02_buyer_mapping.md": `你是一个用户洞察分析师。请把我的卖点翻译成目标用户真正愿意点击、收藏、咨询或购买的买点。

请输出：
1. 用户画像分层：新手、进阶、强需求、高付费意愿。
2. 每类用户的真实痛点、焦虑、渴望和行动阻力。
3. 卖点到买点的映射表。
4. 每个买点对应的生活场景或工作场景。
5. 适合小红书表达的口语化选题句。`,
  "03_opportunity_analysis.md": `你是一个小红书搜索流量和内容机会分析师。请基于我的人群、买点和产品方向，寻找低竞争、高意图、适合持续生产的内容机会。

请输出：
1. 搜索词池：核心词、长尾词、场景词、问题词、对比词。
2. 每个搜索词背后的用户意图。
3. 内容切入角度：避坑、清单、案例、测评、教程、复盘、对比。
4. 竞争内容常见弱点。
5. 值得优先验证的 10 个选题。`,
  "04_viral_structure.md": `你是一个内容结构拆解专家。请拆解我提供的高互动笔记，提炼可复用的内容结构，而不是只总结内容。

请输出：
1. 标题结构：钩子、关键词、承诺、限定条件。
2. 开头结构：第一句话如何制造代入、冲突或收益。
3. 正文结构：信息排序、段落节奏、证据安排。
4. 转化结构：如何引导评论、私信、收藏或购买。
5. 可复用模板：用变量形式写出。
6. 适合我业务的改写方向。`,
  "05_topic_matrix.md": `你是一个内容选题策划。请用「用户需求 x 流量入口 x 内容结构」生成一组选题矩阵。

请输出表格字段：选题标题、用户需求、流量入口、内容结构、转化目标、优先级、需要的素材、发布后的验证指标。

约束：
1. 不要生成泛泛的知识科普。
2. 每个选题必须能指向具体用户场景。
3. 标题要有搜索词，但不要标题党。`,
  "06_batch_note.md": `你是一个小红书笔记撰写助手。请根据选题和已验证结构生成可发布草稿。

请输出：
1. 标题 5 个，分别偏搜索、痛点、结果、反差、案例。
2. 正文草稿，包含开头、主体、证据、结尾。
3. 封面文案 3 个。
4. 适合评论区引导的问题。
5. 标签建议。
6. 发布前需要补充的素材。`,
  "07_review_iteration.md": `你是一个内容增长分析师。请基于发布数据判断这批内容是否值得继续放大，并给出裂变方案。

请输出：
1. 每篇内容的表现判断：保留、改写、暂停。
2. 有效信号：曝光、点击、收藏、评论、私信、转化。
3. 失效原因推测：选题、标题、开头、结构、素材、转化。
4. 可裂变方向：换标题、换人群、换场景、换案例、换结构。
5. 下一批 10 个选题。
6. 需要沉淀到资产库的表达、结构和案例。`,
};

function qs(id) {
  return document.getElementById(id);
}

function splitLines(value) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function loadState() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    state.fields = { ...demo };
    return;
  }

  try {
    state = { ...state, ...JSON.parse(raw) };
  } catch {
    state.fields = { ...demo };
  }
}

function persistState() {
  fields.forEach((field) => {
    state.fields[field] = qs(field).value;
  });
  localStorage.setItem(storageKey, JSON.stringify(state, null, 2));
}

function showToast(message) {
  const toast = qs("toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1800);
}

function renderStages() {
  const nav = qs("stageNav");
  nav.innerHTML = "";

  workflow.stages.forEach((stage, index) => {
    const button = document.createElement("button");
    button.className = "stage-button";
    if (stage.id === state.activeStage) button.classList.add("is-active");
    if (state.completed[stage.id]) button.classList.add("is-done");
    button.type = "button";
    button.innerHTML = `
      <span class="stage-dot" aria-hidden="true"></span>
      <span>
        <span class="stage-title">${String(index + 1).padStart(2, "0")} ${stage.title}</span>
        <span class="stage-meta">${stage.summary}</span>
      </span>
    `;
    button.addEventListener("click", () => {
      state.activeStage = stage.id;
      persistState();
      render();
    });
    nav.appendChild(button);
  });
}

function renderActiveStage() {
  const index = workflow.stages.findIndex((stage) => stage.id === state.activeStage);
  const stage = workflow.stages[index] ?? workflow.stages[0];

  qs("activeTitle").textContent = stage.title;
  qs("activeStep").textContent = String(index + 1).padStart(2, "0");
  qs("stageTitle").textContent = stage.title;
  qs("stageSummary").textContent = stage.summary;
  qs("stageOutputs").textContent = stage.outputs.join("、");

  const list = qs("stageChecklist");
  list.innerHTML = "";
  stage.outputs.forEach((output) => {
    const id = `${stage.id}:${output}`;
    const item = document.createElement("label");
    item.className = "status-item";
    item.innerHTML = `
      <input type="checkbox" ${state.completed[id] ? "checked" : ""} />
      <span>
        <strong>${output}</strong>
        <span>${stage.title}完成后沉淀到项目资产库。</span>
      </span>
    `;
    const checkbox = item.querySelector("input");
    checkbox.addEventListener("change", () => {
      state.completed[id] = checkbox.checked;
      state.completed[stage.id] = stage.outputs.every((entry) => state.completed[`${stage.id}:${entry}`]);
      persistState();
      renderStages();
    });
    list.appendChild(item);
  });
}

function buildTopicTitle(need, traffic, structure) {
  const titleByStructure = {
    避坑清单: `${traffic}最容易踩的 5 个坑：${need}`,
    案例复盘: `一个真实案例：我是怎么解决「${need}」的`,
    问题诊断: `${need}，先检查这 3 个问题`,
    对比拆解: `${traffic}前后对比：差距不在努力，而在表达结构`,
    步骤教程: `${traffic}怎么做：从${need}开始拆`,
  };

  return titleByStructure[structure] ?? `${traffic}：用${structure}讲清楚「${need}」`;
}

function generateMatrix() {
  const needs = splitLines(qs("needsInput").value);
  const traffic = splitLines(qs("trafficInput").value);
  const structures = splitLines(qs("structuresInput").value);

  if (!needs.length || !traffic.length || !structures.length) {
    showToast("先补齐用户需求、流量入口和内容结构");
    return;
  }

  const nextTopics = [];
  needs.slice(0, 6).forEach((need, needIndex) => {
    traffic.slice(0, 6).forEach((entry, trafficIndex) => {
      const structure = structures[(needIndex + trafficIndex) % structures.length];
      nextTopics.push({
        id: crypto.randomUUID(),
        topic: buildTopicTitle(need, entry, structure),
        need,
        traffic: entry,
        structure,
        conversion: needIndex % 3 === 0 ? "评论互动" : needIndex % 3 === 1 ? "收藏关注" : "私信咨询",
        status: "待生产",
      });
    });
  });

  state.topics = nextTopics.slice(0, 30);
  state.activeStage = "matrix";
  persistState();
  render();
  showToast(`已生成 ${state.topics.length} 个选题`);
}

function renderTopics() {
  const rows = qs("topicRows");
  rows.innerHTML = "";

  if (!state.topics.length) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="6" class="empty-row">暂无选题</td>`;
    rows.appendChild(row);
    return;
  }

  state.topics.forEach((topic) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><strong>${topic.topic}</strong></td>
      <td>${topic.need}</td>
      <td>${topic.traffic}</td>
      <td>${topic.structure}</td>
      <td>${topic.conversion}</td>
      <td>
        <select class="status-select" aria-label="选题状态">
          ${["待生产", "已生产", "已发布", "保留", "改写", "暂停"]
            .map((status) => `<option value="${status}" ${status === topic.status ? "selected" : ""}>${status}</option>`)
            .join("")}
        </select>
      </td>
    `;
    row.querySelector("select").addEventListener("change", (event) => {
      topic.status = event.target.value;
      persistState();
    });
    rows.appendChild(row);
  });
}

async function copyCurrentPrompt() {
  const stage = workflow.stages.find((entry) => entry.id === state.activeStage) ?? workflow.stages[0];
  const promptText = promptTexts[stage.prompt];

  try {
    await navigator.clipboard.writeText(promptText);
    showToast("提示词已复制");
  } catch {
    promptCache.last = promptText;
    showToast("浏览器限制了复制，请打开 prompts 文件夹");
  }
}

function exportMarkdown() {
  persistState();
  const lines = [
    "# AI 内容工作流导出",
    "",
    "## 基础信息",
    "",
    `- 产品 / 服务：${state.fields.offerInput || ""}`,
    `- 目标用户：${state.fields.audienceInput || ""}`,
    "",
    "## 核心卖点",
    "",
    state.fields.sellingPointsInput || "",
    "",
    "## 选题矩阵",
    "",
    "| 选题 | 用户需求 | 流量入口 | 内容结构 | 转化目标 | 状态 |",
    "| --- | --- | --- | --- | --- | --- |",
    ...state.topics.map(
      (topic) =>
        `| ${topic.topic} | ${topic.need} | ${topic.traffic} | ${topic.structure} | ${topic.conversion} | ${topic.status} |`,
    ),
  ];
  downloadFile("ai-content-workflow-export.md", lines.join("\n"));
}

function exportJson() {
  persistState();
  downloadFile("ai-content-workflow-export.json", JSON.stringify(state, null, 2));
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function fillFields() {
  fields.forEach((field) => {
    setFieldValue(field);
    qs(field).addEventListener("input", () => {
      state.fields[field] = qs(field).value;
    });
  });
}

function setFieldValue(field) {
  qs(field).value = state.fields[field] ?? "";
}

function render() {
  renderStages();
  renderActiveStage();
  renderTopics();
}

function init() {
  loadState();
  fillFields();
  qs("saveState").addEventListener("click", () => {
    persistState();
    showToast("已保存到本地");
  });
  qs("generateMatrix").addEventListener("click", generateMatrix);
  qs("copyPrompt").addEventListener("click", copyCurrentPrompt);
  qs("exportMarkdown").addEventListener("click", exportMarkdown);
  qs("exportJson").addEventListener("click", exportJson);
  qs("clearTopics").addEventListener("click", () => {
    state.topics = [];
    persistState();
    renderTopics();
    showToast("选题已清空");
  });
  qs("resetDemo").addEventListener("click", () => {
    state.fields = { ...demo };
    fields.forEach(setFieldValue);
    persistState();
    showToast("示例已载入");
  });
  render();
}

init();
