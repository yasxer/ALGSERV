const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_IDS = (process.env.TELEGRAM_CHAT_ID ?? '').split(',').map(s => s.trim()).filter(Boolean)
const TG = `https://api.telegram.org/bot${BOT_TOKEN}`

/** Sends an HTML message to every configured chat. No-op if Telegram is not configured. */
export async function sendTelegramMessage(text: string): Promise<void> {
  if (!BOT_TOKEN || CHAT_IDS.length === 0) {
    console.warn('[Telegram] Not configured — skipping notification')
    return
  }
  await Promise.all(
    CHAT_IDS.map(chat_id =>
      fetch(`${TG}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id, text, parse_mode: 'HTML' }),
      }).catch(err => console.error('[Telegram] sendMessage failed:', err))
    )
  )
}
