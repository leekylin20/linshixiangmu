from pathlib import Path
from docx import Document
import re
src=Path('D:/下载/1222222222')
out=Path('E:/obsidian/_legacy/直播间调试搭建技术/资料源_支哥直播技术_20260430_保留原文转写.md')
lines=[]
lines.append('# 资料源_支哥直播技术_20260430_保留原文转写')
lines.append('')
lines.append('来源：`D:\\下载\\1222222222`')
lines.append('')
lines.append('说明：低价值文件已删除，本文件只汇总保留下来的 100 个 docx 的转写文本，供后续回查原文依据。')
lines.append('')
for p in sorted(src.glob('*.docx')):
    m=re.match(r'(\d{4}-\d{2}-\d{2})_(.*?)_原文\.docx$', p.name)
    date=m.group(1) if m else ''
    title=m.group(2) if m else p.stem
    try:
        doc=Document(str(p))
        paras=[x.text.strip() for x in doc.paragraphs if x.text.strip()]
    except Exception as e:
        paras=[f'读取失败：{e}']
    body='\n\n'.join(paras[2:] if len(paras)>2 else paras)
    body=re.sub(r'发言人\s+\d{2}:\d{2}\s*','',body).strip()
    lines.append(f'## {date}｜{title}')
    lines.append('')
    lines.append(f'- 原文件：`{p.name}`')
    lines.append('')
    lines.append(body if body else '（无有效正文）')
    lines.append('')
out.write_text('\n'.join(lines),encoding='utf-8')
print(out, len(lines))