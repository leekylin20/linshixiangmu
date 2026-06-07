# Git Sync Boundary

同步目标：`https://github.com/leekylin20/linshixiangmu`

本仓库用于同步 `E:\临时项目` 的可复现工作内容：

- 规则、索引、项目运行记忆、研发日报。
- Agent Memory Lite。
- 项目源码、脚本、README、PROJECT、配置模板和小型文档。
- 可复用工作台的源码和规则文件。

默认不上传：

- `_system` 中的通用运行体、模型缓存、下载包、venv、node_modules。
- 用户数据、cookie、token、密钥、私有状态。
- 微信聊天导出、飞书 payload、客户资料、原始抓取响应。
- 模型权重、压缩包、安装器、大型媒体文件。
- 一次性测试输出、旧备份、缓存目录。

如果某个被忽略的大文件确实需要同步，应优先：

1. 写清楚来源、下载方式和校验信息。
2. 放在项目 `README.md` 或 `PROJECT.md` 中。
3. 避免直接提交到普通 Git；必要时单独评估 Git LFS。
