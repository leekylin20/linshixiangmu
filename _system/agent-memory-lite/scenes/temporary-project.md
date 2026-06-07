# 场景：E:\临时项目

更新时间：2026-06-07

## 定位

`E:\临时项目` 是执行 workspace，负责项目、工具、运行时、临时产物和可复用启动经验。它不是长期知识库。

## 主入口

- 根规则：`E:\临时项目\AGENTS.md`
- 起始说明：`E:\临时项目\00-从这里开始.md`
- 索引入口：`E:\临时项目\_索引\README.md`
- 项目运行记忆：`E:\临时项目\_索引\项目运行记忆.md`
- 安装测试日志：`E:\临时项目\_索引\安装测试日志.md`
- 清理候选：`E:\临时项目\_索引\清理候选.md`

## 运行时约定

- 通用运行时：`E:\临时项目\_system`
- Codex skills：`E:\临时项目\_system\codex-skills`
- OpenClaw/Get笔记 配置：`E:\临时项目\_system\openclaw-config`
- ffmpeg：`E:\临时项目\_system\ffmpeg`
- 本地 Agent 记忆：`E:\临时项目\_system\agent-memory-lite`
- 当前归类快照：`E:\临时项目\_索引\临时项目归类快照-20260607.md`
- Agent 场景归类：`E:\临时项目\_system\agent-memory-lite\scenes\workspace-classification-20260607.md`
- 研发日报目录：`E:\临时项目\_索引\研发日报`
- 研发日报生成脚本：`E:\临时项目\_system\agent-memory-lite\scripts\New-DevDailyReport.ps1`

## 记忆层接入方式

- 启动摘要：`scripts\Show-AgentMemoryBrief.ps1`
- 搜索历史：`scripts\Search-AgentMemory.ps1 -Query "关键词"`
- 写入事实：`scripts\Add-AgentMemoryRecord.ps1 -Type project_status -Summary "..."`

## 回写规则

当出现以下事件时，写入 Agent Memory Lite，同时更新 `_索引`：

- 新项目创建。
- 新工具安装。
- 运行命令首次验证通过。
- 项目状态变化。
- 出现可复用踩坑。
- 确认某些文件/目录可清理。

## 不写入这里的内容

- 长期业务判断、内容方法、客户洞察：进 `E:\obsidian`。
- 大段文章全文：只保存摘要和来源。
- 密钥和账号凭证：不保存。
