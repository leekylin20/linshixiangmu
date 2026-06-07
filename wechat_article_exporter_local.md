# wechat-article-exporter local run

Project directory:

- `E:\临时项目\wechat-article-exporter-master`

Start command:

```powershell
powershell -ExecutionPolicy Bypass -File "E:\临时项目\start_wechat_article_exporter.ps1"
```

Local URL:

- <http://localhost:3000>

Notes:

- This project is already installed locally.
- It still requires logging in with a WeChat `subscription account` or `service account`.
- The core mechanism is searching other public accounts from the WeChat public-platform editor.
- If the target account disables search by other public accounts, full-history export will not work.
