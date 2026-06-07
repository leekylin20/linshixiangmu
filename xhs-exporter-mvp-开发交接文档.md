# 小红书导出 MVP 插件开发交接文档

更新时间：2026-04-29

## 1. 项目位置

当前可测试插件目录：

```text
E:\临时项目\xhs-exporter-mvp_20260429_152825
```

主要文件：

```text
manifest.json
content.js
popup.html
popup.js
popup.css
README.md
```

已有备份目录：

```text
E:\临时项目\xhs-exporter-mvp_20260429_152825_backup_before_content_20260429
E:\临时项目\xhs-exporter-mvp_20260429_152825_backup_before_storage_fix_20260429
E:\临时项目\xhs-exporter-mvp_20260429_152825_backup_before_one_click_detail_20260429
```

## 2. 当前目标

做一个小红书网页端 Chrome 插件，用于采集主页笔记数据，并尽量把笔记详情正文回填到本地缓存，最后一次性导出 CSV。

用户希望的理想交互：

```text
在主页卡片外面点“采正文”
-> 插件打开该笔记详情
-> 自动读取详情正文
-> 写入本地缓存
-> 悬浮窗显示正文数量增加
-> 最后统一导出 CSV
```

## 3. 当前已实现功能

### 3.1 主页卡片采集

插件可以在小红书用户主页读取当前已渲染、用户可见的卡片信息。

已采字段：

```text
序号
笔记ID
标题
正文
作者
点赞数
类型
封面图
链接
来源页面
采集时间
```

注意：主页卡片本身没有完整正文，所以主页采集时 `正文` 列通常为空。

### 3.2 详情页正文采集

当用户手动打开笔记详情页或详情弹窗后，点击插件 popup 里的 `开始采集`，可以读取当前详情页可见正文，并回填到本地缓存。

已验证过一份导出文件：

```text
D:\下载\xhs-export-1777449461737.csv
总行数：32
有正文：10
```

说明详情正文回填逻辑本身是可用的。

### 3.3 本地累计缓存

数据保存在：

```text
chrome.storage.local
key: xhsExporterMvpData
```

早期 bug：

`content.js` 曾经直接写 `chrome.storage.local`，导致详情页采集 1 条时覆盖主页 32 条。

已修复：

现在 `content.js` 主要负责返回当前页面数据，`popup.js` 负责合并和保存。后来为了页面卡片按钮，也在 `content.js` 里保留了按钮点击写入缓存的逻辑。

### 3.4 CSV / JSON 导出

popup 支持：

```text
导出 JSON
导出 CSV
清空数据
```

CSV 已加 BOM，Excel/WPS 可正常识别中文。

CSV 里已有 `正文` 列，但只有详情回填成功的条目才有正文。

### 3.5 打开下一条

popup 支持：

```text
打开下一条
```

逻辑：

从缓存里找第一条 `link` 存在但 `content` 为空的记录，打开该链接。

问题：

直接打开 `/explore/<noteId>` 有时会被小红书拦截到“当前笔记暂时无法浏览，请打开小红书 App 扫码查看”页面。

### 3.6 下载当前媒体

popup 支持：

```text
下载当前媒体
```

逻辑：

读取当前详情页可见的图片 / 视频资源 URL，然后用 Chrome Downloads API 下载到本地：

```text
下载目录/xhs-media/
```

注意：这只是浏览器端下载，不是服务器端转存。

### 3.7 主页卡片按钮

已向主页卡片注入按钮。

按钮当前文案：

```text
采正文
```

历史文案：

```text
采集
收链接
```

当前设计意图：

用户点主页卡片上的 `采正文`，插件应该打开该条笔记详情并自动采正文。

当前问题：

点击后仍可能进入小红书扫码页，说明触发路径还没有完全复刻用户真实点击卡片打开弹窗的行为。

### 3.8 悬浮状态窗

页面右下角已注入悬浮状态窗：

```text
小红书采集
总数 32
正文 0
```

作用：

实时显示本地缓存总条数和已有正文条数。

## 4. 当前关键问题

### 4.1 点“采正文”仍跳扫码页

现象：

点击主页卡片上的 `采正文` 后，小红书页面显示：

```text
当前笔记暂时无法浏览
请打开小红书 App 扫码查看
```

原因推断：

当前实现仍然触发了小红书认为的“直接访问详情链接”路径，而不是站内正常点击卡片打开详情弹窗。

已尝试方案：

1. `window.open(item.link, '_blank')`
   结果：跳扫码页。

2. `linkEl.click()`
   结果：仍然可能跳扫码页。

下一步建议：

不要点击 `a[href*="/explore/"]` 链接本身，而是模拟点击卡片里用户平时点开的具体图片区域或卡片容器。需要在 DevTools 里确认真实点击哪个 DOM 会打开弹窗。

可能方向：

```js
const target = card.querySelector('img') || card.querySelector('.cover') || card;
target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
```

但要注意：如果小红书依赖 React/Vue 内部事件或 pointerdown/mousedown/mouseup/click 组合，需要按真实事件链触发。

### 4.2 主页卡片无法直接拿正文

主页 DOM 里通常只有：

```text
标题
作者
点赞
封面
链接
```

完整正文只有详情弹窗或详情页渲染出来后才存在。

所以：

```text
主页卡片按钮不能“直接读正文”
必须先让详情内容进入当前页面 DOM
```

### 4.3 自动批量不建议做

用户曾提过类似按键精灵、随机时间、自动打开下一篇。

当前边界：

不做随机模拟真人行为。
不做接口监听。
不做 XHR hook。
不绕登录、验证码、权限限制。

推荐方式：

用户手动点一条，插件只处理这一条。

## 5. 当前重要代码结构

### 5.1 content.js

负责：

```text
识别页面类型
采集主页卡片
采集详情正文
注入卡片按钮
注入悬浮状态窗
监听 popup 消息
部分按钮点击后的本地缓存写入
```

关键常量：

```js
const STORAGE_KEY = 'xhsExporterMvpData';
const PENDING_KEY = 'xhsExporterMvpPendingDetail';
const PICK_BUTTON_CLASS = 'xhs-exporter-pick-btn';
const PICKED_ATTR = 'data-xhs-exporter-picked';
const FLOAT_ID = 'xhs-exporter-float';
```

关键函数：

```text
detectPageType()
getDetailOverlayRoot()
getDetailRoot()
getCardCandidates()
extractCardItem(card)
collectProfileCards()
collectDetailNote()
collect()
addPickedItem(item)
setPendingDetail(item)
waitForDetailItem()
collectPendingDetailInCurrentPage(pending)
injectPickButtons()
startButtonInjector()
refreshFloat()
startFloatStatus()
startPendingDetailCollector()
```

### 5.2 popup.js

负责：

```text
读取当前 tab
向 content.js 发送采集消息
合并 profile/detail 数据
保存到 chrome.storage.local
导出 JSON/CSV
打开下一条
下载当前媒体
清空数据
显示预览
监听 storage 变化
```

关键函数：

```text
collect()
loadStored()
saveStored()
clearStored()
mergeItem()
mergePayload()
getPendingItem()
getLatestMediaItem()
toCsv()
downloadBlob()
```

## 6. 当前使用流程

### 6.1 稳定流程

这是目前相对稳定的流程：

1. 打开小红书用户主页。
2. popup 点 `开始采集`，建立主页链接清单。
3. 手动打开一条笔记详情弹窗。
4. popup 点 `开始采集`，回填正文。
5. 重复第 3-4 步。
6. popup 点 `导出 CSV`。

### 6.2 当前待修流程

目标流程：

1. 在主页卡片上点 `采正文`。
2. 插件自动打开该条详情弹窗。
3. 插件自动等待详情正文出现。
4. 插件自动写入缓存。
5. 悬浮窗 `正文` 数量增加。

当前卡在第 2 步：点击后仍可能跳扫码页。

## 7. 新窗口接续建议

新窗口可以直接说：

```text
继续维护 E:\临时项目\xhs-exporter-mvp_20260429_152825。
请先阅读 E:\临时项目\xhs-exporter-mvp-开发交接文档.md。
当前问题是：主页卡片上的“采正文”点击后会跳到小红书扫码页，而不是打开站内详情弹窗。
目标是：点击卡片按钮后，复用用户真实点击卡片的路径打开详情弹窗，详情加载后自动采正文并回填本地缓存。
不要做接口监听、XHR hook、随机模拟真人、绕过登录/验证码。
```

## 8. 验证命令

每次修改后运行：

```powershell
node --check 'E:\临时项目\xhs-exporter-mvp_20260429_152825\content.js'
node --check 'E:\临时项目\xhs-exporter-mvp_20260429_152825\popup.js'
```

然后在 Chrome：

```text
chrome://extensions/
重新加载扩展
刷新小红书页面
```

## 9. 已知导出样例

旧导出，只有主页卡片，无正文：

```text
D:\下载\xhs-export-1777447882730.csv
32 行，正文列不存在或为空
```

新导出，部分正文成功：

```text
D:\下载\xhs-export-1777449461737.csv
32 行，10 条有正文
```

点卡片收链接后导出：

```text
D:\下载\xhs-export-1777451065217.csv
32 行，正文 0 条
```

这说明卡片层收录有效，但正文仍必须等详情渲染后才能采。
