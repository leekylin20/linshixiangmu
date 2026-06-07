from pathlib import Path
from docx import Document
import re, json
root=Path('D:/下载/1222222222')
files=sorted(root.glob('*.docx'))
tech_terms=set('''4K 2K 1080 2160 3840 2560 1920 60帧 30帧 RGB YUY2 YY OBS obs 直播伴侣 采集卡 相机 索尼 A7M4 a7m4 A7M5 a7m5 ZVE10 zve10 FX30 FX3 A7S3 镜头 焦段 光圈 对焦 白平衡 色温 曝光 ISO 快门 伽马 gamma 对比度 亮度 饱和度 锐化 滤镜 美颜 码率 关键帧 显卡 CPU GPU 电脑 配置 卡顿 掉帧 声画不同步 生化不同步 多平台 多机位 兔笼 HDMI 监视屏 风扇 灯光 布光 声卡 麦克风 音频 电平 降噪 户外直播 LED 高刷 屏幕 参数 储存 保存 开播 下播 全流程'''.split())
strong_terms=set('''参数 设置 调 选择 适合 不适合 原因 解决 处理 降低 升级 关闭 打开 设成 选择 调成 采集 输出 输入 分辨率 帧率 格式 对焦 光圈 白平衡 曝光 锐化 伽马 对比度 亮度 饱和度 卡顿 掉帧 同步 画面 清晰 发灰 偏色 设备 镜头 电脑 配置'''.split())
low_phrases=['点头像','点个关注','关注收藏','送赞','一路长虹','正在开播','每晚23','免费帮粉丝','提供搭建调试','来到直播间','三亚','早餐','钓鱼','放飞雨燕','痛并快乐','直播生活','赚了啥','一镜到底','看个全','全景','长啥样','这就是我的直播间','团队祝粉丝']
keep_title_terms=['画面发灰','不清楚','声画不同步','电脑配置','镜头怎么选','对焦设置','美颜参数','多机位','布光','音频设备','参数设置','参数储存','开播全流程','下播全流程','4K','高清直播参数','直播伴侣参数','OBS','obs']
rows=[]
for p in files:
    m=re.match(r'(\d{4}-\d{2}-\d{2})_(.*?)_原文\.docx$', p.name)
    date=m.group(1) if m else ''
    title=m.group(2) if m else p.stem
    try:
        doc=Document(str(p))
        paras=[x.text.strip() for x in doc.paragraphs if x.text.strip()]
    except Exception:
        paras=[]
    body='\n'.join(paras[2:] if len(paras)>2 else paras)
    body=re.sub(r'发言人\s+\d{2}:\d{2}\s*','',body).strip()
    hay=body.lower(); title_hay=title.lower()
    tech_hits=[t for t in tech_terms if t.lower() in hay]
    strong_hits=[t for t in strong_terms if t.lower() in hay]
    low_hits=[x for x in low_phrases if x in body or x in title]
    title_keep=any(x.lower() in title_hay for x in keep_title_terms)
    actionable=(len(tech_hits)>=2 and len(strong_hits)>=2 and len(body)>=180) or (title_keep and (len(tech_hits)>=1 or len(strong_hits)>=1) and len(body)>=45)
    low=False; reason=[]
    if not actionable:
        low=True; reason.append('缺少可复用技术判断')
    if len(body)<180 and low_hits and not title_keep:
        low=True; reason.append('短内容且偏生活/营销/展示')
    if low_hits and len(body)<350 and not title_keep and len(tech_hits)<=1:
        low=True; reason.append('以引流或生活展示为主')
    if title_keep and len(body)>=45 and (len(tech_hits)>=1 or len(strong_hits)>=1):
        low=False; reason=[]
    rows.append({'date':date,'title':title,'file':p.name,'path':str(p),'chars':len(body),'tech_hits':tech_hits[:12],'strong_hits':strong_hits[:12],'low_hits':low_hits[:8],'delete':low,'reason':'；'.join(dict.fromkeys(reason)) or '保留','body_preview':body[:220].replace('\n',' ')})
out=Path('E:/临时项目/live_doc_classification.json')
out.write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'total':len(rows),'delete':sum(r['delete'] for r in rows),'keep':sum(not r['delete'] for r in rows)},ensure_ascii=False))