# skill-dashboard

## 用途
- 把 `E:\临时项目` 下的 Codex 技能按分类整理成一个本地静态网页目录，并保留常用临时项目入口。

## 当前状态
状态：reusable

## 创建或引入时间
- 2026-06-02

## 启动方式

```powershell
cd E:\临时项目\skill-dashboard
.\open_dashboard.ps1
.\refresh_skills.ps1
```

也可以直接双击 `index.html`。

## 关键路径

- 页面：`E:\临时项目\skill-dashboard\index.html`
- 打开脚本：`E:\临时项目\skill-dashboard\open_dashboard.ps1`
- 同步脚本：`E:\临时项目\skill-dashboard\refresh_skills.ps1`
- 记忆快照：`E:\临时项目\_索引\技能目录快照.md`
- 技能来源：`E:\临时项目\_system\codex-skills`
- 交易技能来源：`E:\临时项目\.agents\skills`

## 依赖与运行时

- 无运行时依赖，单文件静态网页。

## 最近结论
- 已整理用户技能、`.agents` 技能和少量系统技能，支持搜索、分类筛选、来源筛选和复制路径。
- 2026-06-06 已补入 `muse-ui-fabric` 画布工作台项目入口。
- 安装或更新 Skill 后运行 `refresh_skills.ps1`，会刷新网页数据并写入 `_索引\技能目录快照.md`。

## 保留或删除判断
- 保留理由：本地技能入口索引，可复用。
- 可删除条件：技能目录迁移或改由其他 dashboard 管理。

## 下一步
- 后续新增技能时运行 `refresh_skills.ps1` 同步网页与记忆快照。
