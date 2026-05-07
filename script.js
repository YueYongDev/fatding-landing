document.getElementById('year').textContent = new Date().getFullYear();

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.feature, .capabilities, .pet-section, .download, .stage').forEach((el) => {
  el.classList.add('reveal');
  io.observe(el);
});

// Capability mockup modal
const modal = document.getElementById('capModal');
const modalBody = document.getElementById('modalBody');
let lastFocus = null;

function openCap (key) {
  const tpl = document.getElementById('mock-' + key);
  if (!tpl) return;
  modalBody.innerHTML = '';
  modalBody.appendChild(tpl.content.cloneNode(true));
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lastFocus = document.activeElement;
  modal.querySelector('.modal-close').focus();
}

function closeCap () {
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  modalBody.innerHTML = '';
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

document.querySelectorAll('.cap[data-cap]').forEach((card) => {
  const open = () => openCap(card.dataset.cap);
  card.addEventListener('click', open);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });
});

modal.addEventListener('click', (e) => {
  if (e.target.matches('[data-close]')) closeCap();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hidden) closeCap();
});

// Desktop download
const downloadButton = document.getElementById('downloadMac');
const downloadMeta = document.getElementById('downloadMeta');
const downloadSize = document.getElementById('downloadSize');
const downloadError = document.getElementById('downloadError');

function formatBytes (bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return null;
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const precision = value >= 100 || unitIndex === 0 ? 0 : 1;
  return `${value.toFixed(precision)} ${units[unitIndex]}`;
}

function getDownloadUrl (release) {
  if (!release || typeof release !== 'object') return null;
  return release.download_url || release.release_url || release.url || null;
}

function updateDownloadInfo (release) {
  if (downloadMeta && release.version) {
    downloadMeta.textContent = `v${release.version} · 同时支持 Apple Silicon 与 Intel`;
  }

  const size = formatBytes(Number(release.size));
  if (downloadSize && size) downloadSize.textContent = size;
}

function showDownloadError (message) {
  if (!downloadError) return;
  downloadError.textContent = message;
  downloadError.hidden = false;
}

async function requestLatestDesktopRelease (endpoint) {
  const response = await fetch(endpoint, {
    headers: { Accept: 'application/json' },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Latest release request failed: ${response.status}`);
  }

  return response.json();
}

async function fetchLatestDesktopRelease () {
  return requestLatestDesktopRelease(downloadButton.dataset.downloadEndpoint);
}

function startDownload (url) {
  const link = document.createElement('a');
  link.href = url;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

if (downloadButton) {
  fetchLatestDesktopRelease()
    .then(updateDownloadInfo)
    .catch(() => {
      if (downloadSize) downloadSize.textContent = '未知';
    });

  downloadButton.addEventListener('click', async (event) => {
    event.preventDefault();
    if (downloadButton.getAttribute('aria-busy') === 'true') return;

    const originalText = downloadButton.textContent;
    downloadButton.setAttribute('aria-busy', 'true');
    downloadButton.classList.add('is-loading');
    downloadButton.textContent = '正在获取安装包...';
    if (downloadError) downloadError.hidden = true;

    try {
      const release = await fetchLatestDesktopRelease();
      updateDownloadInfo(release);
      const url = getDownloadUrl(release);
      if (!url) throw new Error('Latest release response has no download URL');
      startDownload(url);
    } catch (error) {
      showDownloadError('下载地址获取失败，请稍后再试。');
    } finally {
      downloadButton.removeAttribute('aria-busy');
      downloadButton.classList.remove('is-loading');
      downloadButton.textContent = originalText;
    }
  });
}
