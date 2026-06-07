# female-photo-prompt-generator

## 用途

- 女装直播间视觉生成系统，生成适合 AI 图像模型使用的直播间视觉提示词、空间复用元素、直播信息层、空间透视强锁和负面限制词。

## 当前状态

状态：reusable

## 创建或引入时间

- 2026-05-30 已存在
- 2026-05-31 按 PRD V1.1 改为女装直播间场景设计提示词生成器
- 2026-05-31 按字段 JSON / 表单结构 V2 升级为女装直播间视觉生成系统
- 2026-05-31 增加牛仔裤直播间空间板块 V1
- 2026-05-31 按女装直播间空间生成元提示词系统 V2 完整版升级输出结构

## 启动方式

```powershell
Start-Process "E:\临时项目\female-photo-prompt-generator\index.html"
```

也可临时启动本地静态服务：

```powershell
node -e "const http=require('http'),fs=require('fs'),path=require('path');const root=process.cwd();http.createServer((req,res)=>{const u=decodeURIComponent((req.url||'/').split('?')[0]);const f=u==='/'?path.join(root,'index.html'):path.resolve(root,'.'+u);if(!f.startsWith(root)){res.writeHead(403);return res.end('Forbidden')}fs.readFile(f,(e,d)=>{if(e){res.writeHead(404);res.end('Not found')}else{res.writeHead(200,{'Content-Type':f.endsWith('.html')?'text/html; charset=utf-8':'application/octet-stream'});res.end(d)}})}).listen(8123,'127.0.0.1')"
```

## 关键路径

- `E:\临时项目\female-photo-prompt-generator\index.html`
- `E:\临时项目\female-photo-prompt-generator\fashion-live-room-director\SKILL.md`
- `E:\临时项目\female-photo-prompt-generator\fashion-live-room-director\skill\route-registry.md`
- `E:\临时项目\female-photo-prompt-generator\fashion-live-room-director\skill\routes\denim\denim-live-room.md`

## 依赖与运行时

- 无构建依赖，单文件静态 HTML。
- 可直接浏览器打开；本地服务验证可使用系统已有 Node.js。

## 最近结论

- 已实现 V2 九模块字段：输出目标、销售、直播、服装、场景、空间复用、直播信息、稳定出图、负面限制。
- 已支持 locked / auto / empty 状态判断，locked 字段不会被自动补全覆盖。
- 输出六个结果卡片，每个卡片可单独复制，也可一键复制完整结果。
- 已通过 V2 验收：参数锁定、羽绒服自动补全、空场景底图、透视强锁。
- 已接入牛仔裤专项：牛仔裤品类、牛仔裤裤型、牛仔颜色、深木/中灰/暖灰低反光空间母版、丹宁纹理提示词、牛仔裤专项负面限制。
- 输出卡片已改为完整版结构：空间方向判断、推荐空间母版、可复用空间元素、镜头与透视要求、完整生成提示词、负面限制词。
- 完整提示词已加入 L0 硬规则、基础空间骨架、装饰密度控制、直播机位强锁和全局负面限制。
- 2026-05-31 已删除系统内直播信息层与信息密度相关字段和输出描述。
- 2026-05-31 已加入空间纵深与房间尺度规则：前景地面层、中景主播层、后景空间层、完整房间盒子、主播身后 1.5–2.5 米距离、人物高度 68%–76%。
- 2026-05-31 已加入 V2.1 修正补丁：直播讲解动作强锁、人物与服装主次规则、牛仔裤/羽绒服/新中式真丝专项补丁、全局新增负面限制词。
- 2026-05-31 已加入真实感与服装讲解强锁模块 V2.1：真实直播间使用感、防展厅化、真丝/羽绒服/牛仔裤材质真实感、人物与空间比例强锁。
- 2026-06-01 新增 `fashion-live-room-director` Skill-style 规则库，主工作台停止直接承载未知实验。
- 第一阶段已沉淀：`spatial-perspective-rules.md`、`live-room-structure-rules.md`、`title-font-decision-rules.md`、`anti-posterization-rules.md`、`denim-live-room.md`。
- `route-registry.md` 当前只注册已实现的 `denim-live-room`；羽绒服、新中式真丝、法式裙装、通勤套装 route 仅为 draft，不允许选择。

## 开发原则

- 本项目不再从“大而全一站式工作台”开始开发。
- 所有新能力必须先经过三步：知识库规则沉淀、单能力实验验证、小闭环工具封装。
- 只有通过单能力验收的模块，才能进入主工作台。
- 禁止在主工作台里直接试错新能力。
- 禁止一个需求同时修改提示词、生图、UI、质检、导出。
- 禁止靠不断补字段修复系统方向错误。
- 主工作台只负责串联成熟模块，不负责承载未知实验。

## 固定结构规则

- 空间透视必须作为强锁定模块长期保留。
- 输出结构中「镜头与透视要求」固定为第 4 张结果卡，后续迭代不得删除、弱化或移动到非固定位置。
- 完整生成提示词中，空间透视强锁必须保持在靠后位置，紧邻最终整体要求，确保不会被品类、风格、空间母版或主播动作描述覆盖。
- 所有新增品类规则、材质规则、动作规则都必须服从空间透视强锁。

## Skill 规则库接入原则

- 第一阶段只做本地规则库文件，不重构主页面。
- Route 不是固定风格预设，而是品类直播间空间骨架、陈列逻辑、主播动作、材质方向和反失败规则。
- 未在 `route-registry.md` 标记为 implemented 的 route 不得被选择。
- 无匹配 route 时回退 `generic-fashion-live-room`，并在 debug 中标记 `routeFallback=true`。

## 保留或删除判断

- 保留理由：可复用的女装直播间 AI 图片视觉提示词工具。
- 可删除条件：业务上确认不再需要女装直播间视觉生成系统。

## 下一步

- 如需发布公网分享，可接入飞书妙搭或其他静态托管。
