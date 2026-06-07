# auditPromptForFauxGardenWorkbench

This workbench only audits `faux_garden_window_scenic_livestream_room` prompts for two fixed 9:16 cases:

- `empty_front_9x16`
- `host_final_9x16`

It does not audit or generate `wide_overview_16x9`.

## Compile Rule

For every generated case:

- positivePrompt = Shared Scene DNA + case-specific positivePrompt + style variables
- negativePrompt = Common Negative + case-specific negativePrompt

Shared Scene DNA and Common Negative must be physically included in the final prompt text.

## Common Audit Fields

- `sharedSceneDNAIncluded`
- `commonNegativeIncluded`
- `sameFrontCameraAxis`
- `differentCropAllowed`
- `noDifferentAngle`
- `noRedesignedLayout`
- `sameSceneRelativePositions`

## empty_front_9x16 Audit Fields

- `topStudioLocked`
- `leftOpenStudioSpace`
- `rearWallBehindLightbox`
- `rearWallOnlyLightbox`
- `coveTransition`
- `grassWidthRule`
- `cottageOverlapRule`
- `noVisibleEquipment`

## host_final_9x16 Audit Fields

- `hostHidesStudioShell`
- `chineseDouyinRealismPriority`
- `hostFullBodyGrounded`
- `hostYouthfulFashionStyle`
- `hostTableNotBlockingBody`
- `foregroundLeavesIncluded`
- `noVisibleWhiteBoxBoundary`
- `noVisibleEquipment`

## Failure Conditions

Audit status is `fail` if any required field for the selected case is false, or if the prompt drifts into:

- missing Shared Scene DNA
- missing Common Negative
- different camera angle
- redesigned layout
- no support wall behind the lightbox
- floating or detached lightbox
- U-shaped scenic wrap
- narrow grass strip
- wall-to-wall turf carpet
- cottage module not overlapping the right side of the lightbox
- lace table moved away from the right-mid foreground
- hydrangea tree moved away from the cottage-lightbox connection
- empty_front missing TVC-style studio context
- empty_front missing left open studio-side working area
- host_final revealing black industrial ceiling, open studio shell, left-side working area, or backstage floor
- host_final drifting into Korean fashion model look or editorial portrait
- host_final feet floating, cropped, or pasted onto background
- lace table blocking the host full body, legs, feet, or presentation gesture
- visible light stand, softbox, LED panel, filming equipment, crew tools, or cables
