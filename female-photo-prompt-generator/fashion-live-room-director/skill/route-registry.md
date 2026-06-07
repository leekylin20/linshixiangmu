# route-registry.md

已实现 Routes：

牛仔裤 / 丹宁 / 女裤 / 阔腿牛仔裤 / 直筒牛仔裤 / 微喇牛仔裤 / 高腰牛仔裤 / 显瘦牛仔裤 -> denim-live-room

未实现品类不得虚构 route。
未匹配品类回退到 generic-fashion-live-room，并在 Debug 中标记 routeFallback=true。

## Draft Routes

### brand-event-stage-live-room

匹配关键词：
- 品牌活动
- 品牌日
- 超级品牌日
- 品牌专场
- 官方旗舰直播
- 新品发布
- 明星嘉宾
- 嘉宾直播
- 专家直播
- 美妆直播
- 护肤直播
- 香水直播
- 珠宝直播
- 奢品直播
- 发布会直播
- 品牌直播广场

Route:
brand-event-stage-live-room

Status:
draft

Default behavior:
Do not auto-select this route for women’s fashion try-on prompts.
Do not use this route for denim, dress, sun-protection clothing, linen clothing or full-body garment display.
Only select this route when the user clearly asks for brand event, super brand day, beauty, skincare, fragrance, jewelry, official campaign or multi-host event livestream.

Debug status:

```json
{
  "selectedRoute": "brand-event-stage-live-room",
  "routeStatus": "draft",
  "connectedToGeneration": false,
  "requiresFinalTemplate": true,
  "doNotUseForFashionTryOn": true
}
```

### virtual-scenic-sunlight-live-room

匹配关键词：
- 绿幕
- 绿幕抠像
- 虚拟建模
- 虚拟直播间
- 假阳光
- 阳光房
- 天窗
- 草地
- 木梁
- 石材
- 岩石
- 苔藓
- 植物窗景
- 生态场景
- 户外感直播间
- 自然感直播间
- 夏季户外感
- 防晒服场景
- 轻户外生活方式

Route:
virtual-scenic-sunlight-live-room

Status:
draft

Default behavior:
Do not auto-select this route for denim jeans, strict commuting clothing, couture women’s fashion, brand event stage or multi-person launch livestream.
Only select this route when the user clearly asks for green screen compositing, virtual scenic modeling, faux sunlight, ecological material, outdoor feeling, seasonal freshness or natural lifestyle atmosphere.

Debug status:

```json
{
  "selectedRoute": "virtual-scenic-sunlight-live-room",
  "routeStatus": "draft",
  "connectedToGeneration": false,
  "requiresFinalTemplate": true,
  "doNotUseForPreciseGarmentFit": true
}
```

### new-chinese-aesthetic-live-room

匹配关键词：
- 新中式直播间
- 新中式女装
- 宋式美学
- 宋式极简
- 东方雅致
- 东方陈设
- 棉麻女装
- 文艺宽松
- 香云纱
- 刺绣女装
- 提花女装
- 苎麻女装
- 中式家居服
- 竹影
- 屏风
- 暖木中式
- 东方灯具
- 新中式陈设

Route:
new-chinese-aesthetic-live-room

Status:
draft

Reserved sub directions:
- song_minimal_home
- oriental_display_home

Default behavior:
Do not auto-select this route for strong urban denim jeans, sun-protection clothing, strong athleisure, European / American hot-girl style, medical research style or brand event stage livestream rooms.
Only select this route when the user clearly asks for new Chinese, Song-style, oriental elegant, cotton-linen, xiangyunsha, embroidery, jacquard, ramie, Chinese homewear or similar clothing presentation.

Debug status:

```json
{
  "selectedRoute": "new-chinese-aesthetic-live-room",
  "routeStatus": "draft",
  "connectedToGeneration": false,
  "requiresFinalTemplate": true,
  "doNotUseForBrandEventStage": true,
  "doNotUseForGreenScreenScenic": true
}
```

### faux-garden-window-scenic-live-room

中文名：
仿真花园窗景直播间

匹配关键词：
- 仿真花园
- 花园窗景
- 夏日庭院
- 海景窗
- 木屋窗景
- 花园直播间
- 卡布灯箱花园
- 半弧形灯箱
- 弧形灯箱
- 软膜灯箱
- 仿真绿植
- 仿真草皮
- 夏装直播间
- 防晒服花园场景
- 森系女装直播间
- 轻户外直播间
- 度假风直播间
- 花园系品牌
- 宠物生活方式直播间

Route:
faux-garden-window-scenic-live-room

Status:
draft

Default behavior:
Do not auto-select this route for normal denim, formal dress, deep wood premium fashion, new Chinese fashion, or brand event livestream.
Only select when the user clearly asks for faux garden, summer garden, scenic window, curved lightbox, seaside cottage, flower greenery, light outdoor, or summer lifestyle live room.

Debug:

```json
{
  "selectedRoute": "faux-garden-window-scenic-live-room",
  "routeStatus": "draft",
  "connectedToGeneration": false,
  "requiresFinalTemplate": true,
  "coreScenicStructure": "curved SEG lightbox backdrop"
}
```
