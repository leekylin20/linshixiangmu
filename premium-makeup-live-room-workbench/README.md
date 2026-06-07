# 高端大牌彩妆直播间提示词工作台｜前景成交骨架锁定版｜35mm

独立工作台：`premium-makeup-live-room-workbench`

## 用途

用于生成：

- 高端彩妆坐播直播间；
- 眼影盘专场；
- 彩妆顾问讲解场景；
- 大牌黑白高级感直播画面。

当前阶段只锁定前景直播成交骨架，不锁死背景空间结构。

## 核心锁定

- 竖版 9:16。
- 中国抖音坐播直播间。
- `Camera Geometry Lock｜透视母版锁定` 放在每条正向提示词最前面。
- `Foreground Anchor Lock｜前景锚点锁定` 放在透视母版之后。
- `Space Integration Engine｜空间一体化引擎` 放在前景锚点之后、品类风格之前。
- 生成前先拆成七个模块：摄影机、空间分层、灯光、材质、物体落点、反射、景深。
- 目标是像 C4D / 商品摄影棚里真实搭了一个直播棚，而不是一张平面海报。
- 35mm equivalent lens，正面中近景坐播直播机位。
- 摄像机高度固定 125cm。
- 轻微下俯 2°。
- 单一正面一点透视。
- 桌台前沿水平，人物肩线水平，背景垂直线保持垂直。
- 所有产品、亚克力、刷具和辅助彩妆位于同一黑色镜面桌面平面。
- 成年女性高端品牌彩妆顾问，年龄感 28-35 岁。
- 黑色西装或高级黑色顾问服。
- 黑色高光镜面直播讲解桌台。
- 中央高端眼影盘为第一主角。
- 左右少量辅助彩妆。
- 透明亚克力、黑镜、银色金属细节。
- 背景只锁高端大牌彩妆调性，不锁具体空间结构。

## 背景路由

- `flagship_black_wall`｜旗舰黑墙品牌型
- `pro_backstage_mirror`｜专业后台化妆镜型
- `arc_architecture_counter`｜弧形建筑专柜型
- `black_gold_evening_eye`｜黑金晚宴眼妆型
- `mirror_luxury_counter`｜镜面奢华柜台型
- `minimal_brand_lab`｜极简品牌实验室型
- `low_density_wall_niche`｜低密度壁龛陈列型

## 文件结构

- `index.html`：中文静态工作台页面。
- `workbench.js`：生成、批量输出、TXT 格式化、audit。
- `data/premium-makeup-variables.json`：变量与输出结构。
- `templates/premium-makeup-foreground-transaction-35mm-v01.md`：底层规则。
- `audits/audit-rules.md`：审计规则。
- `output/premium-makeup-default-7-prompts.txt`：默认 7 条单行 TXT。
- `output/premium-makeup-default-7-prompts.json`：默认 7 条 JSON。

## 使用方式

直接打开：

```powershell
Start-Process 'E:\临时项目\premium-makeup-live-room-workbench\index.html'
```

或用 Node 生成默认输出：

```powershell
node -e "const wb=require('./workbench.js'); const b=wb.generateBatch({count:7}); console.log(wb.buildTxt(b));"
```

## 当前验证

- 默认 7 条覆盖 7 个背景路由。
- 单条 audit 全部 pass。
- 背景分散 audit pass。
- 已升级到 `premium_makeup_foreground_transaction_space_integration_engine_v1_0`，接入空间一体化七模块引擎。
- TXT 一条一行，无空行、无分隔符。
- 未生图。
