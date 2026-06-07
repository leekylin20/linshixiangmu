# Prompt Template Baseline

This archive freezes the current audit-passing final template mode baseline.

## 1. Denim Template

templateName: `denim_deep_wood_premium_corner.md`

positivePrompt:

```text
Vertical 9:16 realistic women's fashion live-commerce room, large indoor room-box space, L-shaped corner composition, slight angled live-camera view. Show a visible side wall, main background wall, ceiling, large foreground floor depth and a clean midground presentation zone.

The product is [PRODUCT_NAME], a premium urban denim piece for commuting and daily styling. The scene follows the product mood: mature, steady and refined, with [MATERIAL_DETAILS]. Use low-density furnishing: [SOFT_FURNISHING_DETAILS]. Small props: [PROP_DETAILS]. All props stay secondary and low-density.

The host looks like a natural Chinese fashion livestream seller, friendly, grounded and commercial. She stands in the midground, speaking to the live camera, one hand indicating the waistband or hip line, the other naturally explaining the pant leg.

The jeans are the main subject. Clearly show [DISPLAY_POINTS]. Full pants silhouette, hems and shoes must be visible, with natural body proportions and realistic denim texture.

Use integrated architectural lighting only: ceiling downlights, hidden cove lighting, wall lamps and warm ambient interior light. Use only one small side sample display.
```

negativePrompt:

```text
fake price, invented price, price tag, promotion board, blackboard price sign, large sales sign, discount board, dense text, visible softbox, visible light stand, LED panel light, filming equipment, photo studio backdrop, boutique fitting room, store try-on photo, full row of clothes rack, dense clothing racks, retail rack lineup, narrow niche, flat front-facing backdrop, no side wall, no floor depth, host pasted against wall, giant host, overlong legs, cropped hems, waistband blocked, pants distorted, denim texture missing, Korean catalog model, fashion editorial pose.
```

variables:

- `[PRODUCT_NAME]`
- `[DISPLAY_POINTS]`
- `[SOFT_FURNISHING_DETAILS]`
- `[PROP_DETAILS]`
- `[MATERIAL_DETAILS]`

displayPoints:

```text
high waist, waistband, fly front, pockets, hip fit, leg silhouette, full hems, shoes, denim wash, seams and hem drape
```

## 2. Dress Template

templateName: `dress_soft_home_window_corner.md`

positivePrompt:

```text
Vertical 9:16 realistic women's fashion live-commerce room, large indoor room-box space, L-shaped corner composition, slight angled live-camera view. Show a visible side wall, main background wall, large foreground floor depth and a clean midground presentation zone. The scene is a soft home-style window-scenic corner inside a real indoor livestream room, not a studio portrait set and not a wedding scene.

Use a side-back arched window or partial scenic window with [MATERIAL_DETAILS]. Add low-density furnishing: [SOFT_FURNISHING_DETAILS]. Small props: [PROP_DETAILS]. The window stays toward the side-back area and supports room depth, not as a centered portrait backdrop. Keep the center as a clean livestream selling zone.

The product is [PRODUCT_NAME], a soft women's dress with a light, breathable and elegant commercial mood. The host looks like a natural Chinese fashion livestream seller, friendly and grounded. She stands in the midground, speaking to the live camera with natural product explanation gestures.

The dress is the main subject. Clearly show [DISPLAY_POINTS]. The garment must stay fully visible, with complete length and shoes shown.

Use integrated architectural lighting only. No visible filming equipment. Use minimal side styling only, no dense clothing rack.
```

negativePrompt:

```text
wedding window set, bridal studio, romantic portrait, photo studio portrait set, centered arched window portrait, full frontal window backdrop, flat scenic wall, host pasted against window, narrow window niche, Korean soft boutique room, lifestyle editorial, model-only pose, fake price, promotion board, large sales sign, visible softbox, visible light stand, LED panel light, full row of clothes rack, dense retail rack, furniture blocking garment, cropped dress hem, garment details unclear.
```

variables:

- `[PRODUCT_NAME]`
- `[DISPLAY_POINTS]`
- `[SOFT_FURNISHING_DETAILS]`
- `[PROP_DETAILS]`
- `[MATERIAL_DETAILS]`

displayPoints:

```text
neckline, shoulder line, waistline, sleeve shape, skirt drape, hemline, full length and shoes
```

## 3. Sunproof Template

templateName: `sunproof_fresh_summer_corner.md`

positivePrompt:

```text
Vertical 9:16 realistic women's fashion live-commerce room, large indoor room-box space, L-shaped corner composition, slight angled live-camera view. Show visible side wall, main background wall, large foreground floor depth, clean midground presentation zone and real room distance behind the host.

The product is [PRODUCT_NAME], a lightweight summer sun-protection garment. The scene follows the product: clean, bright, breathable, fresh and practical. Use [MATERIAL_DETAILS]. Add low-density furnishing: [SOFT_FURNISHING_DETAILS]. Small props: [PROP_DETAILS].

The host looks like a natural Chinese fashion livestream seller, friendly, grounded and commercial. She speaks to the live camera, explaining lightness, breathability, commuting use and daily outdoor practicality.

The garment is the main subject. Clearly show [DISPLAY_POINTS]. The full outfit relation and shoes must be visible.

Use integrated architectural lighting only. No visible filming equipment. Only one small side sample display is allowed.
```

negativePrompt:

```text
fake price, promotion board, large sales sign, visible softbox, visible light stand, LED panel light, production gear, boutique fitting room, store try-on photo, dense clothing racks, full row of clothes rack, narrow niche, flat front-facing backdrop, no side wall, no floor depth, plastic raincoat, medical protective suit, heavy hiking gear, cluttered summer props, Korean catalog model, fashion editorial pose, garment blocked, sleeve cropped, zipper missing.
```

variables:

- `[PRODUCT_NAME]`
- `[DISPLAY_POINTS]`
- `[SOFT_FURNISHING_DETAILS]`
- `[PROP_DETAILS]`
- `[MATERIAL_DETAILS]`

displayPoints:

```text
collar or hood, zipper, sleeve length, lightweight fabric texture, body silhouette, hemline, full outfit relation and shoes
```
