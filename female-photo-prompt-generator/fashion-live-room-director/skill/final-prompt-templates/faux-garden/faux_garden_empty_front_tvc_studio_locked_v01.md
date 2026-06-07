# faux_garden_empty_front_tvc_studio_locked_v01.md

Route:
faux_garden_window_scenic_livestream_room

Case:
empty_front_9x16

Template status:
locked final prompt template

Connected to generation:
false

Prompt mode:
final template + fixed text structure

Do not append routePrompt, sceneStylePrompt or layoutVariantPrompt text.

Shared compile rule:

```text
empty_front_9x16 positivePrompt = Shared Scene DNA + empty_front case-specific positivePrompt
empty_front_9x16 negativePrompt = Common Negative + empty_front case-specific negativePrompt
```

Shared Scene DNA source:
`fashion-live-room-director/skill/routes/faux-garden-window-scenic/scene_dna_shared_9x16_v01.md`

## Positive prompt structure order

1. aspect ratio and use
2. scene identity
3. TVC studio top lock
4. lightbox and rear support wall relationship
5. rear-wall-only SEG lightbox structure
6. shallow rear-wall R-cove transition
7. open left studio-side space
8. grass width and floor relationship
9. wooden cottage module and lightbox overlap relationship
10. hydrangea tree and flower borders hiding structure
11. lace round table and flower basket support props
12. final quality close

## Positive prompt

Vertical 9:16 empty front view of the shared Faux Garden Window Scenic Livestream Room, a medium-size buildable indoor livestream scenic set inside a rectangular studio-like commercial room. No host, no product. Keep a clean usable central livestream standing zone.

The overall scene should feel like a refined scenic set built inside a larger TVC-style studio. Inside the camera frame, the scenic set is polished and beautiful. Outside the scenic zone, the studio shell may feel more open and rougher, like a professional shooting stage.

Lock the current top structure style. The upper outer area should keep a TVC-stage / studio-build feeling, with visible dark industrial ceiling, exposed overhead structure, beams, rigging, or open black stage ceiling context above the scenic set. The shooting area below remains refined and beautiful. Do not make it look like a fully sealed residential ceiling.

The SEG fabric lightbox is a rear-wall-only scenic lightbox. The wall behind the lightbox must remain present and structurally intact. The scenic wall must not float in open space. The lightbox is installed against a proper rear wall. Keep the scenic lightbox width unchanged.

The SEG fabric lightbox rises vertically from the floor to the ceiling on the back wall only. At the top edge of this rear scenic wall, the lightbox curves gently into a shallow ceiling extension. The curve happens only along the upper edge of the rear wall, where the vertical wall meets the ceiling. The rear scenic lightbox must show one smooth rounded R-cove transition from the vertical rear wall into the shallow ceiling strip. The seaside sky image is printed across one continuous fabric lightbox surface. There must be no hard horizontal line, no straight crease, no visible seam, and no 90-degree break between the rear wall image and the ceiling extension.

The ceiling extension is only a shallow rear-wall cove strip, about 0.8-1.2 meters deep, placed directly above the rear scenic wall. It must not extend onto the left or right side walls. It must not form a U-shaped room, curved side walls, wraparound screen, or immersive sky tunnel. The rear lightbox top cove should have a moderate buildable thickness, not an oversized rounded screen frame.

On the left side, keep the current open studio-side space rather than a close visible white wall. The left side in the camera view should feel open and spacious, like an accessible working side of the studio, with practical empty hard-floor area for future lighting placement. Do not show lighting equipment, stands, cables, or crew tools. The near-left wall should not dominate the frame. The left side should feel visually open, not boxed in, while the rear scenic lightbox still remains mounted on a proper back wall. The left open studio-side area should remain visible but should not dominate the frame, roughly around 20-25% of the image width. The scenic lightbox, grass presentation zone, and wooden cottage module remain the main visual focus.

The artificial grass scenic floor should remain wide and practical, approximately matching the main scenic width of the rear lightbox. The artificial grass scenic floor should visually align with the main width of the rear scenic lightbox. Its left edge should be mostly straight and intentional, not a strong diagonal narrowing strip. The grass should feel like a broad rectangular scenic presentation zone matching the rear lightbox width. The grass should not become a narrow strip. It should not cover the entire room wall-to-wall. The grass remains a defined scenic presentation zone, broad enough for future host standing and livestream presentation, with open hard-floor studio space visible on the left side.

The SEG fabric lightbox scenic image must extend behind the wooden cottage window module. The wooden cottage window facade must clearly overlap in front of the right side of the rear scenic lightbox. It should be visibly rotated inward toward the center of the scene, not parallel to the right wall. The wooden facade should physically cover the right ending edge of the scenic lightbox from the front camera view.

The wooden cottage module is a shallow scenic facade prop, only a partial window-wall set piece, about 0.5-0.8 meters deep, with a shallow decorative pitched eave, wooden window frame, white sheer curtain, windowsill flower pots, and a shallow wooden platform. Add a faux hydrangea tree between the lightbox wall and the wooden window module to hide the structural transition.

Add low flower borders and small potted flowers around the scenic edge. Add one small lace-covered round table fixed in the right-mid foreground inside the grass scenic zone, close to the wooden cottage module but not blocking the future host position, with one flower basket fixed nearby. Do not move the table or flower basket to another side. Keep the central presentation zone open and usable.

The final result should feel like a finished professional indoor scenic livestream set, refined inside the scenic frame, with TVC-style studio context outside the scenic area, not a construction site, not a real outdoor garden, and not a finished residential interior.

## Negative prompt

close left white wall dominating frame, narrow boxed-in corridor feeling, visible near-left full-height wall, cramped left-side wall, enclosed left-side room feeling, no open studio-side space, left open studio area dominating the frame, excessive empty gray floor on the left, floating scenic wall, detached lightbox, no wall behind lightbox, open back with no support wall, lightbox suspended in open space, enlarged scenic lightbox, oversized lightbox, narrow grass strip, skinny turf runway, tiny turf island, full-room turf carpet, wall-to-wall grass, grass covering the whole room, grass left edge strongly diagonal, grass narrowing into a trapezoid strip, scenic grass much narrower than lightbox, real outdoor garden, open-air garden, construction site mess, unfinished front camera frame, finished residential interior, luxury model room interior, U-shaped cyclorama, U-shaped curved room, curved left wall, curved right wall, side walls wrapped by scenic lightbox, plan-view wall corner bend, three-sided scenic wrap, wraparound sky wall, curved side wall lightbox, immersive curved room, sky tunnel, panoramic side-wall screen, lightbox wrapping onto side walls, full cyclorama studio, hard horizontal line between wall and ceiling image, straight seam across the top of the scenic wall, visible 90-degree break at rear wall top, hard horizontal seam between wall and ceiling, visible straight crease at wall-ceiling junction, flat sky ceiling panel, separate ceiling mural, sharp ceiling transition line, broken cove curve, angular wall-to-ceiling joint, non-curved ceiling junction, full sky ceiling, open skylight, giant ceiling mural, huge overhead screen, immersive sky dome, ceiling opening to outdoor sky, flat printed backdrop only, giant wraparound LED wall, immersive exhibition hall, giant rounded screen frame, overly thick lightbox border, oversized rounded LED display, bulky rounded screen shell, full cabin body, real roof volume, complete wooden house, oversized roof, wooden facade parallel to right wall, cottage module not overlapping lightbox, cottage module beside lightbox, right lightbox edge not covered, wooden cottage module flat against wall, blank white wall gap between lightbox and wooden module, lightbox stops before the wooden module, visible right-side lightbox termination edge, exposed white wall strip, separated scenic modules, different angle, redesigned layout, new plant arrangement, changed cottage position, table moved to another side, hydrangea tree moved, random flower placement, inconsistent grass boundary, different scenic set, visible light stand, visible softbox, visible LED panel, visible filming equipment, visible crew tools, visible cables, wedding floral arch, dense flower wall, cramped small photo booth

## Audit

Use `auditPromptForFauxGardenEmptyFront`.

Required pass fields:

- topStudioLocked
- leftOpenStudioSpace
- rearWallBehindLightbox
- rearWallOnlyLightbox
- coveTransition
- grassWidthRule
- cottageOverlapRule
- noVisibleEquipment
- sceneDNALock
- sharedSceneDNAIncluded
- commonNegativeIncluded
- sameFrontCameraAxis
- differentCropAllowed
- emptyShowsStudioShell
- hostHidesStudioShell
- hostTableNotBlockingBody
- chineseDouyinRealismPriority

Failure means the prompt is not ready for image generation.
