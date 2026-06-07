---
name: fashion-live-room-director
description: Build and validate female fashion live-room director prompts from modular rules and a single selected product route. Use for prompt-only live-room space generation, not for UI, image generation, quality inspection, or export.
---

# Fashion Live Room Director

This skill is a rule library for the female fashion live-room generation system.

It must not be used as a large all-in-one workbench. New capabilities must move through:

1. Knowledge-base rule sedimentation.
2. Single-capability experimental validation.
3. Small closed-loop tool packaging.

Only validated modules may be connected to the main workbench.

## Fixed Loading Order

When generating a prompt with this skill, load files in this order:

1. Read `skill/skill.md` to load the canonical workflow.
2. Read `skill/parameter-schema.md` to lock explicit user input.
3. Read `skill/route-registry.md` and select exactly one main route.
4. Read the selected route file only.
5. If the selected route references a route example or anchor, read only that specific example file. For `denim-live-room`, read `skill/examples/denim/golden-spatial-anchor.md`.
6. Read the required core rules:
   - `skill/core/product-lock-rules.md`
   - `skill/core/spatial-perspective-rules.md`
   - `skill/core/live-room-structure-rules.md`
   - `skill/core/title-font-decision-rules.md`
   - `skill/core/anti-posterization-rules.md`
   - `skill/core/negative-rules.md`
7. Compile the final director prompt.

## Hard Constraints

- Do not invent unimplemented routes.
- Do not let a route override explicit user input.
- Do not modify UI, image generation, QA, or export in the same task.
- Do not test unknown capabilities inside the main workbench.
- Main workbench integration is allowed only after route-level acceptance.

## First Acceptance Target

Use the `denim-live-room` route only.

Input:

```text
女装牛仔裤直播间，站播，9:16，真实直播机位。
```

Output:

- Final prompt.
- Negative prompt.

Acceptance:

- Defines room structure first.
- Uses real standing live-room camera.
- Includes foreground floor, midground host, background rack/shelf.
- Avoids posterization.
- Keeps title/text as optional information layer only.
- Product display logic matches denim pants.
- Does not invent an unimplemented route.
