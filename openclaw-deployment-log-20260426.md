# OpenClaw Deployment Log - 2026-04-26

维护对象：Ubuntu 云主机 `38.76.193.161`
维护范围：OpenClaw Gateway、SSH 免密、桌面隧道入口、多 Agent、Discord 多 Bot 分流。

## 安全约束

- 未开放服务器 `18789` 到公网。
- OpenClaw Gateway 仍通过本机回环地址访问。
- Windows 通过 SSH 隧道访问：`127.0.0.1:18789 -> 127.0.0.1:18789`。
- 未在脚本、日志或聊天中写入服务器密码。
- Discord Bot Token 与 DeepSeek API Key 未输出到屏幕。
- Discord Token 通过服务器本地 `read -rsp` 输入，保存到 `/root/.openclaw/discord.env`。
- `/root/.openclaw/discord.env` 权限为 `600`。

## Windows SSH 与桌面入口

本地专用 SSH key：

- 私钥：`%USERPROFILE%\.ssh\openclaw_hk`
- 公钥：`%USERPROFILE%\.ssh\openclaw_hk.pub`
- 类型：ed25519
- 注释：`openclaw_hk`

服务器端：

- 公钥追加到 `/root/.ssh/authorized_keys`
- `/root/.ssh` 权限：`700`
- `/root/.ssh/authorized_keys` 权限：`600`
- `/root/.ssh` owner：`root:root`

问题与修复：

- 初始 `ssh -vvv` 显示服务器认证方式只有 `password,keyboard-interactive`，没有 `publickey`。
- `sshd -T` 显示 `pubkeyauthentication no`。
- 已新增 `/etc/ssh/sshd_config.d/99-openclaw-pubkey.conf`：

```text
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys .ssh/authorized_keys2
PermitRootLogin yes
```

- 已执行 `sshd -t` 并 reload sshd。
- 最终免密测试成功：

```bash
ssh -i "%USERPROFILE%\.ssh\openclaw_hk" root@38.76.193.161 "echo ssh_key_ok"
```

Windows 桌面文件：

- 脚本：`C:\Users\麒麟\Desktop\打开OpenClaw.ps1`
- 快捷方式：`C:\Users\麒麟\Desktop\打开 OpenClaw.lnk`

脚本行为：

- 检查本地 `18789` 端口是否已有连接。
- 如果没有，则隐藏启动 SSH 隧道：

```powershell
ssh.exe -i $env:USERPROFILE\.ssh\openclaw_hk -N -L 18789:127.0.0.1:18789 root@38.76.193.161
```

- 等待 2 秒。
- 打开 `http://127.0.0.1:18789`。
- 不保留 PowerShell 黑窗口。

## OpenClaw Gateway

systemd user service：

```bash
systemctl --user status openclaw-gateway --no-pager -l
systemctl --user restart openclaw-gateway
```

当前状态：

- service：`openclaw-gateway.service`
- Gateway 版本：`v2026.4.23`
- 访问端口：`18789`
- 访问方式：本机 / SSH 隧道
- Discord env drop-in：`/root/.config/systemd/user/openclaw-gateway.service.d/10-discord-env.conf`

Drop-in 内容：

```ini
[Service]
EnvironmentFile=/root/.openclaw/discord.env
```

## DeepSeek 模型

当前 agent 均使用：

```text
deepseek/deepseek-chat
```

维护过程中未改 DeepSeek API Key。

## Agent 配置

当前 4 个 agent：

| Agent ID | 显示名 | Emoji | Workspace | Model |
|---|---|---|---|---|
| `main` | 大头虾 | 🦞 | `/root/.openclaw/workspace` | `deepseek/deepseek-chat` |
| `schedule` | 排班虾 | 📅 | `/root/.openclaw/workspace-schedule` | `deepseek/deepseek-chat` |
| `project` | 项目虾 | 📌 | `/root/.openclaw/workspace-project` | `deepseek/deepseek-chat` |
| `creative` | 创意虾 | 🎨 | `/root/.openclaw/workspace-creative` | `deepseek/deepseek-chat` |

创建命令参考：

```bash
openclaw agents add schedule --workspace /root/.openclaw/workspace-schedule --model deepseek/deepseek-chat --non-interactive
openclaw agents add project --workspace /root/.openclaw/workspace-project --model deepseek/deepseek-chat --non-interactive
openclaw agents add creative --workspace /root/.openclaw/workspace-creative --model deepseek/deepseek-chat --non-interactive
```

身份文件：

- `IDENTITY.md`
- `AGENTS.md`
- `SOUL.md`

默认 `BOOTSTRAP.md` 已禁用，避免 bot 再回复“刚开机没名字”：

- `BOOTSTRAP.md` -> `BOOTSTRAP.md.disabled`

备份位置：

```text
/root/.openclaw/merge-backups/bootstrap-remove-20260426_011842
```

## 旧 QClaw 备份融合

Windows 备份来源：

```text
E:\qclaw_backups\qclaw_backup_20260421_203526
```

旧备份中识别到的旧 agent 方法：

- 金团团：结构拆解 / 骨架 / 步骤规划
- 雨绵绵：成稿优化 / 交付包装
- 银圆圆：审查 / 质检 / 反方
- 土土主：总管 / 裁判 / 调度
- 代可行：技术落地 / 后端工程 / 可执行实现

安全处理：

- 未迁移旧 `openclaw.json`。
- 未迁移旧 token、旧 channel、旧 sessionKey。
- 只整理旧角色方法和工作原则。

新增文件：

- `/root/.openclaw/workspace/QCLAW_LEGACY_ROUNDTABLE.md`
- `/root/.openclaw/workspace-schedule/QCLAW_LEGACY_WORKSTYLE.md`
- `/root/.openclaw/workspace-project/QCLAW_LEGACY_WORKSTYLE.md`
- `/root/.openclaw/workspace-creative/QCLAW_LEGACY_WORKSTYLE.md`

备份位置：

```text
/root/.openclaw/merge-backups/qclaw-legacy-20260426_002956
```

## Discord 多 Bot 分流

Discord 服务器：

```text
1496776315431419985
```

允许用户：

```text
1496732610586476626
```

当前绑定：

| Discord Bot | Account ID | Agent |
|---|---|---|
| 不睡觉的虾哥 | `default` | `main` / 大头虾 |
| 排班虾 行政虾 | `schedule` | `schedule` / 排班虾 |
| 项目虾-项目负责 | `project` | `project` / 项目虾 |
| 创意虾-内容 | `creative` | `creative` / 创意虾 |

配置要求：

- 每个 account 只允许服务器 `1496776315431419985`。
- 每个 account 只允许用户 `1496732610586476626`。
- 每个 account `requireMention=true`。
- token 通过 env SecretRef，不写入 `openclaw.json` 明文。

Token env 文件：

```text
/root/.openclaw/discord.env
```

变量名：

```text
DISCORD_BOT_TOKEN
DISCORD_BOT_TOKEN_SCHEDULE
DISCORD_BOT_TOKEN_PROJECT
DISCORD_BOT_TOKEN_CREATIVE
```

配置备份：

```text
/root/.openclaw/merge-backups/discord-multibot-20260426_004732
```

逐个 token 输入备份：

```text
/root/.openclaw/merge-backups/discord-token-schedule-*
/root/.openclaw/merge-backups/discord-token-project-*
/root/.openclaw/merge-backups/discord-token-creative-*
```

## Discord Intent 修复

问题：

- 三个新 bot 初始 token 正确后，仍只有 default 回复。
- Gateway 日志出现：

```text
gateway closed with code 4014 (missing privileged gateway intents)
```

原因：

- OpenClaw `v2026.4.23` 的 Discord provider 硬编码请求了 `MessageContent` intent。
- 新 bot 没在 Discord Developer Portal 开启 Message Content privileged intent。
- 已设置 `requireMention=true`，实际只需要 @ 提及即可工作。

修复：

- 备份并 patch：

```text
/usr/lib/node_modules/openclaw/dist/extensions/discord/provider-Bc1Lm79N.js
```

- 移除了 `resolveDiscordGatewayIntents()` 中对 `MessageContent` intent 的硬请求。
- 执行 `node --check` 通过。
- 重启 `openclaw-gateway`。

备份位置：

```text
/root/.openclaw/merge-backups/discord-intent-patch-20260426_011710
```

注意：

- 这是对已安装 OpenClaw 包文件的本地补丁。
- 如果未来升级或重装 OpenClaw，此补丁可能被覆盖。
- 覆盖后若新 bot 再次不回复并出现 `4014`，需要重新处理：
  - 方案 A：在 Discord Developer Portal 给每个 bot 开启 Message Content Intent。
  - 方案 B：重新移除 provider 中的 MessageContent intent 请求。

## 当前验证命令

```bash
openclaw agents list --bindings
openclaw channels status --probe
systemctl --user status openclaw-gateway --no-pager -l
```

当前最终状态：

- 4 个 agent 都存在。
- 4 个 Discord account 都存在。
- bindings 正确：
  - `default -> main`
  - `schedule -> schedule`
  - `project -> project`
  - `creative -> creative`
- 4 个 bot 均 connected / works。
- Gateway active running。
- Discord 人工 @ 测试已通过。

## 人工测试语句

```text
@不睡觉的虾哥 你是谁
@排班虾 行政虾 你是谁
@项目虾-项目负责 你是谁
@创意虾-内容 你是谁
```

预期：

- 不睡觉的虾哥：大头虾 / main
- 排班虾 行政虾：排班虾 / schedule
- 项目虾-项目负责：项目虾 / project
- 创意虾-内容：创意虾 / creative

## 回滚提示

按操作阶段回滚：

- Discord multi-bot 配置：恢复 `/root/.openclaw/merge-backups/discord-multibot-20260426_004732/openclaw.json.bak` 和 `discord.env.bak`。
- Discord intent patch：恢复 `/root/.openclaw/merge-backups/discord-intent-patch-20260426_011710/provider-Bc1Lm79N.js.bak` 到原 provider 文件。
- Bootstrap 禁用：把对应 workspace 的 `BOOTSTRAP.md.disabled` 改回 `BOOTSTRAP.md`，或从 `/root/.openclaw/merge-backups/bootstrap-remove-20260426_011842` 恢复。

回滚后通常需要：

```bash
systemctl --user restart openclaw-gateway
sleep 10
openclaw channels status --probe
```

## 后续维护注意

1. 不要打印 `/root/.openclaw/discord.env`。
2. 不要打印完整 `/root/.openclaw/openclaw.json`，只输出脱敏摘要。
3. 修改前先备份到 `/root/.openclaw/merge-backups/`。
4. OpenClaw 升级后重点检查：
   - Discord provider 本地 intent patch 是否被覆盖。
   - `openclaw channels status --probe` 是否 4 个 bot 都 works。
   - `BOOTSTRAP.md` 是否被重新生成。
5. 18789 继续只走本地和 SSH 隧道，不开放公网。

## 旧 QClaw Skills 提取与分发 - 2026-04-26 01:42

本机旧 QClaw 备份中识别到 `D_qclaw/skills` 目录，并先在 Windows 本机安全提取到：

```text
E:\临时项目\qclaw_extracted_skills
```

云主机上传位置：

```text
/root/.openclaw/skills/qclaw-legacy
```

已上传并启用的 skill：

- `geo-playbook`
- `karpathy-skill`
- `mrbeast-skill`
- `munger-skill`
- `naval-skill`
- `nuwa-skill`
- `pre-main-wave-scanner`
- `steve-jobs-skill`
- `taleb-skill`

暂不启用：

- `daba-limit-up`：旧文件标注已弃用。
- `openclaw_market_skill_bundle_a_hk_v3`：不是标准单 skill，是 bundle，需要单独审计。

OpenClaw 加载目录：

```json
"skills": {
  "load": {
    "extraDirs": ["/root/.openclaw/skills/qclaw-legacy"]
  }
}
```

分发策略：

- `main / 大头虾`：加载全部 9 个旧 skill，作为总控判断和任务分发工具箱。
- `project / 项目虾`：加载 `geo-playbook`、`munger-skill`、`naval-skill`、`taleb-skill`，用于项目复盘、决策审查、GEO 方法论。
- `creative / 创意虾`：加载 `geo-playbook`、`mrbeast-skill`、`nuwa-skill`、`steve-jobs-skill`，用于内容创意、视觉方案、产品表达、造 skill。
- `schedule / 排班虾`：不加载旧 skill，保持行政排班场景纯净，避免被投资/内容/人物视角污染。

配置备份：

```text
/root/.openclaw/merge-backups/skills-upload-20260426_014048
/root/.openclaw/merge-backups/skills-config-20260426_014117
/root/.openclaw/merge-backups/main-identity-fix-20260426_014206
```

补充修复：

- 上传 skill 后发现 `main` 的 workspace `IDENTITY.md` 覆盖了 config 身份，显示为“虾哥 / 不睡觉的虾哥”。
- 已将 `/root/.openclaw/workspace/IDENTITY.md` 修正为“大头虾”。

后续注意：

- 如果 OpenClaw 升级后 skill 不触发，先检查 `/root/.openclaw/openclaw.json` 中 `skills.load.extraDirs` 是否仍包含 `/root/.openclaw/skills/qclaw-legacy`。
- 如果某个 agent 输出风格串味，优先检查该 agent 的 `skills` 列表。
- 金融类 `pre-main-wave-scanner` 目前只分给 `main`，不直接分给业务 agent。

## 四虾军团总控规则落地 - 2026-04-26 01:47

用户提供旧“东海龙王体系”规则后，已重写为当前“四虾军团总控规则”。

旧名映射：

| 旧体系 | 新体系 | 核心定位 |
|---|---|---|
| 东海龙王 | 大头虾 | 总管、裁判、记分员、财政官、最终裁决 |
| 北海龙王 | 项目虾 | 结构拆解、方案骨架、步骤规划、优先级 |
| 南海龙王 | 创意虾 | 成稿优化、表达增强、交付包装、视觉方案 |
| 西海龙王 | 排班虾 | 规则检查、漏洞审查、反方质检、风险控制 |

本机文档：

```text
E:\临时项目\four-shrimp-command-rules.md
```

云主机维护文档：

```text
/root/.openclaw/maintenance/four-shrimp-command-rules.md
```

四个 workspace 内均已分发：

```text
/root/.openclaw/workspace/FOUR_SHRIMP_COMMAND_RULES.md
/root/.openclaw/workspace-schedule/FOUR_SHRIMP_COMMAND_RULES.md
/root/.openclaw/workspace-project/FOUR_SHRIMP_COMMAND_RULES.md
/root/.openclaw/workspace-creative/FOUR_SHRIMP_COMMAND_RULES.md
```

各 workspace 的 `AGENTS.md` 均已追加 `four-shrimp-command-rules` 挂载段落。

初始积分榜：

```text
/root/.openclaw/workspace/state/four-shrimp-scoreboard.json
```

初始值：

- 项目虾：60 虾币，B 级
- 创意虾：60 虾币，B 级
- 排班虾：60 虾币，B 级
- 大头虾不参与排名，只负责裁决和维护秩序

备份位置：

```text
/root/.openclaw/merge-backups/four-shrimp-rules-20260426_014646
```

## 默认 Bot 群聊免 @ 接话 - 2026-04-26 21:57

需求：用户希望群组聊天时，不睡觉的虾哥可以直接接话，不需要每次 @。

修改范围：只改 Discord default account，不改三个专职 bot。

配置结果：

- `default / 不睡觉的虾哥`：`requireMention=false`
- `schedule / 排班虾 行政虾`：`requireMention=true`
- `project / 项目虾-项目负责`：`requireMention=true`
- `creative / 创意虾-内容`：`requireMention=true`

目的：

- 不睡觉的虾哥作为老板入口，可以在群里直接接话。
- 三个专职 bot 仍需 @ 才响应，避免四个 bot 同时乱回。

备份位置：

```text
/root/.openclaw/merge-backups/default-bot-no-mention-20260426_215700
```

修改后已重启：

```bash
systemctl --user restart openclaw-gateway
```

## 默认 Bot 免 @ 二次修复 - 2026-04-26 22:50

现象：

- `default / 不睡觉的虾哥` 配置为 `requireMention=false` 后，群里普通消息仍不回复。
- @ 它时可以回复。

原因：

- 之前为避免三个专职 bot 因 Discord `4014 missing privileged gateway intents` 断开，移除了 Discord provider 对 `MessageContent` intent 的全局硬请求。
- 这让 `default` 也无法读取未 @ 的普通群消息正文，所以免 @ 配置虽然生效，实际没有内容可处理。

修复：

- Patch `/usr/lib/node_modules/openclaw/dist/extensions/discord/provider-Bc1Lm79N.js`。
- `MessageContent` intent 只对 `accountId === "default"` 请求。
- `schedule/project/creative` 不请求 `MessageContent`，继续避免 4014。
- 配置恢复为：
  - default: `requireMention=false`
  - schedule/project/creative: `requireMention=true`

备份位置：

```text
/root/.openclaw/merge-backups/default-message-content-patch-20260426_225030
```

如果未来升级 OpenClaw 覆盖 provider 文件，需要重新检查此补丁。

## Feishu WebSocket Main 入口预配置 - 2026-04-26 23:35

目标：先接入一个 Feishu 入口绑定 `main / 大头虾`，优先使用 WebSocket 长连接，不开放 `18789` 公网端口。

已完成：

- 备份：`/root/.openclaw/merge-backups/feishu-websocket-main-20260426_233024`
- 新增 `channels.feishu` 配置：
  - `enabled=true`
  - `connectionMode=websocket`
  - `domain=feishu`
  - `dmPolicy=pairing`
  - `groupPolicy=allowlist`
  - `requireMention=true`
  - `appId=${FEISHU_APP_ID}`
  - `appSecret=${FEISHU_APP_SECRET}`
- 新增绑定：`feishu/default -> main / 大头虾`
- 新增 systemd user drop-in：`/root/.config/systemd/user/openclaw-gateway.service.d/20-feishu-env.conf`
- 新增 env 文件：`/root/.openclaw/feishu.env`，权限 `600`
- 新增本地交互填密钥脚本：`/root/.openclaw/maintenance/set-feishu-env.sh`，权限 `700`
- 已执行 `openclaw config validate`，配置有效。

当前状态：

- Feishu App ID / App Secret 尚未写入，因此通道会提示缺少 `FEISHU_APP_ID` 和 `FEISHU_APP_SECRET`。
- Discord 四 bot 未受影响，`openclaw channels status --probe` 仍显示四个 Discord account connected / works。
- 18789 未开放公网；Feishu 预配置使用 WebSocket 长连接，不需要公网 webhook URL。

下一步：

1. 在飞书开放平台创建企业自建应用，启用 Bot 能力。
2. 权限和事件订阅按 OpenClaw Feishu 文档配置：事件订阅选择“使用长连接接收事件 / WebSocket”，至少添加 `im.message.receive_v1`。
3. 在服务器执行：

```bash
/root/.openclaw/maintenance/set-feishu-env.sh
```

脚本会提示输入 App ID 和 App Secret，写入 `/root/.openclaw/feishu.env` 后重启 `openclaw-gateway`。不要在聊天或日志中输出 App Secret。

验证命令：

```bash
systemctl --user status openclaw-gateway --no-pager -l
openclaw channels status --probe
openclaw pairing list feishu
```

注意：直接在 SSH shell 运行 `openclaw channels status --probe` 时，如果 shell 未加载 `/root/.openclaw/feishu.env`，CLI 侧可能仍提示 env 缺失；systemd service 会通过 drop-in 加载该 env 文件。

## Feishu Main 入口凭证修正并连通 - 2026-04-26 23:50

处理结果：

- 旧 `/root/.openclaw/feishu.env` 已备份到：`/root/.openclaw/merge-backups/feishu-env-refill-20260426_234859`
- 重新输入 Feishu App ID / App Secret 后，飞书 tenant token 检查返回 `code=0`。
- `openclaw channels status --probe` 显示：`Feishu default: enabled, configured, running, works`。
- OpenClaw 日志显示 Feishu bot `open_id` 已解析，WebSocket client 已启动。
- Discord 四个 account 仍显示 connected / works。

注意：

- 不要在日志或聊天中输出 `/root/.openclaw/feishu.env` 内容。
- 直接运行 `openclaw channels logs --channel feishu` 的 shell 如果未 source `/root/.openclaw/feishu.env`，CLI 可能仍显示 env 缺失警告；Gateway service 自身已通过 systemd drop-in 加载 env。
- 当前 Feishu 只绑定 `default -> main / 大头虾`，暂未做四 Bot 分流。

## Feishu 第二入口：排班虾接入 - 2026-04-26 23:55

目标：在已有 `feishu/default -> main / 大头虾` 基础上，新增第二个 Feishu Bot 入口绑定 `schedule / 排班虾`。

已完成：

- 备份：`/root/.openclaw/merge-backups/feishu-schedule-account-20260426_235225`
- 新增 Feishu account：`schedule`，显示名 `排班虾`
- 新增 env 变量：
  - `FEISHU_APP_ID_SCHEDULE`
  - `FEISHU_APP_SECRET_SCHEDULE`
- 新增安全输入脚本：`/root/.openclaw/maintenance/set-feishu-env-schedule.sh`
- 新增绑定：`feishu/schedule -> schedule / 排班虾`
- 重新输入排班虾 Feishu App ID / App Secret 后，飞书 tenant token 检查返回 `code=0`。
- `openclaw channels status --probe` 显示：
  - `Feishu default: enabled, configured, running, works`
  - `Feishu schedule (排班虾): enabled, configured, running, works`
- OpenClaw 日志显示 `feishu[schedule]` bot `open_id` 已解析，WebSocket client 已启动。

当前 Feishu 绑定：

| Feishu Account | Agent |
|---|---|
| `default` | `main / 大头虾` |
| `schedule` | `schedule / 排班虾` |

注意：

- 当前仍不开放 `18789` 公网端口。
- 不要输出 `/root/.openclaw/feishu.env` 内容。
- 后续继续接 `project / 项目虾` 和 `creative / 创意虾` 时，沿用同样模式：新增 account、env 变量、绑定、输入脚本、验证 token 和 `channels status --probe`。

## Feishu 四 Bot 分流完成 - 2026-04-26 23:59

目标：在 Feishu 上完成四个 Bot / 四个 account 分流，分别绑定四个 OpenClaw agent。

新增阶段备份：

```text
/root/.openclaw/merge-backups/feishu-project-creative-accounts-20260426_235535
```

最终 Feishu 绑定：

| Feishu Account | 显示名 | Agent |
|---|---|---|
| `default` | 大头虾 | `main` |
| `schedule` | 排班虾 | `schedule` |
| `project` | 项目虾 | `project` |
| `creative` | 创意虾 | `creative` |

新增 env 变量：

```text
FEISHU_APP_ID_PROJECT
FEISHU_APP_SECRET_PROJECT
FEISHU_APP_ID_CREATIVE
FEISHU_APP_SECRET_CREATIVE
```

新增输入脚本：

```text
/root/.openclaw/maintenance/set-feishu-env-project-creative.sh
```

验证结果：

- 四组 Feishu App ID / App Secret 的 tenant token 检查均返回 `code=0`。
- `openclaw channels status --probe` 显示：
  - `Feishu default: enabled, configured, running, works`
  - `Feishu schedule (排班虾): enabled, configured, running, works`
  - `Feishu project (项目虾): enabled, configured, running, works`
  - `Feishu creative (创意虾): enabled, configured, running, works`
- OpenClaw 日志显示四个 Feishu account 均已解析 bot `open_id`，并启动 WebSocket client。
- `/root/.openclaw/feishu.env` 权限保持 `600`。
- 仍未开放 `18789` 公网端口。

当前同时保留 Discord 四 Bot 和 Feishu 四 Bot 分流。Discord 状态字段偶尔在 Gateway 刚重启后显示 disconnected，但 probe 仍显示 works；人工测试以 @ 对应 Bot 为准。

## Discord / Feishu 隐私隔离：公司专用 Agent 拆分 - 2026-04-27 00:08

背景：用户希望 Discord 作为个人入口，Feishu 作为公司入口，避免个人隐私数据、会话记忆和工作区上下文混入公司场景。

处理原则：

- 不删除原 Discord 四虾。
- 不复制旧个人会话到公司侧。
- Feishu 改绑定到一套新的 `corp-*` agent 和独立 workspace。
- 公司 workspace 只写入公司用途身份、职责和隐私边界说明，不继承个人 `USER.md` 内容。
- 仍使用 WebSocket 模式，不开放 `18789` 公网端口。

备份位置：

```text
/root/.openclaw/merge-backups/feishu-corp-agent-split-20260427_000527
```

新增公司专用 agent：

| Agent ID | 显示名 | Workspace | 用途 |
|---|---|---|---|
| `corp-main` | 公司大头虾 | `/root/.openclaw/workspace-corp-main` | 公司飞书总控入口 |
| `corp-schedule` | 公司排班虾 | `/root/.openclaw/workspace-corp-schedule` | 公司行政、日程、排班 |
| `corp-project` | 公司项目虾 | `/root/.openclaw/workspace-corp-project` | 公司项目管理 |
| `corp-creative` | 公司创意虾 | `/root/.openclaw/workspace-corp-creative` | 公司创意与内容 |

最终路由：

| Channel | Account | Agent |
|---|---|---|
| Discord | `default` | `main` |
| Discord | `schedule` | `schedule` |
| Discord | `project` | `project` |
| Discord | `creative` | `creative` |
| Feishu | `default` | `corp-main` |
| Feishu | `schedule` | `corp-schedule` |
| Feishu | `project` | `corp-project` |
| Feishu | `creative` | `corp-creative` |

验证结果：

- `openclaw agents list --bindings` 显示 Discord 和 Feishu 已完全拆分。
- `openclaw channels status --probe` 显示四个 Feishu account 均 `works`。
- Discord 四个 account probe 仍 `works`；Gateway 刚重启后 status 字段可能短暂显示 disconnected，但 probe 通过。

后续注意：

- 公司飞书侧测试时应看到身份为“公司大头虾 / 公司排班虾 / 公司项目虾 / 公司创意虾”。
- 不要把个人侧 workspace 文件复制到 `workspace-corp-*`。
- 不要输出 `/root/.openclaw/feishu.env` 或 `/root/.openclaw/discord.env` 内容。

## Feishu 公司侧业务命名与规则套用 - 2026-04-27 00:14

需求：Feishu 作为公司入口，四个 Bot 名称按业务场景设置；规则先套用原 Discord 四虾规则，但继续保持公司/个人数据隔离。

备份位置：

```text
/root/.openclaw/merge-backups/feishu-business-names-rules-20260427_001135
```

映射结果：

| Feishu Account | 公司 Agent | 公司显示名 | 规则来源 |
|---|---|---|---|
| `default` | `corp-main` | 总督 | 原 `main / 大头虾` |
| `schedule` | `corp-schedule` | 排班虾 | 原 `schedule / 排班虾` |
| `project` | `corp-project` | 淘宝/拼多多电商运营 | 原 `project / 项目虾` |
| `creative` | `corp-creative` | 电商客服话术师 | 原 `creative / 创意虾` |

处理内容：

- 更新 `corp-*` 四个 agent 的 config identity。
- 更新 Feishu account 显示名：`schedule/project/creative`。
- 公司 workspace 套用对应 Discord agent 的规则文件：`AGENTS.md`、`SOUL.md`、`TOOLS.md`、`HEARTBEAT.md`、`FOUR_SHRIMP_COMMAND_RULES.md` 及可用的旧 QClaw workstyle 文件。
- 未复制个人侧会话文件。
- 未复制个人侧 `USER.md`，公司侧保留独立 `USER.md`。
- 每个公司 workspace 的 `IDENTITY.md` 已写入公司飞书专用身份和隐私边界。

验证结果：

- `openclaw config validate` 通过。
- `openclaw agents list --bindings` 显示：
  - Feishu default -> `corp-main / 总督`
  - Feishu schedule -> `corp-schedule / 排班虾`
  - Feishu project -> `corp-project / 淘宝/拼多多电商运营`
  - Feishu creative -> `corp-creative / 电商客服话术师`
- `openclaw channels status --probe` 显示四个 Feishu account 均 `works`。
- Discord 仍保持原个人四虾路由。

## 2026-04-26 安全加固：SSH 密钥登录 + UFW

目标：适合经常出差的访问方式，不做固定公网 IP 白名单；保留公网 SSH 入口，但禁止密码登录，只允许 SSH key 登录。OpenClaw 控制台继续仅通过 SSH 隧道访问，不开放 `18789` 公网端口。

备份：

- 远端备份目录：`/root/.openclaw/merge-backups/security-hardening-20260426_233536`
- 已备份：`/etc/ssh/sshd_config`、`/etc/ssh/sshd_config.d/`、UFW/iptables 加固前状态。

变更：

- `/etc/ssh/sshd_config.d/99-root-login.conf`
  - `PermitRootLogin prohibit-password`
  - `PasswordAuthentication no`
  - `KbdInteractiveAuthentication no`
  - `ChallengeResponseAuthentication no`
- `/etc/ssh/sshd_config.d/99-openclaw-pubkey.conf`
  - `PubkeyAuthentication yes`
  - `AuthorizedKeysFile .ssh/authorized_keys .ssh/authorized_keys2`
  - `GatewayPorts no`
  - `AllowTcpForwarding yes`
  - `X11Forwarding no`
- UFW：
  - 默认拒绝入站
  - 默认允许出站
  - 允许 `22/tcp`
  - 拒绝 `5353/udp`

验证结果：

- SSH key 登录成功：`ssh -i %USERPROFILE%\.ssh\openclaw_hk root@38.76.193.161`
- 密码登录被拒绝：`Permission denied (publickey)`
- SSH 有效配置：
  - `permitrootlogin without-password`
  - `passwordauthentication no`
  - `kbdinteractiveauthentication no`
  - `pubkeyauthentication yes`
  - `gatewayports no`
  - `allowtcpforwarding yes`
  - `x11forwarding no`
- UFW 状态：`active`
- 公网 TCP 复测：
  - `22` open
  - `53/80/443/5353/18789/18791/28789/3000/8080/8443` closed
- OpenClaw Gateway：`active`
- OpenClaw 监听：
  - `127.0.0.1:18789`
  - `127.0.0.1:18791`
  - 未暴露公网
- Discord 四 bot：`default / schedule / project / creative` 均 `connected` / `works`

后续注意：

- 出差换网络不影响登录，因为没有做公网 IP 白名单。
- 新电脑要登录服务器，必须先把对应 SSH 公钥加入 `/root/.ssh/authorized_keys`。
- 不要删除本机私钥：`%USERPROFILE%\.ssh\openclaw_hk`。
- 如果需要临时恢复密码登录，先通过已有 SSH key 登录，再修改 `/etc/ssh/sshd_config.d/99-root-login.conf` 并执行 `sshd -t && systemctl reload ssh`。
