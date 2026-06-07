(() => {
  const STORAGE_KEY = 'xhsExporterMvpData';
  const PENDING_KEY = 'xhsExporterMvpPendingDetail';
  const PICK_BUTTON_CLASS = 'xhs-exporter-pick-btn';
  const DETAIL_BUTTON_CLASS = 'xhs-exporter-detail-btn';
  const PICKED_ATTR = 'data-xhs-exporter-picked';
  const FLOAT_ID = 'xhs-exporter-float';
  const AUTO_OPEN_DELAY_MS = 250;
  const AUTO_CLOSE_DELAY_MS = 600;

  function isVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) {
      return false;
    }
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function textOf(root, selectors) {
    for (const selector of selectors) {
      const el = root.querySelector(selector);
      if (el && isVisible(el)) {
        const value = (el.textContent || '').trim();
        if (value) return value;
      }
    }
    return '';
  }

  function cleanText(text) {
    return (text || '')
      .replace(/\u200b/g, '')
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function visibleTextOf(el) {
    if (!el || !isVisible(el)) return '';
    return cleanText(el.innerText || el.textContent || '');
  }

  function firstVisible(selectors, root = document) {
    for (const selector of selectors) {
      const nodes = root.querySelectorAll(selector);
      for (const node of nodes) {
        if (isVisible(node)) return node;
      }
    }
    return null;
  }

  function attrOf(root, selectors, attr) {
    for (const selector of selectors) {
      const el = root.querySelector(selector);
      if (el && isVisible(el)) {
        const value = (el.getAttribute(attr) || '').trim();
        if (value) return value;
      }
    }
    return '';
  }

  function absoluteUrl(url) {
    if (!url) return '';
    try {
      return new URL(url, location.href).href;
    } catch (_error) {
      return '';
    }
  }

  function collectVisibleMedia(root) {
    const media = [];
    const seen = new Set();
    const scope = root || document;

    scope.querySelectorAll('img, video, video source').forEach((node) => {
      const host = node.tagName.toLowerCase() === 'source' ? node.closest('video') : node;
      if (!isVisible(host)) return;

      const type = host.tagName.toLowerCase() === 'video' ? 'video' : 'image';
      const rawUrl = node.currentSrc || node.src || node.getAttribute('src') || node.getAttribute('data-src') || '';
      const url = absoluteUrl(rawUrl);
      if (!url || seen.has(url)) return;
      if (/^data:/.test(url) || /^blob:/.test(url)) return;

      seen.add(url);
      media.push({ type, url });
    });

    return media;
  }

  function detectPageType() {
    const path = location.pathname;
    if (/^\/explore\/[^/]+/.test(path) || getDetailOverlayRoot()) {
      return 'detail';
    }
    if (/^\/user\/profile\//.test(path) || document.querySelector('[data-e2e="user-profile"]')) {
      return 'profile';
    }
    return 'unknown';
  }

  function getDetailOverlayRoot() {
    return firstVisible([
      '[class*="note-detail-mask"]',
      '[class*="note-detail-container"]',
      '.note-detail-mask .note-content',
      '.note-detail-mask [class*="note-content"]',
      '[role="dialog"] .note-content',
      '[role="dialog"] [class*="note-content"]',
      '[role="dialog"] [class*="interaction"]',
      '[class*="modal"] .note-content',
      '[class*="modal"] [class*="note-content"]',
      '[class*="modal"] [class*="interaction"]'
    ]);
  }

  function getDetailRoot() {
    return getDetailOverlayRoot() || firstVisible([
      '.note-detail-mask .note-content',
      '.note-detail-mask [class*="note-content"]',
      '.note-container .note-content',
      '.note-container [class*="note-content"]',
      '[class*="note-detail"] [class*="note-content"]',
      '[class*="note-detail"] [class*="interaction"]',
      '[class*="interaction-container"]',
      '[class*="note-content"]'
    ]);
  }

  function getCardCandidates() {
    const selectors = [
      'section.note-item',
      'div.note-item',
      'a.cover',
      'a[href*="/explore/"]',
      'section a[href*="/explore/"]'
    ];
    const seen = new Set();
    const nodes = [];
    for (const selector of selectors) {
      document.querySelectorAll(selector).forEach((node) => {
        const card = node.closest('section, article, div') || node;
        if (!card || seen.has(card)) return;
        if (!isVisible(card)) return;
        seen.add(card);
        nodes.push(card);
      });
    }
    return nodes;
  }

  function normalizeCount(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  function noteIdFromUrl(url) {
    const match = String(url || '').match(/\/explore\/([^/?#]+)/);
    return match ? match[1] : '';
  }

  function extractCardItem(card, index = 0) {
    const linkEl = card.querySelector('a[href*="/explore/"]') || card.closest('a[href*="/explore/"]');
    const href = linkEl ? linkEl.href : '';
    const noteId = noteIdFromUrl(href);
    const title = textOf(card, [
      '.title span',
      '.title',
      '[class*="title"]',
      'img[alt]'
    ]) || attrOf(card, ['img[alt]'], 'alt');
    const author = textOf(card, [
      '.author .name',
      '.author',
      '[class*="author"] [class*="name"]'
    ]);
    const likes = normalizeCount(textOf(card, [
      '.like-wrapper .count',
      '.count',
      '[class*="like"] [class*="count"]'
    ]));
    const image = attrOf(card, ['img'], 'src');
    const type = card.querySelector('video, [class*="video"]') ? 'video' : 'normal';

    return {
      index,
      noteId,
      title,
      content: '',
      author,
      likes,
      image,
      media: image ? [{ type: 'image', url: image }] : [],
      type,
      link: href,
      sourceUrl: location.href,
      capturedAt: Date.now()
    };
  }

  function collectProfileCards() {
    const cards = getCardCandidates();
    const items = [];
    const dedupe = new Set();

    cards.forEach((card) => {
      const item = extractCardItem(card, items.length + 1);
      const key = item.noteId || [item.title, item.author, item.image].filter(Boolean).join('|');

      if (!key || dedupe.has(key)) return;
      dedupe.add(key);
      items.push(item);
    });

    return items;
  }

  function collectDetailNote() {
    const root = getDetailRoot() || document.body;
    const href = location.href;
    const noteId = noteIdFromUrl(href);
    const title = textOf(root, [
      '#detail-title',
      '[data-e2e="detail-title"]',
      '.title',
      '[class*="title"]'
    ]);
    const content = textOf(root, [
      '#detail-desc',
      '[data-e2e="detail-desc"]',
      '.desc',
      '.note-text',
      '.content',
      '[class*="desc"]',
      '[class*="note-text"]',
      '[class*="content"]'
    ]) || visibleTextOf(root);
    const author = textOf(document, [
      '.author-container .author-name',
      '.author-wrapper .name',
      '[class*="author"] [class*="name"]',
      '[class*="author-name"]'
    ]);
    const likes = normalizeCount(textOf(document, [
      '.like-wrapper .count',
      '.interact-container [class*="count"]',
      '[class*="like"] [class*="count"]'
    ]));
    const image = attrOf(document, [
      '.note-slider img',
      '.swiper img',
      'img'
    ], 'src');
    const media = collectVisibleMedia(root);
    const type = document.querySelector('video, [class*="video"]') ? 'video' : 'normal';

    if (!noteId && !title && !content) return [];

    return [{
      index: 1,
      noteId,
      title,
      content,
      author,
      likes,
      image,
      media: media.length ? media : image ? [{ type: 'image', url: image }] : [],
      type,
      link: href,
      sourceUrl: location.href,
      capturedAt: Date.now()
    }];
  }

  function collect() {
    const pageType = detectPageType();
    const items = pageType === 'profile' ? collectProfileCards() : pageType === 'detail' ? collectDetailNote() : [];
    return {
      pageType,
      pageUrl: location.href,
      count: items.length,
      capturedAt: Date.now(),
      items
    };
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

  async function addPickedItem(item) {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const stored = result[STORAGE_KEY] || {
      pageType: 'picked',
      pageUrl: location.href,
      capturedAt: Date.now(),
      items: []
    };
    const items = Array.isArray(stored.items) ? stored.items.slice() : [];
    const key = itemKey(item);
    const existingIndex = key ? items.findIndex((storedItem) => itemKey(storedItem) === key) : -1;

    if (existingIndex >= 0) {
      items[existingIndex] = mergeItem(items[existingIndex], item);
    } else {
      items.push({ ...item, index: items.length + 1 });
    }

    const payload = {
      ...stored,
      pageType: stored.pageType === 'detail' ? 'picked' : stored.pageType || 'picked',
      pageUrl: location.href,
      capturedAt: Date.now(),
      mode: 'picked',
      count: items.length,
      items
    };
    await chrome.storage.local.set({ [STORAGE_KEY]: payload });
    return payload;
  }

  async function setPendingDetail(item) {
    await chrome.storage.local.set({
      [PENDING_KEY]: {
        noteId: item.noteId || noteIdFromUrl(item.link),
        link: item.link,
        title: item.title,
        createdAt: Date.now()
      }
    });
  }

  async function clearPendingDetail() {
    await chrome.storage.local.remove(PENDING_KEY);
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function isSamePendingDetail(pending) {
    if (!pending) return false;
    const currentNoteId = noteIdFromUrl(location.href);
    if (pending.noteId && currentNoteId && pending.noteId === currentNoteId) return true;
    return pending.link && location.href.startsWith(pending.link);
  }

  async function waitForDetailItem(timeoutMs = 12000) {
    const startedAt = Date.now();
    while (Date.now() - startedAt < timeoutMs) {
      if (detectPageType() === 'detail') {
        const item = collectDetailNote()[0];
        if (item && (item.content || item.title || item.noteId)) return item;
      }
      await delay(500);
    }
    return null;
  }

  function setFloatHint(text) {
    const float = document.getElementById(FLOAT_ID);
    if (!float) return;
    const hint = document.createElement('div');
    hint.className = 'xhs-exporter-float-hint';
    hint.textContent = text;
    float.appendChild(hint);
    setTimeout(() => hint.remove(), 2400);
  }

  async function startPendingDetailCollector() {
    const result = await chrome.storage.local.get(PENDING_KEY);
    const pending = result[PENDING_KEY];
    if (!isSamePendingDetail(pending)) return;

    setFloatHint('正在采正文...');
    const item = await waitForDetailItem();
    if (!item) {
      setFloatHint('正文采集失败');
      return;
    }

    await addPickedItem(item);
    await clearPendingDetail();
    refreshFloat();
    setFloatHint(item.content ? '正文已采集' : '已采详情');
  }

  async function collectPendingDetailInCurrentPage(pending) {
    if (!pending) return;

    setFloatHint('正在打开详情...');
    const item = await waitForDetailItem();
    if (!item) {
      setFloatHint('正文采集失败');
      return;
    }

    const mergedItem = {
      ...item,
      noteId: item.noteId || pending.noteId || noteIdFromUrl(pending.link),
      link: item.link && item.link.includes('/explore/') ? item.link : pending.link || item.link,
      title: item.title || pending.title || ''
    };

    await addPickedItem(mergedItem);
    await clearPendingDetail();
    refreshFloat();
    setFloatHint(mergedItem.content ? '正文已采集' : '已采详情');
    await delay(AUTO_CLOSE_DELAY_MS);
    closeDetailOverlay();
  }

  function findVisibleCloseButton() {
    const selectors = [
      '[aria-label*="关闭"]',
      '[aria-label*="close" i]',
      '[title*="关闭"]',
      '[title*="close" i]',
      '[class*="close" i]',
      'button'
    ];
    const candidates = [];

    for (const selector of selectors) {
      document.querySelectorAll(selector).forEach((node) => {
        if (!isVisible(node)) return;
        const text = (node.textContent || '').trim();
        const label = [
          text,
          node.getAttribute('aria-label') || '',
          node.getAttribute('title') || '',
          node.className || ''
        ].join(' ');
        const rect = node.getBoundingClientRect();
        const looksLikeClose = /关闭|close|×|x/i.test(label);
        const isTopLeftRoundButton = rect.left < 80 && rect.top < 100 && rect.width <= 64 && rect.height <= 64;
        if (looksLikeClose || isTopLeftRoundButton) {
          candidates.push(node);
        }
      });
    }

    return candidates[0] || null;
  }

  function closeDetailOverlay() {
    if (!getDetailOverlayRoot()) return false;

    const closeButton = findVisibleCloseButton();
    if (closeButton && dispatchUserLikeClick(closeButton)) {
      return true;
    }

    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      which: 27,
      bubbles: true,
      cancelable: true
    }));
    return true;
  }

  function markButtonState(button, text) {
    button.textContent = text;
    button.disabled = true;
    setTimeout(() => {
      button.textContent = '采正文';
      button.disabled = false;
    }, 1200);
  }

  function findFollowButton() {
    const nodes = document.querySelectorAll('button, [role="button"], a');
    for (const node of nodes) {
      if (!isVisible(node)) continue;
      if (node.closest(`.${DETAIL_BUTTON_CLASS}`)) continue;
      const text = (node.textContent || '').replace(/\s+/g, '').trim();
      if (text === '关注' || text === '已关注') return node;
    }
    return null;
  }

  async function collectCurrentDetailFromButton(button) {
    try {
      button.textContent = '采集中';
      button.disabled = true;

      const item = collectDetailNote()[0] || await waitForDetailItem(3000);
      if (!item || !itemKey(item)) {
        markButtonState(button, '失败');
        setFloatHint('正文采集失败');
        return;
      }

      await addPickedItem(item);
      await clearPendingDetail();
      refreshFloat();
      setFloatHint(item.content ? '正文已采集' : '已采详情');
      markButtonState(button, '已采');
    } catch (_error) {
      markButtonState(button, '失败');
    }
  }

  function injectDetailCollectButton() {
    if (detectPageType() !== 'detail') return;
    if (document.querySelector(`.${DETAIL_BUTTON_CLASS}`)) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = DETAIL_BUTTON_CLASS;
    button.textContent = '采正文';
    button.title = '采集当前详情正文到本地缓存';
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      collectCurrentDetailFromButton(button);
    });

    const followButton = findFollowButton();
    if (followButton && followButton.parentElement) {
      followButton.parentElement.insertBefore(button, followButton);
      return;
    }

    const root = getDetailOverlayRoot() || document.body;
    button.classList.add(`${DETAIL_BUTTON_CLASS}--fixed`);
    root.appendChild(button);
  }

  function getCenterPoint(el) {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  function getCardOpenTarget(card) {
    const selectors = [
      'img',
      'video',
      '[class*="cover"]',
      '[class*="image"]',
      '[class*="poster"]',
      '[class*="mask"]'
    ];
    for (const selector of selectors) {
      const nodes = card.querySelectorAll(selector);
      for (const node of nodes) {
        if (!isVisible(node)) continue;
        if (node.closest(`.${PICK_BUTTON_CLASS}`)) continue;
        return node;
      }
    }
    return card;
  }

  function dispatchUserLikeClick(target) {
    if (!target || !isVisible(target)) return false;

    const point = getCenterPoint(target);
    const eventTarget = document.elementFromPoint(point.x, point.y) || target;
    const common = {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: point.x,
      clientY: point.y,
      button: 0,
      buttons: 1
    };

    const dispatchMouse = (type, extra = {}) => {
      eventTarget.dispatchEvent(new MouseEvent(type, { ...common, ...extra }));
    };
    const dispatchPointer = (type, extra = {}) => {
      if (typeof PointerEvent === 'function') {
        eventTarget.dispatchEvent(new PointerEvent(type, {
          ...common,
          pointerId: 1,
          pointerType: 'mouse',
          isPrimary: true,
          ...extra
        }));
      }
    };

    dispatchPointer('pointerover', { buttons: 0 });
    dispatchPointer('pointerenter', { bubbles: false, buttons: 0 });
    dispatchMouse('mouseover', { buttons: 0 });
    dispatchMouse('mouseenter', { bubbles: false, buttons: 0 });
    dispatchPointer('pointermove');
    dispatchMouse('mousemove');
    dispatchPointer('pointerdown');
    dispatchMouse('mousedown');
    dispatchPointer('pointerup', { buttons: 0 });
    dispatchMouse('mouseup', { buttons: 0 });
    dispatchMouse('click', { buttons: 0 });
    return true;
  }

  function injectPickButtons() {
    if (detectPageType() !== 'profile') return;

    getCardCandidates().forEach((card) => {
      if (card.getAttribute(PICKED_ATTR) === '1') return;
      const linkEl = card.querySelector('a[href*="/explore/"]') || card.closest('a[href*="/explore/"]');
      if (!linkEl) return;

      card.setAttribute(PICKED_ATTR, '1');
      if (window.getComputedStyle(card).position === 'static') {
        card.style.position = 'relative';
      }

      const button = document.createElement('button');
      button.type = 'button';
      button.className = PICK_BUTTON_CLASS;
      button.textContent = '采正文';
      button.title = '在当前页面打开这条笔记详情弹窗，加载后自动采集正文到本地缓存';
      button.addEventListener('click', async (event) => {
        event.preventDefault();
        event.stopPropagation();
        try {
          const item = extractCardItem(card);
          if (!itemKey(item)) {
            markButtonState(button, '失败');
            return;
          }
          await addPickedItem(item);
          const pending = {
            noteId: item.noteId || noteIdFromUrl(item.link),
            link: item.link,
            title: item.title,
            createdAt: Date.now()
          };
          await setPendingDetail(item);
          markButtonState(button, '打开中');
          await delay(AUTO_OPEN_DELAY_MS);
          dispatchUserLikeClick(getCardOpenTarget(card));
          collectPendingDetailInCurrentPage(pending);
        } catch (_error) {
          markButtonState(button, '失败');
        }
      });
      card.appendChild(button);
    });
  }

  function startButtonInjector() {
    if (document.getElementById('xhs-exporter-style')) return;

    const style = document.createElement('style');
    style.id = 'xhs-exporter-style';
    style.textContent = `
      .${PICK_BUTTON_CLASS} {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 20;
        border: 0;
        border-radius: 6px;
        padding: 6px 9px;
        background: rgba(17, 24, 39, 0.9);
        color: #fff;
        font-size: 12px;
        line-height: 1;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
      }
      .${PICK_BUTTON_CLASS}:disabled {
        opacity: 0.8;
        cursor: default;
      }
      .${DETAIL_BUTTON_CLASS} {
        flex: 0 0 auto;
        height: 40px;
        margin-right: 10px;
        border: 0;
        border-radius: 999px;
        padding: 0 18px;
        background: rgba(17, 24, 39, 0.92);
        color: #fff;
        font-size: 14px;
        font-weight: 700;
        line-height: 40px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
      }
      .${DETAIL_BUTTON_CLASS}:disabled {
        opacity: 0.8;
        cursor: default;
      }
      .${DETAIL_BUTTON_CLASS}--fixed {
        position: fixed;
        top: 54px;
        right: 168px;
        z-index: 2147483647;
      }
      #${FLOAT_ID} {
        position: fixed;
        right: 18px;
        bottom: 92px;
        z-index: 2147483647;
        min-width: 112px;
        border-radius: 12px;
        padding: 10px 12px;
        background: rgba(17, 24, 39, 0.94);
        color: #fff;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
        font-size: 12px;
        line-height: 1.35;
        user-select: none;
      }
      #${FLOAT_ID} .xhs-exporter-float-title {
        font-weight: 700;
        margin-bottom: 4px;
      }
      #${FLOAT_ID} .xhs-exporter-float-row {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        white-space: nowrap;
      }
      #${FLOAT_ID} .xhs-exporter-float-value {
        color: #ffccd5;
        font-weight: 700;
      }
      #${FLOAT_ID} .xhs-exporter-float-hint {
        margin-top: 6px;
        padding-top: 6px;
        border-top: 1px solid rgba(255, 255, 255, 0.16);
        color: #dbeafe;
        font-weight: 700;
      }
    `;
    document.documentElement.appendChild(style);

    injectPickButtons();
    injectDetailCollectButton();
    const observer = new MutationObserver(() => {
      injectPickButtons();
      injectDetailCollectButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function countContent(items) {
    return (Array.isArray(items) ? items : []).filter((item) => item.content && String(item.content).trim()).length;
  }

  async function refreshFloat() {
    const float = document.getElementById(FLOAT_ID);
    if (!float) return;

    const result = await chrome.storage.local.get(STORAGE_KEY);
    const payload = result[STORAGE_KEY] || {};
    const items = Array.isArray(payload.items) ? payload.items : [];
    const total = items.length;
    const contentTotal = countContent(items);

    float.innerHTML = `
      <div class="xhs-exporter-float-title">小红书采集</div>
      <div class="xhs-exporter-float-row"><span>总数</span><span class="xhs-exporter-float-value">${total}</span></div>
      <div class="xhs-exporter-float-row"><span>正文</span><span class="xhs-exporter-float-value">${contentTotal}</span></div>
    `;
  }

  function startFloatStatus() {
    if (document.getElementById(FLOAT_ID)) return;

    const float = document.createElement('div');
    float.id = FLOAT_ID;
    float.title = '显示本地已采集数量；正文需要打开详情页后在插件中点“开始采集”';
    float.innerHTML = `
      <div class="xhs-exporter-float-title">小红书采集</div>
      <div class="xhs-exporter-float-row"><span>总数</span><span class="xhs-exporter-float-value">0</span></div>
      <div class="xhs-exporter-float-row"><span>正文</span><span class="xhs-exporter-float-value">0</span></div>
    `;
    document.documentElement.appendChild(float);
    refreshFloat();

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes[STORAGE_KEY]) {
        refreshFloat();
      }
    });
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!message || !message.type) return;

    if (message.type === 'XHS_EXPORTER_COLLECT') {
      try {
        const payload = collect();
        sendResponse({ ok: true, payload });
      } catch (error) {
        sendResponse({ ok: false, error: error.message || String(error) });
      }
      return false;
    }

    if (message.type === 'XHS_EXPORTER_PING') {
      sendResponse({ ok: true, pageType: detectPageType(), url: location.href });
    }
  });

  startButtonInjector();
  startFloatStatus();
  startPendingDetailCollector();
})();
