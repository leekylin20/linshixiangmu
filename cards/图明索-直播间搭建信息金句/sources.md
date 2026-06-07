# 图明索直播间搭建用户痛点卡片

主题方向: `product-manual`
设计语言: `image-led-magazine + edge-crop + annotation`
输出比例: `3:4`
目标: 6 张

## Layout Plan

| Card | Role | Layout | Visual Anchor | Text Density | Asset Slot | Risk |
|---|---|---|---|---|---|---|
| 01 | Cover | `cover-crop` | CSS 直播间占位场景 | Low | replaceable photo slot | title crowding |
| 02 | Mechanism | `split-diagram` | CSS 信号链路占位场景 | Medium | replaceable photo slot | too much copy |
| 03 | Front-end Fix | `artifact-board` | CSS 白平衡占位场景 | Medium | replaceable photo slot | checklist crowding |
| 04 | Quote / Explanation | `closer-question` | CSS 光比占位场景 | Low-Medium | replaceable photo slot | image underuse |
| 05 | Data / Rule | `big-number` | CSS 码率余量占位场景 | Medium | replaceable photo slot | fake metric feel |
| 06 | Closer | `checklist-sheet` | CSS 音频链路占位场景 | Medium | replaceable photo slot | repetitive shell |

## Local Sources

- `E:\\obsidian\\_legacy\\直播间调试搭建技术\\知识库_直播技术体系.md`
- `E:\\obsidian\\_legacy\\直播间调试搭建技术\\知识库_户外远程与多机位直播技术.md`
- `E:\\obsidian\\_legacy\\直播间调试搭建技术\\资料源_直播伴侣手机绿幕音频_20260508_已清洗.md`
- `E:\\obsidian\\_legacy\\直播间调试搭建技术\\主题归档\\LUT与校色.md`

## Copy Direction

- 第二版采写从消费者可感知的问题切入：看不清、颜色不准、画面廉价、卡顿变糊、声音听着累。
- 技术动作放在二级说明里，用来解释后台如何排查，不再把参数作为主标题。

## Used Facts

- 先稳结构，再谈画质。
- 自动白平衡会漂，先锁曝光和白平衡。
- 画面发灰常常是光比结构问题，不只是颜色问题。
- 码率建议按实际上传速度预留 20% 余量。
- 声音尽量和画面走同一路，先查路径再查滤镜。

## Assumptions

- 这里的“80%”是经验预留值，不是精确工程指标。
- 本轮不生成新素材图；卡片内先使用 CSS 占位场景，后续可替换为真实垫图。
- 这组卡片不走网页式 UI，走图文卡片导出。
