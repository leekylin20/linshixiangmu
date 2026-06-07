const fs = require("fs");
const path = require("path");

function escapeMd(text) {
  return String(text ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");
}

function stripHtml(text) {
  return String(text ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

function parseQuestionInfo(question) {
  try {
    return JSON.parse(question.questionInfo || "{}");
  } catch {
    return {};
  }
}

function getChoiceTexts(info) {
  return Array.isArray(info.Choices)
    ? info.Choices.map((choice) => choice.FormsProDisplayRTText || choice.Description || "").filter(Boolean)
    : [];
}

function renderDescriptive(item, index) {
  const lines = [];
  lines.push(`## 说明块 ${index}`);
  lines.push("");
  lines.push(`- 标题：${escapeMd(item.title || "")}`);
  if (item.subtitle) {
    lines.push("");
    lines.push("### 说明");
    lines.push("");
    lines.push(stripHtml(item.formsProRTSubtitle || item.subtitle));
  }
  if (item.image?.resourceUrl) {
    lines.push("");
    lines.push(`- 配图：${item.image.resourceUrl}`);
  }
  lines.push("");
  return lines.join("\n");
}

function renderQuestion(question, index) {
  const info = parseQuestionInfo(question);
  const lines = [];
  lines.push(`## 题目 ${index}`);
  lines.push("");
  lines.push(`- 类型：${question.type}`);
  lines.push(`- 必答：${question.required ? "是" : "否"}`);
  lines.push(`- 标题：${escapeMd(question.title || "")}`);
  if (question.subtitle) {
    lines.push(`- 副标题：${escapeMd(question.subtitle)}`);
  }

  if (question.type === "Question.Choice") {
    const choiceType = info.ChoiceType === 2 ? "多选" : "单选";
    lines.push(`- 选择模式：${choiceType}`);
    const choices = getChoiceTexts(info);
    if (choices.length) {
      lines.push("");
      lines.push("### 选项");
      lines.push("");
      choices.forEach((choice, idx) => {
        lines.push(`${idx + 1}. ${escapeMd(choice)}`);
      });
    }
  } else if (question.type === "Question.Rating") {
    lines.push(`- 最小分值：${info.MinRating ?? ""}`);
    lines.push(`- 最大分值：${info.Length ?? ""}`);
    if (info.LeftDescription || info.RightDescription) {
      lines.push(`- 左标签：${escapeMd(info.LeftDescription || "")}`);
      lines.push(`- 右标签：${escapeMd(info.RightDescription || "")}`);
    }
  } else if (question.type === "Question.TextField") {
    lines.push(`- 多行：${info.Multiline ? "是" : "否"}`);
  }

  if (question.image?.resourceUrl) {
    lines.push(`- 配图：${question.image.resourceUrl}`);
  }

  lines.push("");
  return lines.join("\n");
}

function main() {
  const inputPath = process.argv[2] || path.join(process.cwd(), "form_prefetch.json");
  const outputPath = process.argv[3] || path.join(process.cwd(), "form_full_export.md");

  const raw = fs.readFileSync(inputPath, "utf8");
  const payload = JSON.parse(raw);
  const form = payload.form;

  const sections = Array.isArray(form.descriptiveQuestions) ? form.descriptiveQuestions : [];
  const questions = Array.isArray(form.questions) ? form.questions : [];

  const ordered = [
    ...sections.map((item) => ({ kind: "section", order: item.order ?? 0, item })),
    ...questions.map((item) => ({ kind: "question", order: item.order ?? 0, item })),
  ].sort((a, b) => a.order - b.order);

  const out = [];
  out.push(`# ${escapeMd(form.title || "Untitled Form")}`);
  out.push("");
  if (form.description) {
    out.push("## 表单描述");
    out.push("");
    out.push(escapeMd(form.description));
    out.push("");
  }

  out.push("## 基本信息");
  out.push("");
  out.push(`- 表单 ID：${form.id || ""}`);
  out.push(`- 状态：${form.status || ""}`);
  out.push(`- 题目数：${questions.length}`);
  out.push(`- 说明块数：${sections.length}`);
  out.push(`- 创建时间：${form.createdDate || ""}`);
  out.push(`- 修改时间：${form.modifiedDate || ""}`);
  out.push(`- 匿名：${String((JSON.parse(form.settings || "{}").IsAnonymous) ?? "")}`);
  out.push("");

  let sectionIndex = 0;
  let questionIndex = 0;
  for (const entry of ordered) {
    if (entry.kind === "section") {
      sectionIndex += 1;
      out.push(renderDescriptive(entry.item, sectionIndex));
    } else {
      questionIndex += 1;
      out.push(renderQuestion(entry.item, questionIndex));
    }
  }

  fs.writeFileSync(outputPath, "\uFEFF" + out.join("\n"), "utf8");
  console.log(`Exported: ${outputPath}`);
}

main();
