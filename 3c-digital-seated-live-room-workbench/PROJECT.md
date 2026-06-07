# 3C 数码坐播直播间提示词工作台｜独立专用版

## 用途

为 3C 数码 / 快充数码 / 数码配件 / 充电宝 / 小家电数码周边类直播场景建立独立提示词工作台。

输出中国抖音风格的 3C 数码坐播直播间图提示词，适合获客展示、提案参考、风格测试、批量生图和元素拆分分析。

## 当前状态

状态：reusable

## 创建时间

- 2026-06-05

## 启动方式

```powershell
Start-Process 'E:\临时项目\3c-digital-seated-live-room-workbench\index.html'
```

## 关键路径

- 页面入口：`E:\临时项目\3c-digital-seated-live-room-workbench\index.html`
- 生成逻辑：`E:\临时项目\3c-digital-seated-live-room-workbench\workbench.js`
- 规则模板：`E:\临时项目\3c-digital-seated-live-room-workbench\templates\3c-digital-seated-rules-v01.md`
- 审计规则：`E:\临时项目\3c-digital-seated-live-room-workbench\audits\audit-rules.md`
- 默认 JSON：`E:\临时项目\3c-digital-seated-live-room-workbench\output\3c-digital-seated-live-room-default-10.json`
- 默认 TXT：`E:\临时项目\3c-digital-seated-live-room-workbench\output\3c-digital-seated-live-room-default-10.txt`
- 30 条 TXT：`E:\临时项目\3c-digital-seated-live-room-workbench\output\3c-digital-seated-live-room-30-prompts.txt`
- 30 条 JSON：`E:\临时项目\3c-digital-seated-live-room-workbench\output\3c-digital-seated-live-room-30-prompts.json`

## 锁定规则

- 坐播，不站播。
- 中国抖音成年女主播，年龄感 23-28 岁。
- 摄像机高度 120-125cm。
- 全画幅等效 35mm。
- 35mm 保留但机位略微后撤，露出更多后景科技氛围。
- 轻微下俯 2-3 度。
- 科技感数码直播间。
- 中大型专业 3C 科技直播舱，不是小柜台角落。
- 中大型专业 3C 科技直播空间，背景有纵深、科技墙、灯带、电池符号、线路图案、磨砂金属或路由匹配材质。
- 多风格母版池 `style_route`：冷蓝科技舱风、银白极简科技风、黑金商务科技风、白蓝办公效率风、黑紫电竞风、橙黑机能风、青绿智能生活风、深空银灰极客风、奶油白轻数码风、明亮新零售数码店风。
- 英文 route ID：`cold_blue_tech_cabin`、`silver_white_minimal`、`black_gold_business`、`white_blue_office`、`black_purple_gaming`、`orange_black_utility`、`green_smart_home`、`deep_space_geek`、`cream_light_digital`、`bright_retail_digital`。
- 自动批量风格打散：自动模式下相邻不重复，单风格占比不超过 30%，30 条默认覆盖 10 个风格 route。
- 局部随机池：背景结构、桌台材质、信息牌造型、标题板、背景陈列、点缀色、主播服装、背景纵深、科技氛围等级。
- 台面不过宽。
- 主产品 + 包装盒 + 辅助产品组合。
- 参数牌/卖点牌是不透明实体科技硬板，不透明、不亚克力、不漂浮 UI。
- 可抠图、可复现、可拆元素。

## 当前验证

- 默认生成 10 条 prompt。
- 2026-06-05 已扩展批量上限到 30 条，并补充 20 组标题/副标题变量；超过 20 条时按产品与风格组合轮换。
- 2026-06-05 已按用户要求抽取并导出 30 条 3C 数码坐播提示词，TXT 单行格式验证通过，audit 全部 pass。
- 2026-06-05 已升级到 `3c_digital_seated_live_room_tech_studio_locked_v02`：补强中大型科技直播舱尺度、冷蓝科技氛围、大型科技标题区、层次数字背景和不透明实体科技硬板信息牌；默认 10 条和 30 条输出已重写并 pass。
- 2026-06-05 已升级到 `3c_digital_seated_live_room_style_route_random_v03`：新增 `style_route`、`style_random_mode`、`host_style`、`title_board_style`、`info_card_style`、`background_depth_level`、`tech_atmosphere_level` 控制字段；30 条默认输出覆盖 10 个风格母版，audit 全 pass。
- 2026-06-05 已升级到 `3c_digital_seated_live_room_random_style_pool_v04`：按最新指令替换 10 个风格路线，`styleRoute` 输出英文 route ID，`styleRouteCn` 输出中文名；批量生成先打散 style sequence，再编译 prompt；30 条默认输出 10 种风格各 3 条、相邻无重复，audit 全 pass。
- audit 全部 pass。
- TXT 输出一条一行，适配生图软件批量读取。

## 保留理由

该工作台是独立 3C 数码坐播提示词系统，不和通用品类、女装、美妆、食品、生鲜工作台混用。后续可以继续扩展 3C 细分产品、风格子类和批量主题。

## 下一步

- 如用户需要，可加入个人工具箱快捷入口。
- 可继续扩展手机配件、桌搭、智能穿戴、家庭网络、小家电数码周边专项批次。
