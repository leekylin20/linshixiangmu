# scene_dna_shared_9x16_v01

Route:
faux_garden_window_scenic_livestream_room

Status:
locked shared scene DNA

Version alias:
shared_scene_dna_two_9x16_v01

Connected to generation:
false

Purpose:
Keep `empty_front_9x16` and `host_final_9x16` visually consistent as two camera framings of the same livestream set, not two independently redesigned scenic prompts.

## Shared Scene DNA

Both vertical 9:16 cases must share the same set layout:

- Rear layer: rear-wall-only SEG seaside fabric lightbox, installed against a retained support wall.
- Top layer: TVC-style black industrial studio ceiling above the set. It may be visible in `empty_front_9x16`, but must be hidden in `host_final_9x16`.
- Right layer: shallow wooden cottage window facade module overlaps in front of the right side of the lightbox.
- Transition layer: one fixed faux hydrangea tree sits between the left edge of the wooden cottage module and the right side of the rear lightbox, hiding the structural connection.
- Floor layer: artificial grass is the main livestream standing zone, close to the main lightbox width, not wall-to-wall.
- Left layer: open hard-floor studio-side working area for real lighting and crew operation. It may be visible in `empty_front_9x16`, but must be cropped or hidden in `host_final_9x16`.
- Prop layer: one small lace-covered round table is fixed in the right-mid foreground, close to the wooden cottage module but not blocking the host.
- Flower basket: fixed near the lace table, not moved to another side.
- Upper foreground: `host_final_9x16` must use foreground leaves to hide upper set edges; `empty_front_9x16` may reveal the studio top.

## Compile Rule

Shared Scene DNA is not a note. It must participate in the final compiled prompt:

```text
When generating empty_front_9x16 or host_final_9x16, always prepend the Shared Scene DNA to the case-specific positivePrompt. Always append Common Negative to the case-specific negativePrompt.
```

Compile order:

```text
empty_front_9x16 positivePrompt = Shared Scene DNA + empty_front case-specific positivePrompt
empty_front_9x16 negativePrompt = Common Negative + empty_front case-specific negativePrompt
host_final_9x16 positivePrompt = Shared Scene DNA + host_final case-specific positivePrompt
host_final_9x16 negativePrompt = Common Negative + host_final case-specific negativePrompt
```

## Same-Scene Relation Lock

Use this sentence in both 9:16 prompts:

```text
The empty_front_9x16 is the same scene as host_final_9x16, pulled back on the same front camera axis. Do not redesign the set. Keep the wooden cottage module, hydrangea tree, flower borders, lace table, flower basket, grass boundary, and rear lightbox in the same relative positions.
```

Different crop distance is allowed; different camera angle is not allowed.

The exposed black ceiling and open studio-side working area belong only to empty_front_9x16, not to host_final_9x16.

For host_final_9x16, the lace table remains on the right-mid foreground side, but it must stay low and off to the side, never blocking the host's full body, legs, feet, or central presentation gesture.

Chinese Douyin live-commerce realism is more important than fashion-model beauty. The host may be youthful, bright, fresh and stylish, but must remain a real Chinese Douyin live-commerce seller, not a Korean lookbook model, cold editorial model or fashion campaign portrait.

For host_final_9x16, the host should stay centered in the main presentation zone with safe headroom and footroom. Her shoes and feet must be fully visible, not cropped, not touching the bottom edge, and not pasted to the frame bottom. The lace table must stay low and off to the right side, never stealing focus from the host.

For empty_front_9x16, keep the left open studio-side area visible but do not enlarge it beyond the locked proportion. Keep the current proportion between grass width, rear lightbox width and wooden cottage position. Do not make the left open area larger, do not narrow the grass, do not resize the lightbox, and do not move the wooden cottage module.

## Consistency Negative Terms

Use these negative terms in both 9:16 prompts:

```text
different angle, redesigned layout, new plant arrangement, changed cottage position, table moved to another side, hydrangea tree moved, random flower placement, inconsistent grass boundary, different scenic set
```

## Case Relationship

`empty_front_9x16`:
Same scene, same front camera axis, pulled back. No host, no product. Shows more studio top and left open working area.

`host_final_9x16`:
Same scene, same front camera axis, tighter final livestream crop. Has host. Hides white-box boundaries, black studio ceiling, left working area and construction reveal.
