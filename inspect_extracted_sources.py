from pathlib import Path

FILES = [
    "001_qilin_love_you_9894_msg_file_2026-05_电商直播设备采购清单.xlsx.md",
    "010_qilin_love_you_9894_msg_file_2026-03_ZXC直播机位-灯光设备清单222.xlsx.md",
    "013_qilin_love_you_9894_msg_file_2026-03_美颜调试定价.xlsx.md",
    "021_qilin_love_you_9894_msg_file_2026-01_牧萌雨衣直播灯光清单.xls.md",
    "022_qilin_love_you_9894_msg_file_2026-01_摩吉影像1.27价格_高(1).xlsx.md",
    "023_qilin_love_you_9894_msg_file_2026-01_摩吉影像1.27报价_低(1).xlsx.md",
    "027_qilin_love_you_9894_msg_file_2026-01_【云犀_S3】4K_绿幕直播间解决方案-配图版本.docx.md",
    "031_qilin_love_you_9894_msg_file_2025-12_刘刚-直播清单报价.xls.md",
    "034_qilin_love_you_9894_msg_file_2025-11_直播盈亏ROI测算--计算模板（最新）.xlsx.md",
    "036_qilin_love_you_9894_msg_file_2025-11_酒水官旗_M4报价单.xls.md",
    "049_qilin_love_you_9894_msg_file_2025-07_杭州绿幕_M4报价单.xls.md",
    "004_qilin_love_you_9894_msg_file_2026-05_直播间CPM、CTR、CVR分层归因与复盘手册_V2_(1)(1).pdf.md",
]

KEYWORDS = [
    "合计",
    "直播设备加拍摄设备",
    "设备采购清单",
    "设备名称",
    "设备名",
    "相机",
    "采集卡",
    "补光",
    "影视灯",
    "灯光",
    "绿幕",
    "主机",
    "导播",
    "调试",
    "ROI",
    "CPM",
    "CTR",
    "CVR",
    "GPM",
    "价格",
    "美颜",
    "单价",
    "总价",
]

base = Path(r"E:\临时项目\wechat_extract")
for file_name in FILES:
    text = (base / file_name).read_text(encoding="utf-8")
    print("\n###", file_name)
    hits = [line for line in text.splitlines() if any(keyword in line for keyword in KEYWORDS)]
    for line in hits[:90]:
        print(line[:700])
