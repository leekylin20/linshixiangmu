# BrowserAct 本地技能工具包

BrowserAct 是给 AI 智能体用的浏览器自动化 CLI 和技能包。当前工具包已经把官方仓库下载到本地，并在 E 盘安装了 BrowserAct CLI，避免把程序主体和运行资产放到 C 盘。

## 当前状态

- 官方仓库：`https://github.com/browser-act/skills`
- 本地仓库：`E:\临时项目\browseract-skills\repos\skills`
- 下载包：`E:\临时项目\browseract-skills\downloads\browser-act-skills-main.zip`
- CLI：`E:\临时项目\_system\uv-bin\browser-act.exe`
- CLI 版本：`browser-act 0.1.27`
- Python 3.12：`E:\临时项目\_system\uv-python\cpython-3.12.13-windows-x86_64-none`
- BrowserAct 数据目录：`E:\临时项目\_system\browseract-data`
- 可安装技能总数：59 个，其中核心技能 2 个，solution 技能 57 个。

## 已安装核心技能

这两个技能会复制到 `E:\临时项目\.agents\skills`：

- `browser-act`：一次性网页抓取、浏览器打开、点击、输入、截图、网络请求捕获、登录态浏览器会话等。
- `browser-act-skill-forge`：探索目标网站并生成可复用的采集/自动化 Skill。

Codex 需要重启后才会在技能列表里看到新技能。

## 运行方式

使用包装脚本调用，脚本会自动设置 E 盘的 uv、Python、BrowserAct 数据目录：

```powershell
E:\临时项目\browseract-skills\scripts\browser-act.ps1 --version
E:\临时项目\browseract-skills\scripts\browser-act.ps1 get-skills core --skill-version 2.0.2
E:\临时项目\browseract-skills\scripts\browser-act.ps1 browser list
```

如果要临时把命令加到当前 PowerShell：

```powershell
$env:PATH = "E:\临时项目\_system\uv-bin;$env:PATH"
$env:BROWSERACT_DATA_DIR = "E:\临时项目\_system\browseract-data"
browser-act --version
```

## 常用能力

- `stealth-extract <url>`：提取需要 JS 渲染或容易被拦截的网页内容。
- `browser list` / `browser create` / `browser open`：管理独立浏览器环境。
- `state` / `click` / `input` / `select`：按索引操作页面元素。
- `network requests` / `network request <id>`：查看页面 XHR/fetch 请求。
- `screenshot` / `get markdown` / `get html`：截图或导出页面内容。
- `remote-assist`：遇到验证码、2FA 或需要人工确认时生成接管链接。

## Solution 技能

仓库自带 57 个预制 solution 技能，见 `docs\INSTALLABLE_SKILLS.md`。默认没有全部安装，避免把技能目录塞得过满；需要时可以单独安装：

```powershell
E:\临时项目\browseract-skills\scripts\install-solution-skill.ps1 -Name xiaohongshu-search
E:\临时项目\browseract-skills\scripts\install-solution-skill.ps1 -Name youtube-transcript
```

## 注意事项

- Chrome / chrome-direct 模式不需要 BrowserAct API Key。
- stealth 浏览器、`stealth-extract`、托管代理和 `solve-captcha` 通常需要登录或 API Key。
- 敏感操作，比如创建浏览器、导入本地 Chrome Profile、提交表单、上传文件，应先得到明确确认。
- 所有本地配置、日志和浏览器资料目录已经指向 `E:\临时项目\_system\browseract-data`。
