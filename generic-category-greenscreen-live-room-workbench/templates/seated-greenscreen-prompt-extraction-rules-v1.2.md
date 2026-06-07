# Seated Greenscreen Prompt Extraction Rules v1.2

This is the bottom-level reusable prompt rule template for the generic seated green-screen livestream room workbench.

## Core Intent

Generate a vertical 9:16 seated live-commerce green-screen room mother image, not a retail-store standing presenter image.

The scene must show:

- one young adult Chinese female Douyin livestream host;
- seated upper-body framing;
- foreground livestream table in the lower frame;
- products placed on the foreground table in front of the host;
- host lower body hidden by the table;
- category atmosphere only in the background and side areas;
- unbranded, no price, no platform UI.

## Extract From Input

Extract only:

- product category;
- product type and package shape;
- room atmosphere;
- material/color/lighting direction;
- display props;
- title and short selling points;
- seasonal or category theme elements.

Do not extract:

- real brand names;
- real logos or trademarks;
- exact prices;
- real model numbers;
- platform UI;
- store-counter perspective;
- standing presenter posture.

## Positive Prompt Order

1. Vertical 9:16 / 1080x1920 / use case.
2. Unbranded lock.
3. Safe area.
4. Seated livestream camera.
5. Young adult Chinese female Douyin host.
6. Foreground livestream table.
7. Products in front of the host.
8. Background category atmosphere.
9. Physical title plaques / stickers.
10. Layer-friendly final image.

## Required Camera Lock

```text
Real seated Douyin live-commerce camera view, not a standing retail-store presenter view.
Camera height about 115-125cm, full-frame equivalent 45-50mm lens, slight downward angle 2-3 degrees.
The viewer feels seated across the table watching the host explain products.
One young adult Chinese female Douyin livestream host sits behind the foreground livestream table, shown from head to waist or upper body.
The host's lower body is hidden by the table.
Products are placed on the foreground table in front of the host, closer to the camera than the host.
```

## Required Host Lock

```text
One young adult Chinese female Douyin livestream host sits behind the foreground livestream table in the middle zone, shown as a realistic seated upper-body live-selling presenter.
She appears around 24-30 years old, definitely adult but youthful, bright, fresh, attractive, friendly and commercially appealing.
Her face has natural makeup, healthy skin texture, clear bright eyes, a soft smile, and a neat youthful hairstyle.
Her face, shoulders, chest, forearms and hands are visible, while the lower body is hidden by the table.
She speaks toward the camera with natural explanation gestures.
```

## Required Outfit Lock

```text
The outfit should be youthful, clean, fresh and Douyin-commercial, not household cooking clothes.
If an apron is used, it should be a light modern livestream apron over a youthful blouse or fitted knit top, not a heavy kitchen apron, not a bakery uniform, not a supermarket clerk uniform, and not motherly homewear.
```

## Required Foreground Product Rule

```text
Display 3-5 main unbranded product packages on the foreground table, arranged as a compact live-selling product group.
Do not fill the whole table with dozens of products.
The product group should be clean, centered, and easy to cut out as a product layer.
Products sit on the tabletop in the foreground, with clear landing points, contact shadows and frontal labels.
The host stays behind the table.
```

## Required Background Rule

```text
Category atmosphere should stay mainly in the background and side display areas.
Background shelves, category props, kitchen props, beauty shelves, fresh-food props, 3C desk props, or seasonal props are allowed only as light context.
They must not turn the scene into a real store, supermarket, bakery shop, restaurant counter, electronics store, showroom, or outdoor event.
The foreground table remains the main live-commerce stage.
```

## Required Common Negative

```text
real brand, real logo, real trademark, real price, platform UI, shopping cart button, comment area, like icon, livestream floating UI, dense small text, unreadable text, garbled text, standing host, full-body host, retail store clerk, bakery shop assistant, shopkeeper pose, host standing behind store counter, full-body presenter, store counter perspective, restaurant counter, cashier counter, retail checkout counter, supermarket counter, shop interior photography, product table overloaded, dozens of products on table, products covering entire table, host far behind products, host not seated, no foreground livestream table, table not blocking lower body, lower body visible, legs visible, middle-aged host, older female host, auntie-style host, mature motherly host, housewife presenter, kitchen mom style, mature shop assistant, heavy mature makeup, motherly styling, heavy kitchen apron, bakery uniform, supermarket clerk uniform, household cooking clothes, teen girl, student girl, underage host, Korean idol, Korean fashion model, strong wide angle, high camera angle, obvious overhead view, table perspective conflicting with background, sci-fi light bands, blue tech fog, visible light stand, softbox, filming equipment, visible cables
```

## TXT Export Rule

For image generation tools, export each prompt as one single line:

```text
#1 【生图提示词】 ...positivePrompt... 【负面提示词】 ...negativePrompt...
```

No blank lines, no separators, no random-parameter block.

## Audit Checklist

- `seatedLivestreamPerspectivePass`
- `noStandingHostPass`
- `foregroundTablePass`
- `hostBehindTablePass`
- `productInFrontOfHostPass`
- `notRetailStoreCounterPass`
- `youngAdultHostPass`
- `noMiddleAgedHostPass`
- `noAuntieStylePass`
- `hostOutfitYouthfulPass`
- `productDisplayPass`
- `layerFriendlyPass`

## Stable Baseline

Current baseline:

```text
v1.2-youthful-host-lock
```

Do not regress to:

- standing presenter;
- shop assistant;
- mature housewife presenter;
- auntie-style host;
- full-body host;
- real retail store counter;
- product-overloaded table;
- real brand or platform UI.
