# Version Notes

## v0.1 - Rule Stack Prototype

- route / sceneStyle / layoutVariant 规则拼接阶段。
- prompt 过长，生成不稳定。

## v0.2 - Audit and Conflict Cleanup

- 增加 prompt-writing-framework 审计。
- 清理价格、灯具、直播身份冲突。

## v0.3 - Final Template Mode Baseline

- 新增 final-prompt-templates。
- `buildPromptFromFinalTemplate` 生效。
- 三类模板通过审计。
- 阶段性稳定基线。

## v0.3.1 - Workbench Integration Hotfix

- 接入牛仔裤品类到工作台。
- 接入 L 型构图 layoutVariant。
- 完成 denim-live-room 到 `denim_deep_wood_premium_corner.md` 的模板映射。
- Debug 与 Prompt Preview 可见链路验证。

## v0.3.2 - Scene Enrichment Patch

- 增强防晒服模板的夏季感与绿色层次。
- 增强裙装模板的软装丰富度与空间层次。
- 保持模板模式，不回退到规则拼接。

## v0.4 - Soft Furnishing & Decor Variable Library

- 新增软装、摆件、材质变量库。
- 支持按产品品类、季节、价格带选择视觉丰富度变量。
- 控制注入后 prompt 不超过 260 词。
- 保持最终模板模式。

## v0.4.1 - New Chinese Aesthetic Live Room Draft Templates

- 新增新中式直播间两个 final prompt 模板骨架。
- 支持宋式极简居家型和新中式陈设型。
- 当前为 draft template，等待后续生图验证。

## v0.4.2 - Faux Garden Host Final Locked Archive

- Archived `host_final_9x16_locked_youthful_douyin_host_v01` for `faux_garden_window_scenic_livestream_room`.
- Locked the accepted Douyin host direction: youthful Chinese live-commerce seller, fresh stylish summer outfit, hidden side-wall reveal, upper leafy framing, right-side cottage facade edge cover, hydrangea transition layer and continuous grass standing zone.
- Archive only; no generation connection, no director layer and no rewrite layer.

## v0.4.3 - Faux Garden Empty Front Final Template

- Added `faux_garden_empty_front_tvc_studio_locked_v01` for `faux_garden_window_scenic_livestream_room / empty_front_9x16`.
- Connected the workbench to generate fixed positivePrompt / negativePrompt JSON through final template mode.
- Added `auditPromptForFauxGardenEmptyFront` to lock TVC studio top context, open left studio-side space, rear support wall, rear-wall-only lightbox, R-cove transition, grass width, cottage overlap and no visible equipment.
- No image generation, no director layer, no rewrite layer.

## v0.4.4 - Faux Garden Vertical Cases Only

- Current faux garden phase locks only two vertical cases: `empty_front_9x16` and `host_final_9x16`.
- `wide_overview_16x9` is paused and must not be connected, generated, audited or output as a prompt in this phase.
- The 16:9 overview knowledge remains archived for future reopening after the two 9:16 cases stabilize.

## v0.4.5 - Faux Garden 9x16 Light Patch

- Patched `empty_front_9x16` to limit left open studio-side area to roughly 20-25% of image width.
- Strengthened grass-to-lightbox width alignment: broad rectangular scenic grass zone, mostly straight left edge, not a diagonal narrowing strip.
- Added top-cove restraint: moderate buildable thickness, not a giant rounded screen frame.
- Patched `host_final_9x16` to hide empty-front studio shell exposure: no black industrial ceiling, rigging, backstage floor or left-side working area.
- No wide overview connection, no image generation, no director layer and no rewrite layer.

## v0.4.6 - Faux Garden Shared 9x16 Scene DNA

- Added `scene_dna_shared_9x16_v01` to force `empty_front_9x16` and `host_final_9x16` to share one scene layout.
- Patched both vertical prompts with the same-scene relation lock: empty front is pulled back on the same front camera axis; host final is the tighter livestream crop.
- Fixed relative positions for wooden cottage module, hydrangea tree, flower borders, lace table, flower basket, grass boundary and rear lightbox.
- Added consistency negatives: different angle, redesigned layout, changed cottage position, table moved to another side, hydrangea tree moved, random flower placement, inconsistent grass boundary and different scenic set.

## v0.4.7 - Shared Scene DNA Compile Rule

- Locked version alias `shared_scene_dna_two_9x16_v01`.
- Shared Scene DNA is now compiled as the positivePrompt prefix for `empty_front_9x16`.
- Common Negative is now compiled as the negativePrompt prefix for `empty_front_9x16`.
- Added audit fields: `sharedSceneDNAIncluded`, `commonNegativeIncluded`, `sameFrontCameraAxis`, `differentCropAllowed`, `emptyShowsStudioShell`, `hostHidesStudioShell`, `hostTableNotBlockingBody`, `chineseDouyinRealismPriority`.
- Documented the same compile rule for `host_final_9x16`; wide overview remains paused.

## v0.4.8 - Shared Scene DNA Stage Lock

- Stage-locked `shared_scene_dna_two_9x16_v01` after the two 9:16 consistency test passed.
- Kept the large structure unchanged.
- Light patch only: host feet/footroom safety, centered host presentation, right-side low lace table not stealing focus, empty-front left open area not enlarged, and current grass/lightbox/cottage proportions preserved.
- `wide_overview_16x9` remains paused.
