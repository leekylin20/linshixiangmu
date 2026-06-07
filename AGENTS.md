# Codex Local Rules

## Storage Rule: Do Not Put Programs On C:

Every new session must check this rule before installing, downloading, extracting, caching, or configuring tools.

- Do not place program bodies, portable runtimes, downloaded tool packages, SDKs, skills, model/cache data, temporary dependency folders, or generated runtime assets on `C:\`.
- Default storage root for local tools and runtime assets is `E:\临时项目\_system`.
- Project-specific dependencies should stay inside the relevant project under `E:\临时项目`, unless the user explicitly chooses another non-C drive path.
- If a tool requires a conventional C-drive entry point, keep only the smallest necessary pointer there, such as a junction or config shim, and store the real files on `E:\临时项目`.
- Before installing anything substantial, verify the target path is not on `C:\`.
- If an installer can only write program files to `C:\`, pause and ask the user before proceeding.

Current important locations:

- Codex skills entity: `E:\临时项目\_system\codex-skills`
- OpenClaw/Get笔记 config entity: `E:\临时项目\_system\openclaw-config`
- ffmpeg entity: `E:\临时项目\_system\ffmpeg`
- Local rule archive: `E:\临时项目\_system\codex-rules`
## Project Memory Rule: Prevent Amnesia And Junk Piles

This directory is an execution workspace, not the second brain.

- Persistent business knowledge, content methods, and long-term judgments belong in `E:\obsidian`.
- Local installations, experiments, test projects, launch commands, and cleanup candidates belong in `E:\临时项目\_索引`.
- After creating a new project, installing a tool, or proving a launch command, update one of:
  - `E:\临时项目\_索引\项目运行记忆.md`
  - `E:\临时项目\_索引\安装测试日志.md`
  - `E:\临时项目\_索引\清理候选.md`
- Do not delete or move existing project folders unless the user explicitly confirms.
- For any new project that may be reused, add a `PROJECT.md` based on `E:\临时项目\_索引\PROJECT模板.md`.
