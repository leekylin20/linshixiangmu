# Parameter Schema And Lock Rules

## Field Source

```ts
type FieldSource = "locked" | "auto" | "empty";
```

## Lock Principle

User-explicit fields are always `locked`.

Routes may fill only `auto` and `empty` fields.

Routes must never overwrite `locked` fields.

## Examples

- User says `不要人物`: route cannot add a host.
- User says `站播`: route cannot switch to seated live-room.
- User says `原木风`: route cannot change it to luxury showroom.
- User says `无价格`: system cannot create price signs.
- User uploads or references a product image: product image decides product category and product appearance. Route cannot change it.
- User says `9:16`: route cannot output square frame.
- User says `空场景底图`: route cannot add a person.

## Minimal Field Set

```ts
type LiveRoomDirectorParams = {
  productCategory?: string;
  productImage?: string;
  liveMode?: "standing" | "seated" | "half-body" | "empty-room" | string;
  aspectRatio?: string;
  season?: string;
  fashionStyle?: string;
  spaceDirection?: string;
  includePerson?: string;
  cameraMode?: string;
  titlePolicy?: string;
  negativeRequirements?: string[];
};
```

## Debug Metadata

Each compiled prompt may include internal debug metadata during tests:

```json
{
  "selectedRoute": "denim-live-room",
  "routeFallback": false,
  "lockedFields": [],
  "autoFilledFields": []
}
```

Do not expose debug metadata in final user-facing prompt unless explicitly requested.
