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

## 2026-04-27 飞书四 Bot 公司侧隔离与连通复查

目标：飞书作为公司侧入口，Discord 保持个人侧入口；两边 agent/workspace/session 隔离，避免混用个人数据。

当前路由：

- Discord default/schedule/project/creative -> 个人侧 `main/schedule/project/creative`
- Feishu default -> `corp-main / 总督`
- Feishu schedule -> `corp-schedule / 排班虾`
- Feishu project -> `corp-project / 淘宝/拼多多电商运营`
- Feishu creative -> `corp-creative / 电商客服话术师`

处理内容：

- 飞书继续使用 WebSocket 模式，不开放 `18789` 公网端口。
- 飞书群 `oc_cb2f33067da97756a91c5ddc24d4758e` 已加入 allowlist。
- 关闭飞书 sender name resolve，规避缺少用户通讯录权限导致的 `41050/no user authority` 噪声。
- 修正 `corp-project` 的 `IDENTITY.md`，显示身份从“虾虾”改为“淘宝/拼多多电商运营”。

备份：

- `/root/.openclaw/merge-backups/feishu-group-allowlist-20260427_002834`
- `/root/.openclaw/merge-backups/feishu-disable-sender-name-resolve-20260427_004428`
- `/root/.openclaw/merge-backups/corp-project-identity-20260427_004633`

验证结果：

- `openclaw config validate` 通过。
- `openclaw channels status --probe` 显示四个 Feishu account 均 `works`。
- `openclaw agents list --bindings` 显示 `corp-project` 身份为 `淘宝/拼多多电商运营 (IDENTITY.md)`。
- OpenClaw Gateway：`active`。

使用建议：

- 群里建议一次只 @ 一个飞书 bot，例如 `@总督 你是谁`。
- 一条消息同时 @ 四个 bot 会触发 Feishu provider 的 forward/quoted-message 逻辑，多个 bot 可能互相引用，回复会变吵。

## 2026-04-27 飞书回复体感提速调优

现象：飞书回复体感比 Discord 慢。排查结果：服务器资源正常，主要慢点来自飞书企业消息链路、WebSocket/API 处理、以及一条消息同时 @ 多个 bot 后触发多个公司 agent 并发与互相引用。

处理内容：

- 关闭 Feishu `typingIndicator`，减少飞书侧额外 API 动作。
- 给四个公司飞书 workspace 增加 `FEISHU_GROUP_RULES.md`：
  - 只回答直接 @ 自己的问题。
  - 不主动 @、点名或转发给其他 bot。
  - 多 bot 同时被 @ 时，只处理自己职责范围内部分，短回复结束。
- 在四个公司 workspace 的 `AGENTS.md` 追加飞书群聊规则引用。

备份：

- `/root/.openclaw/merge-backups/feishu-speed-tuning-20260427_005226`

验证结果：

- `openclaw config validate` 通过。
- OpenClaw Gateway 重启后为 `active`。
- 四个 Feishu account `status --probe` 均为 `works`。
- 重启后飞书群内未直接 @ bot 的消息被正确忽略，避免无效触发。

后续测试建议：

- 用单独 @ 测速：`@总督 你是谁`、`@排班虾 你是谁`、`@淘宝/拼多多电商运营 你是谁`、`@电商客服话术师 你是谁`。
- 不建议一条消息同时 @ 四个 bot，会产生并发与引用链，体感明显变慢。

## 2026-04-27 飞书 DM 私聊配对

现象：飞书私聊提示 `OpenClaw: access not configured`，这是 `dmPolicy=pairing` 的预期行为，首次私聊需管理员批准对应 pairing code。

已批准的 Feishu DM sender：

- default / 总督：`ou_13456a7c4a34caf30532bcc615fb2ab2`
- schedule / 排班虾：`ou_babd601b4a9c06306cd3169ce1ba75a8`
- project / 淘宝/拼多多电商运营：`ou_8a813f69812432744b1416f68dcb4db1`
- creative / 电商客服话术师：`ou_f0f01d1c8b514bd4093e718f4a8c529d`

备份：

- `/root/.openclaw/merge-backups/feishu-dm-pairing-20260427_005942`
- `/root/.openclaw/merge-backups/feishu-dm-pairing-more-20260427_010334`

验证结果：

- 四个 Feishu account `status --probe` 均为 `works`。
- default 私聊已进入 `corp-main` agent 并返回。
- schedule/project/creative 的截图消息发生在批准前；批准后需重新发一条新私聊消息才会进入对应 agent。

## 2026-04-27 飞书公司 Agent 初始化规则加固

现象：飞书私聊/群聊中，部分公司 Agent 回复像未初始化，不明确自己职责。

原因判断：

- `corp-main` workspace 仍残留 `BOOTSTRAP.md`，可能触发“首次启动/出生证明”语义。
- 四个公司 Agent 虽已有 `IDENTITY.md` 和 `AGENTS.md`，但“遇到你是谁/你能做什么时必须如何回答”的规则不够靠前、不够硬。

处理内容：

- 备份四个公司 workspace 的身份/规则文件。
- 禁用 `corp-main` 残留 `BOOTSTRAP.md`。
- 新增并嵌入 `OPENCLAW_FEISHU_INIT.md` 初始化规则。
- 在四个公司 workspace 的 `AGENTS.md` 文件最开头写入固定身份、职责、中文回复、私聊规则和身份类问题回答模板。
- 规则明确禁止：说自己刚上线、未初始化、没有身份、需要查看 BOOTSTRAP、泛化成普通助手、引用个人 Discord 数据。

备份：

- `/root/.openclaw/merge-backups/feishu-agent-init-rules-20260427_175816`
- `/root/.openclaw/merge-backups/feishu-agent-init-embed-20260427_180014`

验证结果：

- `openclaw config validate` 通过。
- OpenClaw Gateway 重启后为 `active`。
- 四个 Feishu account `status --probe` 均为 `works`。

测试建议：

- 分别在四个飞书私聊里发送：`你是谁？你能做什么？`
- 预期应分别自称：总督、排班虾、淘宝/拼多多电商运营、电商客服话术师。

## 2026-04-27 飞书公司四虾内部协作审核

目标：飞书公司侧四个 Agent 能围绕同一任务协作、互审、赛马；公司侧保持与 Discord 个人侧隔离。

处理内容：

- 新增四个公司 workspace 的 `CORP_AGENT_COLLAB.md`。
- 在四个公司 workspace 的 `AGENTS.md` 顶部加入“四虾协作优先规则”。
- 配置 `agents.defaults.subagents.allowAgents` 只允许：
  - `corp-main`
  - `corp-schedule`
  - `corp-project`
  - `corp-creative`
- 开启顶层 `tools.agentToAgent`，allowlist 同样只包含 `corp-*`。
- 设置 `tools.sessions.visibility=all`，允许协作链路读取必要的公司子会话结果。
- 设置 `session.agentToAgent.maxPingPongTurns=2`，限制 agent 间循环。
- 设置子代理运行约束：`runTimeoutSeconds=75`、`announceTimeoutMs=15000`、`archiveAfterMinutes=30`、`requireAgentId=true`。
- 协作协议要求：总督负责调度和最终裁决，项目/创意/排班分别做结构、表达、风险审核；子代理不得外发飞书消息。

备份：

- `/root/.openclaw/merge-backups/feishu-corp-a2a-collab-20260427_180819`
- OpenClaw 自动配置备份：`/root/.openclaw/openclaw.json.bak`

验证结果：

- `openclaw config validate` 通过。
- OpenClaw Gateway 重启后为 `active`。
- 四个 Feishu account `status --probe` 均为 `works`。
- 内部测试中 `corp-main` 实际调用了 `sessions_spawn`，并生成 `corp-project/corp-creative/corp-schedule` 子代理会话，证明不是纯提示词模拟。

已知注意点：

- 当前 OpenClaw 的子代理完成公告可能尝试走原会话通道；跨飞书 App 场景曾出现一次 `open_id cross app` 投递错误。已通过协议限制子代理不主动外发，并降低公告超时。实际使用时建议只 @ 总督，由总督内部调度，不要一条消息同时 @ 四个 bot。

使用方式：

- 在飞书里对总督说：`@总督 四虾协作审核：……`
- 总督应内部调用 `corp-project`、`corp-creative`、`corp-schedule`，最后只输出一条汇总结论。

## 2026-04-27 安装公司侧 Hermes / 爱马仕 Agent

目标：新增 1 个公司侧内部协作 Agent `corp-hermes / 爱马仕`，与总督和其他公司 Agent 打通；不绑定 Discord，不新增飞书入口，不开放公网端口。

处理内容：

- 修改前备份到 `/root/.openclaw/merge-backups/hermes-agent-20260427_222418`。
- 新增 `corp-hermes`，workspace 为 `/root/.openclaw/workspace-corp-hermes`，agent dir 为 `/root/.openclaw/agents/corp-hermes/agent`。
- 设置身份为 `🪽 爱马仕`。
- 新增 Hermes 的 `IDENTITY.md`、`AGENTS.md`、`SOUL.md`、`USER.md`、`OPENCLAW_FEISHU_INIT.md`、`CORP_AGENT_COLLAB.md`。
- 将 `corp-hermes` 加入 `agents.defaults.subagents.allowAgents` 和 `tools.agentToAgent.allow`。
- 更新公司侧 5 个 workspace 的协作规则，允许 `corp-main`、`corp-schedule`、`corp-project`、`corp-creative`、`corp-hermes` 内部协作。
- 移除 Hermes 自动生成的 `BOOTSTRAP.md`，已转存到备份目录，避免身份初始化混乱。
- 补充子代理等待规则：调用 `sessions_spawn` 后必须等待或读取结果，不能只回复“已发起调用”。

验证结果：

- `openclaw config validate` 通过。
- OpenClaw Gateway 重启后为 `active`。
- `openclaw status` 显示 9 个 agent，且 `no bootstrap files`。
- 飞书 4 个 account 探测均为 `works`。
- `corp-hermes` 直接身份测试通过，自称爱马仕并说明职责。
- `corp-main` 已产生 `agent:corp-hermes:subagent` 会话，总督侧测试返回“爱马仕已接通”并给出审核要点。

使用方式：

- 飞书里仍优先找总督：`@总督 让爱马仕审核一下这个竞品/文案/礼盒方案：……`
- Hermes 当前是内部协作 Agent，没有单独 Feishu Bot 入口。

## 2026-04-28 公司侧项目隔离、爱马仕协作权限与共享资料库

目标：支持 B/C/D Agent 按项目调用爱马仕协作，同时避免不同同事、不同项目的上下文互相污染；只有审核通过的资料进入全员共享资料库。

处理内容：

- 修改前备份到 `/root/.openclaw/merge-backups/project-isolation-hermes-kb-20260428_110421`。
- 创建公司共享资料库 `/root/.openclaw/company-knowledge/`：
  - `approved/`：已审核通过，所有公司 Agent 必须遵循。
  - `pending-review/`：待审核项目沉淀、会议纪要、规则提案。
  - `rejected/`：未通过或废弃内容。
  - `archive/`：历史归档。
- 在 `corp-main`、`corp-project`、`corp-creative`、`corp-schedule`、`corp-hermes` 五个 workspace 新增 `PROJECT_ISOLATION_RULES.md`。
- 在五个公司 Agent 的 `AGENTS.md` 顶部加入“项目隔离优先规则”。
- 规则明确：B/C/D 可以调用 `corp-hermes`，但必须按当前项目任务包协作，不得读取其他项目、其他同事私聊、总督私聊或 Discord 个人侧资料。
- 规则明确：项目产出默认留在项目库；只有明确要求沉淀并经总督审核后，才可从 `pending-review/` 进入 `approved/`。

验证结果：

- `openclaw config validate` 通过。
- OpenClaw Gateway 仍为 `active`。
- 当前配置层面 `corp-main`、`corp-project`、`corp-creative`、`corp-schedule`、`corp-hermes` 均在 `agentToAgent.allow` 和 `subagents.allowAgents` 中。

注意：

- 当前 OpenClaw 配置仍显示 `tools.sessions.visibility = all`。本次先用规则层约束项目任务包协作；后续如确认 OpenClaw 支持更细粒度 session visibility，再收紧为配置层强隔离。

## 2026-04-28 收紧公司侧 session 可见性

目标：将公司侧协作从“全局 session 可见”收紧为“当前项目树可见”，降低多同事、多项目上下文污染风险。

处理内容：

- 修改前备份到 `/root/.openclaw/merge-backups/session-visibility-tree-20260428_111017`。
- 将 `tools.sessions.visibility` 从 `all` 改为 `tree`。
- 保留 `corp-main`、`corp-project`、`corp-creative`、`corp-schedule`、`corp-hermes` 的 `agentToAgent.allow` 和 `subagents.allowAgents`。

收紧后的含义：

- 普通 Agent 只能访问当前 session 和自己 spawn 出来的子代理 session。
- B/C/D 调用爱马仕时，只在当前项目协作树内共享上下文。
- 不再默认读取其他同事、其他项目、总督私聊或个人 Discord 侧 session。

验证结果：

- `openclaw config validate` 通过。
- Gateway 重启后为 `active`。
- `openclaw config get tools.sessions.visibility` 返回 `tree`。
- 内部回归测试显示 `corp-main` 可在项目树内调用 `corp-hermes`，无权限阻断。
- 飞书 4 个账号与 Discord 4 个账号 `channels status --probe` 均为 `works`。

## 2026-04-28 接入微信 openclaw-weixin

目标：将微信接入 OpenClaw，并按当前公司端策略绑定到 `corp-main / 总督`。

处理内容：

- 接入前备份：
  - `/root/.openclaw/merge-backups/weixin-install-20260428_111535`
  - `/root/.openclaw/merge-backups/weixin-bind-corp-main-20260428_112440`
  - `/root/.openclaw/merge-backups/weixin-plugin-allow-tighten-20260428_112605`
- 通过 `@tencent-weixin/openclaw-weixin-cli` 安装微信插件。
- 扫码登录成功，插件安装路径为 `/root/.openclaw/extensions/openclaw-weixin`。
- 显式启用插件 `plugins.entries.openclaw-weixin.enabled=true`。
- 设置 `session.dmScope=per-account-channel-peer`，微信私聊按账号+渠道+对端隔离。
- 绑定微信账号到 `corp-main / 总督`：
  - `corp-main <- openclaw-weixin accountId=bf573e3d1f00-im-bot`
- 将 `tools.sessions.visibility` 保持为 `tree`。

验证结果：

- OpenClaw Gateway 为 `active`。
- `openclaw config validate` 通过。
- `openclaw agents bindings` 显示微信已绑定到 `corp-main`。
- `openclaw channels status --probe` 显示：
  - Discord 4 个账号 `works`
  - Feishu 4 个账号 `works`
  - `openclaw-weixin bf573e3d1f00-im-bot: enabled, configured, running`
- `openclaw security audit` 当前为 `0 critical`。

注意：

- 安全审计仍有 warnings：多用户共用 gateway、插件工具在宽松工具策略下可达、插件安装记录是 `latest`、Feishu doc create 权限提醒等。后续多人正式使用前建议继续收紧工具权限和插件版本 pin。
- 微信当前进入公司端总督，不是个人侧 `main / 大头虾`。

测试建议：

- 在微信里给该微信入口发：`你是谁？`
- 预期回复应为 `总督`，而不是 `大头虾`。

## 2026-04-28 同步总督长期记忆

目标：把微信接入、公司侧项目隔离、爱马仕协作权限和共享资料库规则同步给 `corp-main / 总督`，让总督在后续微信/飞书入口中稳定遵守。

处理内容：

- 修改前备份到 `/root/.openclaw/merge-backups/corp-main-memory-sync-20260428_113908`。
- 新增 `/root/.openclaw/workspace-corp-main/MEMORY.md`。
- 新增 `/root/.openclaw/workspace-corp-main/memory/2026-04-28.md`。
- 在 `/root/.openclaw/workspace-corp-main/AGENTS.md` 顶部加入“总督当前固定设定”。
- 归档旧的总督直连/微信会话以强制重新加载启动设定：
  - `/root/.openclaw/merge-backups/corp-main-session-refresh-20260428_114058`
  - `/root/.openclaw/merge-backups/corp-main-after-memory-restart-20260428_114150`
- 重启 OpenClaw Gateway，刷新 workspace 启动文件缓存。

验证结果：

- `openclaw config validate` 通过。
- Gateway 重启后为 `active`。
- 总督设定自检通过：
  - 微信入口绑定到 `corp-main / 总督`。
  - Discord default 属于个人侧 `main / 大头虾 / 不睡觉的虾哥`。
  - 公司共享资料库只有 `approved/` 是正式规则来源。

## 2026-04-28 LinkAPI 模型接入

- `corp-main`（总督）与 `corp-schedule`（排班虾）已切到 `linkapi/gpt-5.5`。
- LinkAPI key 在服务器 `/root/.openclaw/linkapi.env`，本地文档不保存密钥。
- OpenClaw 实际访问本机兼容代理：`http://127.0.0.1:18790/v1`。
- 代理服务：`openclaw-linkapi-proxy.service`。
- 代理脚本：`/root/.openclaw/linkapi-proxy.py`。
- 原因：LinkAPI 直连 Chat Completions 可用，但原始流式返回进入 OpenClaw 后 assistant content 为空；代理改为上游非流式、本地标准 SSE 流式输出。
- 验证通过：总督返回“OK，我是总督。”；排班虾返回“OK，我是 排班虾。”。

## 2026-04-28 图片解析修复

- 现象：总督收到图片后提示缺少 `sharp/libvips`，无法可靠读图。
- 根因：服务器 `/usr/lib/node_modules/openclaw/node_modules/sharp` 缺少 Linux x64 的 libvips 可选依赖，报 `libvips-cpp.so.8.17.3` 找不到。
- 修复：在服务器 OpenClaw 安装目录补装 `@img/sharp-libvips-linux-x64@1.2.4`。
- 验证：`sharp 0.34.5 / libvips 8.17.3`，PNG metadata 测试成功，`openclaw-gateway` active。
- 备份：`/root/.openclaw/merge-backups/sharp-libvips-fix-20260428_202637`。

## 2026-04-29 个人大头虾切换 LinkAPI GPT-5.5

- `main`（大头虾 / 不睡觉的虾哥）已显式设置为 `linkapi/gpt-5.5`。
- 验证通过：返回“OK，我是大头虾”，provider=`linkapi`，model=`gpt-5.5`，thinking=`off`。
- 备份：`/root/.openclaw/merge-backups/main-linkapi-gpt55-20260429_000122`。

## 2026-04-29 全部 Agent 切换 TokenLand GPT-5.5

- Provider：`tokenland`
- Base URL：`https://api.mytokenland.com/v1`
- API：`openai-completions`，端点 `/v1/chat/completions`
- 模型：`tokenland/gpt-5.5`
- API key：服务器 `/root/.openclaw/tokenland.env`，本地文档不保存密钥。
- 默认主模型：`agents.defaults.model.primary = tokenland/gpt-5.5`
- 已切换：`main`、`schedule`、`project`、`creative`、`corp-main`、`corp-schedule`、`corp-project`、`corp-creative`、`corp-hermes`
- 验证通过：大头虾和总督均返回当前模型为 `tokenland/gpt-5.5`。
- 已归档旧活跃 session，避免旧 DeepSeek/LinkAPI 上下文污染。
- 备份：`/root/.openclaw/merge-backups/all-agents-tokenland-gpt55-20260429_003635`，`/root/.openclaw/merge-backups/clear-agent-sessions-tokenland-20260429_004100`。

## 2026-04-29 TokenLand 图片输入修复

- 现象：私人微信发图给大头虾后，agent 说看不到图。
- 根因：`tokenland/gpt-5.5` 配置为 `input: [text]` 且启用了 `requiresStringContent`，多模态图片没有作为视觉输入送给模型。
- 修复：`tokenland/gpt-5.5` 改为 `input: [text, image]`，移除 `requiresStringContent`。
- 验证：OpenClaw 能读取微信入站图片并描述为中文文章截图。
- 已清理 main 私人微信旧会话，避免失败上下文污染。
- 备份：`/root/.openclaw/merge-backups/tokenland-vision-enable-20260429_005951`，`/root/.openclaw/merge-backups/main-weixin-clear-after-vision-fix-20260429_010202`。

## 2026-04-29 飞书公司 Bot 私聊免配对

- 公司内部使用，能连接到飞书 Bot 的用户视为内部人员。
- Feishu 四个公司账号 `dmPolicy` 均改为 `open`：`default`、`schedule`、`project`、`creative`。
- 群聊策略保持 `groupPolicy=allowlist` 和原 mention 控制。
- 结果：同事首次私聊不再收到英文 pairing 提示，无需人工审批。
- 备份：`/root/.openclaw/merge-backups/feishu-dm-open-all-corp-20260429_151515`。

## 2026-04-29 总督私聊权限收紧

- Feishu `default` / 总督已恢复 `dmPolicy=pairing`。
- 非总督公司 bot：`schedule`、`project`、`creative` 仍保持 `dmPolicy=open`，供同事直接私聊使用。
- 群聊策略保持 allowlist。
- 备份：`/root/.openclaw/merge-backups/feishu-governor-dm-pairing-restore-20260429_151633`。
