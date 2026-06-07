(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.FauxGardenWorkbench = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  const ROUTE = "faux_garden_window_scenic_livestream_room";
  const WORKBENCH = "faux-garden-window-live-room-workbench";
  const TEMPLATE_VERSION = "shared_scene_dna_two_9x16_v01";

  const STYLE_VARIANTS = {
    seaside_hydrangea_summer: {
      styleVariant: "seaside_hydrangea_summer",
      label: "海边绣球夏日",
      lightboxScene: "bright seaside garden view, blue sky, soft clouds, ocean horizon, fresh summer atmosphere, soft faux sunlight",
      windowModule: "wooden cottage window facade, shallow pitched eave, wooden window frame, white sheer curtain, windowsill flower pots",
      planting: "faux hydrangea tree, blue and white hydrangea clusters, low mixed flower borders, fresh green foliage",
      props: "one small lace-covered round table, one flower basket nearby, small potted flowers",
      hostOutfit: "pale yellow fitted knit top paired with white high-waisted wide-leg pants",
      colorMood: "fresh summer blue, soft cream white, natural green, warm wood, clean sunlight"
    },
    french_countryside_garden: {
      styleVariant: "french_countryside_garden",
      label: "法式乡村花园",
      lightboxScene: "French countryside garden view, soft blue sky, distant lavender field, warm sunlight, romantic rural atmosphere",
      windowModule: "French garden window facade, cream wall texture, arched wooden window, linen curtain, small wrought iron flower shelf",
      planting: "soft climbing roses, pale pink rose bushes, low romantic flower borders",
      props: "one small lace-covered round table, vintage flower basket, ceramic teacup, small linen napkin",
      hostOutfit: "cream short-sleeve blouse paired with a light beige A-line midi skirt",
      colorMood: "cream white, pale pink, lavender, soft green, warm sunlight"
    },
    cream_soft_garden: {
      styleVariant: "cream_soft_garden",
      label: "奶油软装花园",
      lightboxScene: "soft cream garden window view, pale sky, gentle clouds, airy floral background, clean warm daylight",
      windowModule: "cream white cottage window facade, soft painted wood, shallow decorative eave, white sheer curtain, small ceramic flower pots",
      planting: "cream white flowers, pale yellow blossoms, low rounded flower borders, light fresh greenery",
      props: "one small lace-covered round table, cream woven flower basket nearby, small ceramic vase",
      hostOutfit: "cream white fitted short-sleeve top paired with light beige wide-leg pants",
      colorMood: "cream white, pale yellow, soft beige, natural green, gentle warm sunlight"
    },
    modern_chinese_courtyard: {
      styleVariant: "modern_chinese_courtyard",
      label: "新中式庭院",
      lightboxScene: "modern Chinese courtyard garden view, soft misty sky, bamboo shadows, distant lake, elegant oriental atmosphere",
      windowModule: "modern Chinese wooden window facade, warm walnut wood, lattice window, linen curtain, ceramic flower pots, subtle bamboo details",
      planting: "bamboo branches, white orchids, low moss and fern planting, restrained oriental greenery",
      props: "one small wooden round table, ceramic vase, bamboo basket, small folded linen cloth",
      hostOutfit: "light beige modern Chinese-style blouse paired with white wide-leg pants, subtle linen texture",
      colorMood: "warm walnut brown, cream beige, bamboo green, misty gray, restrained oriental tone"
    },
    autumn_wood_garden: {
      styleVariant: "autumn_wood_garden",
      label: "秋日暖木花园",
      lightboxScene: "warm autumn garden view, soft amber sunlight, distant trees, pale blue sky, calm seasonal atmosphere",
      windowModule: "warm wooden cottage window facade, shallow pitched eave, wood grain texture, beige linen curtain, windowsill dried flowers",
      planting: "soft autumn hydrangea, dried grasses, low warm-toned flower borders, muted green foliage",
      props: "one small lace-covered round table, woven harvest flower basket nearby, small amber glass vase",
      hostOutfit: "light camel knit top paired with cream white high-waisted wide-leg pants",
      colorMood: "warm wood, cream beige, muted green, soft amber, autumn sunlight"
    },
    fresh_daisy_summer: {
      styleVariant: "fresh_daisy_summer",
      label: "清新雏菊夏日",
      lightboxScene: "fresh summer daisy garden view, blue sky, white clouds, clean sunny atmosphere, gentle garden depth",
      windowModule: "light wooden cottage window facade, shallow pitched eave, white curtain, simple window boxes with daisies",
      planting: "white daisies, pale yellow flowers, low fresh flower borders, light green foliage",
      props: "one small lace-covered round table, daisy flower basket nearby, small white ceramic pot",
      hostOutfit: "fresh pale yellow short-sleeve knit top paired with white wide-leg pants",
      colorMood: "clean white, pale yellow, summer blue, fresh green, bright soft sunlight"
    }
  };

  const SHARED_SCENE_DNA = [
    "Faux Garden Window Scenic Livestream Room, one fixed scenic livestream set, shared by both empty_front_9x16 and host_final_9x16. The empty_front_9x16 is the same scene as host_final_9x16, pulled back on the same front camera axis. The host_final_9x16 is a tighter crop on the same front camera axis. Different crop distance is allowed; different camera angle is not allowed. Do not redesign the set. Keep the wooden cottage module, hydrangea tree, flower borders, lace table, flower basket, grass boundary, and rear lightbox in the same relative positions.",
    "Rear layer: rear-wall-only SEG seaside fabric lightbox, installed against a retained support wall, not floating. The wall behind the lightbox must remain present and structurally intact. The lightbox rises vertically on the back wall only, with a shallow rear-wall top R-cove extension. The ceiling extension is about 0.8-1.2 meters deep, does not extend onto side walls, and does not form a U-shaped room.",
    "The rear scenic lightbox must show one smooth rounded R-cove transition from the vertical rear wall into the shallow ceiling strip. The seaside sky image is printed across one continuous rear-wall lightbox surface. There must be no hard horizontal line, no straight crease, no visible seam, and no 90-degree break between the rear wall image and the ceiling extension.",
    "Right layer: shallow wooden cottage window facade overlaps in front of the right side of the lightbox, rotated inward, hiding the right ending edge. A fixed faux hydrangea tree sits between the cottage facade and the rear lightbox to hide the connection.",
    "Floor layer: broad rectangular artificial grass presentation zone, close to the main lightbox width, not wall-to-wall.",
    "Left layer: open hard-floor studio-side working area for empty_front_9x16. In host_final_9x16, this working area should be cropped out or hidden.",
    "Prop layer: one lace-covered round table fixed in the right-mid foreground near the wooden cottage module, with one flower basket fixed nearby."
  ].join("\n\n");

  const COMMON_NEGATIVE = "different angle, redesigned layout, new plant arrangement, changed cottage position, table moved to another side, hydrangea tree moved, random flower placement, inconsistent grass boundary, different scenic set, U-shaped cyclorama, curved left wall, curved right wall, side walls wrapped by scenic lightbox, floating scenic wall, no wall behind lightbox, detached lightbox, blank white wall gap between lightbox and wooden module, narrow grass strip, wall-to-wall grass, full-room turf carpet, giant rounded screen frame, visible light stand, visible softbox, visible LED panel, visible cables";

  const CASES = {
    empty_front_9x16: {
      positive: [
        "Vertical 9:16 empty front view, same shared Faux Garden Window Scenic Livestream Room, pulled back on the same front camera axis. No host, no product. Show more of the TVC-style studio context: visible dark industrial ceiling, exposed overhead structure, beams, rigging, or open black stage ceiling above the scenic set. The shooting area below remains refined and beautiful. The left open studio-side area remains visible but should not dominate the frame, roughly around 20-25% of the image width. The scenic lightbox, grass presentation zone, and wooden cottage module remain the main visual focus.",
        "Keep the rear-wall-only SEG scenic lightbox mounted against a proper rear wall. The rear lightbox top cove has moderate buildable thickness, not an oversized rounded screen frame. The grass visually aligns with the main width of the rear scenic lightbox; its left edge is mostly straight and intentional, not a diagonal narrowing strip. The lace-covered round table stays fixed in the right-mid foreground near the wooden cottage module, with the flower basket fixed nearby. Keep the central presentation zone open and usable. The final result should feel like a finished professional indoor scenic livestream set inside a larger TVC-style studio, not a construction site, not a real outdoor garden, and not a residential interior."
      ].join("\n\n"),
      negative: "close left white wall dominating frame, left open studio area dominating the frame, excessive empty gray floor on the left, grass left edge strongly diagonal, grass narrowing into a trapezoid strip, scenic grass much narrower than lightbox, giant rounded screen frame, overly thick lightbox border, oversized rounded LED display, bulky rounded screen shell, construction site mess, finished residential interior, real outdoor garden, open-air garden, visible filming equipment, visible crew tools"
    },
    host_final_9x16: {
      positive: [
        "Vertical 9:16 final livestream camera frame, same shared Faux Garden Window Scenic Livestream Room, tighter crop on the same front camera axis. This is a realistic Chinese Douyin live-commerce scene, not a Korean fashion lookbook, not a Korean idol portrait, and not a fashion editorial shoot. Unlike the empty front set reference, the final host livestream frame should not reveal the open studio shell, black industrial ceiling, rigging, backstage floor, or left-side working area. These construction and operation zones should be cropped out or hidden by scenic layers, foreground foliage, and camera framing. The exposed black ceiling and open studio-side working area belong only to empty_front_9x16, not to host_final_9x16.",
        "One young adult Chinese female Douyin livestream host stands full-body in the central presentation zone on continuous artificial grass, feet naturally grounded, realistic scale and natural shadow. She looks youthful, bright, attractive, fresh, stylish, commercially appealing, with a warm smile, clear bright eyes, natural makeup, healthy skin texture, and softly styled long dark hair. Chinese Douyin live-commerce realism is more important than fashion-model beauty. Dress her in the selected host outfit from the style variables. The outfit looks bright, clean, fashionable, wearable, and commercially appealing, not like homewear and not like a fashion editorial. Only one subtle livestream signal: a small lavalier microphone.",
        "Keep the same wooden cottage module on the right, the same hydrangea tree between cottage and lightbox, the same grass boundary, and the same lace table fixed in the right-mid foreground near the wooden cottage module, with the flower basket fixed nearby. In host_final_9x16, the lace table remains on the right-mid foreground side, but it must stay low and off to the side, never blocking the host's full body, legs, feet, or central presentation gesture.",
        "Add soft foreground leaves and branches across the upper left and upper right corners, lightly across the upper edge, forming a natural leafy frame. Hide white-box room boundaries, rough ceiling, lightbox edge, turf boundary, construction seams, black industrial ceiling, open studio shell, and left-side working area. The final frame should feel like a clean finished indoor-built garden illusion for Douyin livestreaming, not a real outdoor location."
      ].join("\n\n"),
      negative: "Korean fashion model look, K-beauty makeup, idol-like face, glossy influencer portrait, Korean catalog model, cold model pose, fashion editorial shoot, over-polished portrait, overly delicate makeup, tiny face, overlong legs, unrealistic beauty filter, homewear styling, oversized plain T-shirt, pajama-like casual outfit, auntie styling, lifeless expression, visible black industrial ceiling, exposed studio rigging, open studio shell, left-side working area visible, backstage floor visible, visible white-box room boundary, visible turf boundary, visible lightbox edge, raw construction seam, unfinished set boundary, real outdoor garden, open-air garden, host pasted onto background, floating feet, fake shadow, mismatched lighting, text, livestream UI, price tag overlay"
    }
  };

  function normalizeText(value) {
    return String(value || "").toLowerCase();
  }

  function hasAll(text, terms) {
    const haystack = normalizeText(text);
    return terms.every((term) => haystack.includes(term.toLowerCase()));
  }

  function compactJoin(parts) {
    return parts.filter(Boolean).join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
  }

  function getStyleVariant(styleVariant, overrides) {
    const base = STYLE_VARIANTS[styleVariant] || STYLE_VARIANTS.seaside_hydrangea_summer;
    return {
      ...base,
      ...(overrides || {}),
      styleVariant: styleVariant === "custom" ? "custom" : base.styleVariant
    };
  }

  function buildStyleBlock(variant, caseId) {
    const lines = [
      "Style variables for this fixed Scene DNA:",
      `Lightbox scene: ${variant.lightboxScene}.`,
      `Window module: ${variant.windowModule}.`,
      `Planting and flower borders: ${variant.planting}.`,
      `Props: ${variant.props}.`,
      `Color mood: ${variant.colorMood}.`
    ];

    if (caseId === "host_final_9x16") {
      lines.splice(5, 0, `Host outfit: ${variant.hostOutfit}.`);
    }

    if (caseId === "empty_front_9x16") {
      lines.push("No host outfit should appear in this empty_front_9x16 image because there is no host and no product.");
    }

    return lines.join("\n");
  }

  function buildCase(caseId, variant) {
    if (!CASES[caseId]) {
      throw new Error(`Unsupported caseId: ${caseId}`);
    }
    const positivePrompt = compactJoin([
      SHARED_SCENE_DNA,
      CASES[caseId].positive,
      buildStyleBlock(variant, caseId)
    ]);
    const negativePrompt = compactJoin([
      COMMON_NEGATIVE,
      CASES[caseId].negative
    ]);

    return {
      caseId,
      positivePrompt,
      negativePrompt,
      audit: auditPromptForFauxGardenWorkbench(caseId, positivePrompt, negativePrompt)
    };
  }

  function auditPromptForFauxGardenWorkbench(caseId, positivePrompt, negativePrompt) {
    const audit = {
      sharedSceneDNAIncluded: hasAll(positivePrompt, [
        "Faux Garden Window Scenic Livestream Room, one fixed scenic livestream set",
        "shared by both empty_front_9x16 and host_final_9x16",
        "Rear layer:",
        "Right layer:",
        "Floor layer:",
        "Left layer:",
        "Prop layer:"
      ]),
      commonNegativeIncluded: hasAll(negativePrompt, [
        "different angle",
        "redesigned layout",
        "new plant arrangement",
        "changed cottage position",
        "table moved to another side",
        "hydrangea tree moved",
        "U-shaped cyclorama",
        "visible softbox"
      ]),
      sameFrontCameraAxis: hasAll(positivePrompt, [
        "same front camera axis"
      ]),
      differentCropAllowed: hasAll(positivePrompt, [
        "Different crop distance is allowed"
      ]),
      noDifferentAngle: hasAll(positivePrompt, [
        "different camera angle is not allowed"
      ]) && hasAll(negativePrompt, ["different angle"]),
      noRedesignedLayout: hasAll(positivePrompt, [
        "Do not redesign the set"
      ]) && hasAll(negativePrompt, ["redesigned layout"]),
      sameSceneRelativePositions: hasAll(positivePrompt, [
        "same relative positions",
        "lace table",
        "flower basket",
        "hydrangea tree",
        "rear lightbox"
      ]),
      notes: []
    };

    if (caseId === "empty_front_9x16") {
      Object.assign(audit, {
        topStudioLocked: hasAll(positivePrompt, [
          "TVC-style studio context",
          "visible dark industrial ceiling",
          "open black stage ceiling"
        ]),
        leftOpenStudioSpace: hasAll(positivePrompt, [
          "left open studio-side area remains visible",
          "20-25% of the image width"
        ]),
        rearWallBehindLightbox: hasAll(positivePrompt, [
          "wall behind the lightbox must remain present",
          "proper rear wall"
        ]) && hasAll(negativePrompt, [
          "no wall behind lightbox",
          "floating scenic wall",
          "detached lightbox"
        ]),
        rearWallOnlyLightbox: hasAll(positivePrompt, [
          "rear-wall-only",
          "back wall only"
        ]) && hasAll(negativePrompt, [
          "U-shaped cyclorama",
          "side walls wrapped by scenic lightbox"
        ]),
        coveTransition: hasAll(positivePrompt, [
          "smooth rounded R-cove transition",
          "no hard horizontal line",
          "no 90-degree break"
        ]),
        grassWidthRule: hasAll(positivePrompt, [
          "broad rectangular artificial grass presentation zone",
          "close to the main lightbox width",
          "not wall-to-wall",
          "grass visually aligns with the main width"
        ]) && hasAll(negativePrompt, [
          "narrow grass strip",
          "wall-to-wall grass"
        ]),
        cottageOverlapRule: hasAll(positivePrompt, [
          "overlaps in front of the right side",
          "hiding the right ending edge"
        ]) && hasAll(negativePrompt, [
          "blank white wall gap between lightbox and wooden module"
        ]),
        noVisibleEquipment: hasAll(negativePrompt, [
          "visible light stand",
          "visible softbox",
          "visible LED panel",
          "visible cables"
        ])
      });
    }

    if (caseId === "host_final_9x16") {
      Object.assign(audit, {
        hostHidesStudioShell: hasAll(positivePrompt, [
          "should not reveal the open studio shell",
          "black industrial ceiling",
          "left-side working area",
          "cropped out or hidden"
        ]) && hasAll(negativePrompt, [
          "visible black industrial ceiling",
          "open studio shell",
          "left-side working area visible"
        ]),
        chineseDouyinRealismPriority: hasAll(positivePrompt, [
          "realistic Chinese Douyin live-commerce scene",
          "Chinese Douyin live-commerce realism is more important than fashion-model beauty"
        ]),
        hostFullBodyGrounded: hasAll(positivePrompt, [
          "stands full-body",
          "feet naturally grounded",
          "realistic scale and natural shadow"
        ]),
        hostYouthfulFashionStyle: hasAll(positivePrompt, [
          "youthful, bright, attractive, fresh, stylish",
          "selected host outfit",
          "commercially appealing"
        ]),
        hostTableNotBlockingBody: hasAll(positivePrompt, [
          "lace table remains on the right-mid foreground side",
          "never blocking the host's full body, legs, feet"
        ]),
        foregroundLeavesIncluded: hasAll(positivePrompt, [
          "soft foreground leaves and branches",
          "upper left and upper right corners",
          "natural leafy frame"
        ]),
        noVisibleWhiteBoxBoundary: hasAll(positivePrompt, [
          "Hide white-box room boundaries"
        ]) && hasAll(negativePrompt, [
          "visible white-box room boundary"
        ]),
        noVisibleEquipment: hasAll(negativePrompt, [
          "visible light stand",
          "visible softbox",
          "visible LED panel",
          "visible cables"
        ])
      });
    }

    const entries = Object.entries(audit).filter(([key]) => key !== "notes" && key !== "status");
    const failed = entries.filter(([, value]) => value !== true).map(([key]) => key);
    audit.status = failed.length === 0 ? "pass" : "fail";
    if (failed.length > 0) {
      audit.notes.push(`Failed checks: ${failed.join(", ")}`);
    }
    return audit;
  }

  function generatePrompts(options) {
    const selectedCase = (options && options.caseId) || (options && options.case) || "both_9x16";
    const styleVariant = (options && options.styleVariant) || "seaside_hydrangea_summer";
    const overrides = options && options.overrides;
    const variant = getStyleVariant(styleVariant, overrides);
    const caseIds = selectedCase === "both_9x16" ? ["empty_front_9x16", "host_final_9x16"] : [selectedCase];

    return {
      route: ROUTE,
      workbench: WORKBENCH,
      templateVersion: TEMPLATE_VERSION,
      styleVariant: variant.styleVariant,
      sharedSceneDNA: SHARED_SCENE_DNA,
      commonNegative: COMMON_NEGATIVE,
      styleVariables: variant,
      cases: caseIds.map((caseId) => buildCase(caseId, variant))
    };
  }

  return {
    ROUTE,
    WORKBENCH,
    TEMPLATE_VERSION,
    STYLE_VARIANTS,
    SHARED_SCENE_DNA,
    COMMON_NEGATIVE,
    CASES,
    auditPromptForFauxGardenWorkbench,
    generatePrompts
  };
});
