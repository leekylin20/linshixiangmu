---
title: 知识记忆字段规范
date: 2026-05-06
version: v1
status: active
---

# 知识记忆字段规范

## 一、记忆类型

```text
visual_sample：单张图片样本
prompt_framework：提示词框架
lighting_rule：光影规则
room_layout_rule：房间 / 直播间布置规则
hair_makeup_rule：发丝 / 妆面规则
composition_rule：构图规则
safety_rule：安全边界
source_account：账号 / 网站来源
workflow_rule：工作流规则
project_module：临时项目中已加载的代码模块、外部仓库和可调用工具入口
```

## 二、MemoryCoreClaw 兼容字段

所有记录建议保留这一组顶层字段，方便以后接入 MemoryCoreClaw 或类似长期记忆引擎。

```yaml
memory_core:
  layer: working | episodic | semantic | procedural | relation
  importance: 0.0-1.0
  strength: 0.0-1.0
  access_count: 0
  last_accessed:
  ttl:
  context_triggers:
    people: []
    location: []
    activity: []
    emotion: []
    visual_tags: []
  relations:
    - from:
      type:
      to:
      confidence:
```

### 层级映射

```text
working：当前正在处理的图片、任务、短期判断
episodic：单张图片样本、一次账号拆解、一次网站提取
semantic：可复用提示词框架、光影规则、妆面规则、构图规律
procedural：分析流程、写入流程、质量检查清单
relation：样本与框架、框架与场景、风险与规避写法之间的关系
```

### 重要性映射

```text
0.90-1.00：核心记忆，长期保留，优先注入上下文
0.70-0.89：重要记忆，长期保留，常规召回
0.50-0.69：普通记忆，阶段性整理
0.00-0.49：低优先记忆，可衰减或只做归档
```

## 三、图片样本字段

```yaml
record_type: visual_sample
id:
date:
source:
image_ref:
task_context:
memory_core:
```

### 人物

```yaml
person:
  gender_presentation:
  age_signal:
  face_shape:
  eyes:
  nose:
  lips:
  expression:
  body_posture:
  identity_stability_notes:
```

### 发丝

```yaml
hair:
  hairstyle:
  hair_color:
  hairline:
  bangs:
  flyaway_hairs:
  edge_light:
  texture_notes:
```

### 妆面

```yaml
makeup:
  base_makeup:
  skin_finish:
  blush:
  eye_makeup:
  lip:
  contour:
  beauty_filter_signal:
  risk_notes:
```

### 房间 / 直播间

```yaml
room:
  room_type:
  background_elements:
  furniture:
  live_equipment:
  desk_objects:
  wall_texture:
  depth_layers:
  clutter_level:
```

### 光影

```yaml
lighting:
  source:
  direction:
  hardness:
  face_protection:
  rim_light:
  background_shadow:
  reflection:
  haze_or_diffusion:
  color_temperature:
  matched_framework:
```

### 构图

```yaml
composition:
  aspect_ratio:
  shot_size:
  camera_angle:
  focal_feel:
  subject_position:
  foreground:
  background:
  negative_space:
  depth:
```

### 可复用框架

```yaml
reusable_frameworks:
  - name:
    source_doc:
    why_matched:
    confidence:
```

### 待追加规则

```yaml
new_rules:
  - rule:
    target_doc:
    priority:
```

### 安全边界

```yaml
safety:
  fictional_required:
  real_platform_risk:
  real_person_risk:
  sexualization_risk:
  youthfulness_risk:
  mitigation:
```

### 项目模块

```yaml
record_type: project_module
id:
date:
summary:
tags: []
source:
linked_docs: []
memory_core:
module:
  name:
  local_path:
  source_repo:
  package:
  entrypoints: []
  install_state:
  run_state:
  usage_notes:
  safety_notes:
```

## 四、JSONL 记录格式

`memory-records.jsonl` 每行一条记录，推荐格式：

```json
{
  "record_type": "visual_sample",
  "id": "VS-YYYYMMDD-001",
  "date": "2026-05-06",
  "summary": "",
  "tags": [],
  "source": "",
  "linked_docs": [],
  "memory_core": {
    "layer": "episodic",
    "importance": 0.6,
    "strength": 0.6,
    "access_count": 0,
    "last_accessed": "",
    "ttl": "",
    "context_triggers": {
      "people": [],
      "location": [],
      "activity": [],
      "emotion": [],
      "visual_tags": []
    },
    "relations": []
  },
  "memory": {
    "person": {},
    "hair": {},
    "makeup": {},
    "room": {},
    "lighting": {},
    "composition": {},
    "reusable_frameworks": [],
    "new_rules": [],
    "safety": {}
  },
  "importance": 0,
  "status": "draft"
}
```

## 五、重要性评分

```text
0-2：一次性观察，不写主库
3-5：有局部复用价值，写 memory-records
6-8：可形成框架，追加到对应专题库
9-10：改变顶层结构，追加到 Layer 架构或主写法库
```

换算到 MemoryCoreClaw 的 `importance`：

```text
0-2  → 0.00-0.29
3-5  → 0.30-0.59
6-8  → 0.60-0.89
9-10 → 0.90-1.00
```

## 六、关系记忆

每张图片至少建立 1-3 个关系：

```text
图片样本 -> 复用 -> 光影框架
图片样本 -> 复用 -> 妆面框架
图片样本 -> 暴露缺口 -> 新规则
图片样本 -> 风险 -> 安全边界
```
