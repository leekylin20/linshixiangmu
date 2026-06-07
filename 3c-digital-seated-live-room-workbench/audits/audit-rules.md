# auditPromptFor3CDigitalSeatedLiveRoom v04

## 单条 Required Checks

```json
{
  "status": "pass/fail",
  "projectIsolationPass": true,
  "douyinSeatedLiveRoomPass": true,
  "hostAgePass": true,
  "hostStylePass": true,
  "cameraPass": true,
  "pulledBackCameraPass": true,
  "studioScalePass": true,
  "techAtmospherePass": true,
  "titleTechPanelPass": true,
  "backgroundDepthPass": true,
  "tableWidthPass": true,
  "productPlacementPass": true,
  "opaqueInfoCardsPass": true,
  "styleRoutePass": true,
  "localRandomPoolPass": true,
  "controlledStyleVariationPass": true,
  "techRoomStylePass": true,
  "cutoutFriendlyPass": true,
  "outputSchemaPass": true,
  "negativePromptPass": true,
  "notes": []
}
```

## 批量 Style Distribution Audit

批量输出必须额外返回：

```json
{
  "status": "pass/fail",
  "uniqueStyleCount": 10,
  "minUniqueRequired": 10,
  "noAdjacentDuplicate": true,
  "maxShare": 0.1,
  "routeCounts": {},
  "notes": []
}
```

固定风格模式或用户手动指定 `style_route` 时，允许整批同一风格。自动随机模式下必须满足：

- 2-3 张至少 2 种风格；
- 4-6 张至少 3 种风格；
- 7-10 张至少 5 种风格；
- 11-30 张尽量覆盖完整 10 种风格；
- 相邻两条不能使用同一个 `styleRoute`；
- 单一风格占比不能超过 30%。

## Fail Conditions

Status is `fail` if any of these happen:

- prompt mixes with fashion, beauty, food, fresh food, bakery, pharmacy, home decor, or other category logic;
- no seated livestream camera;
- no Chinese Douyin adult female host;
- host age is not locked at 23-28;
- camera is not 120-125cm / 35mm / slight downward 2-3 degrees;
- camera is not slightly pulled back to reveal background technology atmosphere;
- room does not feel like a medium-large professional digital tech livestream studio;
- background lacks depth, curved/layered tech walls, large rear visual area, or luminous edge lines;
- selected style route is missing or the prompt collapses back into one default cold-blue room every time;
- prompt lacks local random modules for background structure, table material, title board, info card, background display, accent color, and host style;
- title area is too small or looks like an ordinary shop sign;
- tabletop is too wide or becomes the main subject;
- products are not clearly placed on the foreground table;
- info cards are transparent, acrylic, holographic, floating, glass, or hard to cut out;
- scene becomes showroom, cyberpunk, internet cafe, living room, poster, or product collage;
- negative prompt lacks key bans for Korean model look, age drift, standing host, high camera, wide tabletop, transparent acrylic cards, floating UI, real brands, real logos, real prices, platform UI, cramped room, shallow gray room, weak technology atmosphere, ordinary counter room, title too small, background not visible, and repeated identical style.

## Output Schema Checks

Each generated item must include:

- `category: "3c_digital"`
- `sceneType: "seated_livestream"`
- `styleRoute`: English route ID
- `styleRouteCn`: Chinese route name
- `productType`: English product ID
- `productTypeCn`: Chinese product name
- `prompt`: alias of `positivePrompt`
- `positivePrompt`
- `negativePrompt`
