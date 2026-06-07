# Video Skills Toolkit

## 用途

这个工具包把 Serena 帖子里提到的 6 个视频制作相关 GitHub 仓库集中下载到本地，方便后续让 Codex/Claude/Cursor 等 Agent 读取、安装或组合成视频工作流。

## 仓库清单

| 目录 | GitHub | 主要用途 | 本地技能数量 |
|---|---|---|---:|
| `repos/hyperframes` | `heygen-com/hyperframes` | HTML/CSS/动画转 MP4，适合文章、推文、产品介绍转动效视频 | 15 |
| `repos/video-use` | `browser-use/video-use` | 口播、采访、教程等视频剪辑流程，含转录、字幕、剪辑辅助脚本 | 2 |
| `repos/remotion-skills` | `remotion-dev/skills` | 用 React/Remotion 代码批量制作固定栏目视频 | 1 |
| `repos/generative-media-skills` | `SamurAIGPT/Generative-Media-Skills` | AI 图片、视频、音频生成和多媒体工作流，部分能力需要 MuAPI | 60 |
| `repos/videocut-skills` | `Ceeon/videocut-skills` | 中文口播视频剪辑、字幕、高清化、自进化技能 | 5 |
| `repos/seedance2-skill` | `dexhunter/seedance2-skill` | 即梦 Seedance 2.0 视频提示词、分镜、运镜和场景模板 | 2 |

共扫描到 `85` 个 `SKILL.md`。

机器可读清单在 `manifest.json`，后续做网页入口或自动安装可以直接读取。

## 推荐组合

| 任务 | 推荐入口 |
|---|---|
| 文章/推文转 45 秒竖版视频 | `hyperframes` + `remotion-skills` |
| 真人口播剪辑 | `video-use` 或 `videocut-skills/剪口播` |
| 中文口播字幕与剪映草稿 | `videocut-skills/导入字幕` |
| 固定栏目批量视频 | `remotion-skills/skills/remotion` |
| 即梦视频提示词/短剧/广告分镜 | `seedance2-skill/zh` |
| 大量 AI 视频生成玩法 | `generative-media-skills/library/motion/*` |

## 使用方式

查看可安装技能：

```powershell
Get-Content E:\临时项目\video-skills-toolkit\docs\INSTALLABLE_SKILLS.md
```

安装单个技能到临时项目 skills 目录：

```powershell
cd E:\临时项目\video-skills-toolkit
.\scripts\install-local-skill.ps1 -SkillPath "repos\seedance2-skill\zh" -Name "seedance2-zh"
```

刷新 6 个仓库源码：

```powershell
cd E:\临时项目\video-skills-toolkit
.\scripts\refresh-toolkit.ps1
```

## 注意

- 当前源码通过 GitHub zip 代理下载，目录里不是完整 git clone 历史。
- `downloads/` 保留了下载的 zip 源包，便于离线复查。
- 部分技能依赖 API Key、FFmpeg、Node、Python、MuAPI、ElevenLabs、火山引擎或模型文件；工具包只负责本地归档和安装入口，不默认安装重依赖。
- 不建议一次性安装全部 85 个技能，会让 Codex 技能列表过载。按任务选装更稳。
