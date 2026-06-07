param(
  [string]$Workspace = "E:\临时项目",
  [datetime]$Date = (Get-Date).Date,
  [string]$OutputDir = "",
  [int]$MaxItems = 40
)

$ErrorActionPreference = "Stop"

if (-not $OutputDir) {
  $OutputDir = Join-Path $Workspace "_索引\研发日报"
}

$dayStart = $Date.Date
$dayEnd = $dayStart.AddDays(1)
$dateText = $dayStart.ToString("yyyy-MM-dd")
$reportPath = Join-Path $OutputDir ("研发日报-{0}.md" -f $dateText)

function Get-RelativePath {
  param([string]$Path)
  if ($Path.StartsWith($Workspace, [System.StringComparison]::OrdinalIgnoreCase)) {
    return $Path.Substring($Workspace.Length).TrimStart("\")
  }
  return $Path
}

function Format-Size {
  param([Nullable[long]]$Bytes)
  if ($null -eq $Bytes) { return "" }
  if ($Bytes -ge 1GB) { return "{0:N2} GB" -f ($Bytes / 1GB) }
  if ($Bytes -ge 1MB) { return "{0:N2} MB" -f ($Bytes / 1MB) }
  if ($Bytes -ge 1KB) { return "{0:N2} KB" -f ($Bytes / 1KB) }
  return "$Bytes B"
}

function Get-Category {
  param([string]$Name)
  switch -Regex ($Name) {
    '^(_system|_索引|\.agents|skills|tools|venvs)$' { return "00 系统索引/运行时" }
    '(browseract|video-skills|skill-dashboard|openclaw|qclaw|ccman|飞书|_voxflow|_tmp_tong)' { return "10 工具/CLI/技能" }
    '(douyin|wechat|xhs|huobao|redbook|图明索|直播间背景生成器|sales)' { return "20 内容平台/运营" }
    '(live-room|greenscreen|prompt-workbench|female-photo|bakery|faux|denim|premium|scenic|template_visual)' { return "25 直播间视觉工作台" }
    '(AI|AiToEarn|agent|prompt|knowledge|第三大脑|awesome|guo-yu)' { return "30 AI/Prompt/Agent" }
    '(BiRefNet|VoxCPM|MoneyPrinter|cards|watermark|rice_ai|outputs|super-i)' { return "35 图像视频/多媒体" }
    '(gmgn|Kronos|Fincept|Quant|OpenStock|BTC|finance|moss|crypto)' { return "40 金融投研/回测" }
    '(ebook|file-to-md|ocr|all_md|sample_md|info|VOSR|getnotes)' { return "50 文档资料处理" }
    '(muse|toolbox|GEOFlow|客服|canvas|fastisslow)' { return "60 前端/UI/应用" }
    '^_|__pycache__|backup|\.zip$' { return "80 临时/备份/候选" }
    default { return "90 待确认" }
  }
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

$topDirs = Get-ChildItem -Directory -Force -LiteralPath $Workspace | Sort-Object Name
$topFiles = Get-ChildItem -File -Force -LiteralPath $Workspace | Sort-Object Name

$changedDirs = $topDirs |
  Where-Object { $_.LastWriteTime -ge $dayStart -and $_.LastWriteTime -lt $dayEnd } |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First $MaxItems

$changedFiles = $topFiles |
  Where-Object { $_.LastWriteTime -ge $dayStart -and $_.LastWriteTime -lt $dayEnd } |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First $MaxItems

$indexDir = Join-Path $Workspace "_索引"
$indexChanges = @()
if (Test-Path -LiteralPath $indexDir) {
  $indexChanges = Get-ChildItem -File -Force -LiteralPath $indexDir |
    Where-Object { $_.LastWriteTime -ge $dayStart -and $_.LastWriteTime -lt $dayEnd } |
    Sort-Object LastWriteTime -Descending
}

$factsPath = Join-Path $Workspace "_system\agent-memory-lite\facts\facts.jsonl"
$memoryFacts = @()
if (Test-Path -LiteralPath $factsPath) {
  $memoryFacts = Get-Content -LiteralPath $factsPath -Encoding UTF8 |
    Where-Object { $_.Trim() -and $_ -match $dateText } |
    ForEach-Object {
      try { $_ | ConvertFrom-Json } catch { $null }
    } |
    Where-Object { $null -ne $_ } |
    Select-Object -Last $MaxItems
}

$gitSummaries = @()
$gitRepos = $topDirs | Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName ".git") }
$since = $dayStart.ToString("yyyy-MM-dd 00:00:00")
$until = $dayEnd.ToString("yyyy-MM-dd 00:00:00")

foreach ($repo in $gitRepos) {
  $logs = @()
  $status = @()
  try {
    $logs = @(& git -C $repo.FullName log --since="$since" --until="$until" --oneline --max-count=8 2>$null)
    $status = @(& git -C $repo.FullName status --porcelain 2>$null)
  } catch {
    $logs = @()
    $status = @("git unavailable or failed")
  }

  if ($logs.Count -gt 0 -or $status.Count -gt 0) {
    $gitSummaries += [PSCustomObject]@{
      Name = $repo.Name
      Category = Get-Category $repo.Name
      Commits = $logs
      DirtyCount = $status.Count
    }
  }
}

$categoryCounts = $topDirs |
  Group-Object { Get-Category $_.Name } |
  Sort-Object Name |
  ForEach-Object {
    [PSCustomObject]@{
      Category = $_.Name
      Count = $_.Count
    }
  }

$activeCategories = $changedDirs |
  Group-Object { Get-Category $_.Name } |
  Sort-Object Count -Descending |
  Select-Object -First 5

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("# 研发日报 - $dateText")
$lines.Add("")
$lines.Add("生成时间：$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$lines.Add("")
$lines.Add("范围：$Workspace 顶层目录、顶层文件、顶层 git 仓库、_索引、Agent Memory Lite。")
$lines.Add("")
$lines.Add("## 总览")
$lines.Add("")
$lines.Add("| 指标 | 数量 |")
$lines.Add("|---|---:|")
$lines.Add("| 今日活跃顶层目录 | $($changedDirs.Count) |")
$lines.Add("| 今日活跃顶层文件 | $($changedFiles.Count) |")
$lines.Add("| 有提交或未提交状态的顶层 git 仓库 | $($gitSummaries.Count) |")
$lines.Add("| 今日 Agent Memory 事实记录 | $($memoryFacts.Count) |")
$lines.Add("| 今日索引文件变动 | $($indexChanges.Count) |")
$lines.Add("")

$lines.Add("## 活跃分类")
$lines.Add("")
if ($activeCategories.Count -eq 0) {
  $lines.Add("- 今日没有顶层目录活跃记录。")
} else {
  foreach ($group in $activeCategories) {
    $lines.Add("- $($group.Name)：$($group.Count) 个目录")
  }
}
$lines.Add("")

$lines.Add("## 今日活跃目录")
$lines.Add("")
if ($changedDirs.Count -eq 0) {
  $lines.Add("- 无。")
} else {
  $lines.Add("| 目录 | 分类 | 最后修改 |")
  $lines.Add("|---|---|---|")
  foreach ($dir in $changedDirs) {
    $lines.Add("| $($dir.Name) | $(Get-Category $dir.Name) | $($dir.LastWriteTime.ToString('HH:mm:ss')) |")
  }
}
$lines.Add("")

$lines.Add("## 今日活跃顶层文件")
$lines.Add("")
if ($changedFiles.Count -eq 0) {
  $lines.Add("- 无。")
} else {
  $lines.Add("| 文件 | 大小 | 最后修改 |")
  $lines.Add("|---|---:|---|")
  foreach ($file in $changedFiles) {
    $lines.Add("| $($file.Name) | $(Format-Size $file.Length) | $($file.LastWriteTime.ToString('HH:mm:ss')) |")
  }
}
$lines.Add("")

$lines.Add("## Git 仓库状态")
$lines.Add("")
if ($gitSummaries.Count -eq 0) {
  $lines.Add("- 顶层 git 仓库今日无可见提交或未提交状态。")
} else {
  foreach ($repo in $gitSummaries) {
    $lines.Add("### $($repo.Name)")
    $lines.Add("")
    $lines.Add("- 分类：$($repo.Category)")
    $lines.Add("- 未提交条目：$($repo.DirtyCount)")
    if ($repo.Commits.Count -gt 0) {
      $lines.Add("- 今日提交：")
      foreach ($commit in $repo.Commits) {
        $lines.Add("  - $commit")
      }
    } else {
      $lines.Add("- 今日提交：无")
    }
    $lines.Add("")
  }
}

$lines.Add("## Agent Memory 今日事实")
$lines.Add("")
if ($memoryFacts.Count -eq 0) {
  $lines.Add("- 无。")
} else {
  foreach ($fact in $memoryFacts) {
    $lines.Add("- [$($fact.record_type)] $($fact.summary)")
  }
}
$lines.Add("")

$lines.Add("## 索引变动")
$lines.Add("")
if ($indexChanges.Count -eq 0) {
  $lines.Add("- 无。")
} else {
  $lines.Add("| 文件 | 大小 | 最后修改 |")
  $lines.Add("|---|---:|---|")
  foreach ($file in $indexChanges) {
    $lines.Add("| $($file.Name) | $(Format-Size $file.Length) | $($file.LastWriteTime.ToString('HH:mm:ss')) |")
  }
}
$lines.Add("")

$lines.Add("## 当前目录分类分布")
$lines.Add("")
$lines.Add("| 分类 | 顶层目录数 |")
$lines.Add("|---|---:|")
foreach ($item in $categoryCounts) {
  $lines.Add("| $($item.Category) | $($item.Count) |")
}
$lines.Add("")

$lines.Add("## 风险与待跟进")
$lines.Add("")
$riskLines = New-Object System.Collections.Generic.List[string]
if ($changedDirs.Name -contains "_system") {
  $riskLines.Add("- _system 今日有变动，注意运行时和缓存不要写到 C 盘。")
}
if ($changedDirs.Name -contains "_索引") {
  $riskLines.Add("- _索引 今日有变动，日报后可检查入口是否同步。")
}
if ($changedDirs.Name -contains "outputs") {
  $riskLines.Add("- outputs 今日有变动，后续按项目确认是否归档或清理。")
}
if ($topDirs.Name -contains "user_data") {
  $riskLines.Add("- user_data 仍按敏感边界处理，不自动查看内容。")
}
if ($riskLines.Count -eq 0) {
  $riskLines.Add("- 暂无自动识别风险。")
}
foreach ($risk in $riskLines) {
  $lines.Add($risk)
}
$lines.Add("")

$lines.Add("## 明日建议")
$lines.Add("")
$suggestions = New-Object System.Collections.Generic.List[string]
if (($activeCategories.Name -join " ") -match "直播间视觉") {
  $suggestions.Add("- 直播间视觉工作台如继续迭代，优先把稳定规则写入 Agent Memory 或 Obsidian。")
}
if (($activeCategories.Name -join " ") -match "金融") {
  $suggestions.Add("- 金融/投研相关任务继续保留数据来源、启动命令和验证日期，涉及最新信息必须联网核验。")
}
if (($activeCategories.Name -join " ") -match "工具|CLI") {
  $suggestions.Add("- 工具/CLI 变动后补启动命令和缓存位置，保持 E 盘规则。")
}
if ($suggestions.Count -eq 0) {
  $suggestions.Add("- 继续保持新项目/安装/跑通命令后同步 _索引 与 Agent Memory。")
}
foreach ($suggestion in $suggestions) {
  $lines.Add($suggestion)
}
$lines.Add("")

$lines.Add("## 生成信息")
$lines.Add("")
$lines.Add("- 生成脚本：E:\临时项目\_system\agent-memory-lite\scripts\New-DevDailyReport.ps1")
$lines.Add("- 报告路径：$reportPath")

Set-Content -LiteralPath $reportPath -Value $lines -Encoding UTF8

$addMemoryScript = Join-Path $Workspace "_system\agent-memory-lite\scripts\Add-AgentMemoryRecord.ps1"
if (Test-Path -LiteralPath $addMemoryScript) {
  & $addMemoryScript `
    -Type "handoff" `
    -Layer "semantic" `
    -Summary "已生成 $dateText 研发日报：$reportPath" `
    -Tags @("dev-daily-report", "automation", "workspace") `
    -Source "New-DevDailyReport.ps1" `
    -LinkedDocs @($reportPath) `
    -Importance 0.75 | Out-Null
}

Write-Output "Report written: $reportPath"
