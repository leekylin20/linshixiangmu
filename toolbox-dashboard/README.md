# 个人工具箱工作台

本目录是 `E:\临时项目` 的第一版本地前端工作台。

## 启动

```powershell
cd E:\临时项目\toolbox-dashboard
.\start-toolbox-dashboard.ps1
```

默认会从 `8765` 开始寻找可用端口，并打开：

```text
http://127.0.0.1:<port>/toolbox-dashboard/
```

## 当前能力

- 读取 `E:\临时项目\toolbox-manifest.json`
- 按分类、状态、风险筛选工具
- 搜索工具名称、标签、路径和文档
- 查看工具详情、入口、依赖、输出和运行提示
- 生成 Codex 任务包
- 生成 OpenClaw/QClaw 任务包
- 生成工具运行记录模板
- 生成审核记录模板
- 生成 Open Design brief
- 展示 Open Design 样例交付入口、运行记录和终审依据链接

## 低风险闭环样例

v0.2 已为 3 个低风险工具生成闭环样例，均为 Markdown 材料，不执行工具、不写文件到业务目录：

```text
E:\临时项目\toolbox-artifacts\low-risk-closures\ai-content-workflow-closure.md
E:\临时项目\toolbox-artifacts\low-risk-closures\watermark-batch-closure.md
E:\临时项目\toolbox-artifacts\low-risk-closures\knowledge-memory-closure.md
```

闭环结构：

```text
工具详情 -> Codex 任务包 -> 运行记录模板 -> Open Design brief -> 审核记录
```

## Open Design 样例入口

v0.3 在工作台首页增加 `Open Design 样例` 区块，只提供本地 artifact、运行记录、终审依据或终审交接文档链接。

当前样例：

```text
sample 01 watermark-batch       终审通过  低风险工具说明页
sample 02 ai-content-workflow   终审通过  流程型工具说明页
sample 03 knowledge-memory      终审通过  知识索引导航页
sample 04 file-to-md            待终审    高风险任务包展示页
```

这些入口不执行工具、不读取 secret、不上传文件，也不自动写入运行记录。

## 边界

第一版只做索引和任务包生成，不直接执行本地命令。

v0.2 的运行记录生成器只生成可复制 Markdown 模板，不会自动写入 `toolbox-runs`，也不会启动工具。

不做：

- 任意 shell 执行
- secret/API key 读取
- 自动上传
- 自动采集
- 实盘交易
