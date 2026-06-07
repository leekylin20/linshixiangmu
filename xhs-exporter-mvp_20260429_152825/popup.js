const STORAGE_KEY = 'xhsExporterMvpData';

const collectBtn = document.getElementById('collectBtn');
const openNextBtn = document.getElementById('openNextBtn');
const downloadMediaBtn = document.getElementById('downloadMediaBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const clearBtn = document.getElementById('clearBtn');
const pageTypeEl = document.getElementById('pageType');
const countEl = document.getElementById('count');
const contentCountEl = document.getElementById('contentCount');
const pageUrlEl = document.getElementById('pageUrl');
const previewListEl = document.getElementById('previewList');
const messageEl = document.getElementById('message');

function setMessage(text) {
  messageEl.textContent = text;
}

function render(payload) {
  const data = payload || { pageType: '-', count: 0, pageUrl: '-', items: [] };
  const allItems = Array.isArray(data.items) ? data.items : [];
  const contentCount = allItems.filter((item) => item.content && String(item.content).trim()).length;
  pageTypeEl.textContent = data.pageType || '-';
  countEl.textContent = String(data.count || 0);
  contentCountEl.textContent = String(contentCount);
  pageUrlEl.textContent = data.pageUrl || '-';
  previewListEl.innerHTML = '';

  const items = allItems.slice(0, 10);
  if (!items.length) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = '暂无数据，请先打开小红书用户主页后点击开始采集。';
    previewListEl.appendChild(li);
    return;
  }

  items.forEach((item, idx) => {
    const li = document.createElement('li');
    li.className = 'preview-item';

    const title = document.createElement('div');
    title.className = 'preview-item-title';
    title.textContent = item.title || `未命名笔记 ${idx + 1}`;

    const meta = document.createElement('div');
    meta.className = 'preview-item-meta';
    meta.innerHTML = [
      item.author ? `作者：${escapeHtml(item.author)}` : '',
      item.likes ? `点赞：${escapeHtml(item.likes)}` : '',
      item.type ? `类型：${escapeHtml(item.type)}` : '',
      item.content ? '含正文' : '',
      Array.isArray(item.media) && item.media.length ? `媒体：${item.media.length}` : '',
      item.noteId ? `ID：${escapeHtml(item.noteId)}` : ''
    ].filter(Boolean).map(part => `<span>${part}</span>`).join('');

    li.appendChild(title);
    li.appendChild(meta);
    previewListEl.appendChild(li);
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function getCurrentTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

async function collect() {
  const tab = await getCurrentTab();
  if (!tab || !tab.id) {
    throw new Error('未找到当前标签页');
  }
  if (!tab.url || !tab.url.startsWith('https://www.xiaohongshu.com/')) {
    throw new Error('请先切到小红书网页后再采集');
  }

  let response;
  try {
    response = await chrome.tabs.sendMessage(tab.id, { type: 'XHS_EXPORTER_COLLECT' });
  } catch (_error) {
    throw new Error('当前页面尚未注入采集脚本，请刷新页面后重试');
  }

  if (!response || !response.ok) {
    throw new Error(response?.error || '采集失败');
  }
  return response.payload;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({
    url,
    filename,
    saveAs: true
  }, () => {
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  });
}

function makeJsonFilename() {
  return `xhs-export-${Date.now()}.json`;
}

function makeCsvFilename() {
  return `xhs-export-${Date.now()}.csv`;
}

function sanitizeFilename(value) {
  return String(value || 'xhs')
    .replace(/[\\/:*?"<>|]+/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 80);
}

function extensionFromUrl(url, type) {
  try {
    const path = new URL(url).pathname;
    const match = path.match(/\.([a-z0-9]{2,5})$/i);
    if (match) return match[1].toLowerCase();
  } catch (_error) {
    // fall through
  }
  return type === 'video' ? 'mp4' : 'jpg';
}

function csvEscape(value) {
  const text = value == null ? '' : String(value);
  const escaped = text.replace(/"/g, '""');
  return `"${escaped}"`;
}

function toCsv(payload) {
  const headers = ['序号', '笔记ID', '标题', '正文', '作者', '点赞数', '类型', '封面图', '链接', '来源页面', '采集时间'];
  const rows = [headers.map(csvEscape).join(',')];
  const items = Array.isArray(payload?.items) ? payload.items : [];

  items.forEach((item, index) => {
    const row = [
      index + 1,
      item.noteId || '',
      item.title || '',
      item.content || '',
      item.author || '',
      item.likes || '',
      item.type || '',
      item.image || '',
      item.link || '',
      item.sourceUrl || '',
      item.capturedAt ? new Date(item.capturedAt).toISOString() : ''
    ];
    rows.push(row.map(csvEscape).join(','));
  });

  return '\uFEFF' + rows.join('\n');
}

async function loadStored() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return result[STORAGE_KEY] || null;
}

async function saveStored(payload) {
  await chrome.storage.local.set({ [STORAGE_KEY]: payload });
  return payload;
}

async function clearStored() {
  await chrome.storage.local.remove(STORAGE_KEY);
}

function itemKey(item) {
  if (!item) return '';
  return item.noteId || item.link || [item.title, item.author, item.image].filter(Boolean).join('|');
}

function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function mergeItem(existing, incoming) {
  const merged = { ...(existing || {}) };
  Object.entries(incoming || {}).forEach(([key, value]) => {
    if (hasValue(value) || !hasValue(merged[key])) {
      merged[key] = value;
    }
  });
  return merged;
}

function getPendingItem(items) {
  return (items || []).find((item) => item.link && !item.content);
}

function getLatestMediaItem(items) {
  const list = Array.isArray(items) ? items : [];
  for (let index = list.length - 1; index >= 0; index -= 1) {
    const item = list[index];
    if (Array.isArray(item.media) && item.media.length) return item;
  }
  return null;
}

function mergePayload(stored, incoming) {
  const storedItems = Array.isArray(stored?.items) ? stored.items : [];
  const incomingItems = Array.isArray(incoming?.items) ? incoming.items : [];

  if (incoming?.pageType === 'profile') {
    const mergedItems = incomingItems.map((item) => {
      const key = itemKey(item);
      const previous = storedItems.find((storedItem) => itemKey(storedItem) === key);
      return previous ? mergeItem(item, previous) : item;
    });
    return {
      ...incoming,
      mode: 'append',
      items: mergedItems,
      count: mergedItems.length
    };
  }

  const mergedItems = storedItems.slice();
  incomingItems.forEach((item) => {
    const key = itemKey(item);
    const existingIndex = key ? mergedItems.findIndex((storedItem) => itemKey(storedItem) === key) : -1;
    if (existingIndex >= 0) {
      mergedItems[existingIndex] = mergeItem(mergedItems[existingIndex], item);
    } else {
      mergedItems.push(item);
    }
  });

  return {
    ...(stored || {}),
    pageType: incoming?.pageType || stored?.pageType || '-',
    pageUrl: incoming?.pageUrl || stored?.pageUrl || '-',
    capturedAt: Date.now(),
    mode: 'append',
    items: mergedItems,
    count: mergedItems.length
  };
}

collectBtn.addEventListener('click', async () => {
  try {
    collectBtn.disabled = true;
    setMessage('正在采集当前页面可见内容…');
    const payload = await collect();
    const stored = await loadStored();
    const merged = mergePayload(stored, payload);
    await saveStored(merged);
    render(merged);
    if (payload.pageType === 'profile') {
      setMessage(`已更新主页链接清单，共 ${merged.count || 0} 条。打开单条笔记详情后再次采集可回填正文。`);
    } else if (payload.pageType === 'detail') {
      setMessage(`已采集详情并追加/回填。当前累计 ${merged.count || 0} 条。`);
    } else {
      setMessage('当前页面不是已识别的用户主页或笔记详情，可能无法采到数据。');
    }
  } catch (error) {
    setMessage(`采集失败：${error.message || String(error)}`);
  } finally {
    collectBtn.disabled = false;
  }
});

clearBtn.addEventListener('click', async () => {
  try {
    await clearStored();
    render(null);
    setMessage('已清空本地采集数据。');
  } catch (error) {
    setMessage(`清空失败：${error.message || String(error)}`);
  }
});

openNextBtn.addEventListener('click', async () => {
  try {
    const payload = await loadStored();
    const item = getPendingItem(payload?.items || []);
    if (!item) {
      setMessage('没有待打开的链接。请先在主页采集链接，或所有链接都已采正文。');
      return;
    }
    const tab = await getCurrentTab();
    if (!tab || !tab.id) {
      throw new Error('未找到当前标签页');
    }
    await chrome.tabs.update(tab.id, { url: item.link });
    setMessage('已打开下一条。页面加载完成后，再点“开始采集”回填正文。');
  } catch (error) {
    setMessage(`打开失败：${error.message || String(error)}`);
  }
});

downloadMediaBtn.addEventListener('click', async () => {
  try {
    const payload = await loadStored();
    const item = getLatestMediaItem(payload?.items || []);
    if (!item) {
      setMessage('暂无可下载媒体。请先打开详情并点击“开始采集”。');
      return;
    }

    const media = item.media.filter((entry) => entry && entry.url);
    if (!media.length) {
      setMessage('当前记录没有可下载媒体链接。');
      return;
    }

    const baseName = sanitizeFilename(item.noteId || item.title || 'xhs-note');
    media.forEach((entry, index) => {
      const ext = extensionFromUrl(entry.url, entry.type);
      chrome.downloads.download({
        url: entry.url,
        filename: `xhs-media/${baseName}_${index + 1}.${ext}`,
        saveAs: false
      });
    });
    setMessage(`已触发 ${media.length} 个媒体下载。`);
  } catch (error) {
    setMessage(`下载失败：${error.message || String(error)}`);
  }
});

exportJsonBtn.addEventListener('click', async () => {
  const payload = await loadStored();
  if (!payload) {
    setMessage('暂无可导出的数据，请先采集。');
    return;
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
  downloadBlob(blob, makeJsonFilename());
  setMessage('已触发 JSON 导出。');
});

exportCsvBtn.addEventListener('click', async () => {
  const payload = await loadStored();
  if (!payload) {
    setMessage('暂无可导出的数据，请先采集。');
    return;
  }
  const items = Array.isArray(payload.items) ? payload.items : [];
  const contentCount = items.filter((item) => item.content && String(item.content).trim()).length;
  const blob = new Blob([toCsv(payload)], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, makeCsvFilename());
  setMessage(`已触发 CSV 导出。当前 ${items.length} 条，其中 ${contentCount} 条有正文。`);
});

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const payload = await loadStored();
    render(payload);
    if (payload) {
      setMessage('已加载最近一次采集结果。');
    }
  } catch (error) {
    setMessage(`初始化失败：${error.message || String(error)}`);
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local' || !changes[STORAGE_KEY]) return;
  const payload = changes[STORAGE_KEY].newValue || null;
  render(payload);
  if (payload) {
    setMessage(`已同步页面按钮采集结果，当前累计 ${payload.count || 0} 条。`);
  }
});
