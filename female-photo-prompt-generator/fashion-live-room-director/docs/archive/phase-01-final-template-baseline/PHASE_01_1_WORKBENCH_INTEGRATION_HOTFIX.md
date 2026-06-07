# Phase 01.1 - Workbench Integration Hotfix

## Hotfix Goal

Make the final-template mode visible and selectable from the frontend workbench for denim live-room cases, without changing the audited final prompt template core.

## Completed Items

- Added visible denim category options in the workbench:
  - 牛仔裤 -> `denim_jeans`
  - 高腰牛仔裤 -> `high_waist_denim`
  - 阔腿牛仔裤 -> `wide_leg_denim`
  - 微喇牛仔裤 -> `micro_flare_denim`
  - 直筒牛仔裤 -> `straight_denim`
  - 丹宁裤 -> `denim_pants`
- Added visible layout option:
  - L 型构图 -> `l_shape_corner_layout`
- Mapped all denim category and denim-fit values to:
  - `selectedRoute = denim-live-room`
  - `selectedFinalPromptTemplate = denim_deep_wood_premium_corner.md`
- Added Workbench Integration Debug output for:
  - selected category
  - selected subcategory
  - selected route
  - selected scene style
  - selected layout variant
  - selected final prompt template
  - template mode
  - prompt word count
  - audit status
  - ready-for-image-generation status
- Validated three frontend cases with JSDOM:
  - `denim_jeans + l_shape_corner_layout`
  - `high_waist_denim + l_shape_corner_layout`
  - `micro_flare_denim + l_shape_corner_layout`

## Unchanged Items

- No image generation was called.
- No final template core content was changed.
- No visual director layer was added.
- No rewrite layer was added.
- No old routePrompt / sceneStylePrompt / layoutVariantPrompt rule-stacking was restored.
- No long 700-900 word prompt composition was reintroduced.

## Validation Result

All three hotfix validation cases passed:

- `selectedRoute = denim-live-room`
- `selectedLayoutVariant = l_shape_corner_layout`
- `selectedFinalPromptTemplate = denim_deep_wood_premium_corner.md`
- `templateMode = true`
- `auditStatus = pass`
- compact prompt contains L-shaped corner, large indoor room-box, visible side wall, foreground floor depth, clean midground presentation zone, and denim display points.
