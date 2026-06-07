# Phase 01.2 - Scene Enrichment Patch

## Why This Patch Exists

The final-template mode already passed baseline validation, and the three product directions can generate usable images. This patch only addresses two small visual quality issues found after visual review:

- Sun-protection clothing scenes were too neutral and did not feel summery enough.
- Dress scenes felt too plain, with insufficient soft furnishing and lifestyle depth.

## Sunproof Template Patch

The `sunproof_fresh_summer_corner.md` template was adjusted to strengthen:

- early summer freshness
- airy, bright, breathable and sunlit feeling
- pale green / sage / mist blue seasonal palette
- fresh green plants and light foliage
- subtle outdoor greenery through the side-back window
- clearer sun-protection garment display points, including hood or collar, zipper, lightweight fabric, sleeve length and hemline

The patch avoids dark forest mood, resort vacation styling, camping scene, sporty showroom, autumn mood and overly neutral no-season rooms.

## Dress Template Patch

The `dress_soft_home_window_corner.md` template was adjusted to strengthen:

- refined warm home styling
- feminine low-density soft furnishing
- sideboard / low cabinet, round side table, layered curtains, rug and accent chair
- ceramic vase, fresh flowers, framed art, warm wall sconce, books and low greenery
- clearer dress display points, including neckline, shoulder line, waistline, chest-waist proportion, sleeve shape, skirt drape, hemline, shoes and full-body silhouette

The patch keeps all furnishing at the sides and rear, so the central selling zone and dress display remain clean.

## Unchanged

- `denim_deep_wood_premium_corner.md` was not modified.
- No visual director layer was added.
- No rewrite layer was added.
- No image generation was called.
- No routePrompt / sceneStylePrompt / layoutVariantPrompt rule-stacking was restored.
- The system remains in final-template mode.

## Validation Summary

- `sunproof_fresh_summer_corner.md`: 225 English words, pass.
- `dress_soft_home_window_corner.md`: 228 English words, pass.
- Both prompts stay within the target 170-230 word range.
- Both retain the large room-box, L-shaped corner composition, visible side wall, floor depth and clean midground presentation zone.
