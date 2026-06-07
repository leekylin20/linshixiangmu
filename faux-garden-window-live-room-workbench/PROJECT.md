# faux-garden-window-live-room-workbench

## 用途

- 独立生成「仿真花园窗景直播间」两张固定 9:16 提示词。
- 只服务 `faux_garden_window_scenic_livestream_room`。
- 通过 Shared Scene DNA + case-specific prompt + style variables 编译输出。

## 当前状态

状态：reusable

## 创建或引入时间

- 2026-06-03

## 启动方式

```powershell
Start-Process 'E:\临时项目\faux-garden-window-live-room-workbench\index.html'
```

## 关键路径

- 页面入口：`E:\临时项目\faux-garden-window-live-room-workbench\index.html`
- 生成逻辑：`E:\临时项目\faux-garden-window-live-room-workbench\workbench.js`
- 默认测试：`E:\临时项目\faux-garden-window-live-room-workbench\output\faux-garden-two-9x16-default-test.json`

## 依赖与运行时

- 静态 HTML/JS，无需安装依赖。
- 默认测试可用本机 Node.js 运行 `workbench.js` 生成。

## 最近结论

- 已生成 `seaside_hydrangea_summer + both_9x16` 默认测试 JSON。
- `empty_front_9x16` 和 `host_final_9x16` audit 均为 pass。
- 未接入 `wide_overview_16x9`。
- 未接入女装工作台、女装 route、总监层或 rewrite 层。

## 保留或删除判断

- 保留理由：单能力小闭环工具，可复用验证仿真花园窗景直播间两个 9:16 prompt 的空间一致性。
- 可删除条件：该 route 后续完全合并到正式系统并确认此独立工作台不再需要。

## 下一步

- 等两个 9:16 prompt 稳定后，再单独决定是否开启 `wide_overview_16x9`。
