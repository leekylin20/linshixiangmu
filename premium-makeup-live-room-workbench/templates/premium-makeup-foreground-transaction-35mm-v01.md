# 高端大牌彩妆直播间提示词规则

版本：`premium_makeup_foreground_transaction_space_integration_engine_v1_0`

## 定位

本工作台用于生成高端大牌彩妆坐播直播间图，当前阶段只锁定前景直播成交骨架，不锁死背景空间结构。

核心原则：

```text
前景稳定可复用，背景多样化生成。
```

不要把整套空间固定成某一种背景。当前只锁定：

- 主播坐播；
- 35mm 正面直播机位；
- 黑色镜面桌台；
- 中央主推眼影盘；
- 左右少量辅助彩妆；
- 亚克力 / 黑镜陈列；
- 高端彩妆顾问人设；
- 眼影盘第一主角。

## 固定前景规则

## Camera Geometry Lock｜透视母版锁定

这个模块必须放在每条生图提示词最前面，优先级高于背景风格、产品陈列和主播动作。

```text
This image must use one fixed front-facing seated livestream camera geometry.
Vertical 9:16 frame, 35mm equivalent lens, camera height 125cm, slight downward tilt only 2 degrees, no wide-angle distortion, no high-angle view, no low-angle view.

The viewer is sitting directly across from the beauty consultant at the same livestream desk.
The camera is centered on the host and the main eyeshadow palette.
Use one stable front-facing one-point perspective.

The host eye line is around the upper-middle area of the frame.
The host shoulders are horizontal and parallel to the front edge of the table.
The black mirror livestream table front edge must be a clean horizontal line across the lower frame.
The tabletop surface is visible only moderately, about 25%-30%, not a strong top-down view.
All products, acrylic stands, brushes, palettes and auxiliary cosmetics must sit on the same tabletop plane with correct contact shadows and reflections.

The main eyeshadow palette must stay in the front-center product zone, directly between the host and the camera.
The host sits behind the table, not leaning too far forward, not standing, not floating.
The background wall, display shelves, mirror lights and architectural frames must follow the same front-facing perspective.
Vertical background lines remain vertical.
No tilted room, no diagonal showroom view, no side-view boutique perspective, no product advertising flat lay.
```

核心原则：

- 背景可以换风格，但不能换机位。
- 前景可以换少量辅助产品，但不能换透视。
- 主播动作可以小幅变化，但不能改变坐播几何关系。

## Foreground Anchor Lock｜前景锚点锁定

```text
Foreground composition must remain fixed:
1. The black mirror table front edge stays horizontal in the lower 15%-20% of the image.
2. The main eyeshadow palette is centered on the table, placed in the lower-middle product zone.
3. The host is seated behind the product, chest and shoulders visible, facing the camera.
4. The host face stays above the main product, not too large, not too close to camera.
5. Left and right auxiliary product groups must stay lower than the host chest and must not cross into the host face area.
6. Acrylic display stands must be low and wide, not tall towers, not floating, not slanted.
7. Product reflections on the black table must align vertically under each product.
```

中文理解：

- 桌台前沿横平。
- 眼影盘居中。
- 主播在后面坐播。
- 人物不要冲到镜头前。
- 亚克力不要变成高塔。
- 所有产品在同一个桌面上。
- 反射方向要对。

## Space Integration Engine｜空间一体化引擎

所有直播间生成前必须先按 C4D / 摄影棚 / 商品摄影逻辑建立统一空间。目标不是生成一张好看的平面图，而是像 C4D 里真实搭了一个直播棚：人物、产品、桌台、背景、灯光、反射、阴影都属于同一个空间。

这个模块必须放在 `Camera Geometry Lock` 和 `Foreground Anchor Lock` 之后、品类风格内容之前。

### 1. Camera｜摄影机

- 竖版 9:16。
- 35mm equivalent lens。
- 摄像机高度 125cm。
- 摄像机距离：距离主播约 160-180cm，距离桌台前沿约 70-90cm。
- 俯仰角：轻微下俯 2°。
- 单一正面消失点。
- 地平线接近主播眼线。
- 桌台前沿线水平。
- 人物眼线在画面中上区域。
- 产品中心点在画面下中部。

### 2. Spatial Layering｜空间分层

- 前景：桌台前沿位于画面下方 15%-20%。
- 前中景：主眼影盘位于下中部产品区。
- 中景：主播坐在产品后方，胸肩可见，正面对镜头。
- 后景：背景墙、陈列柜、镜灯、建筑框都位于主播之后，并服从同一正面透视。
- 禁止把前景、中景、后景压平成平面海报。

### 3. Lighting｜灯光

- 主播脸部使用柔和正面主光。
- 有控制的补光，避免脸部脏暗。
- 头发和肩线有轻微轮廓光。
- 主眼影盘有小面积产品高光。
- 亚克力和金属边缘有清晰但克制的边缘光。
- 所有阴影方向必须一致。

### 4. Material｜材质

- 黑色钢琴烤漆镜面桌台需要有真实反射。
- 透明厚亚克力需要有折射边缘和厚度。
- 银色金属字标需要有冷感高光。
- 眼影珠光粉质需要有细闪。
- 哑光黑 / 深海军蓝背景需要有低反射材质感。
- 所有材质必须响应同一组光源。

### 5. Object Landing｜物体落点

- 每个产品、刷具、眼影盘、亚克力台阶都必须有明确落点。
- 必须有接触阴影和重量感。
- 不能悬浮，不能穿透桌面，不能像贴图。
- 所有产品位于同一个黑色镜面桌面平面。

### 6. Reflection｜反射

- 黑色镜面桌台上的反射必须位于物体正下方。
- 主眼影盘反射最强，辅助产品反射较弱。
- 亚克力边缘可以出现轻微折射高光。
- 反射不能随机偏移，不能与物体脱节。

### 7. Depth Of Field｜景深

- 使用适度商品摄影景深。
- 主眼影盘、主播脸部、手部动作清晰可读。
- 背景略柔，但结构仍可辨认。
- 禁止重度虚化、背景比主产品更锐、人物和产品焦平面不一致。

### 画幅与机位

- 竖版 9:16。
- 中国抖音坐播直播间画面。
- 正面坐播直播机位。
- 35mm equivalent lens, normal front-facing seated livestream perspective, no wide-angle distortion, no telephoto compression, no showroom diagonal view。
- 摄像机高度固定 125cm。
- 轻微下俯 2°。
- 单一正面一点透视。
- 中近景构图。
- 观众像坐在彩妆顾问台对面看主播讲解产品。

禁止：50mm 以上过强压缩感、超广角、强俯拍、强仰拍、高机位、探店斜拍、广告大片视角、空间展示图视角。

### 主播

主播必须是成年女性高端品牌彩妆顾问，年龄感 28-35 岁，成熟、专业、冷静、可信赖，有中国抖音直播间彩妆顾问气质。

服装：黑色西装、高级黑色顾问服、深色内搭，干练专业。

妆容：精致眼妆、高级底妆、自然高级唇色、晚宴眼妆感、眼部细节清晰。

发型：利落盘发、低盘发、精致丸子头，干净专业。

动作：正面对镜头，自然坐播讲解，一手轻扶下巴，一手轻指眼影盘，或轻拿化妆刷讲解。动作克制、专业、有顾问感。

禁止：韩系女团感、甜妹感、网红写真感、普通店员感、强促销主播感、夸张卖货手势、多人主播、人物抢产品。

### 桌台

前景必须是黑色高光镜面直播讲解桌台，黑色钢琴烤漆质感，清晰反射，高级、干净、克制，适合彩妆产品讲解。

桌面上表面可见比例约 25%-35%，不能过度俯拍，不能让桌面铺满画面。

禁止：木桌、白色家居桌、普通办公桌、粉色化妆台、杂乱梳妆台、低价促销台。

### 主推产品

主推产品为高端眼影盘。眼影盘必须是整张画面的第一主角。

必须满足：

- 中央最强展示位给眼影盘；
- 眼影盘打开或半打开；
- 清楚露出色盘；
- 珠光粉质清楚；
- 深浅眼影层次清楚；
- 镜面反光清楚；
- 外壳为深海军蓝接近黑色的高光漆面；
- 银色金属字标；
- 冷感镜面反射。

可以增加一个闭合外壳、一个外盒或一个前方品牌感包装盒，用来强化高端质感。

严格禁止：口红成为第一主角、一排口红占据中央主视觉、眼影盘变成辅助产品、眼影盘太小、眼影盘不清楚、眼影盘变形、产品悬浮、产品巨大化。

### 辅助产品

辅助产品只能少量出现，用来衬托眼影盘。

允许：1 个高光盘 / 粉饼、1 支睫毛膏 / 黑色瓶装单品、少量专业刷具、少量口红、1 个小型辅助眼影盘、黑色刷具筒、透明亚克力刷具座。

建议结构：

- 左侧辅助区：高光盘 + 黑色瓶装单品；
- 中央主推区：打开眼影盘 + 闭合外壳；
- 右侧辅助区：刷具 + 小辅助盘。

禁止：彩妆大杂烩、满桌产品、满墙货架、刷具散乱、口红排队抢主、产品没有主次。

### 陈列材质

前景陈列必须有高级材质：

- 透明亚克力台阶；
- 透明亚克力托盘；
- 厚实亚克力展示岛；
- 黑色镜面底座；
- 黑色亮面圆台；
- 银色金属细节；
- 冷白高光反射。

亚克力不能太高、太空、太笨重；应低矮、厚实、边缘清晰、通透、有折射。

## 背景规则

背景不锁死结构，只锁调性，并且只能作为同一透视母版里的“后景换装”：

```text
Background style may vary, but only as a back-scene design variation within the same locked front-facing livestream camera geometry.
Do not change the camera angle, table angle, host position, product center, or perspective system.
The background is a style layer behind the fixed livestream foreground, not a new showroom camera view.
```

- 高端大牌彩妆空间；
- 黑白高级；
- 冷白灯光；
- 品牌专柜感；
- 专业彩妆后台感；
- 低密度陈列；
- 克制、精致、留白。

无论背景如何变化，都必须保证：

- 主播正对镜头；
- 主推眼影盘在前景中心；
- 黑色镜面桌台清楚；
- 画面像正在开播讲解；
- 不是探店图；
- 不是专柜空间展示图；
- 不是广告大片。

背景路由不能改变相机位置、桌台角度、主播位置、主产品中心点和前景透视。背景后墙垂直线必须保持垂直，左右展示柜、镜灯、建筑框都必须跟随同一正面一点透视。

## 背景随机风格库

1. `flagship_black_wall`｜旗舰黑墙品牌型：大面积哑光黑品牌主墙，低调金属字标，少量线性灯带，左右少量展示柜。
2. `pro_backstage_mirror`｜专业后台化妆镜型：化妆镜灯作为主要背景符号，黑色镜面，冷白灯泡，后台彩妆顾问台氛围。
3. `arc_architecture_counter`｜弧形建筑专柜型：白色弧形建筑框，黑色主墙，冷白线性灯带，镜面边框。
4. `black_gold_evening_eye`｜黑金晚宴眼妆型：深黑主色，少量香槟金，珠光反射，晚宴妆氛围。
5. `mirror_luxury_counter`｜镜面奢华柜台型：黑镜、银镜、玻璃、亚克力，反射丰富，冷艳奢华。
6. `minimal_brand_lab`｜极简品牌实验室型：黑白极简、低密度陈列、干净现代、冷白光，新品发布实验室感。
7. `low_density_wall_niche`｜低密度壁龛陈列型：黑色壁龛、少量彩妆瓶罐、局部冷白灯带，背景干净但有货感。

## 输出格式

TXT 必须一条一行：

```text
#1 【生图提示词】 ...positivePrompt... 【负面提示词】 ...negativePrompt...
```

无空行、无分隔符、无随机参数块。

## 负面透视补丁

每条 negativePrompt 必须包含：

```text
tilted table plane, diagonal table front edge, slanted tabletop, mismatched product perspective, products on different planes, acrylic stand floating, wrong reflection direction, high-angle tabletop view, low-angle host view, showroom diagonal perspective, boutique side-view angle, wide-angle room distortion, telephoto flat compression, host too close to camera, host head too large, product not centered, main palette off-center, table front edge not horizontal, background perspective not matching table, vertical lines leaning, room tilted, camera rotated, inconsistent vanishing point
```

## 结论

当前模板命名为：

```text
高端彩妆直播间｜前景成交骨架锁定版｜35mm
```

它不是完整背景空间锁定版。它只锁定前景直播成交关系，不锁死背景空间；背景可以多样化，但主播、黑镜桌台、中央主推眼影盘、35mm 正面坐播机位必须稳定成立。
