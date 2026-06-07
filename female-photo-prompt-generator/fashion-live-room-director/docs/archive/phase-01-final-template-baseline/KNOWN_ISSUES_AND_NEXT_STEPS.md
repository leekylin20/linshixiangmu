# Known Issues And Next Steps

## 当前已知问题

1. 前端 UI 中牛仔裤 / L 型构图等选项可见性还未完全整理。
2. 四图提案模板暂时搁置，避免干扰主生图流程。
3. 软装、摆件、材质库已初步接入，但还需要更多图像验收。
4. 连衣裙和防晒服 route 仍可后续独立补齐。
5. 当前模板可用，但不同模型 / API 参数下仍需继续对比。
6. 需要继续防止 positivePrompt 中出现价格、促销板、影视灯、密集挂架等字面元素。

## 下一阶段计划

Phase 02 - Soft Furnishing Variable Library

目标：

在不改动最终模板主骨架的情况下，完善软装、摆件、材质变量库。

计划维护：

- `soft-furnishing-library.md`
- `prop-accessory-library.md`
- `material-palette-library.md`

原则：

- 每次只注入少量变量。
- 每段变量不超过 25-40 英文词。
- 注入后总 prompt 不超过 260 词。
- 不回到规则拼接模式。

## 暂缓事项

- 四图提案模板。
- UI 选项大重构。
- 新增总监层。
- 新增 rewrite 层。
- 复杂多品类 route 扩展。
