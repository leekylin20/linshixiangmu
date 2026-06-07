from pathlib import Path
from docx import Document
import re
root=Path('D:/下载/1222222222')
terms=['音频设备','声卡','麦克风','灯光','布光','户外直播','LED','风扇','参数储存','开播全流程','下播全流程','创意外观','索尼相机zve10二代','直播画面不清楚解决方法']
for term in terms:
    hits=[]
    for p in root.glob('*.docx'):
        if term.lower() in p.name.lower(): hits.append(p)
    print('\n###',term,len(hits))
    for p in sorted(hits)[-5:]:
        doc=Document(str(p)); paras=[x.text.strip() for x in doc.paragraphs if x.text.strip()]
        body='\n'.join(paras[2:] if len(paras)>2 else paras)
        body=re.sub(r'发言人\s+\d{2}:\d{2}\s*','',body)
        print('\n--',p.name,'chars',len(body))
        print(body[:1000].replace('\n',' '))