# large-corner-home-live-room.md
# 大空间转角居家感直播间 SceneStyle V1

## 1. 定义

“大空间转角居家感直播间”是一套可复用的服装直播间空间母框架。

它不是某一种固定装修风格，而是先建立稳定、真实、可开播的室内空间透视关系，再在这个母框架上替换风格、材质、地板、窗区、家具、陈列、服装品类和人物设定。

核心公式：

大空间转角居家感直播间 =
真实室内房间盒子
+ L 型转角构图
+ 轻微斜角直播机位
+ 大面积地面延伸
+ 中景主播讲解区
+ 后景生活层 / 低密度陈列层
+ 建筑一体化照明
+ 低密度辅助服装陈列

## 2. 它不是品类 Route

本文件是 sceneStyle，不是主 route。

主 route 负责：
- 牛仔裤 / 连衣裙 / 棉麻 / 防晒服 / 男装 / 女装等品类展示逻辑
- 主播动作
- 商品卖点
- 服装完整展示要求

本 sceneStyle 只负责：
- 空间结构
- 转角构图
- 地面纵深
- 建筑照明
- 背景生活层
- 低密度陈列
- 避免门店 / 试衣间 / 摄影棚感

如果 sceneStyle 与 route 冲突，route 的商品展示逻辑优先。

## 3. 核心空间硬锁

### 3.1 真实室内房间盒子

画面必须像一个真实的大空间室内直播间，而不是一面背景墙。

必须包含：
- 主墙
- 侧墙
- 天花
- 大面积地面
- 侧向窗区或侧向采光区
- 后景生活层或低密度陈列层

禁止：
- 单面背景墙
- 平面海报背景
- 主播贴在背景前
- 假空间
- 狭小角落
- 门店试衣间

### 3.2 L 型转角构图

默认采用 L 型转角构图或轻微斜角机位。

必须满足：
- 能看到主背景墙和侧墙
- 能看到地面从前景延伸到主播脚下
- 机位不是完全正面平推
- 空间关系像真实房间，不像正面展厅图

关键词：
- L-shaped corner composition
- slight angled live-camera view
- visible side wall
- main background wall
- large floor depth

禁止：
- full frontal showroom view
- flat front-facing backdrop
- centered background wall
- no side wall
- no corner composition

### 3.3 大面积地面纵深

地面必须是空间成立的主要证据。

必须有：
- 大面积前景地面
- 地面纹理
- 透视延伸
- 主播真实脚下落点
- 地面与墙面、家具、人物比例统一

禁止：
- 地面太少
- 主播脚下悬浮
- 地面透视错乱
- 地面被家具或货架塞满

### 3.4 中景主播讲解区

中景必须干净、可站播、可讲解、可成交。

主播必须：
- 站在中景
- 不贴墙
- 不贴窗
- 不贴背景板
- 与后景保持真实距离
- 面向直播镜头自然讲解
- 有完整服装展示空间

禁止：
- 主播被家具挡住
- 主播被货架包围
- 主播被狭小窗洞框住
- 主播像贴图
- 主播像影楼模特

### 3.5 建筑一体化照明

只允许出现建筑照明和室内自然光。

允许：
- ceiling downlights
- hidden light strips
- wall lamps
- soft window light
- warm ambient interior light
- cove lighting

明确禁止：
- visible softbox
- visible light stand
- LED panel light
- filming light
- photography equipment
- reflector
- production gear
- 任何影视灯、补光灯、灯架、柔光箱出现在画面里

直播间身份不能靠影视灯出镜体现，只能通过主播讲解状态、空间组织、服装展示和低密度陈列体现。

### 3.6 低密度辅助陈列

服装陈列只能作为辅助，不能形成门店感。

允许：
- 一组小体量侧边陈列
- 一件主推款侧边点挂
- 一个低密度局部挂架
- 一个小边柜
- 一个小圆几
- 少量折叠陈列

禁止：
- 一整排衣服挂架
- full row of clothes rack
- 整墙挂衣杆
- 密集店铺陈列
- 门店式排面
- 仓库库存堆放
- 货架压过主播

## 4. 可替换字段

```json
{
  "sceneStyle": "large-corner-home-live-room",
  "materialPalette": "",
  "layoutVariant": "",
  "floorMaterial": "",
  "wallMaterial": "",
  "windowArea": "",
  "backgroundLayer": "",
  "lowDensityDisplay": ""
}
```

### materialPalette

- `warm_wood_cream`: 暖木地板 + 奶油墙 + 亚麻窗帘
- `beige_stone_linen`: 米色石纹地砖 + 亚麻帘 + 低反光家具
- `soft_gray_oak`: 柔灰墙 + 橡木地板 + 简洁边柜
- `deep_wood_home`: 深木饰面 + 暖色灯带 + 低密度陈列
- `warm_white_rattan`: 暖白墙 + 藤编 / 草编点缀 + 柔和生活感

### layoutVariant

- `side_window_corner`: 侧窗转角构图
- `side_cabinet_corner`: 侧柜生活层转角构图
- `diagonal_empty_floor`: 大面积地面斜向留白构图
- `soft_living_corner`: 柔和居家边角构图
- `soft_home_window_scenic_corner`: 居家软装窗景转角
- `clean_brand_room_box`: 干净品牌房间盒子构图

Default:
- `side_window_corner`
- `warm_wood_cream`

## layoutVariant: soft_home_window_scenic_corner
## 居家软装窗景转角

`soft_home_window_scenic_corner` 是 `large-corner-home-live-room` 下的一个 layoutVariant，不是新的 route，也不是独立 sceneStyle。它用于在真实室内直播间空间盒子中加入柔和的生活方式窗景层，使画面更适合女装、连衣裙、棉麻、防晒服、针织、家居服和轻法式类目。

空间公式：

大空间室内房间盒子
+ L 型转角构图
+ 侧后方窗景 / 拱窗 / 景框窗模块
+ 中景主播讲解区
+ 一侧生活软装
+ 少量植物
+ 壁炉感壁龛 / 单椅 / 边几 / 低柜
+ 建筑一体化暖光
+ 低密度服装辅助陈列

必须继承 `large-corner-home-live-room` 的所有空间硬锁：large indoor room-box space, L-shaped corner composition, slight angled live-camera view, visible side wall, main background wall, large foreground floor depth, clean midground presentation zone, host stands in midground, integrated architectural lighting only, lighting treated as part of the room architecture, low-density supporting garment display only, one small point-like side display at most, broad room breathing space, not offline fitting room, not photo studio backdrop, not narrow window niche.

窗景、拱窗、景框窗必须位于侧后方或后方偏一侧，不能正面居中成为大背景墙。允许 side-back arched window, partial scenic window, window-scenic module at one side, framed window placed toward the side-back area, scenic window supporting room depth。禁止 centered arched window portrait, full frontal window backdrop, centered large window background, host standing directly against window, flat scenic wall, pasted window scenery。

软装只能低密度出现，可包含 small chair, side table, low cabinet, soft curtain, fireplace-like niche, warm wall lamp, small plant, minimal vase, subtle wall art, small rug。中间区域必须保持干净，不能让家具挡住服装下摆、裤腿、鞋子或主播身体。

服装陈列只允许一小组侧边点挂、一件主推款挂样、少量局部服装展示或小型边侧陈列。禁止一整排衣服挂架、满墙衣服、密集门店挂杆、服装店排面、仓库库存感。

适合柔和居家感、轻法式生活方式、奶油 / 米色 / 暖木 / 亚麻、轻植物、自然窗光、暖色建筑照明、女装生活方式氛围。避免婚纱摄影、影楼写真、韩系样板间、过度浪漫花园、民宿宣传照、门店试衣间。

Positive fragment:

```text
Use the soft_home_window_scenic_corner layout variant under a large-corner-home-live-room spatial framework. This is a real indoor fashion live-commerce room box with an L-shaped corner composition, visible side wall, main wall, large foreground floor depth and a clean midground selling zone. Add a soft home-style window-scenic corner: a side-back arched window or partial scenic window module, soft curtains, subtle plants, low-density lifestyle props such as a small chair, side table, low cabinet, fireplace-like niche or warm wall lamp.

The scenic window stays toward the side-back area and supports the room depth. It must not become a centered portrait backdrop or a flat scenic wall. The host stands naturally in the midground selling zone, not directly against the window and not pasted onto the background. The garment remains fully visible.

Use integrated architectural lighting only, such as ceiling downlights, hidden cove lighting, wall lamps and soft window light, with lighting treated as part of the room architecture and kept outside the visual focus. Use only one small point-like supporting garment display at the side, keeping the central livestream selling zone clear.

The room should feel like a soft home-style women’s fashion livestream selling room, with lifestyle atmosphere, but still clearly usable for live-commerce selling.
```

Negative fragment:

```text
centered arched window portrait, full frontal window backdrop, centered large window background, flat scenic wall, host standing directly against window, host pasted against window, narrow window niche, cramped scenic alcove, small window hole, wedding window set, bridal studio window scene, romantic photo studio, Korean soft boutique window room, Korean lifestyle catalog room, homestay promo photo, photo studio portrait set, visible softbox, visible light stand, LED panel light, film set equipment, full row of clothes rack, dense retail rack, showroom clothing rail, furniture blocking garment, scenic props dominating host, window scenery overpowering garment
```

## 5. 正向提示词块

## 5.1 质检约束补丁 V1

### no-fake-price-and-heavy-promo-lock

禁止模型生成任何具体价格数字、直播价数字、限时价数字、折扣数字、满减数字或客单价数字，除非用户明确提供价格。

允许出现的轻量文案仅限泛化产品或直播文案，例如：直播专享、今日主推、新品上新、主推款、轻松通勤、舒适好穿、清爽防晒、高腰显瘦、版型推荐。

Positive fragment:

```text
Do not generate any specific price, discount number, coupon number or sales amount unless explicitly provided by the user. Any sales text must stay minimal, generic and secondary, such as “直播专享”, “今日主推” or product feature words only.
```

Negative fragment:

```text
fake price, invented price, ¥399, price tag, large price board, discount board, coupon board, big promotion sign, heavy sales poster, blackboard price sign, detailed e-commerce promo board, oversized selling board
```

### low-density-display-count-lock

侧边服装陈列只能作为辅助，最多 1 个小型侧边陈列点，最多 1-3 件可见挂样，不允许一整排，不允许超过画面宽度的 20%，不允许抢主播和主服装。

Positive fragment:

```text
Use at most one small side display with only 1-3 visible garments. The side display must stay secondary, occupy limited space, and never look like a retail clothing rack lineup.
```

Negative fragment:

```text
too many hanging garments, side rack too large, retail rack lineup, many clothes on rack, garment rack dominating frame, store display row, full rail of clothing, dense side rack
```

### dress-live-room 直播讲解感补丁

```text
For dress scenes, the host should clearly act as a livestream seller explaining the dress to online viewers, not as a fashion portrait model. Use natural product explanation gestures. Keep the dress fully visible and commercially presented. The room should remain a live-selling space, not a romantic lifestyle photoshoot.
```

Negative:

```text
romantic dress portrait, fashion portrait, lifestyle editorial, bridal mood, wedding room mood, model-only pose, no selling gesture, garment shown as portrait styling
```

### sun-protection 夏季产品赋能补丁

```text
For sun-protection clothing, the scene should feel clean, bright, breathable and summer-oriented. Use side window daylight, light floor, pale wall, small green plant and minimal fresh styling. The product should communicate lightness, breathability, commuting, outdoor daily use and sun-protection practicality, without turning into a sportswear studio or medical protective suit.
```

Negative:

```text
sportswear studio, medical protective suit, plastic raincoat, heavy outdoor hiking gear, over-decorated summer props, beach holiday costume, cluttered summer scene
```

### mid-to-high price denim jeans 赋能补丁

```text
For mid-to-high price denim jeans, use subtle value-added elements such as deep wood, warm gray wall, leather chair, framed art, low cabinet, small handbag or metal detail. These elements must stay secondary and premium, not promotional. Avoid large selling boards or fake prices.
```

Negative:

```text
cheap promo sign, fake luxury overload, price blackboard, discount board, retail sale poster, over-commercial sales sign
```

```text
Vertical 9:16 realistic indoor fashion live-commerce room, large room-box space, L-shaped corner composition, slight angled live-camera view. Show a real side wall, main background wall, large visible foreground floor depth and a clean midground presentation zone. This is a real spacious indoor livestream selling room, not an offline boutique fitting room, not a narrow window niche, not a photo studio backdrop, and not a store try-on space.

Use a real standing livestream camera perspective, camera height around the host’s waist to chest level, stable and natural. The host stands naturally in the midground, with real floor contact and real room distance behind the host, speaking toward the live camera as if explaining the product to online viewers.

The room must first work as a believable interior space: foreground floor extends from camera to the host’s feet and continues into the background; side wall, main wall, window area, floor and furniture all follow one coherent indoor perspective system.

Use integrated architectural lighting only: ceiling downlights, hidden light strips, wall lamps, practical warm interior lighting, and soft window light, with lighting treated as part of the room architecture and kept outside the visual focus.

Background should feel like a clean home-like fashion live room: low-density side display, subtle cabinet or sideboard, small decor, soft curtains, controlled styling, and a spacious uncluttered atmosphere. No full row of clothes rack, avoid dense racks, avoid a whole row of clothing dominating the frame, avoid warehouse feeling, avoid store fitting room feeling.

The center remains open and usable for livestream selling. Background elements stay at the rear or sides and support the scene without dominating the host or product.
```

## 6. 负面提示词块

```text
offline boutique fitting room, store try-on photo, fitting room selfie, clothing store display wall, dense clothing racks, a whole row of hanging garments, full row of clothes rack, full rail of hanging garments, boutique showroom, warehouse-like stock area, equipment-heavy live room, visible softbox, visible light stand, visible filming light, LED panel light, reflector, production gear, photography studio setup, photo studio backdrop, narrow niche set, cramped window alcove, recessed niche, small window hole, flat front-facing backdrop, centered poster composition, centered window background, no side wall, no L-shaped room, no corner composition, no floor depth, host pasted against wall, host standing directly against background, floating feet, giant host, overlong legs, chaotic perspective, cluttered props, full wall racks, furniture blocking legs, table blocking full-body display
```

## 7. sceneStyleChecklist

```json
{
  "selectedSceneStyle": "large-corner-home-live-room",
  "has_large_indoor_room_box": true,
  "has_l_shaped_corner_composition": true,
  "has_slight_angled_live_camera": true,
  "has_visible_side_wall": true,
  "has_main_background_wall": true,
  "has_large_foreground_floor_depth": true,
  "has_clean_midground_presentation_zone": true,
  "host_stands_in_midground": true,
  "host_not_pasted_against_wall": true,
  "has_integrated_architectural_lighting": true,
  "no_visible_filming_equipment": true,
  "no_softbox_or_light_stand": true,
  "has_low_density_supporting_display": true,
  "no_full_row_of_clothes_rack": true,
  "not_offline_fitting_room": true,
  "not_photo_studio_backdrop": true,
  "not_narrow_window_niche": true,
  "garment_or_product_fully_visible": true,
  "status": "pass | fail",
  "missing": []
}
```
