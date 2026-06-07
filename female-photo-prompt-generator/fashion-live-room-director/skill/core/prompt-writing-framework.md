# 网页 GPT 式视觉提示词撰写框架 V1

## 1. 核心原则

最终生图 prompt 必须像一条完整的画面导演指令，而不是知识库规则拼接。

错误写法：

```text
routePrompt + sceneStylePrompt + layoutVariantPrompt + negativeRules 全部拼接。
```

正确写法：

```text
用少量清晰句子描述一个统一画面。
```

每条最终 prompt 必须先回答 5 个问题：

1. 这是什么空间？
2. 产品是什么？
3. 场景为什么适合这个产品？
4. 主播如何讲解产品？
5. 哪些高风险错误必须避免？

## 2. 正向提示词顺序

最终 positivePrompt 必须按以下顺序组织：

第一段：空间骨架

- 9:16
- 真实服装直播间
- 大空间室内盒子
- L 型转角构图
- 轻微斜角直播机位
- 可见侧墙、主墙、地面纵深
- 中景主播讲解区

第二段：产品与场景关系

- 产品品类
- 季节
- 价格带
- 材质
- 主色调
- 场景如何给产品赋能

第三段：主播与商品展示

- 主播是自然国内直播导购
- 正在对镜头讲解
- 手势服务产品
- 商品展示点完整清楚

第四段：克制规则

- 建筑照明
- 无影视灯
- 低密度陈列
- 无价格牌
- 无大促销牌
- 无整排挂架

## 3. 产品优先原则

场景必须跟产品走，不是跟抽象人群标签走。

先判断：

- 品类
- 季节
- 材质
- 价格带
- 穿着场景
- 产品气质
- 主推卖点

再决定：

- 背景主色调
- 空间层次
- 家具
- 陈列
- 小摆件

不要先根据“都市丽人 / 小清新 / 学生 / 宝妈”等人群标签直接套风格。

## 4. Prompt 长度原则

compactImagePrompt 建议控制在 140-240 英文词之间。

不要超过 300 英文词。

不要把所有规则都塞进去。

正向 prompt 中高频概念只出现一次，同义重复必须删除。

## 5. 正向 Prompt 禁止字面元素

除非用户明确要求，否则 positivePrompt 中禁止出现：

```text
price
discount
coupon
RMB
promotion board
blackboard sign
large sign
sales board
size chart
info card
feature board
prepared stock area
full rack
next items waiting on rack
many garments
retail rack
filming light
softbox
light stand
LED panel
side fill light
fill light at edge of frame
```

这些词容易被模型直接画成促销牌、门店、拍摄棚或详情页。

替代表达：

- price / discount / coupon -> 不写
- info card / size card / feature board -> product details communicated by host gesture
- rack with next items -> one small side sample display
- live equipment -> natural livestream speaking posture
- fill light -> integrated architectural lighting / soft window light / hidden cove lighting

## 6. 直播感表达方式

直播感不能靠牌子、价格板、设备、灯架体现。

正确表达：

- host speaking to live camera
- natural product explanation gesture
- clean midground presentation zone
- product clearly displayed for online viewers
- real usable live-selling room

错误表达：

- live on air sign
- promotion board
- big selling board
- price blackboard
- lighting equipment
- prepared stock area
- size chart

## 7. 品类展示优先级

牛仔裤必须清楚展示：

- high waist
- waistband
- fly front
- pockets
- hip fit
- leg silhouette
- full hems
- shoes
- denim wash
- seams
- hem drape

连衣裙必须清楚展示：

- neckline
- shoulder line
- waistline
- sleeve shape
- skirt drape
- hemline
- full length
- shoes

防晒服必须清楚展示：

- collar or hood
- zipper
- sleeve length
- lightweight fabric
- body silhouette
- hemline
- full outfit relation
- shoes

## 8. 空间表达优先级

每条 prompt 必须保留：

- large indoor room-box space
- L-shaped corner composition
- slight angled live-camera view
- visible side wall
- large foreground floor depth
- clean midground presentation zone
- integrated architectural lighting only
- one small side display only

不要把空间写成：

- flat background
- centered window backdrop
- narrow niche
- boutique fitting room
- photography studio
- dense clothing store rack

## 9. 负面词原则

negativePrompt 只保留高风险项，不要堆满 100 个负面词。

优先保留：

- fake price
- promotion board
- visible softbox
- visible light stand
- LED panel light
- full row of clothes rack
- dense clothing racks
- boutique fitting room
- photo studio backdrop
- narrow niche
- flat front-facing backdrop
- overlong legs
- cropped garment

## 10. 审计边界

`auditPromptWritingFramework(promptPack)` 只负责检查和报告。

它不能：

- 自动重写 prompt
- 自动补 prompt
- 自动把审计结果拼回 prompt
- 作为运行时收敛层
- 作为最终视觉总监层
