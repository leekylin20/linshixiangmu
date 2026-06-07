# 归档日志：坐播绿幕直播间提示词抽取规则 v1.2

日期：2026-06-05  
项目：`generic-category-greenscreen-live-room-workbench`  
归档版本：`v1.2-youthful-host-lock`

## 本次归档动作

- 将坐播绿幕提示词抽取规则写入 Obsidian 第二大脑。
- 在工作台内新增底层规则模板 MD。
- 在 `docs/archive` 内打包归档整套逻辑。
- 保留单行 TXT 输出格式规范。
- 将端午龙舟、3C 数码导出作为主题扩展示例入档。

## 新增文件

- `E:\obsidian\10_Notes\提示词专区\坐播绿幕直播间\坐播绿幕直播间提示词抽取规则_v1.2.md`
- `E:\临时项目\generic-category-greenscreen-live-room-workbench\templates\seated-greenscreen-prompt-extraction-rules-v1.2.md`
- `E:\临时项目\generic-category-greenscreen-live-room-workbench\docs\archive\seated-greenscreen-prompt-extraction-v1.2\PACKAGE.md`
- `E:\临时项目\generic-category-greenscreen-live-room-workbench\docs\archive\seated-greenscreen-prompt-extraction-v1.2\ARCHIVE_LOG.md`

## 规则摘要

稳定结构：

- 坐播直播机位。
- 年轻成年中国抖音女主播。
- 前景直播桌遮挡主播下半身。
- 产品在主播前方桌面。
- 背景只提供品类/主题轻氛围。
- 无品牌、无真实价格、无平台 UI。
- 单行 TXT 输出。

禁止回退：

- 站播门店导购。
- 店员柜台讲解。
- 中年家庭主妇或阿姨感主播。
- 产品堆满桌。
- 真实品牌/LOGO/型号/价格。
- 平台 UI。
- 多段分隔 TXT。

## 已验证输出

- `output\generic-category-seated-fixed-30-prompts.txt`
- `output\dragon-boat-festival-seated-10-prompts.txt`
- `output\3c-digital-seated-10-prompts.txt`

验证状态：pass。

## 后续维护规则

新增品类或主题时，优先复用 `templates\seated-greenscreen-prompt-extraction-rules-v1.2.md`，只替换产品、标题、背景轻氛围和专项负面词，不改坐播结构。
