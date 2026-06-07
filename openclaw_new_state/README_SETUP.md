## OpenClaw New State

This directory is a clean local state seed for a fresh OpenClaw setup.

What is here:
- `openclaw.starter.json`: starter config template
- `workspace/`: clean workspace root
- `agents/main/agent/`: main agent local files
- `agents/main/sessions/`: empty session store location
- `skills/`: local skills drop-in directory
- `logs/`: local runtime logs
- `memory/`: local private memory

What is intentionally not imported from old QClaw:
- old `sessions/`
- old `logs/`
- old caches and databases
- old auth files
- old browser/user-data state

Recommended next steps:
1. Edit `openclaw.starter.json` and replace placeholder env vars and token.
2. Point your new OpenClaw install to this state directory instead of `D:\.qclaw`.
3. Only after the new instance starts cleanly, selectively copy in private docs or skills.
4. Do not copy old `sessions.json`, `jsonl`, or cache files into this directory.

Backup archive copied into current project:
- `E:\临时项目\qclaw_backup_20260421_203526.zip`

Template repo copied into current project:
- `E:\临时项目\openclaw_new`
