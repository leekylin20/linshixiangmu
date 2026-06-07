# bakery_bread_video_master_unbranded_v01 Audit

Audit fields:

- `unbrandedPass`
- `safeAreaPass`
- `cameraPerspectivePass`
- `bakeryProductPass`
- `foregroundTablePass`
- `personOrEmptyRoomPass`
- `textPass`
- `lightingPass`
- `layerFriendlyPass`
- `negativePromptPass`

Status is `fail` if the prompt omits 9:16 / 1080x1920, brand restrictions, safe area, camera height, 35-50mm lens, bakery products, foreground bakery table, layer split requirements, or if it asks for real brand, price, platform UI, ordinary restaurant rendering, poster collage, strong top-down view, or difficult cutout edges.
