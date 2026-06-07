# Visual Enrichment Rules
# 女装直播间视觉丰富度规则

## 核心原则

丰富空间只能通过受控变量完成，不能回到长 prompt 拼接。

## 变量注入限制

最终模板只允许注入以下 3 个短变量：

- `[SOFT_FURNISHING_DETAILS]`
- `[PROP_DETAILS]`
- `[MATERIAL_DETAILS]`

每段长度：

- `SOFT_FURNISHING_DETAILS`：最多 25-40 英文词
- `PROP_DETAILS`：最多 20-35 英文词
- `MATERIAL_DETAILS`：最多 20-35 英文词

注入后最终 positivePrompt 总词数必须 <= 260。超过 260，直接 fail，不进入生图。

## 位置规则

软装和摆件只能出现在：

- side area
- rear layer
- side cabinet
- window corner
- background lifestyle layer
- auxiliary display area

禁止出现在：

- central selling zone
- in front of garment
- blocking legs
- blocking skirt hem
- blocking sleeve
- blocking zipper
- blocking product details

## 品类匹配规则

牛仔裤：
优先使用 `denim_premium_winter` 或 `denim_fresh_summer`。中高客单深色牛仔裤可用深木、灰墙、小奢细节。夏季浅色牛仔裤可用浅木、米白、亚麻窗帘、小绿植。

连衣裙：
优先使用 `dress_soft_french` 或 `dress_refined_home`。需要增加软装层次，但不能变影楼写真或婚礼布景。

防晒服：
优先使用 `sunproof_fresh_clean` 或 `sunproof_summer_green`。必须增强清爽、夏季、绿色、轻户外通勤感。

棉麻：
优先使用 `linen_natural_home`。强调自然、棉麻、藤编、陶瓷、舒适生活感。

## 禁止

- 家具堆叠
- 道具堆叠
- 家居广告感
- 线下门店感
- 样板房硬装广告
- 影视灯
- 灯架
- 软箱
- 一整排挂架
- 价格牌
- 促销板
- 大卖点牌
