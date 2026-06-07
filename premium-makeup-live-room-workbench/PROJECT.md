# 高端大牌彩妆直播间提示词工作台｜前景成交骨架锁定版｜35mm

## 用途

为高端大牌彩妆坐播直播间建立独立提示词工作台。当前只锁定前景直播成交骨架，用于眼影盘专场、彩妆顾问讲解场景和黑白高级感直播画面。

## 当前状态

状态：reusable

## 创建时间

- 2026-06-06

## 启动方式

```powershell
Start-Process 'E:\临时项目\premium-makeup-live-room-workbench\index.html'
```

## 关键路径

- 页面入口：`E:\临时项目\premium-makeup-live-room-workbench\index.html`
- 生成逻辑：`E:\临时项目\premium-makeup-live-room-workbench\workbench.js`
- 规则模板：`E:\临时项目\premium-makeup-live-room-workbench\templates\premium-makeup-foreground-transaction-35mm-v01.md`
- 审计规则：`E:\临时项目\premium-makeup-live-room-workbench\audits\audit-rules.md`
- 默认 TXT：`E:\临时项目\premium-makeup-live-room-workbench\output\premium-makeup-default-7-prompts.txt`
- 默认 JSON：`E:\临时项目\premium-makeup-live-room-workbench\output\premium-makeup-default-7-prompts.json`

## 锁定规则

- 只锁定前景直播成交关系，不锁死背景空间。
- 竖版 9:16。
- 中国抖音坐播直播间画面。
- `Camera Geometry Lock｜透视母版锁定` 必须位于每条正向提示词最前面。
- `Foreground Anchor Lock｜前景锚点锁定` 必须位于透视母版之后。
- `Space Integration Engine｜空间一体化引擎` 必须位于前景锚点之后、品类风格之前。
- 七模块统一：摄影机、空间分层、灯光、材质、物体落点、反射、景深。
- 生成目标是 C4D / 商品摄影棚式真实直播棚，不是好看的平面海报。
- 35mm equivalent lens，正面中近景坐播直播机位。
- 摄像机高度固定 125cm。
- 轻微下俯 2°。
- 单一正面一点透视。
- 桌台前沿水平，人物肩线水平，背景垂直线保持垂直。
- 所有产品、亚克力、刷具和辅助彩妆位于同一黑色镜面桌面平面。
- 主播为 28-35 岁成年女性高端品牌彩妆顾问。
- 黑色西装或高级黑色顾问服。
- 黑色高光镜面直播讲解桌台。
- 中央高端眼影盘为第一主角。
- 左右少量辅助彩妆只服务眼影盘。
- 前景使用透明亚克力、黑镜、银色金属细节。
- 背景可以在 7 个高端彩妆路由中变化。

## 背景路由

- `flagship_black_wall`｜旗舰黑墙品牌型
- `pro_backstage_mirror`｜专业后台化妆镜型
- `arc_architecture_counter`｜弧形建筑专柜型
- `black_gold_evening_eye`｜黑金晚宴眼妆型
- `mirror_luxury_counter`｜镜面奢华柜台型
- `minimal_brand_lab`｜极简品牌实验室型
- `low_density_wall_niche`｜低密度壁龛陈列型

## 当前验证

- 默认 7 条提示词已导出。
- 7 条覆盖 7 个背景路由。
- 单条 audit 全部 pass。
- 背景分散 audit pass。
- 2026-06-06 已加入 `premium_makeup_foreground_transaction_35mm_geometry_lock_v1_0` 透视锁定补丁，修复“只写 35mm 但透视母版未锁”问题。
- 2026-06-07 已升级到 `premium_makeup_foreground_transaction_space_integration_engine_v1_0`，新增空间一体化七模块引擎，要求人物、产品、桌台、背景、灯光、反射、阴影、景深属于同一个物理空间。
- TXT 输出一条一行，适配批量生图软件读取。
- 本轮未生图。

## 保留理由

该工作台沉淀的是“高端彩妆前景成交骨架”，和 3C 数码、通用品类绿幕、烘焙、仿真花园窗景等工作台边界不同。后续可扩展底妆、唇妆、高光修容，但当前主锁定仍是眼影盘第一主角。
