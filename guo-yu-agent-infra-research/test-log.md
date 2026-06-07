# Guo Yu Agent Infra Test Log

Timestamp: 2026-05-05 15:15:22 +08:00

## Conclusion

5 projects were downloaded, but none should be marked as fully tested.

Current status is only a local setup/build/smoke-test attempt. Because each project had incomplete verification, Windows-specific failures, missing external dependencies, or only documentation-level checks, all 5 projects remain "not tested" for acceptance purposes.

## Project Status

| Project | Repository | Test status | Notes |
|---|---|---|---|
| 1 | `chekusu/wanman` | Not tested | Build and typecheck passed under local Node 22 after manual native dependency handling, but full test suite had Windows path, symlink permission, `/bin/bash`, and timeout failures. |
| 2 | `chekusu/mails` | Not tested | Build, typecheck, and CLI help worked. Full tests failed due to shared config state and SQLite file locking on Windows. |
| 3 | `chekusu/shipkey` | Not tested | CLI build worked after building `packages/core`; test suite still had 1 failing scanner test. |
| 4 | `nkmc-ai/sdk` | Not tested | Build worked; tests had Windows permission/path failures, and root lint failed due to monorepo `tsconfig` rootDir mismatch. |
| 5 | `guo-yu/skills` | Not tested | Repository cloned and 5 skills were identified, but no functional test suite was run. |

## Working Directory

`guo-yu-agent-infra-research` under the current workspace root.
