import { NextRequest, NextResponse, after } from 'next/server'
import { telegramConfigured, escapeHtml, sendTelegramMessage } from '@/lib/telegram'

export async function POST(req: NextRequest) {
  if (!telegramConfigured) {
    return NextResponse.json({ error: 'Telegram not configured' }, { status: 500 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
  if (typeof body.fullName !== 'string' || !body.fullName.trim() || typeof body.phone !== 'string' || !body.phone.trim()) {
    return NextResponse.json({ error: 'Missing name or phone' }, { status: 400 })
  }

  const serviceType = body.serviceType // 'web-dev' | 'app-dev'
  const features = body.features
  // client + project info, escaped for Telegram HTML
  const [fullName, phone, email, wilaya, projectType, platform, hasDesign, budget, timeline, description] =
    (['fullName', 'phone', 'email', 'wilaya', 'projectType', 'platform', 'hasDesign', 'budget', 'timeline', 'description'] as const)
      .map(k => escapeHtml(body[k]))

  const reqId = Date.now().toString(36).toUpperCase()
  const now   = new Date().toLocaleString('fr-DZ', { timeZone: 'Africa/Algiers' })

  const serviceLabel = serviceType === 'web-dev' ? '🌐 تطوير مواقع ويب' : '📱 تطوير تطبيقات موبايل'

  const featuresText = Array.isArray(features) && features.length > 0
    ? features.map(escapeHtml).join(' / ')
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

  after(() => sendTelegramMessage(message))

  return NextResponse.json({ ok: true })
}
