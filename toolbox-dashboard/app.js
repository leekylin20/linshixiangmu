(function () {
  "use strict";

  const state = {
    manifest: null,
    tools: [],
    filtered: [],
    selectedCategory: "all",
    selectedStatus: "all",
    selectedRisk: "all",
    query: "",
    selectedToolId: null
  };

  const els = {
    categoryNav: document.getElementById("categoryNav"),
    statusFilters: document.getElementById("statusFilters"),
    riskFilters: document.getElementById("riskFilters"),
    searchInput: document.getElementById("searchInput"),
    toolGrid: document.getElementById("toolGrid"),
    resultCount: document.getElementById("resultCount"),
    metricTotal: document.getElementById("metricTotal"),
    metricVerified: document.getElementById("metricVerified"),
    metricLimited: document.getElementById("metricLimited"),
    metricHigh: document.getElementById("metricHigh"),
    metricDesign: document.getElementById("metricDesign"),
    sampleCount: document.getElementById("sampleCount"),
    openDesignSampleGrid: document.getElementById("openDesignSampleGrid"),
    detailEmpty: document.getElementById("detailEmpty"),
    detailContent: document.getElementById("detailContent"),
    detailCategory: document.getElementById("detailCategory"),
    detailName: document.getElementById("detailName"),
    detailSummary: document.getElementById("detailSummary"),
    detailBadges: document.getElementById("detailBadges"),
    detailEntrypoint: document.getElementById("detailEntrypoint"),
    detailPath: document.getElementById("detailPath"),
    detailDeps: document.getElementById("detailDeps"),
    detailOutputs: document.getElementById("detailOutputs"),
    detailRunHint: document.getElementById("detailRunHint"),
    docLinks: document.getElementById("docLinks"),
    artifactLinks: document.getElementById("artifactLinks"),
    closeDetailButton: document.getElementById("closeDetailButton"),
    outputDialog: document.getElementById("outputDialog"),
    dialogTitle: document.getElementById("dialogTitle"),
    generatedOutput: document.getElementById("generatedOutput"),
    copyOutputButton: document.getElementById("copyOutputButton"),
    copyWorkspacePromptButton: document.getElementById("copyWorkspacePromptButton"),
    showAuditButton: document.getElementById("showAuditButton"),
    showDesignButton: document.getElementById("showDesignButton"),
    toast: document.getElementById("toast")
  };

  const statusClass = {
    verified: "status-verified",
    limited: "status-limited",
    indexed: "status-indexed",
    candidate: "status-candidate",
    blocked: "status-blocked",
    archived: "status-indexed"
  };

  const riskClass = {
    low: "risk-low",
    medium: "risk-medium",
    high: "risk-high",
    blocked: "risk-blocked"
  };

  const sampleStatusClass = {
    passed: "status-verified",
    pending: "status-limited"
  };

  const openDesignSamples = [
    {
      id: "sample-01",
      toolId: "watermark-batch",
      title: "Open Design sample 01",
      toolName: "批量加水印",
      template: "低风险工具说明页",
      summary: "说明 input、output、config.ini 和一键加水印.bat 的关系，作为低风险工具交付页基准。",
      risk: "low",
      status: "passed",
      verdict: "终审通过",
      page: "../toolbox-artifacts/watermark-batch-open-design.html",
      record: "../toolbox-runs/20260515-151107_watermark-batch-open-design-artifact.md",
      audit: "../个人工具箱工作台-OpenDesign样例登记表.md"
    },
    {
      id: "sample-02",
      toolId: "ai-content-workflow",
      title: "Open Design sample 02",
      toolName: "AI 内容工作流",
      template: "流程型工具说明页",
      summary: "覆盖 10 个内容生产阶段、本地保存、Markdown/JSON 导出与复盘回流边界。",
      risk: "low",
      status: "passed",
      verdict: "终审通过",
      page: "../toolbox-artifacts/ai-content-workflow-open-design.html",
      record: "../toolbox-runs/20260516-005616_ai-content-workflow-open-design-artifact.md",
      audit: "../toolbox-runs/20260516-233847_open-design-sample-02-final-approval.md"
    },
    {
      id: "sample-03",
      toolId: "knowledge-memory",
      title: "Open Design sample 03",
      toolName: "知识记忆索引",
      template: "知识索引导航页",
      summary: "说明 active-memory、schema、JSONL 记录和 Obsidian 主库之间的只读召回关系。",
      risk: "low",
      status: "passed",
      verdict: "终审通过",
      page: "../toolbox-artifacts/knowledge-memory-open-design.html",
      record: "../toolbox-runs/20260517-001229_knowledge-memory-open-design-artifact.md",
      audit: "../toolbox-runs/20260517-004144_open-design-sample-03-final-approval.md"
    },
    {
      id: "sample-04",
      toolId: "file-to-md",
      title: "Open Design sample 04",
      toolName: "批量转 Markdown",
      template: "高风险任务包展示页",
      summary: "展示递归处理、联网转写和 API key 边界，只作为高风险任务包说明页等待终审。",
      risk: "high",
      status: "pending",
      verdict: "待终审",
      page: "../toolbox-artifacts/file-to-md-open-design.html",
      record: "../toolbox-runs/20260518-001240_file-to-md-open-design-artifact.md",
      audit: "../个人工具箱工作台-OpenDesign样例04终审交接.md"
    }
  ];

  async function init() {
    try {
      const response = await fetch("../toolbox-manifest.json", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`manifest load failed: ${response.status}`);
      }
      state.manifest = await response.json();
      state.tools = Array.isArray(state.manifest.tools) ? state.manifest.tools : [];
      renderAll();
      bindEvents();
      const firstUsable = state.tools.find((tool) => tool.status !== "blocked") || state.tools[0];
      if (firstUsable) {
        selectTool(firstUsable.id);
      }
    } catch (error) {
      renderLoadError(error);
    }
  }

  function bindEvents() {
    els.searchInput.addEventListener("input", () => {
      state.query = els.searchInput.value.trim();
      renderAll({ keepSelection: true });
    });

    els.statusFilters.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-status]");
      if (!button) return;
      state.selectedStatus = button.dataset.status;
      setActiveButton(els.statusFilters, button);
      renderAll({ keepSelection: true });
    });

    els.riskFilters.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-risk]");
      if (!button) return;
      state.selectedRisk = button.dataset.risk;
      setActiveButton(els.riskFilters, button);
      renderAll({ keepSelection: true });
    });

    els.categoryNav.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-category]");
      if (!button) return;
      state.selectedCategory = button.dataset.category;
      setActiveButton(els.categoryNav, button);
      renderAll({ keepSelection: true });
    });

    els.toolGrid.addEventListener("click", (event) => {
      const actionButton = event.target.closest("button[data-card-action]");
      const card = event.target.closest("[data-tool-id]");
      if (!card) return;
      const tool = getTool(card.dataset.toolId);
      if (!tool) return;
      selectTool(tool.id);
      if (actionButton) {
        const action = actionButton.dataset.cardAction;
        showGenerated(action, tool);
      }
    });

    document.addEventListener("click", (event) => {
      const actionButton = event.target.closest("button[data-action]");
      if (!actionButton) return;
      const tool = getTool(state.selectedToolId);
      if (!tool) return;
      showGenerated(actionButton.dataset.action, tool);
    });

    els.closeDetailButton.addEventListener("click", () => {
      state.selectedToolId = null;
      renderDetail(null);
      markSelectedCard();
    });

    els.copyOutputButton.addEventListener("click", () => {
      copyText(els.generatedOutput.value);
    });

    els.copyWorkspacePromptButton.addEventListener("click", () => {
      openOutput("个人工具箱总任务包", buildWorkspacePrompt());
    });

    els.showAuditButton.addEventListener("click", () => {
      openOutput("工作台审核启动文本", buildAuditKickoff());
    });

    els.showDesignButton.addEventListener("click", () => {
      openOutput("Open Design 总 Brief", buildDesignPortfolioBrief());
    });
  }

  function setActiveButton(container, activeButton) {
    container.querySelectorAll("button").forEach((button) => {
      button.classList.toggle("is-active", button === activeButton);
    });
  }

  function renderAll(options = {}) {
    renderCategories();
    applyFilters();
    renderMetrics();
    renderOpenDesignSamples();
    renderToolGrid();
    if (!options.keepSelection && state.filtered[0]) {
      selectTool(state.filtered[0].id);
    } else if (state.selectedToolId) {
      renderDetail(getTool(state.selectedToolId));
      markSelectedCard();
    }
  }

  function renderCategories() {
    const categories = [{ id: "all", label: "全部" }, ...(state.manifest.categories || [])];
    const counts = countBy(state.tools, "category");
    els.categoryNav.innerHTML = categories
      .map((category) => {
        const count = category.id === "all" ? state.tools.length : counts[category.id] || 0;
        const active = state.selectedCategory === category.id ? " is-active" : "";
        return `<button type="button" class="${active}" data-category="${escapeAttr(category.id)}"><span>${escapeHtml(category.label)}</span><strong>${count}</strong></button>`;
      })
      .join("");
  }

  function applyFilters() {
    const query = state.query.toLowerCase();
    state.filtered = state.tools.filter((tool) => {
      const categoryMatch = state.selectedCategory === "all" || tool.category === state.selectedCategory;
      const statusMatch = state.selectedStatus === "all" || tool.status === state.selectedStatus;
      const riskMatch = state.selectedRisk === "all" || tool.risk_level === state.selectedRisk;
      const searchMatch = !query || searchableText(tool).includes(query);
      return categoryMatch && statusMatch && riskMatch && searchMatch;
    });
  }

  function renderMetrics() {
    const tools = state.tools;
    els.metricTotal.textContent = tools.length;
    els.metricVerified.textContent = tools.filter((tool) => tool.status === "verified").length;
    els.metricLimited.textContent = tools.filter((tool) => tool.status === "limited").length;
    els.metricHigh.textContent = tools.filter((tool) => tool.risk_level === "high" || tool.risk_level === "blocked").length;
    els.metricDesign.textContent = tools.filter((tool) => tool.open_design && tool.open_design.brief_seed).length;
    els.resultCount.textContent = state.filtered.length;
  }

  function renderToolGrid() {
    if (!state.filtered.length) {
      els.toolGrid.innerHTML = `<div class="empty-state"><strong>没有匹配工具</strong><span>调整分类、状态、风险或关键词。</span></div>`;
      return;
    }

    els.toolGrid.innerHTML = state.filtered.map(renderToolCard).join("");
    markSelectedCard();
  }

  function renderToolCard(tool) {
    const statusLabel = getStatusLabel(tool.status);
    const riskLabel = getRiskLabel(tool.risk_level);
    const category = getCategoryLabel(tool.category);
    const tags = (tool.tags || []).slice(0, 5).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");

    return `
      <article class="tool-card" data-tool-id="${escapeAttr(tool.id)}">
        <div class="tool-card-head">
          <div>
            <div class="eyebrow">${escapeHtml(category)}</div>
            <h2>${escapeHtml(tool.name)}</h2>
          </div>
        </div>
        <div class="card-badges">
          <span class="badge ${statusClass[tool.status] || ""}">${escapeHtml(statusLabel)}</span>
          <span class="badge ${riskClass[tool.risk_level] || ""}">风险 ${escapeHtml(riskLabel)}</span>
          ${tool.requires_secret ? '<span class="badge">需要 key</span>' : ""}
          ${tool.requires_network ? '<span class="badge">联网</span>' : '<span class="badge">本地</span>'}
        </div>
        <p>${escapeHtml(tool.summary)}</p>
        <div class="tag-row">${tags}</div>
        <div class="path-line" title="${escapeAttr(tool.local_path)}">${escapeHtml(tool.local_path)}</div>
        <div class="card-actions">
          <button type="button" data-card-action="codex">任务包</button>
          <button type="button" data-card-action="audit">审核</button>
        </div>
      </article>
    `;
  }

  function renderOpenDesignSamples() {
    els.sampleCount.textContent = openDesignSamples.length;
    els.openDesignSampleGrid.innerHTML = openDesignSamples.map(renderOpenDesignSampleCard).join("");
  }

  function renderOpenDesignSampleCard(sample) {
    const riskLabel = getRiskLabel(sample.risk);
    const statusClassName = sampleStatusClass[sample.status] || "";
    const auditLabel = sample.status === "passed" ? "终审依据" : "终审交接";

    return `
      <article class="sample-card">
        <div class="sample-card-head">
          <div>
            <div class="eyebrow">${escapeHtml(sample.template)}</div>
            <h2>${escapeHtml(sample.title)}</h2>
          </div>
          <span class="badge ${statusClassName}">${escapeHtml(sample.verdict)}</span>
        </div>
        <p>${escapeHtml(sample.summary)}</p>
        <div class="card-badges">
          <span class="badge">${escapeHtml(sample.toolName)}</span>
          <span class="badge ${riskClass[sample.risk] || ""}">风险 ${escapeHtml(riskLabel)}</span>
          <span class="badge">内部 artifact</span>
        </div>
        <div class="sample-actions">
          <a href="${escapeAttr(sample.page)}">打开页面</a>
          <a href="${escapeAttr(sample.record)}">运行记录</a>
          <a href="${escapeAttr(sample.audit)}">${auditLabel}</a>
        </div>
      </article>
    `;
  }

  function selectTool(id) {
    state.selectedToolId = id;
    renderDetail(getTool(id));
    markSelectedCard();
  }

  function markSelectedCard() {
    els.toolGrid.querySelectorAll("[data-tool-id]").forEach((card) => {
      card.classList.toggle("is-selected", card.dataset.toolId === state.selectedToolId);
    });
  }

  function renderDetail(tool) {
    if (!tool) {
      els.detailEmpty.classList.remove("is-hidden");
      els.detailContent.classList.add("is-hidden");
      return;
    }

    els.detailEmpty.classList.add("is-hidden");
    els.detailContent.classList.remove("is-hidden");
    els.detailCategory.textContent = getCategoryLabel(tool.category);
    els.detailName.textContent = tool.name;
    els.detailSummary.textContent = tool.summary;
    els.detailBadges.innerHTML = `
      <span class="badge ${statusClass[tool.status] || ""}">${escapeHtml(getStatusLabel(tool.status))}</span>
      <span class="badge ${riskClass[tool.risk_level] || ""}">风险 ${escapeHtml(getRiskLabel(tool.risk_level))}</span>
      <span class="badge">${escapeHtml(tool.entry_type || "unknown")}</span>
      ${tool.requires_secret ? '<span class="badge risk-high">需要 secret</span>' : '<span class="badge risk-low">无 secret</span>'}
      ${tool.requires_network ? '<span class="badge risk-medium">联网</span>' : '<span class="badge risk-low">本地</span>'}
    `;
    els.detailEntrypoint.textContent = tool.entrypoint || "";
    els.detailPath.textContent = tool.local_path || "";
    els.detailDeps.textContent = (tool.dependencies || []).join(" / ") || "无";
    els.detailOutputs.textContent = (tool.allowed_outputs || []).join(" / ") || "未标注";
    els.detailRunHint.textContent = tool.run_hint || "无运行提示。";
    els.docLinks.innerHTML = (tool.docs || []).map((doc) => `
      <div class="doc-item">
        <code>${escapeHtml(doc)}</code>
        <button type="button" data-copy-path="${escapeAttr(doc)}">复制路径</button>
      </div>
    `).join("") || "<span>未登记文档。</span>";

    els.docLinks.querySelectorAll("[data-copy-path]").forEach((button) => {
      button.addEventListener("click", () => copyText(button.dataset.copyPath));
    });
    renderArtifactLinks(tool);
  }

  function renderArtifactLinks(tool) {
    const samples = openDesignSamples.filter((sample) => sample.toolId === tool.id);
    if (!samples.length) {
      els.artifactLinks.innerHTML = "<span>未生成样例 artifact。</span>";
      return;
    }

    els.artifactLinks.innerHTML = samples.map((sample) => {
      const auditLabel = sample.status === "passed" ? "终审依据" : "终审交接";
      return `
        <div class="doc-item artifact-item">
          <strong>${escapeHtml(sample.title)}</strong>
          <span>${escapeHtml(sample.verdict)} · ${escapeHtml(sample.template)}</span>
          <div class="inline-links">
            <a href="${escapeAttr(sample.page)}">页面</a>
            <a href="${escapeAttr(sample.record)}">运行记录</a>
            <a href="${escapeAttr(sample.audit)}">${auditLabel}</a>
          </div>
        </div>
      `;
    }).join("");
  }

  function showGenerated(action, tool) {
    const builders = {
      codex: () => buildCodexTask(tool),
      openclaw: () => buildOpenClawTask(tool),
      run: () => buildRunRecord(tool),
      audit: () => buildAuditRecord(tool),
      design: () => buildOpenDesignBrief(tool)
    };
    const titles = {
      codex: "Codex 任务包",
      openclaw: "OpenClaw 任务包",
      run: "运行记录",
      audit: "审核记录",
      design: "Open Design Brief"
    };
    const builder = builders[action] || builders.codex;
    openOutput(`${titles[action] || "输出"} - ${tool.name}`, builder());
  }

  function openOutput(title, text) {
    els.dialogTitle.textContent = title;
    els.generatedOutput.value = text;
    if (typeof els.outputDialog.showModal === "function") {
      els.outputDialog.showModal();
    } else {
      copyText(text);
    }
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("已复制");
    } catch (error) {
      els.generatedOutput.focus();
      els.generatedOutput.select();
      showToast("浏览器未允许自动复制，请手动复制");
    }
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => els.toast.classList.remove("is-visible"), 1800);
  }

  function buildCodexTask(tool) {
    return `# Codex 任务包：${tool.name}

## 目标
围绕工具 \`${tool.id}\` 完成一次有边界的本地执行、修复、说明或验证任务。

## 工具信息
- 名称：${tool.name}
- 分类：${getCategoryLabel(tool.category)}
- 状态：${getStatusLabel(tool.status)}
- 风险：${getRiskLabel(tool.risk_level)}
- 路径：${tool.local_path}
- 入口：${tool.entrypoint}
- 入口类型：${tool.entry_type}

## 允许范围
- 只读取和修改该工具目录及本次明确指定的输出目录。
- 使用已登记入口和固定命令。
- 新输出写入新目录，不覆盖原始输入。
- 需要 secret/API key 时，只从用户明确提供的临时环境变量读取，不写入文档。

## 禁止事项
- 不执行任意 shell 字符串。
- 不清理全目录。
- 不上传用户文件。
- 不绕过登录、验证码、权限或平台限制。
- 金融工具不执行实盘交易，也不输出买卖建议。

## 建议执行
1. 阅读文档：${(tool.docs || []).join("；") || "无"}
2. 检查入口路径是否存在。
3. 按最小样例或 dry-run 方式验证。
4. 记录输入、输出、参数和结果。
5. 按审核机制生成运行记录。

## 验收标准
- 明确说明是否成功。
- 输出路径可追踪。
- 失败时给出原因和下一步。
- 不泄露 secret、账号、token 或用户隐私。
- 如产生设计成果，另走 Open Design artifact 审核。
`;
  }

  function buildOpenClawTask(tool) {
    return `# OpenClaw/QClaw 总督任务包：${tool.name}

## 任务定位
这是一个长期或多 agent 审核任务包，不是直接执行命令。

## 目标
围绕 \`${tool.id}\` 建立可复用状态记录、审核结论和后续任务拆分。

## 工具边界
- 本地路径：${tool.local_path}
- 入口：${tool.entrypoint}
- 风险等级：${getRiskLabel(tool.risk_level)}
- 当前状态：${getStatusLabel(tool.status)}

## 分工建议
- 审核 agent：检查 P0/P1 准入项和风险边界。
- 执行 agent：只在审核通过后按固定入口跑最小验证。
- 记录 agent：把结论写成 Markdown 摘要，不复制 secret 或完整日志。

## 禁止事项
- 不做无边界批量采集。
- 不读取所有账号配置。
- 不上传本地资料。
- 不替用户做实盘交易。

## 输出
- 一份审核结论。
- 一份最小验证记录。
- 一份是否进入工作台 \`verified/limited/blocked\` 的建议。
`;
  }

  function buildRunRecord(tool) {
    const now = new Date();
    const dateStamp = formatLocalDate(now);
    const fileStamp = formatRunFileStamp(now);
    const outputTypes = (tool.allowed_outputs || []).join(" / ") || "未标注";
    const docs = (tool.docs || []).join("；") || "无";

    return `# 工具运行记录

建议文件名：${fileStamp}_${tool.id}_run.md
建议保存目录：E:\\临时项目\\toolbox-runs\\

时间：${dateStamp}
工具：${tool.name}
工具 ID：${tool.id}
版本/路径：${tool.local_path}
调用方式：待填写。本工作台只生成记录模板，不执行命令。

## 审核边界

- 当前状态：${getStatusLabel(tool.status)}
- 风险等级：${getRiskLabel(tool.risk_level)}
- 联网：${tool.requires_network ? "是" : "否"}
- secret/API key：${tool.requires_secret ? "是" : "否"}
- 入口类型：${tool.entry_type || "未标注"}
- 入口：${tool.entrypoint || "未标注"}
- 文档：${docs}

## 输入

待填写：

~~~text
输入文件、目录、链接或人工提供材料。
~~~

## 输出

预期类型：${outputTypes}

待填写：

~~~text
输出文件或目录路径。必须是新输出位置，不覆盖原始输入。
~~~

## 参数

待填写：

~~~text
本次使用的固定参数、配置文件或 dry-run 说明。
~~~

## 运行状态

~~~text
pending
~~~

可选状态：

~~~text
success   完整完成，输出可打开。
partial   有输出，但缺字段、缺文件或需要人工处理。
failed    未生成有效输出。
blocked   因审核规则阻止运行。
~~~

## 耗时

待填写。

## 日志摘要

待填写。不要粘贴 secret、token、账号、cookie 或完整敏感日志。

## 人工复核

待填写：

- 文件能打开：□
- 输出路径明确：□
- 未覆盖原始文件：□
- 未泄露 secret/token/账号/隐私：□
- 中文显示正常：□
- 关键内容完整：□

## 问题

待填写。

## 下一步

待填写。
`;
  }

  function buildAuditRecord(tool) {
    return `# 工具审核记录

工具名称：${tool.name}
工具 ID：${tool.id}
路径：${tool.local_path}
日期：${new Date().toISOString().slice(0, 10)}
审核人：待填写

## 结论

状态：${tool.status}
风险等级：${tool.risk_level}

## 用途

${tool.summary}

## 入口

- 类型：${tool.entry_type}
- 入口：${tool.entrypoint}

## 输入输出

- 推荐 UI：${tool.recommended_ui || "未标注"}
- 输出：${(tool.allowed_outputs || []).join(" / ") || "未标注"}
- 依赖：${(tool.dependencies || []).join(" / ") || "无"}

## P0 检查

□ 本地路径存在
□ 入口文件存在
□ 不覆盖原文件
□ 不泄露 secret
□ 输出位置明确

## P1 检查

□ 有样例
□ 有依赖说明
□ 有验证记录
□ 有已知问题

## 测试记录

${tool.audit && tool.audit.notes ? tool.audit.notes : "待补充。"}

## 已知风险

- 联网：${tool.requires_network ? "是" : "否"}
- secret/API key：${tool.requires_secret ? "是" : "否"}
- 风险等级：${getRiskLabel(tool.risk_level)}

## 允许调用方式

${tool.run_hint || "待补充。"}

## 禁止调用方式

- 不允许前端传入任意 shell 字符串。
- 不允许绕过权限或平台限制。
- 不允许自动覆盖原始文件。

## 下一步

□ 补验证截图或样例输出
□ 写入 toolbox-runs
□ 必要时生成 Open Design brief
`;
  }

  function buildOpenDesignBrief(tool) {
    const surfaces = tool.open_design && tool.open_design.recommended_surfaces
      ? tool.open_design.recommended_surfaces.join(" / ")
      : "doc";
    const seed = tool.open_design && tool.open_design.brief_seed
      ? tool.open_design.brief_seed
      : `为 ${tool.name} 生成一份内部说明页。`;

    return `# Open Design Brief：${tool.name}

## Surface
${surfaces}

## 目标
${seed}

## 受众
工具使用者、审核者、后续接手的 Codex/OpenClaw agent。

## 内容材料
- 工具名称：${tool.name}
- 摘要：${tool.summary}
- 本地路径：${tool.local_path}
- 入口：${tool.entrypoint}
- 文档：${(tool.docs || []).join("；") || "未登记"}
- 状态：${getStatusLabel(tool.status)}
- 风险：${getRiskLabel(tool.risk_level)}

## 设计约束
- 不把本地 token、API key、账号或敏感路径展示成最终用户文案。
- 不编造不存在的功能。
- 明确区分已验证、有限可用、待审核和阻止。
- 页面要像工具工作台，不要做营销 landing page。

## 交付
- 生成一个可编辑 artifact。
- 包含用途、输入、输出、运行边界、审核状态和下一步。
`;
  }

  function buildWorkspacePrompt() {
    return `# 个人工具箱工作台总任务包

## 目标
基于 \`E:\\临时项目\\个人工具箱工作台-架构文档.md\` 和 \`E:\\临时项目\\个人工具箱工作台-审核机制.md\`，继续推进本地工具箱工作台。

## 当前产物
- \`E:\\临时项目\\toolbox-manifest.json\`
- \`E:\\临时项目\\toolbox-dashboard\\index.html\`
- \`E:\\临时项目\\toolbox-dashboard\\styles.css\`
- \`E:\\临时项目\\toolbox-dashboard\\app.js\`

## 下一步
1. 审核 manifest 中每个工具的路径、状态和风险。
2. 为低风险 verified 工具补运行样例。
3. 为 limited/high 工具补边界说明。
4. 选择 3 个工具走“工具运行 -> 设计交付 -> 审核归档”闭环。

## 禁止事项
- 不从工作台直接执行任意 shell。
- 不上传文件。
- 不读取或写入 secret。
- 不自动抓取平台内容。
`;
  }

  function buildAuditKickoff() {
    return `# 审核启动通知

请对 \`E:\\临时项目\\个人工具箱工作台\` 第一版开发产物启动审核。

## 审核对象
- \`E:\\临时项目\\toolbox-manifest.json\`
- \`E:\\临时项目\\toolbox-dashboard\\index.html\`
- \`E:\\临时项目\\toolbox-dashboard\\styles.css\`
- \`E:\\临时项目\\toolbox-dashboard\\app.js\`
- \`E:\\临时项目\\toolbox-dashboard\\start-toolbox-dashboard.ps1\`
- \`E:\\临时项目\\个人工具箱工作台-架构文档.md\`
- \`E:\\临时项目\\个人工具箱工作台-审核机制.md\`

## 重点
1. manifest 状态与风险标注是否保守。
2. 前端是否只生成任务包/审核文本，不执行任意 shell。
3. 平台采集、金融、secret、远程服务是否有明确边界。
4. UI 是否能清楚呈现工具、路径、状态、风险、文档和任务包。
5. 是否满足第一版“看得见、找得到、可调用、可审核”。
`;
  }

  function buildDesignPortfolioBrief() {
    const items = state.tools
      .filter((tool) => tool.open_design && tool.open_design.brief_seed)
      .slice(0, 8)
      .map((tool, index) => `${index + 1}. ${tool.name}：${tool.open_design.brief_seed}`)
      .join("\n");
    return `# Open Design 总 Brief：个人工具箱设计交付层

## 目标
为 \`E:\\临时项目\` 个人工具箱生成一套设计交付入口，展示工具索引、工具说明页、审核状态和可交付 artifact。

## 优先工具
${items}

## 设计方向
安静、实用、信息密度高，像本地操作台，不做营销页。

## 必须体现
- 工具状态：已验证 / 有限可用 / 已登记 / 阻止
- 风险等级：低 / 中 / 高 / 阻止
- 输入、输出、入口、文档
- Codex 任务包、OpenClaw 任务包、审核记录、Open Design brief

## 输出
建议先生成 dashboard 原型和 2 个工具详情页样例。
`;
  }

  function searchableText(tool) {
    return [
      tool.id,
      tool.name,
      tool.summary,
      tool.category,
      tool.local_path,
      tool.entrypoint,
      tool.status,
      tool.risk_level,
      ...(tool.tags || []),
      ...(tool.docs || [])
    ].join(" ").toLowerCase();
  }

  function countBy(items, key) {
    return items.reduce((acc, item) => {
      acc[item[key]] = (acc[item[key]] || 0) + 1;
      return acc;
    }, {});
  }

  function getTool(id) {
    return state.tools.find((tool) => tool.id === id);
  }

  function getCategoryLabel(id) {
    const category = (state.manifest.categories || []).find((item) => item.id === id);
    return category ? category.label : id || "未分类";
  }

  function getStatusLabel(id) {
    return (state.manifest.status_labels && state.manifest.status_labels[id]) || id || "未知";
  }

  function getRiskLabel(id) {
    return (state.manifest.risk_labels && state.manifest.risk_labels[id]) || id || "未知";
  }

  function formatLocalDate(date) {
    const pad = (value) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  function formatRunFileStamp(date) {
    const pad = (value) => String(value).padStart(2, "0");
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
  }

  function renderLoadError(error) {
    els.toolGrid.innerHTML = `
      <div class="empty-state">
        <strong>manifest 加载失败</strong>
        <span>${escapeHtml(error.message)}</span>
      </div>
    `;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replaceAll("`", "&#096;");
  }

  init();
})();
