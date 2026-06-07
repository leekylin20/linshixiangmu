# generic-category-greenscreen-live-room-workbench

## 用途

- 独立生成通用品类绿幕直播间获客素材提示词。
- 默认按 6 个品类 × 10 个场景生成 60 条 prompt。
- 输出无品牌、无 LOGO、无价格、无平台 UI 的生图提示词和 JSON。

## 当前状态

状态：reusable

## 创建或引入时间

- 2026-06-05

## 启动方式

```powershell
Start-Process 'E:\临时项目\generic-category-greenscreen-live-room-workbench\index.html'
```

## 关键路径

- 页面入口：`E:\临时项目\generic-category-greenscreen-live-room-workbench\index.html`
- 生成逻辑：`E:\临时项目\generic-category-greenscreen-live-room-workbench\workbench.js`
- 默认输出：`E:\临时项目\generic-category-greenscreen-live-room-workbench\output\generic-category-greenscreen-batch-prompts.json`
- 坐播与年轻主播锁定后 30 条单行 TXT：`E:\临时项目\generic-category-greenscreen-live-room-workbench\output\generic-category-seated-fixed-30-prompts.txt`
- 坐播与年轻主播锁定审计：`E:\临时项目\generic-category-greenscreen-live-room-workbench\output\generic-category-seated-fixed-30-prompts.audit.json`
- 食品/面食/生鲜各 5 条年轻主播专项测试：`E:\临时项目\generic-category-greenscreen-live-room-workbench\output\generic-category-youthful-host-food-noodle-fresh-15-test.json`
- 端午龙舟元素 10 条坐播 TXT：`E:\临时项目\generic-category-greenscreen-live-room-workbench\output\dragon-boat-festival-seated-10-prompts.txt`
- 端午龙舟元素导出脚本：`E:\临时项目\generic-category-greenscreen-live-room-workbench\scripts\export-dragon-boat-seated-10.js`
- 3C 数码 10 条坐播 TXT：`E:\临时项目\generic-category-greenscreen-live-room-workbench\output\3c-digital-seated-10-prompts.txt`
- 3C 数码导出脚本：`E:\临时项目\generic-category-greenscreen-live-room-workbench\scripts\export-3c-digital-seated-10.js`
- Obsidian 第二大脑规则：`E:\obsidian\10_Notes\提示词专区\坐播绿幕直播间\坐播绿幕直播间提示词抽取规则_v1.2.md`
- 底层规则模板：`E:\临时项目\generic-category-greenscreen-live-room-workbench\templates\seated-greenscreen-prompt-extraction-rules-v1.2.md`
- 归档包：`E:\临时项目\generic-category-greenscreen-live-room-workbench\docs\archive\seated-greenscreen-prompt-extraction-v1.2\PACKAGE.md`

## 依赖与运行时

- 静态 HTML/JS，无外部依赖。
- 默认测试可用本机 Node.js 调用 `workbench.js` 生成。

## 最近结论

- 已生成默认 `category=all`、`countPerCategory=10` 批量输出。
- 输出 60 条 prompts，食品 / 零食 / 面食 / 美妆 / 护肤 / 生鲜各 10 条。
- 每条均包含 positivePrompt、negativePrompt 和 audit。
- 默认批量 audit 全部 pass。
- 2026-06-05 已升级到 `v1.1-seated-perspective-lock`：全局锁定坐播直播间透视，主播坐在前景直播桌后方，下半身被桌台遮挡，产品位于主播前方桌面，不再生成站播门店导购/烘焙店柜台透视。
- 2026-06-05 已升级到 `v1.2-youthful-host-lock`：全局锁定年轻成年中国抖音女主播，约 24-30 岁，definitely adult but youthful；食品/面食/生鲜服装变量改为年轻清爽 Douyin-commercial 方向，避免中年家庭主妇、阿姨感、妈妈厨房主播、烘焙店店员、韩系偶像或未成年化。
- 30 条可复制 TXT 输出格式固定为：每份提示词一整行，`#1` 到 `#30` 序号，无空行、无分隔符、无随机参数块，包含 `【生图提示词】` 与 `【负面提示词】`。
- 2026-06-05 已新增端午龙舟元素 10 条坐播提示词导出：基于食品/粽子礼盒场景，保持坐播透视、年轻成年中国抖音女主播、无品牌、无价格、无平台 UI，并把龙舟、竹叶、粽子、菖蒲等元素限定为背景和侧边轻氛围。
- 2026-06-05 已新增 3C 数码 10 条坐播提示词导出：覆盖手机配件、通勤桌面、充电装备、耳机音频、桌面效率、旅行数码、拍摄配件、智能穿戴、电脑周边、家庭网络；保持坐播透视、年轻成年中国抖音女主播、无品牌、无价格、无平台 UI。
- 2026-06-05 已把“坐播绿幕直播间提示词抽取规则 v1.2”写入 Obsidian 第二大脑，并在工作台内新增底层规则模板与归档包，作为后续新增品类/主题时的稳定基线。

## 保留或删除判断

- 保留理由：单能力独立 prompt 工作台，可复用做通用品类获客素材出图前的提示词批量生成。
- 可删除条件：该能力迁移到正式提示词系统且确认独立工作台不再需要。

## 下一步

- 后续如需复用，可加入个人工具箱总网页索引。
