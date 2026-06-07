from __future__ import annotations

import argparse
import re
import sys
import time
from pathlib import Path

import av
from faster_whisper import WhisperModel


VIDEO_EXTENSIONS = {".mp4", ".mov", ".mkv", ".avi", ".m4v", ".webm"}


def natural_key(path: Path) -> list[object]:
    return [int(part) if part.isdigit() else part.lower() for part in re.split(r"(\d+)", path.name)]


def format_ts(seconds: float) -> str:
    seconds = max(0, int(round(seconds)))
    h, rem = divmod(seconds, 3600)
    m, s = divmod(rem, 60)
    return f"{h:02d}:{m:02d}:{s:02d}"


def video_duration(path: Path) -> float | None:
    try:
        with av.open(str(path)) as container:
            if container.duration is None:
                return None
            return float(container.duration / av.time_base)
    except Exception:
        return None


def md_path_for(video: Path, output_dir: Path) -> Path:
    return output_dir / f"{video.stem}.md"


def write_markdown(
    video: Path,
    output_path: Path,
    model: WhisperModel,
    language: str,
    beam_size: int,
) -> dict[str, object]:
    started = time.time()
    duration = video_duration(video)
    segments, info = model.transcribe(
        str(video),
        language=language,
        beam_size=beam_size,
        vad_filter=True,
        vad_parameters={"min_silence_duration_ms": 500},
    )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = output_path.with_suffix(output_path.suffix + ".tmp")
    segment_count = 0
    char_count = 0
    with tmp_path.open("w", encoding="utf-8", newline="\n") as f:
        f.write(f"# {video.stem}\n\n")
        f.write("## 文件信息\n\n")
        f.write(f"- 视频文件：`{video.name}`\n")
        if duration is not None:
            f.write(f"- 视频时长：{format_ts(duration)}\n")
        if getattr(info, "language", None):
            f.write(f"- 识别语言：{info.language}\n")
        if getattr(info, "language_probability", None) is not None:
            f.write(f"- 语言置信度：{info.language_probability:.2f}\n")
        f.write("\n## 转录正文\n\n")

        for segment in segments:
            text = segment.text.strip()
            if not text:
                continue
            segment_count += 1
            char_count += len(text)
            f.write(f"### {format_ts(segment.start)} - {format_ts(segment.end)}\n\n")
            f.write(f"{text}\n\n")

        f.write("<!-- TRANSCRIPTION_COMPLETE -->\n")

    tmp_path.replace(output_path)
    return {
        "video": video.name,
        "markdown": output_path.name,
        "duration": duration,
        "segments": segment_count,
        "chars": char_count,
        "seconds": time.time() - started,
    }


def load_model(model_name: str, device: str, compute_type: str) -> WhisperModel:
    try:
        return WhisperModel(model_name, device=device, compute_type=compute_type)
    except Exception as exc:
        if device == "cuda":
            print(f"CUDA 加载失败，改用 CPU/int8：{exc}", file=sys.stderr)
            return WhisperModel(model_name, device="cpu", compute_type="int8")
        raise


def completed(path: Path) -> bool:
    if not path.exists():
        return False
    try:
        return "TRANSCRIPTION_COMPLETE" in path.read_text(encoding="utf-8", errors="ignore")[-2000:]
    except Exception:
        return False


def main() -> int:
    parser = argparse.ArgumentParser(description="Transcribe videos in a directory to Markdown files.")
    parser.add_argument("input_dir", type=Path)
    parser.add_argument("--output-dir", type=Path)
    parser.add_argument("--model", default="medium")
    parser.add_argument("--language", default="zh")
    parser.add_argument("--device", default="cuda")
    parser.add_argument("--compute-type", default="float16")
    parser.add_argument("--beam-size", type=int, default=5)
    args = parser.parse_args()

    input_dir = args.input_dir.resolve()
    output_dir = (args.output_dir or (input_dir / "md转录")).resolve()
    videos = sorted(
        [p for p in input_dir.rglob("*") if p.is_file() and p.suffix.lower() in VIDEO_EXTENSIONS],
        key=natural_key,
    )
    if not videos:
        print(f"没有找到视频文件：{input_dir}")
        return 1

    output_dir.mkdir(parents=True, exist_ok=True)
    print(f"找到 {len(videos)} 个视频，输出目录：{output_dir}")
    model = load_model(args.model, args.device, args.compute_type)

    results: list[dict[str, object]] = []
    for index, video in enumerate(videos, start=1):
        out_path = md_path_for(video, output_dir)
        if completed(out_path):
            print(f"[{index}/{len(videos)}] 跳过已完成：{video.name}")
            results.append({"video": video.name, "markdown": out_path.name, "skipped": True})
            continue

        print(f"[{index}/{len(videos)}] 开始转录：{video.name}")
        try:
            result = write_markdown(video, out_path, model, args.language, args.beam_size)
            results.append(result)
            print(
                f"完成：{video.name} -> {out_path.name}，"
                f"{result['segments']} 段，{result['chars']} 字，耗时 {format_ts(float(result['seconds']))}"
            )
        except Exception as exc:
            print(f"失败：{video.name}：{exc}", file=sys.stderr)

    index_path = output_dir / "目录.md"
    with index_path.open("w", encoding="utf-8", newline="\n") as f:
        f.write("# 视频转录目录\n\n")
        for video in videos:
            out_path = md_path_for(video, output_dir)
            status = "已完成" if completed(out_path) else "未完成"
            f.write(f"- [{video.stem}]({out_path.name}) - {status}\n")

    print(f"索引已生成：{index_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
