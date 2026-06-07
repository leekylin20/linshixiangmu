from pathlib import Path
from docx import Document
import re
root=Path('D:/下载/1222222222')
terms=['镜头怎么选','电脑配置','声画不同步','多机位','obs最新版本','美颜参数','布光','音频设备','户外直播','LED','对焦设置','参数储存','画面发灰','直播画面不清楚','有这三个参数','2026年第一版','a7m4_PK','a7m5对焦','主播调试必调四个参数']
files=list(root.glob('*.docx'))
for term in terms:
    hits=[p for p in files if term.lower() in p.name.lower()]
    print('\n### TERM',term, 'hits', len(hits))
    for p in sorted(hits)[-3:]:
        doc=Document(str(p))
        paras=[x.text.strip() for x in doc.paragraphs if x.text.strip()]
        body='\n'.join(paras[2:])
        body=re.sub(r'发言人\s+\d{2}:\d{2}\s*','',body)
        print('\n--',p.name,'chars',len(body))
        print(body[:1600].replace('\n',' '))