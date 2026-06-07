# 可安装 Skills 索引

工具包共扫描到 `85` 个 `SKILL.md`。建议按任务安装，不要一次性全装。

## 快速安装示例

```powershell
cd E:\临时项目\video-skills-toolkit
.\scripts\install-local-skill.ps1 -SkillPath "repos\seedance2-skill\zh" -Name "seedance2-zh"
.\scripts\install-local-skill.ps1 -SkillPath "repos\video-use" -Name "video-use"
.\scripts\install-local-skill.ps1 -SkillPath "repos\hyperframes\skills\hyperframes" -Name "hyperframes"
```

安装后需要重启 Codex 才能在技能列表里看到新技能。

## 六个主仓库

| Repo | 本地目录 | SKILL.md 数量 |
|---|---|---:|
| heygen-com/hyperframes | `repos\hyperframes` | 15 |
| browser-use/video-use | `repos\video-use` | 2 |
| remotion-dev/skills | `repos\remotion-skills` | 1 |
| SamurAIGPT/Generative-Media-Skills | `repos\generative-media-skills` | 60 |
| Ceeon/videocut-skills | `repos\videocut-skills` | 5 |
| dexhunter/seedance2-skill | `repos\seedance2-skill` | 2 |

## 推荐先装

| 用途 | SkillPath | 建议名称 |
|---|---|---|
| HyperFrames 核心视频生成 | `repos\hyperframes\skills\hyperframes` | `hyperframes` |
| HyperFrames CLI | `repos\hyperframes\skills\hyperframes-cli` | `hyperframes-cli` |
| HTML 网站转 HyperFrames | `repos\hyperframes\skills\website-to-hyperframes` | `website-to-hyperframes` |
| 视频剪辑 Agent | `repos\video-use` | `video-use` |
| Remotion 视频代码 | `repos\remotion-skills\skills\remotion` | `remotion` |
| 即梦 Seedance 中文提示词 | `repos\seedance2-skill\zh` | `seedance2-zh` |
| 中文口播剪辑 | `repos\videocut-skills\剪口播` | `videocut-speech` |
| 中文字幕导入 | `repos\videocut-skills\导入字幕` | `videocut-subtitles` |
| AI 短片/生成媒体总工作流 | `repos\generative-media-skills\library\workflow` | `gm-workflow` |
| AI clipping 长视频切短片 | `repos\generative-media-skills\library\edit\ai-clipping` | `gm-ai-clipping` |
| YouTube Shorts/TikTok/Reels | `repos\generative-media-skills\library\social\youtube-shorts` | `gm-youtube-shorts` |
| Seedance 2 视频生成 | `repos\generative-media-skills\library\motion\seedance-2` | `gm-seedance-2` |

## 全量路径

```text
generative-media-skills\core\edit
generative-media-skills\core\media
generative-media-skills\core\platform
generative-media-skills\library\edit\ai-clipping
generative-media-skills\library\motion\3d-logo-animation
generative-media-skills\library\motion\ai-fight-scene
generative-media-skills\library\motion\animal-video-generator
generative-media-skills\library\motion\award-ceremony-video
generative-media-skills\library\motion\cartoon-dance-animation
generative-media-skills\library\motion\character-story-video
generative-media-skills\library\motion\cinema-director
generative-media-skills\library\motion\drone-style-video
generative-media-skills\library\motion\freeze-effect-video
generative-media-skills\library\motion\giant-product-showcase
generative-media-skills\library\motion\jewelry-product-video
generative-media-skills\library\motion\music-video
generative-media-skills\library\motion\one-shot-video
generative-media-skills\library\motion\product-ad-cinematic
generative-media-skills\library\motion\product-showcase-video
generative-media-skills\library\motion\product-video-ad-maker
generative-media-skills\library\motion\seedance-2
generative-media-skills\library\motion\storyboard-to-cooking-video
generative-media-skills\library\motion\talking-baby-video
generative-media-skills\library\motion\ugc-lifestyle-try-on
generative-media-skills\library\motion\ugc-video-factory
generative-media-skills\library\social\instagram-post
generative-media-skills\library\social\product-campaign
generative-media-skills\library\social\rednote-cover
generative-media-skills\library\social\social-media-video
generative-media-skills\library\social\social-pack
generative-media-skills\library\social\ugc-ads-workflow
generative-media-skills\library\social\youtube-shorts
generative-media-skills\library\visual\action-figure-generator
generative-media-skills\library\visual\ad-creative
generative-media-skills\library\visual\amazon-product-listing
generative-media-skills\library\visual\blog-header
generative-media-skills\library\visual\brand-kit
generative-media-skills\library\visual\brochures
generative-media-skills\library\visual\chibi-collage-effect
generative-media-skills\library\visual\color-analysis-board
generative-media-skills\library\visual\couple-grid-creator
generative-media-skills\library\visual\design-guide
generative-media-skills\library\visual\fashion-try-on
generative-media-skills\library\visual\floor-plan-rendering
generative-media-skills\library\visual\interior-design
generative-media-skills\library\visual\interior-design-visualizer
generative-media-skills\library\visual\keyboard-art-maker
generative-media-skills\library\visual\logo-branding
generative-media-skills\library\visual\logo-creator
generative-media-skills\library\visual\logo-generator
generative-media-skills\library\visual\multi-angle-reshoot
generative-media-skills\library\visual\multi-angle-shots
generative-media-skills\library\visual\nano-banana
generative-media-skills\library\visual\photo-pack-generator
generative-media-skills\library\visual\selfie-with-celebrities
generative-media-skills\library\visual\storyboard
generative-media-skills\library\visual\ui-design
generative-media-skills\library\visual\url-to-design
generative-media-skills\library\visual\youtube-thumbnail
generative-media-skills\library\workflow
hyperframes\skills\animejs
hyperframes\skills\contribute-catalog
hyperframes\skills\css-animations
hyperframes\skills\gsap
hyperframes\skills\hyperframes
hyperframes\skills\hyperframes-cli
hyperframes\skills\hyperframes-media
hyperframes\skills\hyperframes-registry
hyperframes\skills\lottie
hyperframes\skills\remotion-to-hyperframes
hyperframes\skills\tailwind
hyperframes\skills\three
hyperframes\skills\typegpu
hyperframes\skills\waapi
hyperframes\skills\website-to-hyperframes
remotion-skills\skills\remotion
seedance2-skill
seedance2-skill\zh
video-use
video-use\skills\manim-video
videocut-skills\导入字幕
videocut-skills\导入字幕\安装
videocut-skills\高清化
videocut-skills\剪口播
videocut-skills\自进化
```
