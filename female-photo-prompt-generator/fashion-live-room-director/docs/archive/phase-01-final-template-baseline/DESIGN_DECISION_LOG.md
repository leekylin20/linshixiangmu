# Design Decision Log

## 1. 不采用 final-visual-director-gate

原因：

多加层级会导致系统继续复杂化。此前多次偏移都和层级增加、规则互相打架有关。

## 2. 采用 final-prompt-template 模式

原因：

模板即最终 prompt，稳定、可控，只做少量变量替换，避免 Codex 自由发挥。

## 3. route 只做品类识别和展示点

原因：

route 不再整段拼入最终 prompt，避免长 prompt。

## 4. sceneStyle 只做模板选择

原因：

sceneStyle 不再作为大段规则拼接来源。

## 5. layoutVariant 暂不独立干预最终 prompt

原因：

先保持模板稳定，避免 L 型、窗景、软装等变量互相打架。

## 6. 室内软装、摆件、材质进入变量库

原因：

丰富画面只能通过受控变量，不直接改主模板。

## 7. 直播感不靠牌子、设备、促销板体现

原因：

这些词会被模型字面画出，导致画面变成门店、促销页或摄影棚。
