const http = require("http");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = __dirname;
const port = Number(process.argv[2] || 8732);
const localConfig = readLocalConfig();
const API_BASE = (process.env.LIVESTREAM_BG_API_BASE || localConfig.apiBase || "https://dm-fox.rjj.cc/codex").replace(/\/+$/, "");
const DEFAULT_MODEL = process.env.LIVESTREAM_BG_MODEL || localConfig.model || "gpt-image-2";
const DEFAULT_SIZE = process.env.LIVESTREAM_BG_SIZE || localConfig.size || "1088x1920";
const DEFAULT_QUALITY = process.env.LIVESTREAM_BG_QUALITY || localConfig.quality || "high";
let apiKey = process.env.LIVESTREAM_BG_API_KEY || process.env.OPENAI_API_KEY || localConfig.apiKey || "";
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".md": "text/markdown; charset=utf-8"
};

function readLocalConfig() {
  const filePath = path.join(root, "api-config.local.json");
  try {
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return {};
  }
}

function corsHeaders(extra = {}) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Authorization,Content-Type",
    "Cache-Control": "no-store, max-age=0",
    ...extra
  };
}

async function promptForKey() {
  if (apiKey || !process.stdin.isTTY) return;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  apiKey = await new Promise((resolve) => {
    rl.question("请输入 API Key: ", (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, corsHeaders({ "Content-Type": "application/json; charset=utf-8" }));
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function proxyRequest(req, res, targetPath) {
  const incomingAuth = req.headers.authorization || "";
  const authHeader = apiKey ? `Bearer ${apiKey}` : incomingAuth;
  if (!authHeader) {
    sendJson(res, 401, { error: { message: "本地服务未设置 API Key，请用启动脚本重新打开。" } });
    return;
  }

  try {
    const body = await readBody(req);
    const headers = {
      Authorization: authHeader
    };
    if (req.headers["content-type"]) headers["Content-Type"] = req.headers["content-type"];

    const upstream = await fetch(`${API_BASE}${targetPath}`, {
      method: req.method,
      headers,
      body
    });
    const contentType = upstream.headers.get("content-type") || "application/json; charset=utf-8";
    const responseBody = Buffer.from(await upstream.arrayBuffer());
    res.writeHead(upstream.status, corsHeaders({ "Content-Type": contentType }));
    res.end(responseBody);
  } catch (error) {
    sendJson(res, 502, { error: { message: `本地代理请求失败：${error.message}` } });
  }
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);

  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders());
    res.end();
    return;
  }

  if (urlPath === "/runtime-config") {
    sendJson(res, 200, {
      useLocalProxy: true,
      hasServerKey: Boolean(apiKey),
      apiBase: API_BASE,
      model: DEFAULT_MODEL,
      size: DEFAULT_SIZE,
      quality: DEFAULT_QUALITY
    });
    return;
  }

  if (urlPath.startsWith("/proxy/")) {
    proxyRequest(req, res, urlPath.slice("/proxy".length));
    return;
  }

  if (urlPath === "/") urlPath = "/index.html";

  const filePath = path.normalize(path.join(root, urlPath));
  if (!filePath.startsWith(root)) {
    res.writeHead(403, corsHeaders());
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, corsHeaders());
      res.end("Not found");
      return;
    }

    res.writeHead(200, corsHeaders({
      "Content-Type": mime[path.extname(filePath).toLowerCase()] || "application/octet-stream"
    }));
    res.end(data);
  });
});

promptForKey().then(() => {
  server.listen(port, "127.0.0.1", () => {
    console.log(`已启动： http://127.0.0.1:${port}/`);
    console.log(`API Base: ${API_BASE}`);
    console.log(apiKey ? "API Key: 已从命令行读取" : "API Key: 未设置，前端会使用页面内 API 设置");
  });
});
