import { NextRequest, NextResponse, after } from 'next/server'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const CHAT_IDS  = (process.env.TELEGRAM_CHAT_ID ?? '').split(',').map(s => s.trim()).filter(Boolean)
const TG        = `https://api.telegram.org/bot${BOT_TOKEN}`

async function sendMessage(chatId: string, text: string) {
  await fetch(`${TG}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })
}

export async function POST(req: NextRequest) {
  if (!BOT_TOKEN || CHAT_IDS.length === 0) {
    return NextResponse.json({ error: 'Telegram not configured' }, { status: 500 })
  }

  const body = await req.json()
  const {
    serviceType, // 'web-dev' | 'app-dev'
    // client info
    fullName, phone, email, wilaya,
    // project info
    projectType, platform, features, hasDesign, budget, timeline, description,
  } = body

  const reqId = Date.now().toString(36).toUpperCase()
  const now   = new Date().toLocaleString('fr-DZ', { timeZone: 'Africa/Algiers' })

  const serviceLabel = serviceType === 'web-dev' ? '🌐 تطوير مواقع ويب' : '📱 تطوير تطبيقات موبايل'

  const featuresText = Array.isArray(features) && features.length > 0
    ? features.join(' / ')
    : '—'

  const platformLine = serviceType === 'app-dev' && platform
    ? `\n• المنصة: ${platform}`
    : ''

  const message = `
🆕 <b>طلب خدمة احترافية</b>  |  #${reqId}
🕒 ${now}

🛠 <b>نوع الخدمة:</b> ${serviceLabel}

👤 <b>معلومات الزبون:</b>
• الاسم الكامل: <b>${fullName}</b>
• الهاتف (WhatsApp): ${phone}${email ? `\n• البريد: ${email}` : ''}
• الولاية: ${wilaya}

💼 <b>معلومات المشروع:</b>
• نوع المشروع: ${projectType}${platformLine}
• الميزات المطلوبة: ${featuresText}
• التصميم: ${hasDesign}
• الميزانية: ${budget}
• المدة: ${timeline}

📝 <b>وصف المشروع:</b>
${description || '—'}
  `.trim()

  after(async () => {
    await Promise.all(CHAT_IDS.map(id => sendMessage(id, message)))
  })

  return NextResponse.json({ ok: true })
}
