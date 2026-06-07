# 存储与缓存规则

第三大脑的所有业务数据、原始数据、处理结果、记忆库和运行缓存，都必须收录在：

```text
E:\临时项目\第三大脑
```

## 固定目录

| 目录 | 用途 |
|---|---|
| `data/raw` | 外部接口原始返回、下载文件、临时落地数据 |
| `data/processed` | 清洗后的结构化数据 |
| `data/memory` | 第三大脑长期记忆库 |
| `data/cache` | 运行缓存、HTTP 缓存、包缓存、模型缓存 |

## 禁止规则

- 不把业务数据放到 C 盘。
- 不把接口缓存、模型缓存、图片缓存、包缓存放到 C 盘。
- 不在用户目录下散落 `.cache`、`.akshare`、`.matplotlib`、`huggingface`、`torch` 等缓存。

## 脚本约束

运行入口脚本会加载：

```powershell
.\scripts\use_local_cache.ps1
```

这个脚本会把常见缓存变量指向：

```text
E:\临时项目\第三大脑\data\cache
```

如果后续新增真实数据源连接器，也要优先读取这些环境变量：

- `THIRD_BRAIN_HOME`
- `THIRD_BRAIN_CACHE`
- `AKSHARE_CACHE_DIR`
- `TDX_CACHE_DIR`
- `REQUESTS_CACHE_DIR`

