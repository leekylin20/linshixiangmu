param(
  [string]$SourceRoot = "E:\obsidian\_legacy\知识系统\md_by_topic",
  [string]$OutRoot = "E:\obsidian\_legacy\知识系统\md_by_topic_分选",
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Test-Match {
  param([string]$Text, [string]$Pattern)
  return $Text -match $Pattern
}

$Categories = [ordered]@{
  "00_索引清单" = "原索引、manifest、分类说明"
  "A01_一人公司AI商业" = "一人公司、AI 工作流、知识库、内容工厂、个人商业"
  "A02_沟通表达逻辑" = "沟通、表达、反馈、提案、说服、即兴发言"
  "A03_写作知识表达" = "写作、知识表达、文本组织"
  "A04_社交情商人际" = "社交、礼仪、人情世故、情绪价值、安慰、拒绝、道歉"
  "A05_心理成长情绪" = "自我认知、情绪管理、依恋、焦虑、孤独、成长"
  "A06_投资理财商业" = "投资、理财、复利、商业认知"
  "A07_亲密婚恋与两性" = "亲密关系、婚恋、两性、人性博弈、关系经营"
  "A08_男性健康与性知识" = "男性健康、早泄/阳痿、性知识与相关训练资料"
  "A09_形象穿搭护肤" = "形象、穿搭、护肤、仪态、外表管理"
  "A10_文学通识" = "文学、通识、叙事样本"
  "C01_短文件说明待复核" = "过短文本、说明页、OCR/视频占位页"
  "C02_未命中待复核" = "规则未命中的待人工复核资料"
}

function Get-Category {
  param(
    [System.IO.FileInfo]$File,
    [object]$Meta
  )

  $name = $File.Name
  $source = if ($Meta) { [string]$Meta.source_path } else { "" }
  $oldCat = if ($Meta) { [string]$Meta.category_folder } else { Split-Path -Leaf $File.DirectoryName }
  $text = "$name $source $oldCat"

  if ($name -eq "00_index.md") {
    return [pscustomobject]@{ Category = "00_索引清单"; Reason = "root index" }
  }

  if (Test-Match $text "必看说明|课程简介-视频直播|视频直播|^\\d+_\\(\\d+\\)|^[0-9]+_[a-f0-9]{16,}") {
    return [pscustomobject]@{ Category = "C01_短文件说明待复核"; Reason = "short or placeholder file" }
  }

  if (Test-Match $text "诡辩|撕逼|吵架|质问术|质问|攻击|辩论|骂战") {
    return [pscustomobject]@{ Category = "A02_沟通表达逻辑"; Reason = "conflict/debate attack content" }
  }

  if (Test-Match $text "社交软件玩法|Soul|soul|陌陌|探探|Tinder|tinder|MarryU|世纪佳缘|牵手|积目|积木|展示面|朋友圈建设|爆款文案|聊天记录曝光|红书tinder|全平台通杀") {
    return [pscustomobject]@{ Category = "A04_社交情商人际"; Reason = "social app/platform playbook" }
  }

  if (Test-Match $text "做愛|做爱|性爱|性技巧|爱抚|陰蒂|阴蒂|女上位|高潮|九浅一深|死进活出|采阴补阳|双修|房中术|黄帝外经|黄帝内经|阴阳互补|阴JING|阴茎|睾丸|生殖按摩|指法|调情小知识|成人|性愛") {
    return [pscustomobject]@{ Category = "A08_男性健康与性知识"; Reason = "adult sexual content" }
  }

  if (Test-Match $text "红丸|米格道|理性男人|供养者|男性妥协|男性是一种耗材|男性的终结|男性研究|男性解放|女权|男权|性别|择偶倾向|两性差距|男宝|彩礼|奴性|被支配|支配主题|基因战争|基因|女性操纵者|女人心理操|男女暗黑心理|女性觉醒|女性智慧|女性红灯|女人为何爱渣男|女人到底|女人最喜欢|女人都该知道|男人都该知道|男人那点想法|解读女人") {
    return [pscustomobject]@{ Category = "A07_亲密婚恋与两性"; Reason = "gender ideology / controversial gender content" }
  }

  if (Test-Match $name "社交恐惧") {
    return [pscustomobject]@{ Category = "A05_心理成长情绪"; Reason = "social anxiety / emotional growth title override" }
  }

  if (Test-Match $name "泡学|型男话术|话术惯例|谜男全流程惯例|爱情体系-惯例|爱情体系.*惯例") {
    return [pscustomobject]@{ Category = "A07_亲密婚恋与两性"; Reason = "PUA routine/playbook title override" }
  }

  if (Test-Match $name "穿搭|护肤|形象|脸书|型男|男神私享穿搭|时尚|仪态|外表|气质|声音|妆|形象价值百万|男士护肤|基本穿搭|男友穿搭") {
    return [pscustomobject]@{ Category = "A09_形象穿搭护肤"; Reason = "image/style/grooming title override" }
  }

  if (Test-Match $text "PUA|泡妞|把妹|撩妹|搭讪|诱惑|勾搭|速推|推拉|服从性测试|废物测试|心锚|冷读|调情|挽回|复合|追回|绿茶|渣男|渣女|狐狸精|猎男|撩汉|操控|操纵|驯化|魔鬼|迷男|谜男|杂耍人|五步陷阱|潘多拉|坏男人|坏蛋|情狼|约妹|套路|惯例|高位|厚黑|阴谋论|一套成神|暧昧拉扯|PALY|PLAY|神撩术|骄傲与风趣|约会倍增术|泡学|约会禁书|魔鬼约会|爱情光谱骚操作|爱情光谱聊天骚操作|女公关") {
    return [pscustomobject]@{ Category = "A07_亲密婚恋与两性"; Reason = "PUA/manipulation/dating tactic content" }
  }

  if (Test-Match $text "一人公司|AI训练营|NotebookLM|Claude|Canva|内容工厂|自媒体|虚拟产品|个人商业|智能体|工作流|知识库|小红书虚拟|松月AI|商业模式|Dan Koe|开营|课程资料") {
    return [pscustomobject]@{ Category = "A01_一人公司AI商业"; Reason = "AI/personal business" }
  }

  if (Test-Match $text "写作|知识表达|写作是门手艺") {
    return [pscustomobject]@{ Category = "A03_写作知识表达"; Reason = "writing and knowledge expression" }
  }

  if (Test-Match $text "投资|理财|复利|达利欧|滚雪球|商业认知") {
    return [pscustomobject]@{ Category = "A06_投资理财商业"; Reason = "investment/business cognition" }
  }

  if (Test-Match $text "小王子|文学|小说|叙事") {
    return [pscustomobject]@{ Category = "A10_文学通识"; Reason = "literature/general knowledge" }
  }

  if ($oldCat -eq "02_沟通表达与逻辑训练" -or (Test-Match $text "说话有逻辑|沟通有效率|了解逻辑|逻辑到底|给予反馈|提出期许|推动改正|正式提案|提建议|有效推荐|结果增强|成功建议|类聚群分|次第有序|因果推断|即兴发言|自我介绍|表达成就|平息分歧|得体拒绝|商业计划|达成合作|辅导沟通")) {
    return [pscustomobject]@{ Category = "A02_沟通表达逻辑"; Reason = "communication logic" }
  }

  if (Test-Match $text "穿搭|护肤|形象|脸书|型男|男神|时尚|仪态|外表|气质|声音|妆|年会怎么穿|过年回家怎么穿|形象价值百万|男士护肤|基本穿搭") {
    return [pscustomobject]@{ Category = "A09_形象穿搭护肤"; Reason = "image/style/grooming" }
  }

  if (Test-Match $text "男性持久力课程|男性健康|早泄|早洩|阳痿|勃起|前列腺|延时|射精|PC肌|提睾|强肾|扶阳|回春|固气|壮阳|男时间短|医学方案|治疗早泄|心理压力疏导|脱敏术|持久度|性功能障碍|中医中药|身体姿势|器械的使用方法|增粗增大") {
    return [pscustomobject]@{ Category = "A08_男性健康与性知识"; Reason = "male health/medical training" }
  }

  if (Test-Match $text "恋爱|爱情|婚姻|婚恋|亲密关系|长期关系|伴侣|依恋模式|安全感|相处|择偶|爱与性|爱的八次约会|冷眼观爱|男人来自火星|完美关系|幸福爱|幸福有个误会|爱的十万个为什么|情感私房课|爱情急救|杨冰阳|陆琪|结婚") {
    return [pscustomobject]@{ Category = "A07_亲密婚恋与两性"; Reason = "relationship/marriage" }
  }

  if (Test-Match $text "情绪|心理|自我成长|焦虑|孤独|虚荣|完美|自卑|无力感|否定自己|内在关系|身体认知|大脑|思维模型|个人成长|人生|复合型思维|了解自己|性格测试|情商入门|情商提升|情商拔高|情商：为什么情商比智商更重要|人性的弱点") {
    return [pscustomobject]@{ Category = "A05_心理成长情绪"; Reason = "psychology/emotional growth" }
  }

  if (Test-Match $text "沟通|表达|逻辑|反馈|提建议|建议|提案|即兴发言|自我介绍|说服|话术库|好好说话|拒绝|道歉|安慰|夸人|赞美|寒暄|接话|聊天万能|人际|社交|礼仪|请客|做客|敬酒|请人帮忙|套话|职场|领导|同事|人脉|社会化|读懂人心|情绪价值|开口|恶意|冷场|陌生人|朋友|关系|高情商|处世") {
    return [pscustomobject]@{ Category = "A04_社交情商人际"; Reason = "social/EQ/interpersonal" }
  }

  if (Test-Match $text "说话|前因后果|因果|类聚群分|次第有序|结果增强|商业计划|达成合作|推动改正|提醒错误|平息分歧|有效推荐") {
    return [pscustomobject]@{ Category = "A02_沟通表达逻辑"; Reason = "communication logic" }
  }

  if (Test-Match $text "小王子|文学|小说|叙事") {
    return [pscustomobject]@{ Category = "A10_文学通识"; Reason = "literature/general knowledge" }
  }

  if ($oldCat -eq "01_一人公司与个人创业") {
    return [pscustomobject]@{ Category = "A01_一人公司AI商业"; Reason = "old category fallback" }
  }
  if ($oldCat -eq "02_沟通表达与逻辑训练") {
    return [pscustomobject]@{ Category = "A02_沟通表达逻辑"; Reason = "old category fallback" }
  }
  if ($oldCat -eq "03_写作与知识表达") {
    return [pscustomobject]@{ Category = "A03_写作知识表达"; Reason = "old category fallback" }
  }
  if ($oldCat -eq "04_社交关系与处世") {
    return [pscustomobject]@{ Category = "A04_社交情商人际"; Reason = "old category fallback" }
  }
  if ($oldCat -eq "05_恋爱关系与吸引力") {
    return [pscustomobject]@{ Category = "A07_亲密婚恋与两性"; Reason = "old category fallback" }
  }
  if ($oldCat -eq "08_男性健康与两性功能") {
    return [pscustomobject]@{ Category = "A08_男性健康与性知识"; Reason = "old category fallback" }
  }

  if ($File.Length -lt 1500) {
    return [pscustomobject]@{ Category = "C01_短文件说明待复核"; Reason = "short unmatched file" }
  }

  return [pscustomobject]@{ Category = "C02_未命中待复核"; Reason = "no rule matched" }
}

if (-not (Test-Path -LiteralPath $SourceRoot)) {
  throw "SourceRoot not found: $SourceRoot"
}

$manifestPath = Join-Path $SourceRoot "manifest.csv"
$manifestRows = @()
$metaByName = @{}
if (Test-Path -LiteralPath $manifestPath) {
  $manifestRows = Import-Csv -Path $manifestPath
  foreach ($row in $manifestRows) {
    $metaByName[$row.categorized_name] = $row
  }
}

$files = Get-ChildItem -LiteralPath $SourceRoot -Recurse -File -Filter "*.md" |
  Where-Object { $_.FullName -notlike "$OutRoot*" }

$records = foreach ($file in $files) {
  $meta = if ($metaByName.ContainsKey($file.Name)) { $metaByName[$file.Name] } else { $null }
  $cat = Get-Category -File $file -Meta $meta
  $dest = Join-Path (Join-Path $OutRoot $cat.Category) $file.Name
  [pscustomobject]@{
    category = $cat.Category
    reason = $cat.Reason
    name = $file.Name
    length = $file.Length
    source_path = if ($meta) { $meta.source_path } else { "" }
    old_category = if ($meta) { $meta.category_folder } else { Split-Path -Leaf $file.DirectoryName }
    old_path = $file.FullName
    new_path = $dest
  }
}

if ($DryRun) {
  $records | Group-Object category | Sort-Object Name |
    Select-Object Name, Count |
    Format-Table -AutoSize
  return
}

if (Test-Path -LiteralPath $OutRoot) {
  throw "OutRoot already exists; refusing to overwrite: $OutRoot"
}

New-Item -ItemType Directory -Path $OutRoot | Out-Null
foreach ($category in $Categories.Keys) {
  New-Item -ItemType Directory -Path (Join-Path $OutRoot $category) | Out-Null
}

foreach ($record in $records) {
  Copy-Item -LiteralPath $record.old_path -Destination $record.new_path
}

if (Test-Path -LiteralPath $manifestPath) {
  Copy-Item -LiteralPath $manifestPath -Destination (Join-Path $OutRoot "00_索引清单\manifest_original.csv")
}

$records | Export-Csv -NoTypeInformation -Encoding UTF8 -Path (Join-Path $OutRoot "00_索引清单\classification_manifest.csv")

$summary = $records | Group-Object category | Sort-Object Name | ForEach-Object {
  [pscustomobject]@{
    category = $_.Name
    count = $_.Count
    description = $Categories[$_.Name]
  }
}
$summary | Export-Csv -NoTypeInformation -Encoding UTF8 -Path (Join-Path $OutRoot "00_索引清单\classification_summary.csv")

$indexLines = New-Object System.Collections.Generic.List[string]
$indexLines.Add("# md_by_topic 归类分选索引")
$indexLines.Add("")
$indexLines.Add('来源目录：`' + $SourceRoot + '`')
$indexLines.Add('输出目录：`' + $OutRoot + '`')
$indexLines.Add("")
$indexLines.Add("")
$indexLines.Add("## 分类汇总")
$indexLines.Add("")
foreach ($row in $summary) {
  $indexLines.Add("- $($row.category)：$($row.count) 个文件。$($row.description)")
}
$indexLines.Add("")
$indexLines.Add("## 目录入口")
$indexLines.Add("")
foreach ($category in $Categories.Keys) {
  $indexLines.Add("- [$category](../$category/)")
}
$indexLines | Set-Content -Encoding UTF8 -Path (Join-Path $OutRoot "00_索引清单\INDEX_归类分选.md")

Write-Host "Done. Files classified: $($records.Count)"
Write-Host "Output: $OutRoot"
