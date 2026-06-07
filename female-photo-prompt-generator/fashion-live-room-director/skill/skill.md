# Canonical Workflow

This director generates prompt text for female fashion live-room spaces.

It does not generate images, inspect images, export files, or edit the main UI.

## Objective

Generate a reusable director prompt for a real female fashion live-room scene:

- Product-first.
- Real live selling context.
- Stable indoor perspective.
- Clear room depth.
- Category-specific space skeleton.
- Low AI taste.
- No posterization.

## Workflow

1. Parse user input.
2. Mark explicit user fields as `locked`.
3. Apply `design-rules/product-driven-scene-design-rule.md` before any sceneStyle decision.
4. Select exactly one main route from `route-registry.md`.
5. Load only the selected route and required core rules.
6. Merge route rules with locked parameters.
7. Compile:
   - final prompt;
   - negative prompt;
   - optional debug metadata.

## Director Fusion Rule

Do not mechanically concatenate fields.

The final prompt must read like a coherent scene direction:

- What room is this?
- Where is the host?
- What product is being explained?
- How does the space support product display?
- How is perspective locked?
- What must not happen?

## Output Discipline

For route tests, output only:

```text
Final Prompt:
...

Negative Prompt:
...
```

Do not include UI plans, image API instructions, export plans, or unrelated implementation notes.
