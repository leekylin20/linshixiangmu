# serenity-skill

## 用途

- X 上白毛股神 / Serenity 风格的产业链卡点投研方法 Skill。
- 用于公开资料驱动的投资研究、产业链拆解、供应链瓶颈判断、候选公司排序、单公司 thesis 反驳和后续验证清单。
- 只做研究支持，不做交易执行。

## 当前状态

状态：reusable

## 创建或引入时间

- 2026-06-07

## 启动方式

重启 Codex 后，用自然语言触发：

```text
用 serenity-skill 深度调研 A 股 AI 半导体产业链，先排产业链层级，再找 5 个最值得优先研究的标的。
```

本地脚本：

```powershell
& 'C:\Users\麒麟\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' 'E:\临时项目\.agents\skills\serenity-skill\scripts\validate_skill.py'
& 'C:\Users\麒麟\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' 'E:\临时项目\.agents\skills\serenity-skill\scripts\serenity_scorecard.py' --help
```

## 关键路径

- Skill 根目录：`E:\临时项目\.agents\skills\serenity-skill`
- 主入口：`E:\临时项目\.agents\skills\serenity-skill\SKILL.md`
- 中文 README：`E:\临时项目\.agents\skills\serenity-skill\README.zh-CN.md`
- 参考方法：`E:\临时项目\.agents\skills\serenity-skill\references`
- 评分脚本：`E:\临时项目\.agents\skills\serenity-skill\scripts\serenity_scorecard.py`
- 校验脚本：`E:\临时项目\.agents\skills\serenity-skill\scripts\validate_skill.py`

## 依赖与运行时

- Skill 本体无安装依赖。
- 可选脚本使用 Python 标准库。
- 安装来源：`https://github.com/muxuuu/serenity-skill`

## 最近结论

- 已通过 `skill-installer` 安装到项目级 `.agents\skills`。
- `validate_skill.py` 校验通过。
- `serenity_scorecard.py --help` 可正常运行。
- 已刷新 `skill-dashboard` 与 `_索引\技能目录快照.md`。

## 保留或删除判断

- 保留理由：可复用的投资研究方法 Skill，适合 AI、半导体、机器人、电力设备、材料、CPO 等产业链研究。
- 可删除条件：不再使用该投研方法，且从技能看板和记忆层中移除记录。

## 下一步

- 重启 Codex 后通过 `$serenity-skill` 或自然语言触发。
- 做当前机会扫描时必须联网核验最新公告、财报、市场数据和监管文件。
