# ccman 调用方式

## 当前配置

- 工具：`ccman`
- Codex 服务商记录名：`大师兄1`
- Base URL：`https://code.newcli.com/codex/v1`
- 模型：`gpt-5.5`
- 配置文件：`C:\Users\麒麟\.ccman\codex.json`
- API Key：已从本机 Codex 配置导入，不在本文档中记录

## 常用命令

打开 ccman 主菜单：

```powershell
ccman
```

查看 Codex 服务商列表：

```powershell
ccman cx list
```

查看当前 Codex 服务商：

```powershell
ccman cx current
```

切换到“大师兄1”：

```powershell
ccman cx use "大师兄1"
```

添加新的 Codex API 服务商：

```powershell
ccman cx add
```

编辑已有服务商：

```powershell
ccman cx edit "大师兄1"
```

克隆已有服务商：

```powershell
ccman cx clone "大师兄1"
```

删除服务商：

```powershell
ccman cx remove "大师兄1"
```

## 命令入口

当前机器上 `ccman` 的可执行入口：

```text
C:\Users\麒麟\.local\bin\ccman.cmd
```

它会转发到 npm 全局安装目录：

```text
%APPDATA%\npm\ccman.cmd
```

如果某个旧终端识别不了 `ccman`，重新打开 PowerShell 后再执行：

```powershell
ccman --version
```

正常应返回：

```text
3.3.25
```

## 验证结果

当前已验证：

```text
Codex 服务商 (1 个)
● 大师兄1 [当前]
  https://code.newcli.com/codex/v1
```
