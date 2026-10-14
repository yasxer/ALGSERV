import { printDocument } from './printDoc'

const NOTIFIED_KEY = 'notified_downloads'
const MAX_KEYS = 50

export interface DownloadInfo {
  service: string
  variant?: string
  clientName: string
  clientPhone?: string
}

function alreadyNotified(key: string): boolean {
  try {
    const keys: string[] = JSON.parse(localStorage.getItem(NOTIFIED_KEY) ?? '[]')
    if (keys.includes(key)) return true
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...keys, key].slice(-MAX_KEYS)))
  } catch { /* storage unavailable — fall through and notify */ }
  return false
}

/**
 * Pings the owner on Telegram (once per document — re-downloading the same
 * client's document does not ping again) and opens the print dialog.
 * Resolves when the print dialog closes.
 */
export async function downloadDocument(info: DownloadInfo): Promise<void> {
  const key = [info.service, info.variant, info.clientName, info.clientPhone].join('|')
  if (!alreadyNotified(key)) {
    fetch('/api/notify-download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    }).catch(() => {})
  }
  await printDocument(info.clientName)
}
