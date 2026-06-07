# auditPromptForPremiumMakeupLiveRoom

版本：`premium_makeup_foreground_transaction_35mm_geometry_lock_v1_0`

## 单条审计字段

```json
{
  "status": "pass/fail",
  "cameraGeometryLockPass": true,
  "foregroundAnchorLockPass": true,
  "foregroundSkeletonPass": true,
  "camera35mmPass": true,
  "hostConsultantPass": true,
  "tableMaterialPass": true,
  "mainEyeshadowPriorityPass": true,
  "auxProductDensityPass": true,
  "backgroundFlexiblePass": true,
  "perspectiveConsistencyPass": true,
  "liveCommerceRelationPass": true,
  "negativePromptPass": true,
  "perspectiveNegativePass": true,
  "outputSchemaPass": true,
  "notes": []
}
```

## 批量背景分散审计

批量输出返回：

```json
{
  "status": "pass/fail",
  "uniqueBackgroundCount": 7,
  "expectedMin": 7,
  "noAdjacentDuplicate": true,
  "routeCounts": {},
  "notes": []
}
```

自动模式下，默认 7 条应覆盖 7 个背景路由；30 条以内应尽量均衡轮换，避免所有图都变成同一套背景。

## 失败条件

出现以下任一情况，单条 audit 应为 fail：

- 没有锁定前景直播成交骨架；
- 没有在正向提示词最前面写入 Camera Geometry Lock / 透视母版锁定；
- 没有写入 Foreground Anchor Lock / 前景锚点锁定；
- 不是中国抖音坐播直播间；
- 没有 35mm equivalent lens、125cm、正面中近景、轻微下俯 2°；
- 没有锁定单一正面一点透视；
- 没有锁定主播眼线、肩线水平、桌台前沿水平、产品同一桌面平面、背景垂直线垂直；
- 主播不像 28-35 岁高端品牌彩妆顾问；
- 主播漂成韩系女团、甜妹网红、写真模特、普通店员或夸张促销主播；
- 桌台不是黑色高光镜面直播讲解桌台；
- 没有亚克力、黑镜、银色金属等高端陈列材质；
- 中央主推不是高端眼影盘；
- 口红成为第一主角；
- 辅助彩妆铺满桌面或抢主体；
- 背景被锁死成单一结构，缺少背景路由；
- 背景路由改变了相机位置、桌台角度、主播位置、产品中心点或透视系统；
- 背景抢走产品或主播；
- 画面变成专柜探店图、空间展示图或广告大片；
- 负面提示词缺少普通卖货直播间、口红成为第一主角、专柜探店图、广告大片视角、强广角、真实品牌 LOGO 等关键禁项。
- 负面提示词缺少 tilted table plane、diagonal table front edge、mismatched product perspective、products on different planes、background perspective not matching table、inconsistent vanishing point 等透视禁项。

## 输出结构

每条 JSON 必须包含：

- `category: "premium_makeup"`
- `sceneType: "seated_livestream"`
- `templateVersion: "premium_makeup_foreground_transaction_35mm_geometry_lock_v1_0"`
- `mainProduct: "eyeshadow_palette"`
- `mainProductCn: "高端眼影盘"`
- `backgroundRoute`
- `backgroundRouteCn`
- `prompt`
- `positivePrompt`
- `negativePrompt`
