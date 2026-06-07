# 阶段性审查清单

## 合规边界
- 仅采集当前页面用户可见 DOM
- 不 hook fetch / XHR
- 不读取 Cookie、localStorage 登录凭证、密码、手机号
- 不绕过登录/验证码/风控
- 由用户主动点击触发采集

## 代码质量
- MV3 清晰
- 权限最小化
- 选择器失败时优雅降级
- 导出 CSV 处理引号/换行/BOM
- popup 与 content script 消息链路可恢复

## MVP 验证项
- 主页卡片可抓到至少若干条
- 详情页正文可抓到基础文本
- popup 可预览
- 可导出 JSON/CSV
