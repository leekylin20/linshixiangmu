# auditPromptForGenericCategoryGreenscreen

This workbench audits generated prompt objects for unbranded generic category green-screen live-commerce customer acquisition material.

## Audit Fields

```json
{
  "status": "pass/fail",
  "category": true,
  "unbrandedPass": true,
  "noPricePass": true,
  "noPlatformUIPass": true,
  "safeAreaPass": true,
  "cameraPerspectivePass": true,
  "hostPass": true,
  "tablePass": true,
  "productDisplayPass": true,
  "seatedLivestreamPerspectivePass": true,
  "noStandingHostPass": true,
  "foregroundTablePass": true,
  "hostBehindTablePass": true,
  "productInFrontOfHostPass": true,
  "notRetailStoreCounterPass": true,
  "youngAdultHostPass": true,
  "noMiddleAgedHostPass": true,
  "noAuntieStylePass": true,
  "hostOutfitYouthfulPass": true,
  "textDensityPass": true,
  "categoryScenePass": true,
  "layerFriendlyPass": true,
  "forbiddenClaimsDetected": [],
  "forbiddenBrandTermsDetected": [],
  "notes": []
}
```

## Failure Conditions

Status is `fail` if any required field is false, or if the positive prompt contains forbidden brand terms, platform UI, price wording, medical claims, exaggerated guarantees, detail-page collage logic, ordinary poster logic, missing host, missing table, missing 3-5 products, missing safe area, missing camera perspective, or missing layer-friendly requirements.

Additional seated livestream perspective failures:

- The positive prompt allows a sitting-or-standing host instead of locking a seated live-commerce camera view.
- The positive prompt does not explicitly say the host sits behind the foreground livestream table.
- The positive prompt does not say the host's lower body is hidden by the table.
- The positive prompt does not say products are placed on the foreground table in front of the host.
- The positive prompt turns the scene into a retail store clerk, bakery shop assistant, standing presenter, or store counter perspective.
- The negative prompt is missing any of: `standing host`, `retail store clerk`, `bakery shop assistant`, `store counter perspective`, `no foreground livestream table`, `table not blocking lower body`.

Additional young adult host failures:

- The positive prompt only says adult host and does not lock `young adult Chinese female Douyin livestream host`.
- The positive prompt does not include `appears around 24-30 years old`.
- The positive prompt does not include `definitely adult but youthful`.
- Food, noodle, fresh-food, kitchen, family, or apron styling is present without youthful/fresh/Douyin-commercial outfit correction.
- The negative prompt is missing any of: `middle-aged host`, `auntie-style host`, `mature motherly host`, `housewife presenter`, `heavy kitchen apron`, `bakery uniform`, `supermarket clerk uniform`.

The negative prompt may contain forbidden terms as exclusions. Detection arrays inspect the positive prompt and product variables, not the negative prompt exclusions.
