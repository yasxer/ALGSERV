import { readFileSync } from 'fs'
import { join } from 'path'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_IDS = (process.env.TELEGRAM_CHAT_ID ?? '').split(',').map(s => s.trim()).filter(Boolean)
const TG = `https://api.telegram.org/bot${BOT_TOKEN}`

export const telegramConfigured = Boolean(BOT_TOKEN && CHAT_IDS.length > 0)

/**
 * Escapes user text for `parse_mode: 'HTML'`. Without it a single `<` or `&`
 * in a name or note makes Telegram reject the whole message (order lost).
 */
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** Calls a Bot API method, logging (never throwing) when Telegram refuses it. */
async function call(method: string, body: BodyInit, json = false): Promise<void> {
  try {
    const res = await fetch(`${TG}/${method}`, {
      method: 'POST',
      headers: json ? { 'Content-Type': 'application/json' } : undefined,
      body,
    })
    if (!res.ok) console.error(`[Telegram] ${method} failed:`, res.status, await res.text())
  } catch (err) {
    console.error(`[Telegram] ${method} failed:`, err)
  }
}

export function sendMessageTo(chatId: string, text: string): Promise<void> {
  return call('sendMessage', JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }), true)
}

export function sendFileTo(chatId: string, file: File, caption: string): Promise<void> {
  const fd = new FormData()
  fd.append('chat_id', chatId)
  fd.append('caption', caption)
  fd.append('document', file)
  return call('sendDocument', fd)
}

export async function sendLogoTo(chatId: string, caption: string): Promise<void> {
  let logo: File
  try {
    const buffer = readFileSync(join(process.cwd(), 'public', 'algserv-logo.jpg'))
    logo = new File([buffer], 'algserv-logo.jpg', { type: 'image/jpeg' })
  } catch {
    return // non-critical
  }
  const fd = new FormData()
  fd.append('chat_id', chatId)
  fd.append('caption', caption)
  fd.append('photo', logo)
  await call('sendPhoto', fd)
}

/** Runs `send` once per configured chat, in parallel. */
export async function forEachChat(send: (chatId: string) => Promise<void>): Promise<void> {
  await Promise.all(CHAT_IDS.map(send))
}

/** Sends an HTML message to every configured chat. No-op if Telegram is not configured. */
export async function sendTelegramMessage(text: string): Promise<void> {
  if (!telegramConfigured) {
    console.warn('[Telegram] Not configured — skipping notification')
    return
  }
  await forEachChat(chatId => sendMessageTo(chatId, text))
}
