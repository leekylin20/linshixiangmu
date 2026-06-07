# 服装站播直播间通用提示词框架 V1

This framework coexists with the denim-specific framework. It is the generic standing fashion live-room prompt structure for clothing categories that share the same live-room camera, spatial perspective, host behavior, and subtle livestream identity.

It is not a route registry entry. Do not use it to override a product-specific accepted route such as denim. Use it as a workbench direct-extract framework when the user needs a general clothing standing live-room prompt.

## 1. 固定骨架层

All standing fashion live-room prompts should first lock the following structure.

### 1.1 画幅

```text
Vertical 9:16
```

### 1.2 空间类型

```text
realistic fashion standing live room
真实服装站播直播间
```

### 1.3 机位

```text
real front standing live camera view
camera height around waist to chest level
stable and natural
not poster angle
not fashion campaign angle
```

### 1.4 空间透视

```text
spacious floor depth extends from foreground to host's feet and into background
host stands naturally in the midground
real room distance behind the host
not close to wall
not pasted onto backdrop
controlled background depth
```

### 1.5 主播状态

```text
adult fashion seller
relaxed and friendly
speaking toward the live camera
introducing the clothing to online viewers
natural explanation gesture
not model pose
```

### 1.6 轻直播信号

```text
only 1-2 subtle livestream signals:
small wireless lavalier microphone
integrated architectural soft lighting kept out of frame
```

### 1.7 直播信号原则

```text
livestream signals are secondary
not drawing attention
not blocking clothing display
not equipment-heavy
```

## 2. 可替换参数层

Replace the following layers according to category and style.

### A. 服装品类

- high-waist denim jeans
- wide-leg trousers
- dress
- down jacket
- wool coat
- suit jacket
- shirt
- knitwear
- men's casual outfit
- men's business suit

### B. 展示重点

Different clothing categories need different display details.

#### 牛仔裤

```text
waistband, fly front, pockets, hip fit, leg silhouette, hems, shoes, denim wash, seams, hem drape
```

#### 连衣裙

```text
neckline, waistline, skirt silhouette, fabric drape, sleeve shape, hemline, full-body proportion
```

#### 羽绒服

```text
collar, shoulder line, puff volume, waist shape, sleeve thickness, zipper, fabric texture, warmth feeling
```

#### 男装西服

```text
shoulder structure, lapel, chest fit, waist fit, sleeve length, trousers line, formal silhouette
```

#### 针织衫

```text
neckline, shoulder fit, sleeve texture, knit pattern, softness, body fit
```

### C. 室内风格

- warm gray home-style live space
- minimalist neutral gray live space
- deep wood premium live space
- clean white studio live space
- soft beige lifestyle live room
- urban men's wardrobe live room
- light luxury fashion live room

### D. 材质

- wood floor
- light oak floor
- gray microcement floor
- warm carpet
- dark wood wall panel
- soft curtain
- metal clothing rack
- wooden shelf
- fabric backdrop
- neutral wall

### E. 灯光

- warm neutral soft interior lighting
- integrated architectural soft light
- subtle ceiling track light
- gentle wall wash light
- clean daylight-balanced lighting
- warm boutique-level lighting

## 3. 通用母提示词

```text
Vertical 9:16 realistic fashion standing live room, [STYLE] clothing live space, natural full-body [CLOTHING_TYPE] display. Real front standing live camera view, camera height around waist to chest level, stable and natural, not a poster angle, not a fashion campaign angle.

Spacious floor depth extends from the camera foreground to the host's feet and into the background. The adult fashion seller stands naturally in the midground, with real room distance behind the host, not close to the wall, not pasted onto a backdrop. Controlled background depth, clean and not cluttered.

The host looks relaxed and friendly, speaking toward the live camera as if explaining the clothing to online viewers. Natural explanation gesture, not a model pose, not a lookbook pose.

Background has [BACKGROUND_ELEMENTS], [FLOOR_MATERIAL], [WALL_OR_CURTAIN_MATERIAL], [LIGHTING_STYLE], clean premium live-room atmosphere. Add only 1-2 subtle livestream signals: a small wireless lavalier microphone on the host and a natural product explanation gesture toward the live camera. Both are secondary and not drawing attention.

The clothing is the main subject: [CLOTHING_DISPLAY_POINTS]. Natural body proportions, natural feet placement, full garment structure visible, no cropped key parts, no exaggerated body proportions.
```

## 4. 通用负面词

```text
offline boutique fitting room, fitting room selfie, store try-on photo, normal clothing store display, fashion studio try-on, boutique showroom, equipment-heavy live room, cluttered operation corner, oversized size chart, large selling board, live table blocking clothing, warehouse-like stock area, messy folded clothes piles, props dominating composition, artificial demo corner, poster composition, fashion advertisement, fashion campaign, flat backdrop, no floor depth, giant host, overlong legs, cropped garment details, floating feet, model pose, runway, street photography, dense text
```

## 5. 核心规则

### 空间框架固定

- 9:16
- 正面站播机位
- 腰胸高度镜头
- 前景地面延伸
- 中景主播
- 后景有真实纵深
- 主播不贴墙
- 轻直播信号

### 可变内容

- 风格
- 材质
- 地板
- 灯光
- 服装品类
- 服装展示重点
- 背景陈列

## 6. 最终公式

```text
服装站播直播间 =
固定空间骨架
+ 固定直播机位
+ 固定主播讲解状态
+ 轻直播信号
+ 可替换服装品类
+ 可替换空间风格
+ 可替换材质与灯光
```

```text
不是：
每个品类重新写一套完整提示词。
```
