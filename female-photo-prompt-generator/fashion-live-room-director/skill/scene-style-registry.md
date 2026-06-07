# Scene Style Registry

Scene styles are room-style overlays. They must not replace the main product route.

System hierarchy:

1. `large-corner-home-live-room` is the default base spatial framework.
2. `layered-window-scenic-live-room` is retained as an optional `scenicModule` / advanced scenic layer.
3. Final prompt composition should follow:
   `routePrompt + largeCornerHomeSpatialLock + optionalScenicModulePrompt + productDisplayLogic + globalNegativeRules`.
4. Faux windows, soft-membrane lightboxes, SEG fabric lightboxes and layered scenery must be built on top of the large corner room instead of running as an independent frontal window set.

## large-corner-home-live-room

Chinese name: 大空间转角居家感直播间

English ID: `large-corner-home-live-room`

### Matching Keywords

Chinese:

- 大空间转角
- 转角居家感
- 居家感直播间
- 大空间直播间
- L型转角
- 转角构图
- 侧向窗光
- 侧窗光
- 侧窗直播间
- 家居感站播
- 生活方式直播间
- 真实室内直播间
- 低密度陈列
- 大面积地面
- 室内房间盒子
- 大空间室内盒子
- 转角服装直播间
- 大空间女装直播间
- 大空间男装直播间

English:

- large corner live room
- L-shaped room
- corner composition
- home-style live room
- large indoor room box
- side window light
- spacious fashion live room
- lifestyle live-commerce room
- angled live camera view
- large floor depth
- low-density garment display

### Rules

1. If user input contains these keywords, set `selectedSceneStyle = large-corner-home-live-room`.
2. If the user asks for home style, large space, corner, real indoor room, no faux scenery, or no store feeling, prefer this scene style.
3. If the user mentions layered scenic windows but also emphasizes large space, corner, or real indoor room, prefer this scene style and keep scenic elements only as side window or side-rear background elements.
4. If no scene style is specified, default to `large-corner-home-live-room`.
5. Debug output must include `selectedSceneStyle`, `sceneStyleFallback`, `matchedSceneStyleKeywords`, `selectedMaterialPalette`, and `selectedLayoutVariant`.

## layered-window-scenic-live-room

Chinese name: 女装层次窗景假景直播间

English ID: `layered-window-scenic-live-room`

Role: optional `scenicModule` / advanced scenic layer.

It provides faux window, framed window, arch window, soft-membrane lightbox, backlit fabric lightbox, SEG fabric lightbox, distant window scenery, and foreground-midground-background scenic layering.

Inheritance rule:

When using `layered-window-scenic-live-room`, always inherit the `large-corner-home-live-room` spatial lock first: large room-box, L-shaped corner composition, visible side wall, large floor depth, clean midground selling zone, integrated architectural lighting only, no visible filming equipment, no narrow niche, no full row of clothes rack.

## Matching Keywords

### Chinese

- 层次假景
- 层次窗景
- 层次窗景假景
- 仿真窗景
- 仿真窗户
- 假窗景
- 景框窗
- 拱门窗景
- 拱窗景
- 室内仿户外
- 花园窗景
- 海景窗景
- 草坪窗景
- 窗外感
- 法式窗景
- 生活方式场景
- 软膜灯箱
- 软膜灯箱窗景
- 卡布灯箱
- 卡布灯箱远景
- 独立灯箱远景
- 前中后景层次
- 女装层次
- 女装窗景
- 女装假景
- 女装氛围场景

### English

- layered scenic
- faux window view
- framed window backdrop
- arched window view
- indoor faux outdoor
- lifestyle scenic live room
- backlit fabric scenic backdrop
- SEG fabric lightbox
- window-scene fashion livestream set

## Rules

1. Scene style only affects room style and must not override the main route.
2. If the user explicitly asks for a normal realistic live room, no faux scenery, or no window view, do not enable this scenic module.
3. If user input contains any matching keyword, keep `selectedSceneStyle = large-corner-home-live-room` and set `selectedScenicModule = layered-window-scenic-live-room` when the prompt builder supports scenic modules.
4. If the current system only supports one sceneStyle field, `layered-window-scenic-live-room` may still appear as a sceneStyle option, but it must inherit the `large-corner-home-live-room` spatial lock first.
5. Debug output must include `selectedSceneStyle`, `selectedScenicModule`, `sceneStyleFallback`, `matchedSceneStyleKeywords`, and `matchedScenicModuleKeywords`.
