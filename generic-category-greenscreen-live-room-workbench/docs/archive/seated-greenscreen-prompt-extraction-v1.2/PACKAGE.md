# 坐播绿幕直播间提示词抽取规则归档包 v1.2

归档时间：2026-06-05  
工作台：`generic-category-greenscreen-live-room-workbench`  
基线版本：`v1.2-youthful-host-lock`

## 归档目的

把已经验证稳定的“坐播绿幕直播间提示词抽取规则”打包成可复用规则包，防止后续生成回退到：

- 站播门店导购；
- 烘焙店员/超市店员；
- 中年家庭主妇/阿姨感主播；
- 产品堆满柜台；
- 高机位俯拍或门店效果图；
- 真实品牌、真实价格、平台 UI。

## 已锁定核心逻辑

1. 坐播直播机位：观众像坐在桌对面看主播讲解。
2. 前景直播桌：桌台位于下半画面，遮挡主播下半身。
3. 产品前置：产品在主播前方桌面，比主播更靠近镜头。
4. 年轻主播：年轻成年中国抖音女主播，约 24-30 岁，成年但年轻清爽。
5. 背景退后：品类或主题元素只作为背景和侧边轻语境。
6. 无品牌：不继承真实品牌、LOGO、商标、型号、价格、平台 UI。
7. 单行 TXT：每条提示词一整行，方便生图软件逐条读取。

## 入档文件

长期知识库：

- `E:\obsidian\10_Notes\提示词专区\坐播绿幕直播间\坐播绿幕直播间提示词抽取规则_v1.2.md`

工作台底层规则：

- `E:\临时项目\generic-category-greenscreen-live-room-workbench\templates\seated-greenscreen-prompt-extraction-rules-v1.2.md`
- `E:\临时项目\generic-category-greenscreen-live-room-workbench\audits\audit-rules.md`
- `E:\临时项目\generic-category-greenscreen-live-room-workbench\workbench.js`

输出样例：

- `output\generic-category-seated-fixed-30-prompts.txt`
- `output\dragon-boat-festival-seated-10-prompts.txt`
- `output\3c-digital-seated-10-prompts.txt`

导出脚本：

- `scripts\export-dragon-boat-seated-10.js`
- `scripts\export-3c-digital-seated-10.js`

## 编译结构

positivePrompt 固定顺序：

1. 画幅与用途。
2. 无品牌锁。
3. 安全区。
4. 坐播机位。
5. 年轻成年中国抖音女主播。
6. 前景直播桌。
7. 产品在主播前方。
8. 背景品类/主题氛围。
9. 标题、卖点、实体贴纸。
10. 可拆层收束。

negativePrompt 固定模块：

1. 无品牌/无平台 UI。
2. 禁门店导购/站播。
3. 禁产品堆满桌。
4. 禁中年化/阿姨化/家庭主妇化。
5. 禁未成年/韩系偶像/画报模特化。
6. 禁透视错误/高机位/广角。
7. 禁设备穿帮/灯架/线缆。
8. 品类专项禁项。

## 审计字段

新增或保留字段：

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

## 验证记录

已验证：

- 通用品类 30 条 TXT：pass。
- 默认 60 条 JSON：pass。
- 食品/面食/生鲜各 5 条专项：pass。
- 端午龙舟元素 10 条：pass。
- 3C 数码 10 条：pass。

TXT 格式验证：

- 每条一行。
- `#1` 至 `#N`。
- 0 空行。
- 0 分隔符。
- 0 随机参数块。
- 每行包含 `【生图提示词】` 与 `【负面提示词】`。

## 后续扩展方法

新增品类或主题时，不新增总监层、不新增 rewrite 层，优先复用此底层规则：

1. 替换产品组合。
2. 替换背景轻氛围。
3. 替换标题和短卖点。
4. 追加品类专项负面词。
5. 保持坐播机位、年轻主播、前景直播桌、产品前置不变。

可扩展主题：

- 中秋礼盒；
- 年货节；
- 618 数码；
- 夏日冷饮；
- 开学季文具；
- 护肤补水；
- 生鲜到家。

## 当前结论

`v1.2-youthful-host-lock` 是坐播绿幕直播间提示词生成的当前稳定基线。

后续不要回退到站播、门店柜台、阿姨感主播、真实品牌门店或多段 TXT 输出。
