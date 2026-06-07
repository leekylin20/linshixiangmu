from pathlib import Path
import os
import re
import time

import pypdfium2 as pdfium
from rapidocr_onnxruntime import RapidOCR


def clean_line(value):
    return re.sub(r"\s+", " ", value or "").strip()


def last_page_marker(path):
    if not path.exists():
        return 0
    text = path.read_text(encoding="utf-8", errors="ignore")
    nums = [int(x) for x in re.findall(r"<!--\s*page\s+(\d+)\s*-->", text)]
    return max(nums) if nums else 0


def append_pages(txt_path, md_path, chunks):
    txt_path.parent.mkdir(parents=True, exist_ok=True)
    md_path.parent.mkdir(parents=True, exist_ok=True)
    with txt_path.open("a", encoding="utf-8", newline="\n") as f_txt:
        for page_no, lines in chunks:
            f_txt.write(f"\n\n<!-- page {page_no} -->\n")
            if lines:
                f_txt.write("\n".join(lines))
                f_txt.write("\n")
    with md_path.open("a", encoding="utf-8", newline="\n") as f_md:
        for page_no, lines in chunks:
            f_md.write(f"\n\n<!-- page {page_no} -->\n")
            if lines:
                f_md.write("\n".join(lines))
                f_md.write("\n")


def main():
    pdf_path = Path(os.environ["PDF_PATH"])
    txt_path = Path(os.environ["TXT_PATH"])
    md_path = Path(os.environ["MD_PATH"])
    log_path = Path(os.environ["LOG_PATH"])
    scale = float(os.environ.get("OCR_SCALE", "2"))
    flush_every = int(os.environ.get("FLUSH_EVERY", "1"))

    log_path.parent.mkdir(parents=True, exist_ok=True)
    engine = RapidOCR()
    doc = pdfium.PdfDocument(str(pdf_path))
    total = len(doc)
    start_page = last_page_marker(txt_path) + 1

    with log_path.open("a", encoding="utf-8", newline="\n") as log:
        log.write(f"\nSTART {time.strftime('%Y-%m-%d %H:%M:%S')} {pdf_path.name} from page {start_page}/{total}\n")

    pending = []
    for page_no in range(start_page, total + 1):
        started = time.time()
        page = doc[page_no - 1]
        image = page.render(scale=scale).to_pil()
        result, _ = engine(image)
        lines = []
        if result:
            for item in result:
                value = clean_line(item[1])
                if value:
                    lines.append(value)
        pending.append((page_no, lines))
        if len(pending) >= flush_every:
            append_pages(txt_path, md_path, pending)
            with log_path.open("a", encoding="utf-8", newline="\n") as log:
                log.write(f"PAGE {page_no}/{total} lines={len(lines)} sec={time.time() - started:.1f}\n")
            pending.clear()

    if pending:
        append_pages(txt_path, md_path, pending)

    doc.close()
    with log_path.open("a", encoding="utf-8", newline="\n") as log:
        log.write(f"DONE {time.strftime('%Y-%m-%d %H:%M:%S')} {pdf_path.name}\n")


if __name__ == "__main__":
    main()
