# layered-window-scenic-live-room.md
# 女装层次窗景假景直播间 SceneStyle V2

## 1. 定义

女装层次窗景假景直播间是一种室内直播间盒子内的层次窗景置景方案。

V3 system role: this file is now an optional `scenicModule` / advanced scene layer. It must not replace the base room framework.

When using `layered-window-scenic-live-room`, always inherit the `large-corner-home-live-room` spatial lock first: large room-box, L-shaped corner composition, visible side wall, large floor depth, clean midground selling zone, integrated architectural lighting only, no visible filming equipment, no narrow niche, no full row of clothes rack.

The faux window, framed window, arch window, soft-membrane lightbox, backlit fabric lightbox, SEG fabric lightbox and layered scenery must be built inside the large corner live room. They are not an independent frontal window portrait set.

它不是自然花园，也不是影楼花园，而是用卡布灯箱 / 景框窗 / 实体侧景 / 前景地面层搭出来的可直播场景。

它通过“室内直播间盒子 + 景框窗 / 拱门 / 假窗结构 + 独立灯箱 / 卡布灯箱 / SEG fabric scenic panel / 喷绘远景 + 实体侧景 + 前景地面层”，在室内直播间中做出有层次的仿窗景空间。

它不是普通线下门店，不是试衣间，不是婚庆布景，不是影楼背景，也不是纯户外真实场景。

核心目标：
用仿真窗景或层次假景，把女装直播间从“货架空间”升级成“生活方式场景空间”，但仍然保留室内直播间盒子感、主播讲解区、服装展示区和直播成交功能。

## 1.1 范式 V2 空间硬锁

0. 必须先继承 `large-corner-home-live-room` 的基础空间母框架：大空间室内房间盒子、L 型转角构图、轻微斜角直播机位、可见侧墙、大面积地面纵深、中景主播讲解区、建筑一体化照明、禁止影视灯、禁止狭小逼龛、禁止一整排挂架。
1. 必须是室内直播间，不是户外。
2. 必须能看出房间结构，不是只有一面背景板。
3. 窗景不是自然真实窗户，而是仿真窗景搭景系统。
4. 默认采用轻微转角构图或轻微斜向直播机位，不要完全正面窗景人像照。
5. 必须保留中间干净的主播讲解区与服装展示区。
6. 所有层次元素必须服务“主播讲解 + 服装展示”，不能压过主体。
7. 禁止出现任何补光灯、影视灯、柔光箱、灯架、灯板、LED 面板灯、拍摄棚设备、打光设备反射痕迹。
8. 禁止狭小逼龛感、窄洞口感、小凹槽背景、主播被塞进小窗洞前的视觉效果。
9. 禁止一整排横向服装挂架、整墙挂衣杆、密集店铺式陈列。只允许一组小体量、低密度、点状辅助陈列。

## 1.2 Host Aesthetic Lock

The host should look like a natural Chinese women’s fashion livestream seller, friendly, grounded and commercial, with realistic domestic live-selling aesthetics. Avoid overly Korean fashion model styling, overly delicate K-beauty makeup, idol-like face, glossy influencer portrait look, or fashion lookbook model expression. The host should feel like a real livestream seller explaining products, not a Korean-style catalog model.

中文解释：
主播要像真实国内女装直播间导购，亲和、自然、有讲解感，不要韩系网拍脸、韩系妆造、爱豆感、过度精致写真感、韩系女装目录模特感。

## 1.3 Layout Variant Lock

`sceneLayoutVariant` may be one of:

- `side_back_window_corner`: Window scenic element placed toward side-back area. Show one side wall, floor depth and a diagonal room corner. Host stands in midground selling zone, not centered directly against the window.
- `diagonal_arch_with_side_rack`: Use an angled arch or framed scenic opening, with clothing rack on one side and a clean center selling zone. The arch is not perfectly centered. Camera slightly diagonal.
- `recessed_lightbox_wall`: Backlit fabric scenic panel is embedded inside a shallow wall niche or framed wall structure. Foreground has floor texture and minimal side plants. More commercial and less romantic.
- `partial_window_with_living_corner`: Only part of the window or scenic view is visible. Add side shelf, small chair, low cabinet or soft curtain as lifestyle corner. Keep host and garment central.
- `soft_room_box_with_side_scenic_panel`: A real indoor room-box structure with a side scenic panel, not a big central window. The scenic panel sits behind or beside the host, creating depth but not dominating.

If the user does not specify a layout variant, the builder should choose one by random or rotation, not always default to the same centered arch-window room.

## 1.4 Material Palette

`materialPalette` may be one of:

- `cream_warm_wood`: 奶油墙 + 浅木地板
- `soft_gray_oak`: 柔灰墙 + 橡木地板
- `beige_linen_stone`: 米色软帘 + 石纹地面
- `light_microcement`: 浅微水泥 + 金属衣架
- `warm_white_rattan`: 暖白墙 + 藤编 / 草编点缀

Material palette only affects wall, floor, soft props and rack materials. It must not override product display logic.

## 2. 它不是品类 Route

本文件是 sceneStyle，不是主 route。

主 route 负责：
- 女装品类
- 牛仔裤 / 连衣裙 / 防晒服 / 棉麻 / 针织等具体展示逻辑
- 主播动作
- 商品展示重点

本 sceneStyle 只负责：
- 房间样式
- 窗景结构
- 假景层次
- 前中后景
- 空间氛围
- 远景载体
- 轻户外感

不得覆盖主 route 的商品展示要求。

## 3. 核心结构

女装层次窗景假景直播间 =

景框结构
+ 远景载体
+ 中景讲解区
+ 前景落地层
+ 女装生活方式氛围
+ 轻直播信号

### 3.1 景框结构

可使用：
- arched window
- framed window opening
- arch doorway
- faux window frame
- scenic wall opening
- soft curtain frame
- indoor arch structure

中文：
- 拱窗
- 拱门
- 景框窗
- 假窗
- 窗洞
- 门洞
- 景墙开口
- 软帘框景

作用：
把远景框住，避免整面背景像平面贴图。

### 3.2 远景载体

远景可以是：
- independent backlit fabric lightbox
- SEG fabric lightbox
- printed scenic backdrop
- faux outdoor scenic panel
- window-view scenic backdrop
- garden / lawn / ocean / courtyard / forest / sky view

中文：
- 独立卡布灯箱
- 卡布灯箱远景
- 柔光灯箱景片
- 喷绘远景
- 窗外画面
- 花园远景
- 草坪远景
- 海景远景
- 庭院远景
- 森林远景

注意：
不能写成真实户外 real outdoor location。
必须强调这是室内直播间里的仿真窗景 / 假景远景。

### 3.3 中景讲解区

必须保留干净的中景讲解区。

中景用于：
- 主播站播
- 主播讲解服装
- 产品展示
- 走动 / 转身 / 展示衣服
- 形成成交画面

要求：
- 主播不能被花草、窗框、桌椅挡住
- 服装轮廓不能被遮挡
- 中间必须有可站播空间
- 主播有真实落点和接触阴影
- 不能像贴在背景板上

### 3.4 前景落地层

前景可以使用：
- floor texture
- rug
- artificial grass
- stone path
- low plants
- flowers
- moss
- soft landscaping
- wooden floor
- light tile
- ground shadow

中文：
- 地面纹理
- 草坪
- 石板路
- 小植物
- 花丛
- 苔藓
- 地毯
- 木地板
- 柔和地面光影

作用：
制造空间起点和落地感。

### 3.5 轻直播信号

允许：
- 小领夹麦
- 边缘补光灯
- 轻微手机直播机位感
- 主播面向镜头讲解

禁止：
- 大直播桌
- 大立牌
- 大尺码表
- 大库存区
- 设备角抢主体
- 满屏运营物料

## 4. 适用类目

最适合：
- 女装连衣裙
- 法式女装
- 棉麻女装
- 防晒服
- 度假风女装
- 夏装
- 半裙
- 家居服
- 女包
- 女鞋
- 饰品
- 轻生活方式品类

可谨慎适用：
- 牛仔裤
- 针织
- 轻通勤

不建议默认适用：
- 严肃商务男装
- 基础无氛围款
- 功能内衣
- 强参数型商品
- 需要极简货架成交的直播间

## 5. 正向提示词块

sceneStylePositiveFragment:

```text
This is an indoor live-commerce room box with a layered window-scenic set, not a real garden, not a photo studio garden, and not a wedding backdrop. The scenic window is a designed set element: a framed arch or window structure with a backlit fabric lightbox / SEG fabric scenic panel behind it, plus real side props and foreground floor layers. The center must remain a clean livestream selling zone for the host and garment.

The scenic window must be built as a layered indoor set: front physical wall or arch frame, mid-layer real props such as side plants, curtains, steps, or small scenic elements, and a rear backlit fabric lightbox / SEG scenic panel as the distant faux outdoor view. The scene uses clear foreground, midground and far-background layers inside a visible indoor floor and wall structure. The framed scenic window is a large scenic module inside a broader live room, not a small narrow niche, not an alcove-like window and not a full natural garden. The far background appears through an arched window, framed opening or scenic backdrop. The far view may be a backlit fabric lightbox, SEG fabric lightbox, printed scenic panel or faux window-view backdrop, softly glowing and not looking like a flat poster.

For large scenic window live rooms, use a slight corner composition or angled live-camera view. Show part of side wall / side structure / side curtain / side rack, so the room reads as an L-shaped or boxed indoor space. Avoid a flat full-frontal centered window portrait composition.

No visible light stand, no softbox, no panel light, no LED video light, no studio lighting equipment, no filming setup and no production gear may appear in frame. Livestream identity must come from the host's natural explanation state, small wireless lavalier microphone and spatial organization only.

Side display must be low-density and point-like: only one small side sample, one single recommended garment, or one low-density folded/side display. Do not show a full rail of hanging garments or store rack lineup.

The midground must keep a central clean selling zone for livestream selling. The host stands in the midground presentation zone with real floor contact, correct scale, contact shadows and enough clear space for clothing explanation. The garment must be fully visible. Scenic props stay at sides and rear.

The foreground and side layers are physical set props: low plants, light floor texture, simple rug, small side rack, soft curtain or modular wall panel. They create depth but stay away from the central garment display.

The overall mood is soft, feminine, clean, premium and lifestyle-oriented, suitable for women’s fashion livestream selling. Use soft French lifestyle mood, cream wall, simple arch window, light greenery and subtle flowers at the sides when a French mood is needed. Avoid romantic flowers, lush flowers, fairy garden, beautiful garden, wedding-like floral arch and large flower wall.

Do not repeat the same centered cream arch-window layout every time. Vary the room structure, window placement, side wall, rack position, floor material and scenic panel shape according to the selected layout variant. The scene should not look like the same room with only clothes changed.
```

For dress scenes, avoid bridal, wedding, photo-studio and romantic portrait feeling. The dress should be presented as a livestream selling garment, not a bridal portrait or fashion editorial. The host speaks to the live camera with a product explanation gesture.

For denim scenes, avoid premium window try-on photo. The jeans remain the main product: waistband, fly front, pockets, hip fit, leg silhouette, hems and shoes must be fully visible. The window scenic set must not make the image look like a lifestyle photoshoot.

## 6. 中文正向解释

生成一张 9:16 女装层次窗景假景直播间。整体不是普通线下门店，也不是简单试衣间，而是用于直播卖货的女装氛围型场景空间。

场景采用“前景 + 中景 + 远景”的层次结构。远景通过拱窗、窗洞、景框窗、假窗、拱门或背景景墙呈现，营造草地、花园、海景、庭院、森林或轻户外风景的感觉。远景可以是独立卡布灯箱、柔光灯箱景片、喷绘远景或仿真窗外画面，但不能像平面贴图。

中景为主播讲解区，需要保留干净可站播空间，可自然讲解服装。前景加入地面层次、植物、小型景观、地毯、石板路、花丛或柔和装饰，增强空间纵深。

整体氛围柔和、清新、适合女装直播，可以带法式、度假、森系、生活方式感，但景观不能压过主播和服装，仍然要以直播成交和服装展示为核心。

## 7. 负面提示词块

sceneStyleNegativeFragment:

```text
offline boutique fitting room, plain clothing store, store try-on photo, normal clothing store display, photo studio backdrop, photo studio portrait set, wedding photo backdrop, wedding set, wedding backdrop, floral wedding arch, heavy event installation, theme park decoration, homestay promo photo, boutique showroom, flat backdrop only, flat scenic wall, flat printed poster, full frontal centered window portrait, real outdoor location, real garden, romantic garden portrait, bridal studio, wedding floral arch, fashion editorial window shoot, lookbook shoot, model posing, premium try-on photo, lifestyle photoshoot, decorative scene overpowering host, too many flowers, full flower wall, no live-commerce room box, no room-box structure, no indoor set structure, no side wall, no corner composition, scenic window only with no physical set layers, host pasted against window, host lost in scenery, garment secondary to background, no foreground depth, no midground presentation zone, no clean selling zone, no clean standing space, props blocking host, plants blocking garment, furniture overload, cluttered garden scene, subject pasted onto background, floating subject, no floor contact, chaotic perspective, scenic props dominating clothing, scenery dominating clothing, landscape bigger than product, no live-selling function, Korean fashion model look, K-beauty makeup, idol-like face, glossy influencer portrait, Korean catalog model, overly delicate makeup, fashion lookbook face, model-like expression, overly polished portrait, soft Korean boutique aesthetic, same centered arch-window room, repetitive cream arch layout, identical room structure, fixed central window, same Korean boutique room, all scenes look the same, generic Korean fashion live room, no visible light stand, no softbox, no panel light, no led video light, no studio lighting equipment, no filming setup, no production gear, no narrow niche, no alcove-like window, no recessed wall niche, no small hole-like scenic opening, no cramped corner, no tiny arch recess, no one full row of clothes rack, no full rail of hanging garments, no store rack lineup, no boutique display wall, no showroom clothing rail, no fitting-room retail layout
```

中文负面：
普通门店、试衣间自拍、门店试穿照、婚庆布景、影楼布景、活动展陈过重、景观过多、道具抢主体、花草遮挡主播、没有讲解区、没有站播区、画面过满、没有前中后景、像民宿宣传照、不像直播间、纯户外风景、平面背景图、人物贴在背景上、没有落地感。

## 8. 必须保留的固定约束

无论主 route 是什么，本 sceneStyle 不得破坏以下约束：

1. 9:16 竖版直播画面
2. 主播或产品必须位于中景
3. 有真实地面和落点
4. 有前景、中景、远景层次
5. 有干净的直播讲解区
6. 道具不能抢主体
7. 景观不能压过服装
8. 不能变成婚庆 / 影楼 / 民宿 / 线下门店
9. 不能变成真实户外
10. 不能成为平面海报背景

## 9. sceneStyleChecklist

```json
{
  "selectedSceneStyle": "layered-window-scenic-live-room",
  "has_framed_window_structure": true,
  "has_far_background_carrier": true,
  "has_foreground_midground_background_depth": true,
  "has_host_presentation_zone": true,
  "has_clean_standing_space": true,
  "has_live_room_usability": true,
  "props_do_not_block_subject": true,
  "scenery_does_not_dominate_product": true,
  "not_plain_store": true,
  "not_photo_studio_set": true,
  "not_wedding_backdrop": true,
  "not_flat_backdrop_only": true,
  "not_real_outdoor_location": true,
  "has_indoor_live_room_box": true,
  "has_backlit_lightbox_window": true,
  "has_physical_side_props": true,
  "has_central_clean_selling_zone": true,
  "not_romantic_photo_studio": true,
  "not_wedding_floral_set": true,
  "not_lifestyle_try_on_photo": true,
  "status": "pass | fail",
  "missing": []
}
```
