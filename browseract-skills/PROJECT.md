# BrowserAct 本地技能工具包

## 用途

- 本地收纳 BrowserAct 官方技能仓库。
- 提供 BrowserAct CLI 的 E 盘安装和启动入口。
- 为 Codex 安装核心 `browser-act` 与 `browser-act-skill-forge` 技能。
- 保存 57 个 BrowserAct solution 技能，按需选择安装。

## 当前状态

状态：reusable

## 创建或引入时间

- 2026-06-07

## 启动方式

```powershell
E:\临时项目\browseract-skills\scripts\browser-act.ps1 --version
E:\临时项目\browseract-skills\scripts\browser-act.ps1 get-skills core --skill-version 2.0.2
```

## 关键路径

- 工具包：`E:\临时项目\browseract-skills`
- 官方仓库副本：`E:\临时项目\browseract-skills\repos\skills`
- CLI：`E:\临时项目\_system\uv-bin\browser-act.exe`
- uv：`E:\临时项目\_system\uv\uv.exe`
- Python 3.12：`E:\临时项目\_system\uv-python\cpython-3.12.13-windows-x86_64-none`
- BrowserAct 数据：`E:\临时项目\_system\browseract-data`
- 临时项目技能目录：`E:\临时项目\.agents\skills`

## 依赖与运行时

- `uv 0.11.15`
- `Python 3.12.13`
- `browser-act-cli 0.1.27`
- 运行时缓存、工具环境和 BrowserAct 数据目录均位于 E 盘。

## 最近结论

- GitHub 直连失败，已通过 `gh-proxy.com` 下载 `browser-act/skills` 主分支 zip。
- `browser-act --version` 验证通过。
- `browser-act get-skills core --skill-version 2.0.2` 验证通过，并保存预览到 `docs\get-skills-core-preview.txt`。

## 保留或删除判断

- 保留理由：可作为浏览器自动化、网页抓取、网站 Skill Forge 的基础工具包。
- 可删除条件：BrowserAct 不再使用，且已从 `E:\临时项目\.agents\skills` 移除对应技能。

## 下一步

- 重启 Codex 后检查技能列表是否出现 `browser-act` 和 `browser-act-skill-forge`。
- 如需 stealth 能力，运行 `browser-act auth login` 完成 API Key 配置。
