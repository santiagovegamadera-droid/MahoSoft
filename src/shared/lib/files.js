export const formatSize = (n) =>
  n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`;

/**
 * Opens a file in a new tab once `download` (a promise of a Blob) resolves. The tab opens right away, so the
 * browser doesn't block it as a popup; it closes again if the download fails, and the error is rethrown.
 */
export async function openBlob(download) {
  const tab = window.open('', '_blank');
  try {
    const url = URL.createObjectURL(await download);
    if (tab) tab.location.href = url;
    else {
      // Popup blocked: a link click still opens it without leaving the app
      const link = Object.assign(document.createElement('a'), { href: url, target: '_blank', rel: 'noopener' });
      link.click();
    }
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch (err) {
    tab?.close();
    throw err;
  }
}

/** Saves a downloaded file (e.g. a report) with its name, through a temporary link */
export function saveBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), { href: url, download: name });
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
