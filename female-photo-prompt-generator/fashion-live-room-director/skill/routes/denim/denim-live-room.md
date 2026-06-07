# denim-live-room.md

## V3 Soft Live Room Identity Lock

### Failure Attribution

```json
{
  "failureType": "hard_live_identity_overcorrected",
  "reason": "V2 Live Room Identity Lock 为了证明直播间堆叠了太多直播设备、尺码牌、备货区和小桌，画面退化成搭建感很强的门店直播角。",
  "suggestedFix": "改为 V3 Soft Live Room Identity Lock：先保留真实干净的女装站播空间和牛仔裤完整展示，再只选择 2-3 个自然直播信号作为辅助。"
}
```

This route must compile denim scenes as a modern women’s fashion live room: clean premium clothing live space, realistic standing live camera, full-body jeans display, controlled room depth, clothing rack / shelves / curtain / soft interior lighting, host standing naturally in the room, spacious floor depth, not cluttered, not equipment-heavy.

Golden spatial anchor file: `skill/examples/denim/golden-spatial-anchor.md`.

The scene identity priority is:

1. real clothing livestream space
2. full-body standing host display
3. worn jeans fit and silhouette
4. natural livestream explanation action
5. a few subtle live-commerce signals

The compactImagePrompt must place this exact lock within the first 300 characters:

> This is a real women’s fashion live-selling room, not an offline boutique fitting room. The host is speaking naturally to the live camera. The room keeps a clean premium clothing live-room atmosphere, with only a few subtle live-commerce signals such as a wireless lavalier microphone, natural product explanation gesture, or next jeans waiting on a side rack. These signals should support the livestream identity without making the room look like an equipment setup or a cluttered store.

### Scene Identity Weighting

Lower the identity weight of these terms. They may appear only as weak supporting details, never as the main scene identity:

- fitting area
- fitting curtain
- fashion studio
- try-on room
- clothing studio
- store fitting room

The route must not prove livestream identity by piling up equipment. The finalPrompt and compactImagePrompt must choose at least 2 and at most 3 natural live signals from:

- wireless lavalier microphone on host
- soft window light or integrated architectural lighting
- side rack with next items to introduce
- small folded denim stock shelf
- subtle size/fit info card

Never show all live signals at once. Live signals must appear naturally as supporting background signals and must not dominate composition, block the jeans, or turn the scene into an operation corner.

Weaken or avoid by default:

- live selling table
- prepared denim stock area
- size/fit info card
- operation corner

Hard avoid:

- large size chart
- large selling board
- front live table blocking jeans
- obvious warehouse stock rack
- equipment-display feeling
- too many signs
- too many folded jeans piles

### Required Background Wording

Replace any wording like "background has clothing rack, hanging rail, fitting area, simple women's live-room wall" with:

background has a clean premium women’s fashion live-room setup: controlled room depth, spacious floor depth, clothing rack / shelves / curtain / soft interior lighting, host naturally standing in the room, and only 2-3 subtle live-commerce signals selected from wireless lavalier microphone, natural product explanation gesture, side rack with next jeans, small folded denim shelf, or subtle size/fit info card.

### Negative Prompt Additions

Add the following to negativePrompt:

offline boutique fitting room, store try-on photo, fitting room selfie, normal clothing store display, fashion studio try-on, boutique showroom, only racks and curtains, no visible filming equipment, no equipment-heavy setup, no cluttered operation trace, model posing in a store, shop assistant try-on photo.

Also add:

equipment-heavy live room, cluttered operation corner, too many signs, oversized size chart, large selling board, live table blocking legs, warehouse-like stock area, messy folded jeans piles, props dominating composition, over-explained livestream setup, artificial demo corner.

### Builder Gate

Before image generation, compactImagePrompt must contain:

1. not an offline boutique fitting room
2. live-selling room
3. clean premium fashion live room
4. real standing live camera view
5. full-body jeans display
6. natural room scale
7. spacious floor depth
8. controlled background depth
9. clothing rack / shelves / curtain / soft lights
10. host naturally standing in the room
11. 2-3 subtle live-commerce signals only
12. not equipment-heavy
13. not store try-on photo

If liveSignalsCount > 3, status = fail.
If a live table blocks legs or jeans, status = fail.
If the room reads as equipment display, warehouse stock area, or cluttered operation corner, status = fail.

### Compact Prompt Order

compactImagePrompt must write the spatial anchor before live equipment:

1. clean premium fashion live room
2. real standing live camera view
3. full-body jeans display
4. natural room scale
5. spacious floor depth
6. controlled background depth
7. clothing rack / shelves / curtain / soft lights
8. host naturally standing in the room
9. host speaking to live camera
10. only then mention 2-3 subtle live signals

### Route Checklist Additions

```json
{
  "liveSignalsCount": 2,
  "liveSignalsMax": 3,
  "has_soft_live_identity": true,
  "not_equipment_heavy": true,
  "not_cluttered_operation_corner": true,
  "golden_spatial_anchor_preserved": true
}
```

### Acceptance Criteria

1. The first read matches the golden spatial anchor: a real clean clothing standing live room.
2. The image is not an offline boutique fitting photo.
3. The image is not an equipment-heavy livestream setup corner.
4. The host fully displays the jeans.
5. Live signals exist naturally but do not dominate.
6. Waistline, silhouette, and hems are complete and visible.
7. The space is clean, premium, and has controlled depth.
# 牛仔裤 / 丹宁 / 女裤站播直播间 Route V1

## 1. Route 定义

本 Route 适用于：

- 牛仔裤
- 丹宁裤
- 女裤
- 阔腿牛仔裤
- 直筒牛仔裤
- 微喇牛仔裤
- 高腰牛仔裤
- 显瘦牛仔裤
- 弹力牛仔裤
- 通勤休闲牛仔裤

本 Route 不是固定风格模板。  
它不是“牛仔裤固定背景”，而是“牛仔裤站播直播间的空间骨架、主播展示方式、服装陈列逻辑、标题字体策略和反失败规则”。

用户明确输入优先。  
如果用户要求“不要人物 / 不要主播 / 只要空场景”，则不得强行生成主播。  
如果用户要求“坐播”，则不得强行改成站播。  
如果用户没有明确要求，则牛仔裤默认采用站播直播间。

---

## 2. 核心目标

生成一张真实可开播的女装牛仔裤站播直播间画面。

画面必须像真实直播间，不是女装海报，不是淘宝详情页首图，不是写真棚拍，不是街拍，不是广告大片。

核心判断：

删掉标题、卖点卡和装饰文字后，画面仍然应像一个真实女装站播直播间。

---

## 3. 空间骨架优先级

本 Route 必须优先执行空间骨架，不得先写标题、促销、风格和卖点。

正确顺序：

1. 直播机位
2. 空间透视
3. 地面延伸
4. 主播站位
5. 服装展示关系
6. 背景衣架 / 货架 / 试衣区
7. 标题区域
8. 卖点卡区域
9. 灯光和风格
10. 负面限制

禁止按以下顺序生成：

大标题 → 模特 → 牛仔裤 → 氛围背景

这种顺序会导致海报化。

---

## 4. 直播机位规则

牛仔裤站播必须采用真实直播间正面机位。

镜头要求：

- 自然正面直播视角
- 接近手机或直播相机拍摄
- 镜头高度接近腰部到胸口之间
- 能展示裤型、腰线、腿型和整体穿搭比例
- 不强俯拍
- 不强仰拍
- 不夸张广角
- 不写真摄影机位
- 不街拍机位

推荐表达：

采用真实女装站播直播机位，镜头高度接近主播腰部到胸口之间，正面略中景视角，能自然展示牛仔裤腰线、裤型、腿部比例和穿搭效果，不是广告写真机位，不是街拍机位。

---

## 5. 空间透视规则

画面必须有真实站播空间，而不是平面背景板。

必须具备：

- 地面从画面前景自然延伸到主播脚下
- 主播站在中景位置
- 主播身后有真实距离
- 主播不能贴墙
- 主播不能像抠图贴片
- 后景有衣架、挂杆、货架、试衣区、帘子、灯光或服装陈列
- 地面、墙面、衣架、灯具、主播身体处于同一套透视关系

推荐表达：

画面必须有真实空间透视。地面从镜头前方向主播脚下自然延伸，主播站在中景位置，身后与背景保持真实距离，不贴墙、不像抠图人物。墙面、地面、衣架、挂杆、试衣帘、灯光和主播身体处于同一套一点透视或轻微两点透视中。

---

## 6. 前中后景结构

牛仔裤站播直播间必须明确前景、中景、后景。

前景：

- 地面延伸
- 低位服装展示台
- 少量折叠牛仔裤
- 鞋盒 / 地毯 / 软装
- 不放核心文字

中景：

- 主播站位
- 牛仔裤穿着展示
- 手势展示腰线、裤腿、弹力或面料
- 可有一侧衣架或移动挂杆

后景：

- 女装直播间背景墙
- 牛仔裤挂架
- 试衣帘
- 衣柜 / 展示架
- 柔和灯带
- 品牌感陈列

推荐表达：

画面必须有清晰前景、中景、后景。前景是地面延伸和少量服装陈列，中景是站播主播展示牛仔裤，后景是衣架、挂杆、试衣区、背景墙和柔和灯光，形成真实女装直播间纵深。

---

## 7. 主播展示规则

默认需要成年女装导购主播，除非用户明确要求不要人物。

主播要求：

- 成年女性导购
- 站姿自然
- 像正在直播讲解
- 面向镜头或轻微侧身
- 不能像写真模特
- 不能像街拍模特
- 不性感化
- 不夸张摆拍
- 不贴边
- 不被标题压住
- 脚部或下半身必须有真实地面关系

牛仔裤展示重点：

- 腰线
- 臀胯修饰
- 腿型
- 裤长
- 裤脚
- 面料垂感
- 弹力
- 显瘦效果
- 日常穿搭

主播动作建议：

- 一手轻扶腰线
- 一手指向裤腿
- 轻微侧身展示裤型
- 拉伸裤脚展示垂感
- 指向面料或腰部细节
- 不做夸张舞台 pose

推荐表达：

主播为成年女装导购，站在中景位置，像正在直播讲解牛仔裤。主播站姿自然，可轻扶腰线或指向裤腿展示裤型、显瘦效果和面料垂感。人物必须真实站在地面上，脚下有接触关系，不像写真模特，不像街拍摆拍，不像抠图贴片。

---

## 8. 牛仔裤产品展示逻辑

牛仔裤直播间不是单纯“人物穿裤子”，而是要让用户理解裤型和购买理由。

必须展示：

- 腰线位置
- 裤型轮廓
- 腿部比例
- 面料垂感
- 裤脚形态
- 日常搭配感

可选展示：

- 背景挂杆上有同款牛仔裤
- 一侧有折叠裤装
- 近处有材质卡或小样布
- 不做大面积商品堆叠

禁止：

- 裤子像贴图
- 腿部比例严重拉长
- 人物变成九头身广告模特
- 牛仔裤变成礼服 / 裙装 / 西装裤
- 只拍上半身看不到裤型
- 裤腿被裁切
- 脚下没有地面

推荐表达：

牛仔裤必须完整展示腰线、臀胯到裤脚的整体裤型，腿部比例自然，不夸张拉长。裤型应像真实穿在主播身上，能看出面料垂感、裤脚形态和日常穿搭效果，不是平面贴图，不是广告修长腿大片。

---

## 9. 直播间场景方向

牛仔裤站播适合以下空间方向：

- 女装直播间
- 服装工作室
- 试衣间直播区
- 简洁服装展厅
- 轻复古衣帽间
- 丹宁主题直播间
- 通勤休闲女装空间

常见空间元素：

- 挂衣杆
- 牛仔裤陈列架
- 木地板或浅灰地面
- 试衣帘
- 全身镜
- 暖白补光灯
- 柔和灯带
- 简洁背景墙
- 折叠服装台
- 地毯或低矮软装

不建议：

- 大舞台
- T 台秀场
- 街拍城市道路
- 纯户外街景
- 高奢珠宝展厅
- 过度性感夜店场景
- 平面详情页背景

---

## 10. 标题字体策略

牛仔裤标题不应使用餐饮招牌字、毛笔字、国风牌匾字。

牛仔裤适合：

- 现代女装直播间字体
- 干净有力量的时尚字
- 轻微杂志感
- 适度年轻化
- 线条利落
- 可略带丹宁硬朗感
- 不过度花哨

大标题：

- 可以轻微艺术化
- 不要变成海报主视觉
- 不要压住人物和裤型
- 只作为直播间头顶信息层

副标题：

- 清晰易读
- 比大标题弱
- 不做复杂艺术字

卖点卡：

- 简洁清晰
- 可用短词
- 不用复杂艺术字

推荐标题方向：

- 显瘦牛仔裤
- 高腰显腿长
- 百搭直筒裤
- 修饰腿型好穿
- 通勤休闲都能搭

标题字体 prompt 表达：

大标题使用现代女装直播间标题字，线条利落、略带时尚杂志感和丹宁硬朗气质；副标题和卖点卡保持清晰规整，不全部艺术化。标题只是直播间顶部信息层，不成为海报主视觉。

---

## 11. 卖点卡规则

牛仔裤卖点卡最多 2-3 个。

卖点建议：

- 高腰显腿长
- 修饰胯宽
- 直筒显瘦
- 弹力舒适
- 不挑腿型
- 通勤百搭
- 垂感好
- 遮肉显瘦

禁止：

- 长段参数
- 密集尺码表
- 详情页式保障条
- 大面积价格牌
- 底部促销贴片
- 把卖点卡做成海报模块

卖点卡应位于主播旁边或衣架旁边，不能遮挡裤型。

---

## 12. 安全区规则

默认按实际画布尺寸缩放。

如果实际为 1024x1792：

- 左右安全区：X=85-939
- 顶部 UI 区：Y=0-243，只放背景、灯光、空间延伸
- 标题区：Y=261-429
- 主播和卖点区：Y=485-1353
- 产品 / 服装展示区：Y=650-1500
- 底部高干扰区：Y=1493-1792，不放核心文字

标题、主播脸部、手部、裤型重点、卖点卡都必须在安全区内。

牛仔裤裤脚不能被底部 UI 区裁掉。脚部可以接近下方，但不得被遮挡关键裤型。

---

## 13. 反海报化规则

如果出现以下情况，判定为海报化：

- 标题成为最大视觉主体
- 主播像写真模特
- 背景只是氛围板
- 没有地面延伸
- 主播脚下没有落点
- 牛仔裤像广告大片里的修长腿
- 看不到直播间货架 / 试衣区 / 服装工作室空间
- 卖点卡像海报贴片
- 删除文字后不像直播间

必须在 negativePrompt 中加入：

海报构图、女装广告大片、街拍写真、平面背景板、人物贴图、没有地面、没有直播空间、标题主视觉、产品像详情页、腿部过度拉长、九头身模特、裤腿裁切、脚下悬浮、主播像模特、卖点卡像海报贴片。

---

## 14. 正向提示词模板

生成一张真实女装牛仔裤站播直播间画面，采用自然正面直播机位，镜头高度接近主播腰部到胸口之间，像手机或直播相机正在拍摄真实站播间，不是广告海报机位，不是街拍写真。

画面必须先成立为真实直播间空间：地面从画面前景自然延伸到主播脚下，主播站在中景位置，身后与背景保持真实距离，不贴墙、不像抠图人物。空间采用一点透视或轻微两点透视，地面、墙面、衣架、挂杆、试衣帘、灯光和主播身体处于同一套透视关系。

画面有清晰前景、中景、后景。前景是地面延伸和少量服装陈列，中景是成年女装导购主播正在展示牛仔裤，后景是女装直播间衣架、挂杆、试衣区、背景墙和柔和灯光，形成真实空间纵深。

主播站姿自然，面向镜头或轻微侧身，像正在直播讲解牛仔裤。可一手轻扶腰线，一手指向裤腿，展示高腰、显瘦、修饰腿型、面料垂感和日常百搭效果。主播不是写真模特，不是街拍摆拍，不性感化，不夸张 pose。

牛仔裤必须完整展示腰线、臀胯到裤脚的整体裤型，腿部比例自然，不夸张拉长。裤型像真实穿在主播身上，能看出面料垂感、裤脚形态和日常穿搭效果，不是平面贴图，不是广告修长腿大片。

标题只是直播间顶部信息层，不是海报主视觉。大标题使用现代女装直播间标题字，线条利落、略带时尚杂志感和丹宁硬朗气质；副标题和卖点卡保持清晰规整。卖点卡最多 2-3 个，可写高腰显腿长、直筒显瘦、通勤百搭，不能遮挡裤型。

整体画面像真实可开播的女装牛仔裤站播直播间，删掉标题和卖点卡后，空间本身仍然成立并像直播间。

---

## 15. 负面提示词模板

海报构图、女装广告大片、街拍写真、平面背景板、人物贴图、没有地面、没有直播空间、没有前中后景、没有真实站位、标题主视觉、标题压人物、标题过大、卖点卡像海报贴片、详情页首图、淘宝主图、腿部过度拉长、九头身模特、裤腿裁切、脚下悬浮、人物贴墙、主播像模特、过度性感、夸张 pose、强俯拍、强仰拍、夸张广角、舞台秀场、T台走秀、街道外景、背景透视混乱、地面和墙面关系错误、裤子像贴图、牛仔裤变成裙装、牛仔裤变成西装裤、看不到裤型、看不到腰线、看不到裤脚、文字密集、尺码表堆叠、底部促销贴片。

---

## 16. 输出 JSON 建议

{
  "route": "denim-live-room",
  "scene_type": "female_fashion_standing_live_room",
  "camera_mode": "front_live_camera",
  "spatial_structure": {
    "foreground": "地面延伸、低位服装陈列",
    "midground": "站播主播展示牛仔裤",
    "background": "衣架、挂杆、试衣区、背景墙、灯光"
  },
  "host_action": {
    "required": true,
    "pose": "自然站姿，轻扶腰线或指向裤腿",
    "avoid": ["写真模特", "街拍摆拍", "过度性感"]
  },
  "product_display": {
    "focus": ["腰线", "裤型", "腿部比例", "裤脚", "面料垂感"],
    "avoid": ["腿部过度拉长", "裤腿裁切", "裤子像贴图"]
  },
  "title_font_strategy": {
    "style_tag": "modern_fashion_denim_title",
    "strength_level": "L2",
    "font_mood": "线条利落、年轻、时尚、略带丹宁硬朗感",
    "subtitle": "清晰规整",
    "card_font": "简洁易读"
  },
  "anti_posterization": {
    "delete_text_still_live_room": true,
    "title_not_main_visual": true,
    "host_not_model": true,
    "ground_extension_required": true
  }
}

---

## 17. 单 route 验收标准

生成或编译提示词后，必须检查：

1. 是否优先定义了真实站播机位。
2. 是否有地面从前景延伸到主播脚下。
3. 主播是否真实站在中景，不贴墙。
4. 后景是否有衣架、挂杆、试衣区或女装直播空间。
5. 牛仔裤是否完整展示腰线、裤型、裤脚。
6. 腿部是否没有过度拉长。
7. 标题是否只是信息层，不是海报主视觉。
8. 卖点卡是否不遮挡裤型。
9. 删除文字后是否仍然像直播间。
10. 是否没有变成街拍、写真、海报、详情页首图。

如果以上任意 3 项失败，本 Route 判定为不合格。
