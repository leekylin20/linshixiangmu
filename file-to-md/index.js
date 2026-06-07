#!/usr/bin/env node

const fs = require("fs");
const fsp = require("fs/promises");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const dotenv = require("dotenv");
const ffmpegPath = require("ffmpeg-static");
const OpenAI = require("openai");
const pdfParse = require("pdf-parse");

dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config();

const PDF_EXTENSIONS = new Set([".pdf"]);
const AUDIO_EXTENSIONS = new Set([".mp3", ".wav", ".m4a", ".aac", ".flac", ".ogg", ".opus", ".wma"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".mkv", ".flv", ".avi", ".webm", ".m4v"]);
const DEFAULT_SEGMENT_SECONDS = 20 * 60;
const DEFAULT_CONCURRENCY = 2;
const DEFAULT_MODEL = "gpt-4o-mini-transcribe";
const DEFAULT_OUTPUT_DIR = path.resolve(__dirname, "output");

function printHelp() {
  console.log(`
Usage:
  node index.js --input "D:\\下载\\新建文件夹 (2)" [options]

Options:
  --input <dir>          Source directory to scan. Required.
  --output <dir>         Output directory for .md files. Default: ${DEFAULT_OUTPUT_DIR}
  --types <list>         Comma separated: pdf,audio,video. Default: pdf,audio,video
  --model <name>         Transcription model. Default: ${DEFAULT_MODEL}
  --base-url <url>       Optional API base URL override
  --ffmpeg-path <path>   Optional ffmpeg executable path
  --language <code>      Optional language hint for transcription, such as zh
  --request-timeout-ms <n>  API request timeout in ms. Default: 60000
  --concurrency <n>      Parallel file workers. Default: ${DEFAULT_CONCURRENCY}
  --segment-seconds <n>  Audio chunk duration. Default: ${DEFAULT_SEGMENT_SECONDS}
  --max-files <n>        Stop after N matched files, useful for testing
  --overwrite            Overwrite existing markdown files
  --dry-run              Scan only, do not process files
  --help                 Show this help

Environment:
  OPENAI_API_KEY         Required for audio/video transcription
  OPENAI_BASE_URL        Optional custom API base URL
  FFMPEG_PATH            Optional ffmpeg executable path
`);
}

function parseArgs(argv) {
  const options = {
    outputDir: DEFAULT_OUTPUT_DIR,
    concurrency: DEFAULT_CONCURRENCY,
    overwrite: false,
    dryRun: false,
    types: new Set(["pdf", "audio", "video"]),
    model: process.env.AUDIO_TRANSCRIBE_MODEL || DEFAULT_MODEL,
    segmentSeconds: DEFAULT_SEGMENT_SECONDS,
    language: undefined,
    maxFiles: undefined,
    baseURL: undefined,
    ffmpegPath: process.env.FFMPEG_PATH,
    requestTimeoutMs: Number.parseInt(process.env.OPENAI_REQUEST_TIMEOUT_MS || "60000", 10),
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--help") {
      options.help = true;
      continue;
    }
    if (arg === "--overwrite") {
      options.overwrite = true;
      continue;
    }
    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    const nextValue = () => {
      const value = argv[i + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for ${arg}`);
      }
      i += 1;
      return value;
    };

    if (arg === "--input") {
      options.inputDir = path.resolve(nextValue());
      continue;
    }
    if (arg === "--output") {
      options.outputDir = path.resolve(nextValue());
      continue;
    }
    if (arg === "--types") {
      options.types = new Set(
        nextValue()
          .split(",")
          .map((item) => item.trim().toLowerCase())
          .filter(Boolean),
      );
      continue;
    }
    if (arg === "--model") {
      options.model = nextValue();
      continue;
    }
    if (arg === "--base-url") {
      options.baseURL = nextValue();
      continue;
    }
    if (arg === "--ffmpeg-path") {
      options.ffmpegPath = path.resolve(nextValue());
      continue;
    }
    if (arg === "--language") {
      options.language = nextValue();
      continue;
    }
    if (arg === "--request-timeout-ms") {
      options.requestTimeoutMs = Number.parseInt(nextValue(), 10);
      continue;
    }
    if (arg === "--concurrency") {
      options.concurrency = Number.parseInt(nextValue(), 10);
      continue;
    }
    if (arg === "--segment-seconds") {
      options.segmentSeconds = Number.parseInt(nextValue(), 10);
      continue;
    }
    if (arg === "--max-files") {
      options.maxFiles = Number.parseInt(nextValue(), 10);
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function classifyExtension(ext) {
  const lower = ext.toLowerCase();
  if (PDF_EXTENSIONS.has(lower)) return "pdf";
  if (AUDIO_EXTENSIONS.has(lower)) return "audio";
  if (VIDEO_EXTENSIONS.has(lower)) return "video";
  return null;
}

async function ensureDirectory(dirPath) {
  await fsp.mkdir(dirPath, { recursive: true });
}

async function walkFiles(rootDir, matchedFiles, options) {
  if (options.maxFiles && matchedFiles.length >= options.maxFiles) {
    return;
  }

  const entries = await fsp.readdir(rootDir, { withFileTypes: true });

  for (const entry of entries) {
    if (options.maxFiles && matchedFiles.length >= options.maxFiles) {
      return;
    }

    const absolutePath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      await walkFiles(absolutePath, matchedFiles, options);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    const kind = classifyExtension(ext);

    if (!kind || !options.types.has(kind)) {
      continue;
    }

    matchedFiles.push({
      sourcePath: absolutePath,
      kind,
      ext,
    });

    if (options.maxFiles && matchedFiles.length >= options.maxFiles) {
      return;
    }
  }
}

async function collectFiles(options) {
  const matchedFiles = [];
  await walkFiles(options.inputDir, matchedFiles, options);
  return matchedFiles;
}

function toOutputMarkdownPath(sourcePath, inputDir, outputDir) {
  const relative = path.relative(inputDir, sourcePath);
  return path.join(outputDir, `${relative}.md`);
}

function normalizeText(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\u0000/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function yamlEscape(value) {
  return String(value).replace(/"/g, '\\"');
}

function buildMarkdown({ title, metadata, body }) {
  const frontmatter = [
    "---",
    ...Object.entries(metadata).map(([key, value]) => `${key}: "${yamlEscape(value)}"`),
    "---",
    "",
  ].join("\n");

  return `${frontmatter}# ${title}\n\n${body.trim()}\n`;
}

function formatTranscriptChunks(transcriptBlocks) {
  return transcriptBlocks
    .map((item, index) => {
      const parts = [`## Segment ${String(index + 1).padStart(3, "0")}`, "", item.text.trim()];
      if (item.durationSeconds != null) {
        parts.splice(1, 0, `Duration: ${item.durationSeconds.toFixed(1)}s`, "");
      }
      return parts.join("\n");
    })
    .join("\n\n");
}

async function writeMarkdownFile(outputPath, markdown) {
  await ensureDirectory(path.dirname(outputPath));
  await fsp.writeFile(outputPath, markdown, "utf8");
}

async function extractPdfText(sourcePath) {
  const buffer = await fsp.readFile(sourcePath);
  const result = await pdfParse(buffer);
  return {
    text: normalizeText(result.text || ""),
    pages: result.numpages || 0,
    info: result.info || {},
  };
}

function spawnProcess(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });

    let stderr = "";
    let stdout = "";

    if (child.stdout) {
      child.stdout.on("data", (chunk) => {
        stdout += String(chunk);
      });
    }
    if (child.stderr) {
      child.stderr.on("data", (chunk) => {
        stderr += String(chunk);
      });
    }

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }
      reject(new Error(`${command} exited with code ${code}: ${stderr || stdout}`));
    });
  });
}

async function transcodeMediaToChunks(sourcePath, tempDir, segmentSeconds, ffmpegCommand) {
  const outputPattern = path.join(tempDir, "chunk-%03d.mp3");
  const args = [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-i",
    sourcePath,
    "-vn",
    "-ac",
    "1",
    "-ar",
    "16000",
    "-b:a",
    "64k",
    "-f",
    "segment",
    "-segment_time",
    String(segmentSeconds),
    "-reset_timestamps",
    "1",
    outputPattern,
  ];

  await spawnProcess(ffmpegCommand, args);

  const segmentNames = (await fsp.readdir(tempDir))
    .filter((name) => name.endsWith(".mp3"))
    .sort((a, b) => a.localeCompare(b, "en"));

  if (segmentNames.length === 0) {
    throw new Error("ffmpeg produced no audio chunks.");
  }

  return segmentNames.map((name) => path.join(tempDir, name));
}

async function resolveFfmpegCommand(options) {
  const candidates = [options.ffmpegPath, process.env.FFMPEG_PATH, "ffmpeg", ffmpegPath].filter(Boolean);
  const seen = new Set();
  const errors = [];

  for (const candidate of candidates) {
    const normalized = candidate.toLowerCase();
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);

    try {
      await spawnProcess(candidate, ["-version"]);
      return candidate;
    } catch (error) {
      errors.push(`${candidate}: ${error.message}`);
    }
  }

  throw new Error(
    `No usable ffmpeg executable was found. Set --ffmpeg-path or FFMPEG_PATH. Tried: ${errors.join(" | ")}`,
  );
}

function isPlaceholderValue(value) {
  return !value || /your[-_]|example/i.test(value);
}

function pickConfiguredValue(...values) {
  return values.find((value) => value && !isPlaceholderValue(value));
}

function getResponseFormatForModel(model) {
  return /gpt-4o(?:-mini)?-transcribe/i.test(model) ? "json" : "verbose_json";
}

function createOpenAIClient(options) {
  const apiKey = pickConfiguredValue(process.env.OPENAI_API_KEY, process.env.OFFICIAL_API_KEY, process.env.API_KEY);
  const baseURL = pickConfiguredValue(
    options.baseURL,
    process.env.OPENAI_BASE_URL,
    process.env.OFFICIAL_BASE_URL,
    process.env.BASE_URL,
  );

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY or compatible API key environment variable.");
  }

  return new OpenAI({
    apiKey,
    baseURL: baseURL || undefined,
    timeout: options.requestTimeoutMs,
    maxRetries: 1,
  });
}

async function transcribeChunks(client, chunkPaths, options) {
  const transcripts = [];
  const responseFormat = getResponseFormatForModel(options.model);

  for (const chunkPath of chunkPaths) {
    console.log(`Transcribing chunk ${path.basename(chunkPath)} with model ${options.model}`);

    const request = {
      file: fs.createReadStream(chunkPath),
      model: options.model,
      response_format: responseFormat,
    };

    if (options.language) {
      request.language = options.language;
    }

    const response = await client.audio.transcriptions.create(request, {
      timeout: options.requestTimeoutMs,
    });

    transcripts.push({
      file: path.basename(chunkPath),
      text: normalizeText(response.text || ""),
      durationSeconds: typeof response.duration === "number" ? response.duration : null,
      language: response.language || options.language || "",
    });
  }

  return transcripts;
}

async function processPdfFile(file, options) {
  const outputPath = toOutputMarkdownPath(file.sourcePath, options.inputDir, options.outputDir);

  if (!options.overwrite) {
    try {
      await fsp.access(outputPath);
      return { status: "skipped", reason: "exists", outputPath };
    } catch {
      // continue
    }
  }

  const pdf = await extractPdfText(file.sourcePath);
  const relativeSource = path.relative(options.inputDir, file.sourcePath);

  const body = pdf.text
    ? `## Extracted Text\n\n${pdf.text}`
    : "## Extracted Text\n\nNo embedded text was found. This PDF is likely image-based or scanned and needs OCR.";

  const markdown = buildMarkdown({
    title: path.basename(file.sourcePath),
    metadata: {
      source_path: relativeSource,
      source_type: "pdf",
      page_count: pdf.pages,
      generated_at: new Date().toISOString(),
    },
    body,
  });

  await writeMarkdownFile(outputPath, markdown);
  return {
    status: "success",
    outputPath,
    extra: { pages: pdf.pages, hasText: Boolean(pdf.text) },
  };
}

async function processMediaFile(file, options, client) {
  const outputPath = toOutputMarkdownPath(file.sourcePath, options.inputDir, options.outputDir);

  if (!options.overwrite) {
    try {
      await fsp.access(outputPath);
      return { status: "skipped", reason: "exists", outputPath };
    } catch {
      // continue
    }
  }

  const tempRoot = await fsp.mkdtemp(path.join(os.tmpdir(), "file-to-md-"));

  try {
    const chunkPaths = await transcodeMediaToChunks(
      file.sourcePath,
      tempRoot,
      options.segmentSeconds,
      options.ffmpegCommand,
    );
    const transcripts = await transcribeChunks(client, chunkPaths, options);
    const mergedText = normalizeText(transcripts.map((item) => item.text).filter(Boolean).join("\n\n"));
    const relativeSource = path.relative(options.inputDir, file.sourcePath);

    const body = [
      "## Full Transcript",
      "",
      mergedText || "No transcript text was returned.",
      "",
      "## Chunk Details",
      "",
      formatTranscriptChunks(transcripts),
    ].join("\n");

    const markdown = buildMarkdown({
      title: path.basename(file.sourcePath),
      metadata: {
        source_path: relativeSource,
        source_type: file.kind,
        transcript_model: options.model,
        segment_count: transcripts.length,
        generated_at: new Date().toISOString(),
      },
      body,
    });

    await writeMarkdownFile(outputPath, markdown);

    return {
      status: "success",
      outputPath,
      extra: {
        segmentCount: transcripts.length,
        transcriptLength: mergedText.length,
      },
    };
  } finally {
    await fsp.rm(tempRoot, { recursive: true, force: true });
  }
}

async function runWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;

  const runWorker = async () => {
    while (true) {
      const current = cursor;
      cursor += 1;

      if (current >= items.length) {
        return;
      }

      results[current] = await worker(items[current], current);
    }
  };

  const workerCount = Math.max(1, Number.isFinite(concurrency) ? concurrency : 1);
  const tasks = Array.from({ length: workerCount }, () => runWorker());
  await Promise.all(tasks);
  return results;
}

function summarizeKinds(files) {
  return files.reduce((summary, file) => {
    summary[file.kind] = (summary[file.kind] || 0) + 1;
    return summary;
  }, {});
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  if (!options.inputDir) {
    throw new Error("Missing required argument: --input");
  }

  const stat = await fsp.stat(options.inputDir).catch(() => null);
  if (!stat || !stat.isDirectory()) {
    throw new Error(`Input directory not found: ${options.inputDir}`);
  }

  const files = await collectFiles(options);
  const kindSummary = summarizeKinds(files);

  console.log(`Matched ${files.length} files.`);
  console.log(`Kinds: ${JSON.stringify(kindSummary)}`);

  if (options.dryRun) {
    return;
  }

  await ensureDirectory(options.outputDir);

  let client = null;
  if (files.some((item) => item.kind === "audio" || item.kind === "video")) {
    options.ffmpegCommand = await resolveFfmpegCommand(options);
    client = createOpenAIClient(options);
  }

  let successCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  const results = await runWithConcurrency(files, options.concurrency, async (file, index) => {
    const label = `[${index + 1}/${files.length}] ${file.kind.toUpperCase()} ${file.sourcePath}`;
    console.log(`${label} -> start`);

    try {
      const result =
        file.kind === "pdf" ? await processPdfFile(file, options) : await processMediaFile(file, options, client);

      if (result.status === "success") {
        successCount += 1;
        console.log(`${label} -> done`);
      } else {
        skippedCount += 1;
        console.log(`${label} -> skipped (${result.reason})`);
      }

      return {
        sourcePath: file.sourcePath,
        kind: file.kind,
        ...result,
      };
    } catch (error) {
      failedCount += 1;
      console.error(`${label} -> failed: ${error.message}`);
      return {
        sourcePath: file.sourcePath,
        kind: file.kind,
        status: "failed",
        error: error.message,
      };
    }
  });

  const summaryPath = path.join(options.outputDir, "_run-summary.json");
  await fsp.writeFile(
    summaryPath,
    JSON.stringify(
      {
        inputDir: options.inputDir,
        outputDir: options.outputDir,
        counts: {
          matched: files.length,
          success: successCount,
          skipped: skippedCount,
          failed: failedCount,
        },
        kinds: kindSummary,
        generatedAt: new Date().toISOString(),
        results,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(`Finished. success=${successCount} skipped=${skippedCount} failed=${failedCount}`);
  console.log(`Summary: ${summaryPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
