# 直播间绿幕设计 Agent 与 PSD 分层导出项目书

版本：v0.1  
日期：2026-05-28

## 一、项目概述

本项目拟建设一个面向直播间、短视频演播间、虚拟带货场景的 AI 设计画布系统。用户通过自然语言描述直播间风格、行业品类、绿幕区域、机位比例和品牌元素，系统内置的设计 Agent 自动生成可编辑的直播间绿幕场景方案，并在画布中以分层元素呈现。最终输出可被 Photoshop 打开的 PSD 文件，供设计师进行二次修正、精修、合成与交付。

项目核心不是简单生成一张直播间背景图，而是从源头建立“图层优先”的生成流程：Agent 先规划场景图层结构，再逐层生成素材，最后在画布中合成预览，并导出分层 PSD。

## 二、项目背景与痛点

直播、电商、知识付费、企业发布会等场景对直播间视觉需求高频且多变。传统设计流程通常依赖设计师从零搭建场景图，耗时较长；而普通 AI 文生图虽然速度快，但大多输出一张扁平图片，无法满足 Photoshop 二次编辑、客户修改、绿幕抠像区调整、品牌替换等专业生产需求。

当前痛点包括：

- AI 生成图难以分层，进入 PS 后只能作为单张背景图修图。
- 绿幕区域、桌面、灯光、屏幕、装饰物、阴影等元素无法独立移动或替换。
- 文字、Logo、品牌色、商品位等商业元素需要可控、可编辑、可复用。
- 设计师仍需要 Photoshop 作为最终修正工具，因此需要与 PSD 和 PS 工作流打通。
- 从“提示词生成图片”到“可交付设计文件”之间缺少结构化中间层。

## 三、项目目标

建设一个可生成、编辑、导出直播间绿幕场景 PSD 的 AI 设计系统。

核心目标：

- 用户用自然语言生成直播间绿幕场景设计。
- 画布中每个视觉元素都以独立图层存在。
- 支持绿幕区域、背景、灯光、桌面、屏幕、前景、阴影、品牌元素分层编辑。
- 支持导出 Photoshop 可打开的 PSD 文件。
- 支持通过 Photoshop UXP 插件实现一键导入 PS。
- 保留设计师二次修正能力，而不是替代设计师。

## 四、目标用户

主要用户：

- 直播间视觉设计师
- 电商品牌设计团队
- MCN/直播代运营机构
- 短视频和直播 SaaS 工具团队
- 虚拟直播间搭建服务商

典型使用场景：

- 电商直播间绿幕背景设计
- 品牌发布会虚拟演播厅设计
- 知识主播/课程直播间设计
- 多行业直播间模板批量生成
- AI 初稿 + Photoshop 精修的设计生产流

## 五、核心产品流程

1. 用户输入需求  
   示例：“生成一个 1920x1080 的科技感美妆直播间，中央保留绿幕区，左右有产品展示架，顶部有柔和灯带，适合真人主播站播。”

2. 设计 Agent 解析需求  
   输出风格、尺寸、绿幕位置、空间结构、图层清单、素材生成提示词。

3. Agent 生成图层计划  
   例如背景墙、地面、中央绿幕区、左侧货架、右侧屏幕、灯光、桌面、前景阴影等。

4. 素材生成与抠图  
   对每个图层单独生成透明 PNG 或形状数据。

5. 画布合成预览  
   用户可以拖拽、缩放、锁定、隐藏、重命名图层。

6. 用户局部调整  
   支持重新生成某一层、替换风格、调整绿幕范围、修改灯光强度。

7. 导出 PSD  
   将画布图层、坐标、透明度、分组、混合模式写入 PSD。

8. 进入 Photoshop 二次修正  
   用户可手动打开 PSD，或通过 UXP 插件一键导入 PS。

## 六、功能范围

### 6.1 MVP 功能

- 文本生成直播间场景方案
- 16:9 画布，默认 1920x1080
- 可视化图层面板
- 基础画布编辑：移动、缩放、旋转、锁定、隐藏、删除
- 绿幕区独立图层，支持颜色、位置、比例调整
- 背景、道具、灯光、阴影等元素独立图层
- 单层重新生成
- PNG 预览导出
- PSD 分层导出
- PSD 中保留图层名称、层级、透明度、坐标

### 6.2 第二阶段功能

- Photoshop UXP 插件一键导入
- 可编辑文字层
- 图层分组：背景组、绿幕组、道具组、灯光组、前景组
- 蒙版和软阴影图层
- 品牌色和 Logo 上传
- 行业模板：美妆、服装、食品、数码、教育、企业直播
- 多方案生成与对比
- 局部重绘、局部替换、局部放大修复

### 6.3 第三阶段功能

- PSD 智能对象支持
- Photoshop 回传修改到画布
- 团队协作与版本管理
- 企业模板库
- 批量生成多直播间方案
- 资产库与商用素材管理
- 云端渲染和队列任务

## 七、图层设计规范

推荐将直播间场景拆为以下图层组：

| 图层组 | 内容 | 是否 MVP 必需 |
| --- | --- | --- |
| Background | 背景墙、远景结构、空间氛围 | 是 |
| Floor | 地面、透视线、地台 | 是 |
| Green Screen | 绿幕矩形区、边框、跟踪点 | 是 |
| Props | 货架、桌子、产品台、装饰物 | 是 |
| Screens | 侧屏、信息屏、Logo 屏 | 是 |
| Lighting | 灯带、柔光、光晕 | 是 |
| Shadows | 接触阴影、投影、前景暗角 | 是 |
| Foreground | 前景装饰、遮挡物 | 可选 |
| Brand | Logo、品牌色块、口号 | 可选 |
| Notes | 设计说明、不可见参考层 | 可选 |

示例场景结构：

```json
{
  "document": {
    "width": 1920,
    "height": 1080,
    "background": "#101216"
  },
  "layers": [
    {
      "name": "Background Wall",
      "group": "Background",
      "type": "image",
      "x": 0,
      "y": 0,
      "width": 1920,
      "height": 1080
    },
    {
      "name": "Main Green Screen",
      "group": "Green Screen",
      "type": "shape",
      "x": 610,
      "y": 180,
      "width": 700,
      "height": 520,
      "fill": "#00ff00"
    },
    {
      "name": "Left Product Shelf",
      "group": "Props",
      "type": "image",
      "x": 160,
      "y": 310,
      "width": 360,
      "height": 560
    }
  ]
}
```

## 八、技术架构

推荐采用 Web/Electron + AI 服务 + PSD 导出服务 + Photoshop 插件的组合。

```text
前端设计画布
  React / Vue
  Konva 或 Fabric.js
        ↓
设计 Agent 服务
  需求解析
  场景规划
  图层提示词生成
        ↓
AI 生成服务
  ComfyUI / InvokeAI / 自研模型服务 / 商业图像 API
        ↓
素材处理服务
  抠图、分割、透明 PNG、阴影、尺寸适配
        ↓
PSD 导出服务
  ag-psd / PhotoshopAPI
        ↓
Photoshop
  手动打开 PSD 或 UXP 插件一键导入
```

## 九、GitHub 开源项目调研

### 9.1 画布与设计编辑器

| 功能 | 开源项目 | 适配度 | 说明 |
| --- | --- | --- | --- |
| 2D 交互画布 | Konva | 高 | MIT，适合做复杂 Canvas 编辑器，支持拖拽、分层、事件、导出。 |
| React 画布 | react-konva | 高 | React 项目中使用 Konva 的首选方案。 |
| Canvas 对象编辑 | Fabric.js | 高 | MIT，适合图片、文字、形状对象编辑，生态里有较多 Canva-like 项目。 |
| 成品白板参考 | Excalidraw | 中 | MIT，适合参考白板交互和文件结构，但风格偏手绘，不适合作为直播间设计主画布。 |
| 无限画布 SDK | tldraw | 中 | 能力强，但生产环境需要 license key，不宜作为纯开源底座。 |
| Canva-like 参考 | react-design-editor / design-editor | 中 | 可参考 UI 和 Fabric.js 组织方式，但需要评估维护状态。 |

推荐结论：MVP 优先选择 Konva/react-konva 或 Fabric.js。若更重视图层和对象编辑，Fabric.js 上手快；若更重视性能、React 集成和自定义渲染，Konva 更稳。

### 9.2 PSD 读写与 Photoshop 文件处理

| 功能 | 开源项目 | 适配度 | 说明 |
| --- | --- | --- | --- |
| JS 写 PSD | ag-psd | 高 | 可读写 PSD，适合 Node/Electron 导出图层 PSD。 |
| Python PSD 处理 | psd-tools | 中 | 适合读取和分析 PSD，写入复杂编辑能力有限。 |
| 高性能 PSD/PSB | PhotoshopAPI | 中 | C++/Python，偏底层，适合后期做更强 PSD 服务。 |
| PSD 读取 | psd.js / webtoon/psd | 低 | 更偏解析读取，不适合作为核心写入方案。 |

推荐结论：MVP 使用 ag-psd 输出 PSD。复杂 PSD、PSB、大文件或高级 Photoshop 特性可后续评估 PhotoshopAPI。

### 9.3 AI 图像生成工作流

| 功能 | 开源项目 | 适配度 | 说明 |
| --- | --- | --- | --- |
| 节点式 AI 生成后端 | ComfyUI | 高 | GPLv3，适合把图像生成、ControlNet、抠图、放大、局部重绘编排为工作流。 |
| 创意图像生成引擎 | InvokeAI | 中 | 面向创意工作流，商业友好许可，适合搭建专业生成服务。 |
| Stable Diffusion WebUI | AUTOMATIC1111 | 中 | 生态大，但 AGPLv3 对商业闭源产品有影响。 |

推荐结论：若要可控工作流与多节点编排，优先 ComfyUI；若产品商业化且介意 GPL 传染，需要评估 InvokeAI 或自研推理服务。

### 9.4 抠图、分割与透明素材生成

| 功能 | 开源项目 | 适配度 | 说明 |
| --- | --- | --- | --- |
| 通用分割 | Segment Anything / SAM | 高 | 适合交互式或自动分割对象，作为元素拆分兜底。 |
| 背景移除 | rembg | 中 | 适合快速抠主体，但要逐一核查所用模型许可证。 |
| 高质量商用抠图 | BRIA RMBG | 中 | 效果好，但开源权重通常是非商业限制，需要商业授权。 |

推荐结论：MVP 不应依赖“单图强拆层”作为主流程，只把 SAM/rembg 作为兜底。主流程应该逐层生成透明素材。

### 9.5 Photoshop 对接

| 功能 | 项目/API | 适配度 | 说明 |
| --- | --- | --- | --- |
| Photoshop 插件 | Adobe Photoshop UXP | 高 | 官方插件体系，可打开文档、创建/访问图层、执行 Photoshop 操作。 |
| 动作录制辅助 | Alchemist / batchPlay 工具 | 中 | 可辅助开发 UXP 插件中的 Photoshop 操作命令。 |

推荐结论：PSD 导出可以先不依赖插件；若要“一键进入 PS”，必须做 UXP 插件。

## 十、推荐技术路线

### MVP 推荐路线

```text
React + Konva/react-konva
Node.js 服务
ComfyUI 或图像生成 API
透明 PNG 图层资产
ag-psd 导出 PSD
本地下载/打开 PSD
```

优点：

- 实现周期短。
- 开源组件成熟。
- PSD 分层导出可以较快验证。
- 后续可自然升级到 Photoshop 插件。

### 正式产品路线

```text
React/Electron 设计工具
Agent 场景规划服务
ComfyUI/InvokeAI/自研生成服务
图层资产管理
PSD Export Service
Photoshop UXP 插件
团队资产库和模板库
```

优点：

- 支持本地文件、字体、PS 联动。
- 可形成专业设计生产工具。
- 便于做商业化交付和私有化部署。

## 十一、Agent 能力设计

设计 Agent 应拆成多个子能力：

| Agent 能力 | 输入 | 输出 |
| --- | --- | --- |
| 需求解析 | 用户自然语言 | 行业、风格、尺寸、绿幕位置、品牌要求 |
| 场景规划 | 需求结构 | 空间布局、图层组、透视关系 |
| 图层生成 | 图层计划 | 每层提示词、负面提示词、尺寸 |
| 质量检查 | 合成预览 | 绿幕是否清晰、遮挡是否合理、元素是否出界 |
| 局部修改 | 用户选择图层 | 修改后的提示词和替换素材 |
| PSD 编排 | 画布 JSON | PSD 图层树、分组、混合模式、命名 |

## 十二、PSD 导出策略

MVP 中 PSD 导出以“可编辑图层”为第一目标，不追求一开始就完整复刻 Photoshop 的所有高级特性。

MVP 支持：

- RGB 8-bit PSD
- 普通像素图层
- 图层分组
- 图层名称
- 图层位置
- 图层透明度
- 可见/隐藏状态
- 绿幕形状层转像素层
- 阴影作为独立 multiply 图层

第二阶段支持：

- 文字层
- 形状层
- 蒙版
- 混合模式
- 图层效果
- 智能对象

建议策略：

- AI 生成的复杂视觉元素先以透明 PNG 像素层进入 PSD。
- 文字、Logo、绿幕区、色块、参考线尽量使用可编辑形状或文字层。
- 阴影、光晕、反光单独成层，方便设计师在 PS 中调节。

## 十三、风险与对策

| 风险 | 影响 | 对策 |
| --- | --- | --- |
| 单图拆层质量不稳定 | PSD 不可编辑、边缘脏 | 采用 layer-first 生成流程，单图分割只做兜底。 |
| PSD 高级特性写入难 | 文字/形状/智能对象不完整 | MVP 先输出像素分层，后续通过 UXP 创建原生 PS 图层。 |
| AI 生成元素风格不一致 | 场景拼贴感重 | 使用统一场景风格提示词、ControlNet、参考图和后处理调色。 |
| 绿幕区被元素遮挡 | 无法用于直播合成 | Agent 质量检查中强制校验绿幕区域完整性。 |
| 开源许可证影响商业化 | 法务和交付风险 | 优先 MIT/Apache/BSD；GPL/AGPL 组件隔离为服务或替换。 |
| Photoshop 自动化权限限制 | 一键导入失败 | 使用 Adobe UXP 官方能力，保留 PSD 文件导出作为兜底。 |

## 十四、里程碑规划

### 第 1 阶段：技术验证，2-3 周

- 选定画布库。
- 实现图层 JSON 数据结构。
- 手工导入若干透明 PNG 合成直播间画布。
- 使用 ag-psd 导出 PSD。
- 验证 Photoshop 打开后的图层结构。

交付物：

- 可运行的画布 Demo
- PSD 导出 Demo
- Photoshop 打开验证样例

### 第 2 阶段：MVP，4-6 周

- 接入设计 Agent。
- 实现需求解析和图层计划生成。
- 接入 AI 生成服务。
- 支持单层重新生成。
- 支持行业模板。
- 完成 PSD 分层导出。

交付物：

- 可用 MVP
- 5-10 套直播间模板
- 基础 PSD 交付能力

### 第 3 阶段：PS 联动，3-4 周

- 开发 Photoshop UXP 插件。
- 插件读取画布项目或 PSD。
- 支持一键导入 Photoshop。
- 支持文字/Logo/绿幕区原生图层增强。

交付物：

- Photoshop 插件
- 一键导入工作流
- 设计师测试报告

### 第 4 阶段：商业化产品，6-8 周

- 团队项目管理。
- 模板库和资产库。
- 批量生成。
- 权限和存储。
- 计费与部署方案。

交付物：

- 商业化 Beta 版本
- 私有化部署方案
- 商用素材和模型许可证清单

## 十五、验收标准

MVP 验收：

- 用户能用一句话生成直播间绿幕场景。
- 画布中至少包含 8 个以上可独立编辑图层。
- 绿幕区域可独立移动、缩放、锁定。
- 支持至少 3 种行业风格模板。
- 支持单层重新生成。
- 可导出 Photoshop 能打开的 PSD。
- PSD 中图层命名清晰，层级和位置与画布基本一致。
- 设计师能在 PS 中完成二次修正。

正式产品验收：

- 支持 Photoshop 插件一键导入。
- 支持文字和品牌元素可编辑。
- PSD 文件结构符合设计师交付习惯。
- 单个 1920x1080 场景生成到 PSD 导出耗时可控。
- 至少通过 10 个真实直播间需求测试。

## 十六、建议开源组合

优先组合：

- 前端：React + Konva/react-konva
- 状态管理：Zustand 或 Redux Toolkit
- 画布渲染：Konva
- PSD 导出：ag-psd
- AI 工作流：ComfyUI 或 InvokeAI
- 分割兜底：SAM + rembg
- PS 直连：Adobe Photoshop UXP

备选组合：

- 前端：React + Fabric.js
- 参考编辑器：react-design-editor / vue-fabric-editor
- PSD 服务：PhotoshopAPI
- AI 工作流：自研 Stable Diffusion/Flux 推理服务

## 十七、资料链接

- Konva: https://github.com/konvajs/konva
- react-konva: https://github.com/konvajs/react-konva
- Fabric.js: https://github.com/fabricjs/fabric.js
- Excalidraw: https://github.com/excalidraw/excalidraw
- tldraw: https://github.com/tldraw/tldraw
- ag-psd: https://github.com/Agamnentzar/ag-psd
- psd-tools: https://github.com/psd-tools/psd-tools
- PhotoshopAPI: https://github.com/EmilDohne/PhotoshopAPI
- ComfyUI: https://github.com/comfy-org/ComfyUI
- InvokeAI: https://github.com/invoke-ai/InvokeAI
- AUTOMATIC1111: https://github.com/AUTOMATIC1111/stable-diffusion-webui
- Segment Anything: https://github.com/facebookresearch/segment-anything
- rembg: https://github.com/danielgatis/rembg
- Adobe Photoshop UXP: https://developer.adobe.com/photoshop/uxp/

## 十八、结论

该项目具备较高可行性。最重要的产品判断是：不能把“AI 生成一张图再拆层”作为主路线，而应采用“Agent 规划图层、逐层生成、画布合成、PSD 导出”的生产方式。这样生成结果才能真正进入 Photoshop 工作流，并保留设计师需要的二次编辑空间。

建议先用 Konva/react-konva + ag-psd 做技术验证，确认 PSD 分层导出质量；随后接入 AI 图层生成和 Photoshop UXP 插件，形成完整的 AI 设计到 PS 精修闭环。
