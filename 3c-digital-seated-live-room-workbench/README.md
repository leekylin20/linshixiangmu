# 3C 数码坐播直播间提示词工作台｜独立专用版

独立工作台：`3c-digital-seated-live-room-workbench`

只服务：

- 3C 数码
- 快充数码
- 数码配件
- 充电宝
- 小家电数码周边
- 数码直播获客图

不与女装、美妆、食品、生鲜等其他品类混用。

## 核心锁定

- 中国抖音风格坐播直播间。
- 成年中国抖音女主播，年龄感 23-28 岁。
- 摄像机高度 120-125cm。
- 全画幅等效 35mm。
- 35mm 保留，但机位略微后撤，露出更多背景科技氛围。
- 轻微下俯 2-3 度。
- 中大型专业 3C 科技直播舱，不是小柜台角落。
- 中大型专业 3C 科技直播空间，背景有纵深、科技墙、灯带、电池符号、线路图案、磨砂金属或路由匹配材质。
- 顶部标题区为大型内嵌科技主视觉，不是普通店招。
- 台面不过宽，产品突出。
- 参数牌、卖点牌为不透明实体科技硬板。
- 无真实品牌、LOGO、价格、型号、平台 UI。
- `style_route` 多风格母版池：冷蓝科技舱风、银白极简科技风、黑金商务科技风、白蓝办公效率风、黑紫电竞风、橙黑机能风、青绿智能生活风、深空银灰极客风、奶油白轻数码风、明亮新零售数码店风。
- 英文 route ID：`cold_blue_tech_cabin`、`silver_white_minimal`、`black_gold_business`、`white_blue_office`、`black_purple_gaming`、`orange_black_utility`、`green_smart_home`、`deep_space_geek`、`cream_light_digital`、`bright_retail_digital`。
- 自动批量风格打散：2-3 张至少 2 种风格，4-6 张至少 3 种风格，7-10 张至少 5 种风格，自动模式下相邻不重复、单风格占比不超过 30%。
- 局部随机池：背景结构、桌台材质、信息牌造型、标题板、背景陈列、点缀色、主播服装、背景纵深、科技氛围等级。

## 文件结构

- `index.html`：中文静态工作台页面。
- `workbench.js`：生成、批量输出、TXT 格式化、audit。
- `data/3c-variables.json`：产品、风格路由、局部随机池、输出结构变量。
- `templates/3c-digital-seated-rules-v01.md`：底层规则。
- `audits/audit-rules.md`：审计规则。
- `output/3c-digital-seated-live-room-default-10.json`：默认 10 条 JSON。
- `output/3c-digital-seated-live-room-default-10.txt`：默认 10 条单行 TXT。

## 使用方式

直接打开：

```powershell
Start-Process 'E:\临时项目\3c-digital-seated-live-room-workbench\index.html'
```

或用 Node 生成默认输出：

```powershell
node -e "const wb=require('./workbench.js'); const b=wb.generateBatch({count:10}); console.log(wb.buildTxt(b));"
```

## 当前验证

- 默认 10 条 audit 全部 pass；按需可生成 30 条。
- 2026-06-05 已升级到 `3c_digital_seated_live_room_tech_studio_locked_v02`，修复空间局促和科技氛围不足问题。
- 2026-06-05 已升级到 `3c_digital_seated_live_room_style_route_random_v03`，新增多风格母版 + 局部随机池，默认 30 条覆盖 10 个 style_route。
- 2026-06-05 已升级到 `3c_digital_seated_live_room_random_style_pool_v04`，风格池更换为最新 10 个英文 route；批量生成先分配 style sequence，再组装 prompt，避免整批长成同一款冷蓝科技舱。
- TXT 格式：每条一行、无空行、无分隔符、`#1` 到 `#30`、包含 `【生图提示词】` 与 `【负面提示词】`。
