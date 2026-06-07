# faux-garden-window-scenic-live-room
# 仿真花园窗景直播间 route

## Route Status

draft route  
connectedToGeneration: false  
requiresFinalTemplate: true

## Core Definition

室内可控置景型直播间，通过半弧形卡布灯箱、木屋窗景、仿真绿植、仿真草皮、花丛和假阳光搭建出类似户外花园、海边小屋、夏日庭院的直播场景。

It is not a real outdoor location, not a normal green screen room, not a flat cloth backdrop and not a printed poster wall.

This is a medium-size buildable indoor livestream scenic set inside a rectangular white-box room, not a real outdoor garden, not a giant TVC stage, and not an immersive exhibition installation.

Recommended base room:

- room width around 5 meters
- room depth around 7 meters
- room height around 3.5 meters
- at least 3.3 meters works, around 4 meters is ideal

Overall positioning:

- medium-size commercial livestream room
- low-to-mid budget buildable set
- not a tiny corner scene
- not a giant TVC studio
- not an immersive exhibition hall
- not a real outdoor garden

Its essence is:

rectangular white-box livestream room + wall-to-ceiling curved SEG lightbox scenic wall + diagonal partial cottage window module + artificial hydrangea tree and low flower beds + continuous artificial grass floor + midground livestream host position.

## Core Scenic Structure

The distant scenic layer must be a 墙顶弧形卡布灯箱 / wall-to-ceiling curved SEG fabric lightbox scenic wall, not a normal flat background lightbox.

Priority hard lock:

The SEG fabric lightbox scenic wall rises vertically from the floor to the ceiling. The curved transition happens at the junction between the wall and the ceiling, and the scenic image extends onto a portion of the ceiling.

Clarification:

- The curve is not a side-wall-to-back-wall plan-view bend.
- The curve is not an L-shaped room corner.
- The curve is not a vertical corner bend between two upright walls.
- The curve is the cove transition from vertical wall to ceiling.
- The sky or scenic image must extend onto part of the ceiling.
- This creates a faux outdoor wraparound feeling through "distant wall scenery + overhead sky extension".

Purpose:

1. Avoid flat printed backdrop feeling.
2. Avoid misunderstanding the set as an L-shaped room or side-wall bend.
3. Build overhead faux-sky depth in vertical mobile livestream composition.
4. Work with foreground grass, flower bushes and cottage window props to create real spatial layers.
5. Make the faux outdoor scene feel like an enterable courtyard, not a printed poster.
6. Keep the livestream room controllable for lighting, sound and camera.

Positive structure keywords:

- curved SEG lightbox backdrop
- semi-curved scenic lightbox wall
- wraparound scenic background
- curved fabric lightbox
- immersive garden backdrop
- continuous sky-and-sea background
- wall-to-ceiling curved SEG fabric lightbox
- ceiling scenic image extension
- cove transition scenic wall
- overhead sky extension

Negative structure keywords:

- flat printed backdrop
- straight flat scenic wall
- poster-like scenic wall
- cheap photo backdrop
- visible backdrop seam
- no wraparound depth
- flat cloth background
- L-shaped room
- L-shaped space
- plan-view corner bend
- side wall to back wall curved corner
- arched window opening
- small rounded rectangle background
- giant wraparound LED stage
- tunnel screen
- immersive exhibition dome

## Core Structure

远景必须是墙顶弧形卡布灯箱，不是普通平面背景，不是左右墙面的 L 型转角。

### Far Background Layer

- wall-to-ceiling curved SEG fabric lightbox scenic wall
- blue sky
- sea view
- garden view
- cloud
- lawn
- soft summer daylight background
- scenic image extending onto a portion of the ceiling
- wall-to-ceiling cove transition

### Midground Scenic Layer

- partial wooden cottage window module
- small triangular eave / roof shape
- wooden window frame
- shutter
- foam carved window
- open window frame
- sheer curtain
- windowsill
- flower pots
- small steps
- wooden platform
- artificial flower tree
- hydrangea bushes

The wooden cottage window module must be placed at a slight diagonal angle, not flat against the right wall. It should be rotated inward toward the center of the scene, approximately 25 to 35 degrees, so that it hides the right-side edge of the SEG lightbox in the future front camera view.

Do not use a complete cottage, complete homestay building, full house facade or a large real building facade. Do not place the wooden module flat against the right wall. Do not expose the right-side SEG lightbox edge in the future front view.

### Foreground Layer

- fake grass carpet
- flower bushes
- round wood table
- lace tablecloth
- flower basket
- low greenery
- small stool
- flower pot
- windowsill vase

The floor should use continuous artificial grass carpet as the host standing area. It must not become a small hard-edged stage, a narrow turf island, or a thick sharp platform edge. The front area should keep enough host standing and walking space.

### Host / Product Layer

- clean host zone or product display zone
- host must not be blocked by flowers, table or window frame
- product display area must not be swallowed by scenery
- clothing categories must keep upper body, hemline, pants hem or shoes visible

## Composition Formula

right-side diagonal cottage window + left-side flower tree + foreground grass and flowers + rear wall-to-ceiling curved SEG lightbox + central host position

More specifically:

- right side: partial cottage window module / wood window / shallow platform / windowsill flowers, rotated inward around 25-35 degrees
- left side: artificial hydrangea tree / branches / hydrangea / low plants
- center: host or product display zone
- bottom: grass carpet / flowers / round wood table / visual base for livestream comments
- top: blue sky / flower branches / UI-safe area
- rear: wall-to-ceiling curved SEG lightbox creates vertical distant scenery and ceiling sky extension

Core relationship:

The right-side diagonal cottage module anchors visual weight and hides the right-side lightbox edge, the left-side greenery creates natural atmosphere, the center remains for host and product, the foreground grass and flowers create layers, and the rear wall-to-ceiling curved SEG lightbox provides the distant wall scenery plus overhead sky extension.

## Hydrangea Tree And Flower Bed Rule

There must be a midground blocking layer between the cottage module and the SEG lightbox.

Recommended:

- one medium-size artificial hydrangea tree
- white, blue-white or pale pink flowers
- low flower beds
- flower baskets
- small potted plants

Purpose:

- hide the structural transition between the cottage module and the lightbox
- hide SEG edges and seam feeling
- create midground depth
- avoid the image reading as "background picture + cottage cutout"

Avoid:

- wedding floral design
- large commercial floral wall
- overly dense flower sea
- plants occupying the host position
- oversized tree pressing down from the top

## Three-Image Delivery Rule

Current phase lock:

- Active locked case: `empty_front_9x16`.
- Active locked case: `host_final_9x16`.
- Paused case: `wide_overview_16x9`.

Do not connect, generate, audit, or write final prompts for `wide_overview_16x9` in the current phase. Keep the wide overview knowledge as future build-reference context only. Reopen `wide_overview_16x9` only after both vertical 9:16 cases are visually stable.

Shared vertical Scene DNA:

- `scene_dna_shared_9x16_v01.md`
- version alias: `shared_scene_dna_two_9x16_v01`

`empty_front_9x16` and `host_final_9x16` must be treated as two camera framings of the same set, not two redesigned prompts. The empty front view is pulled back on the same front camera axis; the host final view is the tighter livestream crop. Keep the wooden cottage module, hydrangea tree, flower borders, lace table, flower basket, grass boundary and rear lightbox in the same relative positions.

Compile rule: always prepend Shared Scene DNA to each 9:16 case-specific positivePrompt, and prepend Common Negative to each 9:16 case-specific negativePrompt.

This scenic set should normally be delivered as three images:

1. Empty front view, vertical 9:16.
   Purpose: show the final livestream main visual without host or product, while preserving a usable standing zone.

2. Full build overview, horizontal 16:9.
   Purpose: show the full construction relationship, including wall-to-ceiling curved SEG lightbox, ceiling scenic extension, diagonal right-side cottage module, hydrangea blocking layer, grass standing area and white-box room boundaries. Ceiling, track lighting, wall edges and set logic may be visible.

3. Final host grounded view, vertical 9:16.
   Purpose: show the final livestream camera image with obvious set edges hidden. Host stands full-body on grass, feet contact the ground, light and shadow direction match, and foreground leaves may be used at the top edge to justify dappled light.

## Prompt Structure Archive

Final prompt structures are divided into three types:

1. Vertical 9:16 front-view empty scenic livestream set.
   Use for the final empty livestream scenic view. No host, no product, clean central standing zone, suitable for future livestream use.

2. Wide 16:9 panoramic full-view image, scenic build overview.
   Use to show the rectangular white-box room, wall-to-ceiling curved SEG lightbox, ceiling scenic extension, angled right-side cottage module, grass floor, flower tree, flower beds and construction scale.

3. Vertical 9:16 realistic Douyin livestream frame with one host.
   Use as the final livestream image. Host must be grounded, garment visible, no set reveal, and the image should feel like a Chinese Douyin livestream, not a Korean fashion lookbook or Korean catalog model image.

All prompt variants must preserve the core structural locks:

- medium-size buildable indoor livestream scenic set inside a rectangular white-box room
- wall-to-ceiling cove SEG fabric lightbox scenic wall
- scenic image extends onto a portion of the ceiling
- bright seaside garden view with blue sky, soft clouds, ocean horizon and fresh summer atmosphere
- wooden cottage window module angled inward 25-35 degrees
- faux hydrangea tree and low flower beds hiding the structural transition
- continuous artificial grass forming the host standing zone

## Host Image Rules

Locked host_final_9x16 reference:

- `host_final_9x16_locked_youthful_douyin_host_v01.md`

Use this locked version for future final host grounded images in this route. It preserves the accepted direction: young bright Chinese Douyin female livestream host, fresh stylish commercial outfit, hidden side-wall edges, upper foreground leafy framing, right-side wooden cottage facade edge cover, hydrangea transition layer and continuous grass standing zone.

For any host image, include this identity lock:

One adult Chinese female Douyin livestream host stands naturally in the central presentation zone. She looks like a real Chinese live-commerce seller, friendly, grounded, practical and commercial, speaking toward the camera with natural product explanation gestures. She is not a Korean fashion model, not a K-beauty influencer, not an idol-like portrait, and not a fashion catalog model.

Recommended host-scene lock:

This is a realistic Chinese Douyin live-commerce scene, not a Korean fashion lookbook. The host should look like a natural Chinese Douyin female livestream seller explaining products, with approachable commercial expression, realistic face, natural makeup, normal body proportion and grounded live-selling presence.

Host negative terms:

- Korean fashion model look
- K-beauty makeup
- idol-like face
- glossy influencer portrait
- Korean catalog model
- overly delicate makeup
- fashion lookbook expression
- cold model pose
- editorial fashion shoot
- over-polished portrait
- soft Korean boutique aesthetic
- Korean-style livestream room
- model-like body exaggeration
- overlong legs
- tiny face
- unrealistic beauty filter

Final host image must avoid:

- visible studio ceiling
- exposed lightbox edge
- white room edge
- turf boundary
- backstage reveal
- construction edge
- floating feet
- cropped feet
- host pasted onto background
- wrong scale
- mismatched lighting
- hard cutout
- empty top corners
- no foreground leaves
- unreasonable ground light spots
- text
- price sign
- livestream UI

## Suitable Categories

Priority suitable:

- summer clothing
- sun-protection clothing
- light outdoor fashion
- forest-style women’s clothing
- fresh women’s clothing
- vacation-style women’s clothing
- kidswear
- parent-child clothing
- hats
- shoes and apparel
- fragrance
- washing care
- natural skincare
- garden-style brands
- pet lifestyle
- home lifestyle
- summer new product livestream
- spring / summer launch livestream

Generally suitable:

- cotton-linen women’s clothing
- light French women’s clothing
- fresh commuting women’s clothing
- niche designer women’s clothing

Not priority:

- structured denim try-on
- serious commuting suits
- luxury couture dress
- heavy autumn / winter fashion
- deep wood premium fashion room
- luxury brand event stage
- beauty brand day center-stage room
- fashion try-on that requires strict body proportion accuracy

## Visual Language

fresh, sunny, soft, garden-like, controlled indoor set, faux outdoor, immersive, clear mobile livestream composition

Visual keywords:

- faux garden set
- indoor faux outdoor live room
- curved SEG lightbox backdrop
- semi-curved scenic lightbox wall
- wraparound scenic background
- wooden cottage window
- open window frame
- scenic cottage facade
- artificial greenery
- hydrangea bushes
- fake grass carpet
- flower basket
- lace table
- seaside background
- garden cottage atmosphere
- summer garden livestream set
- controlled indoor live room
- immersive garden backdrop
- soft summer sunlight
- faux sunlight
- flower shadow
- tree shadow
- soft blue sky reflection
- vertical mobile livestream composition

## Negative Rules

No flat printed backdrop, no wedding flower arch, no excessive floral wall, no dense plant wall, no tropical resort scene, no fake green screen cutout, no cluttered props, no flowers blocking garment, no scenery overpowering host, no broken perspective, no visible backdrop seams.

Do not generate:

- real outdoor location
- wedding flower arch
- wedding garden set
- excessive floral wall
- dense plant wall
- tropical resort scene
- flat printed backdrop
- straight flat scenic wall
- L-shaped room
- L-shaped space
- plan-view corner bend
- side wall to back wall curved corner
- flat scenic backdrop only
- small arched window opening
- giant wraparound LED wall
- immersive exhibition hall
- TVC mega studio
- fake green screen cutout
- low-quality studio garden
- cheap photo backdrop
- visible backdrop seam
- no wraparound depth
- broken perspective
- cluttered props
- no clean host zone
- flowers blocking garment
- flowers blocking product
- scenery overpowering host
- scenery overpowering product
- cartoon garden
- fantasy forest
- over-saturated green
- messy artificial plants
- children photography studio
- tourist photo spot
- outdoor travel advertisement
- flat poster background
- poor scale relationship
- floating feet
- mismatched lighting
- host pasted onto background
- full cottage building
- complete house facade
- oversized roof
- massive lawn
- hard tiny turf island
- visible lightbox edge in final front view
- wooden cottage module flat against wall
- cramped small photo booth
- overly luxurious commercial film set

## Route Boundaries

### Difference From Large Corner Fashion Live Room

Large corner fashion live room:
- real indoor soft-furnishing space
- better for normal fashion try-on
- emphasizes garment fit, pants hem, skirt hem and waistline

Faux garden window scenic live room:
- wall-to-ceiling curved SEG lightbox + artificial natural set
- better for spring / summer, fresh, light outdoor and lifestyle scenes
- emphasizes seasonality and outdoor imagination

### Difference From Virtual Scenic Sunlight Live Room

Virtual scenic sunlight live room:
- more virtual modeling / chroma key / 3D scenic room
- can be more idealized and virtual

Faux garden window scenic live room:
- more physical set based
- emphasizes SEG lightbox, cottage window, artificial greenery and grass carpet
- feels more like a buildable livestream set

### Difference From Brand Event Stage Live Room

Brand event stage live room:
- brand facade
- center-stage composition
- multi-host / guest
- product counter
- official campaign feeling

Faux garden window scenic live room:
- summer garden
- natural lifestyle
- single host or small presenter setup
- fresh and relaxed atmosphere

### Difference From New Chinese Aesthetic Live Room

New Chinese aesthetic live room:
- warm wood, screen, curtain, oriental furnishing
- quiet and restrained
- suitable for cotton-linen, new Chinese and literary women’s clothing

Faux garden window scenic live room:
- blue sky, garden, sea view, cottage window, flowers and grass
- fresh and bright
- suitable for summer clothing, sun-protection clothing, light outdoor and natural lifestyle categories

## Future Template Direction

Current locked empty-front template:

- `faux_garden_empty_front_tvc_studio_locked_v01.md`
  - caseId: `empty_front_9x16`
  - mode: final template + fixed structure
  - connectedToGeneration: false
  - audit: `auditPromptForFauxGardenEmptyFront`

Future final templates may include:

- summer_garden_window_live_room.md
- seaside_cottage_lightbox_live_room.md
- sunproof_greenery_window_live_room.md
- kidswear_garden_cottage_live_room.md
- fragrance_floral_window_live_room.md

Current route remains draft until final prompt templates are created and audited.

## Archive Conclusion

The core of this scene is not "outdoor garden" and not "L-shaped space". It is a buildable medium-size scenic set inside a rectangular white-box livestream room: a SEG fabric scenic wall rises from floor to ceiling, curves at the wall-to-ceiling junction, and extends sky imagery onto the ceiling; a partial wooden cottage window module is placed diagonally on the right to hide the lightbox edge; a midground artificial hydrangea tree and low flower bed hide structural seams; continuous artificial grass creates the host standing area. The result is a reusable, buildable, faux outdoor livestream scenic set.
