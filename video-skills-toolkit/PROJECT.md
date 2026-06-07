# video-skills-toolkit

## 用途

- 本地视频制作 Agent Skills 工具包，集中保存 6 个 GitHub 仓库源码，并提供可安装技能索引与安装/刷新脚本。

## 当前状态

状态：reusable

## 创建或引入时间

- 2026-06-07

## 启动方式

```powershell
cd E:\临时项目\video-skills-toolkit
Get-Content .\README.md
```

## 关键路径

- 工具包根目录：`E:\临时项目\video-skills-toolkit`
- 仓库源码：`E:\临时项目\video-skills-toolkit\repos`
- 下载缓存：`E:\临时项目\video-skills-toolkit\downloads`
- 机器清单：`E:\临时项目\video-skills-toolkit\manifest.json`
- 技能索引：`E:\临时项目\video-skills-toolkit\docs\INSTALLABLE_SKILLS.md`
- 安装脚本：`E:\临时项目\video-skills-toolkit\scripts\install-local-skill.ps1`
- 刷新脚本：`E:\临时项目\video-skills-toolkit\scripts\refresh-toolkit.ps1`

## 依赖与运行时

- 下载依赖 PowerShell `Invoke-WebRequest` 与 `Expand-Archive`。
- 默认使用 `https://gh-proxy.com/https://github.com/.../archive/refs/heads/main.zip` 刷新源码。
- 不默认安装 Node/Python/FFmpeg/模型/API 依赖。

## 最近结论

- 2026-06-07 已下载并解压 6 个仓库：HyperFrames、video-use、Remotion Skills、Generative Media Skills、videocut-skills、seedance2-skill。
- 直连 GitHub 443 失败，已改用 GitHub zip 代理下载。
- 已扫描到 85 个 `SKILL.md`：Generative Media 60 个、HyperFrames 15 个、Remotion 1 个、Seedance2 2 个、video-use 2 个、videocut 5 个。

## 保留或删除判断

- 保留理由：视频制作 workflow 可复用，适合后续把脚本、分镜、提示词、剪辑、字幕、动效串成 Agent 工作流。
- 可删除条件：确认不再使用这些视频 Skills，且无需保留 zip 源包时可归入清理候选。

## 下一步

- 按任务选装具体技能到 `E:\临时项目\.agents\skills`。
- 对常用链路创建更小的组合技能，例如“推文转竖版视频”“中文口播剪辑”“即梦分镜提示词”。
