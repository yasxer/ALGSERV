import { translations, LangKey } from '@/lib/i18n'
import { withAlpha, darkenHex } from '../helpers'
import type { CVData } from '../types'
import { IIcon, CIcon } from './Icons'

export function CVDocumentGreen({ d, lang, accentColor = '#0E7C5A' }: { d: CVData; lang: LangKey; accentColor?: string }) {
  const isRTL = lang === 'ar'
  const t = translations[lang].cv

  const filledExps      = d.exps.filter(e => e.position || e.company)
  const filledEdus      = d.edus.filter(e => e.degree || e.school)
  const filledSkills    = [...d.skills, ...d.tools].filter(s => s.name)
  const filledLangs     = d.langs.filter(l => l.name)
  const filledInterests = d.interests.filter(i => i.name)

  const score = (d.profile ? 2 : 0) + filledExps.length * 3 + filledEdus.length * 2 + filledSkills.length * 0.5 + filledLangs.length * 0.5 + (filledInterests.length > 0 ? 1 : 0)
  const sparse = score < 5
  const dense  = score > 14

  const bodyFont   = sparse ? '10.5pt' : dense ? '8.5pt'  : '9.5pt'
  const secGap     = sparse ? 28       : dense ? 13       : 20
  const itemGap    = sparse ? 22       : dense ? 9        : 14
  const hdrPad     = sparse ? 38       : dense ? 24       : 32
  const nameSize   = sparse ? '26pt'   : dense ? '19pt'   : '22pt'
  const titleSize  = sparse ? '10pt'   : dense ? '7.5pt'  : '9pt'
  const circleSize = sparse ? 62       : dense ? 44       : 54
  const initFont   = sparse ? '20pt'   : dense ? '13pt'   : '17pt'
  const skillH     = sparse ? '4px'    : '3px'
  const skillGap   = sparse ? '10px'   : dense ? '5px'    : '7px'
  const langGap    = sparse ? '9px'    : dense ? '4px'    : '6px'

  const initials = [d.firstName?.[0], d.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?'
  const fullName = [d.firstName, d.lastName].filter(Boolean).join(' ') || (isRTL ? 'الاسم الكامل' : lang === 'en' ? 'Full Name' : 'Prénom Nom')
  const fontFamily = isRTL ? '"Arial", "Tahoma", sans-serif' : '"Segoe UI", "Helvetica Neue", Arial, sans-serif'

  const ACCENT = accentColor
  const DARK   = darkenHex(accentColor, 0.3)
  const LIGHT  = withAlpha(accentColor, 0.15)

  const secTitle: React.CSSProperties = {
    fontSize: '7pt', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.6px',
    color: ACCENT, marginBottom: '9px', paddingBottom: '5px',
    borderBottom: `1.5px solid ${ACCENT}`, display: 'block',
    textAlign: isRTL ? 'right' : 'left',
  }

  const dot: React.CSSProperties = {
    position: 'absolute', left: isRTL ? 'auto' : '-5px', right: isRTL ? '-5px' : 'auto',
    top: '5px', width: '8px', height: '8px', borderRadius: '50%',
    background: ACCENT, border: '1.5px solid white',
  }

  return (
    <div style={{ width: '210mm', minHeight: '297mm', fontFamily, direction: isRTL ? 'rtl' : 'ltr', color: '#1a1a1a', background: 'white', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: `linear-gradient(120deg, ${DARK} 0%, ${ACCENT} 100%)`, padding: `${hdrPad}px 32px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flex: 1, minWidth: 0, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
          <div style={{ width: `${circleSize}px`, height: `${circleSize}px`, borderRadius: '50%', background: 'rgba(255,255,255,0.14)', border: '2px solid rgba(255,255,255,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
            {d.photo
              ? <img src={d.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: initFont, fontWeight: 'bold', color: 'white' }}>{initials}</span>
            }
          </div>
          <div style={{ minWidth: 0, textAlign: isRTL ? 'right' : 'left' }}>
            <div style={{ fontSize: nameSize, fontWeight: 'bold', color: 'white', lineHeight: 1.1, letterSpacing: '-0.3px' }}>{fullName}</div>
            {d.jobTitle && <div style={{ fontSize: titleSize, color: '#a7f3d0', marginTop: '5px', letterSpacing: '0.4px' }}>{d.jobTitle}</div>}
          </div>
        </div>
        {(d.email || d.phone || d.address || d.city || d.linkedin) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '8pt', color: 'rgba(255,255,255,0.85)', textAlign: isRTL ? 'left' : 'right', flexShrink: 0 }}>
            {d.email    && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: isRTL ? 'flex-start' : 'flex-end' }}><CIcon type="email" size={9} color="rgba(255,255,255,0.85)" />{d.email}</div>}
            {d.phone    && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: isRTL ? 'flex-start' : 'flex-end' }}><CIcon type="phone" size={9} color="rgba(255,255,255,0.85)" />{d.phone}</div>}
            {(d.address || d.city) && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: isRTL ? 'flex-start' : 'flex-end' }}><CIcon type="location" size={9} color="rgba(255,255,255,0.85)" />{[d.address, d.city].filter(Boolean).join(', ')}</div>}
            {d.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: isRTL ? 'flex-start' : 'flex-end' }}><CIcon type="link" size={9} color="rgba(255,255,255,0.85)" />{d.linkedin}</div>}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row' }}>

        {/* Sidebar */}
        <div style={{ width: '64mm', background: '#F7FAF9', borderRight: isRTL ? 'none' : '1px solid #E8EDEB', borderLeft: isRTL ? '1px solid #E8EDEB' : 'none', padding: `${secGap}px 18px`, display: 'flex', flexDirection: 'column', gap: `${secGap}px` }}>
          {filledSkills.length > 0 && (
            <div>
              <div style={secTitle}>{t.cvSkills}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: skillGap }}>
                {filledSkills.map(s => (
                  <div key={s.id}>
                    <div style={{ fontSize: sparse ? '9.5pt' : '8.5pt', fontWeight: '500', color: '#1a1a1a', marginBottom: '3px', textAlign: isRTL ? 'right' : 'left' }}>{s.name}</div>
                    <div style={{ display: 'flex', gap: '2px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                      {[1,2,3,4,5].map(i => <div key={i} style={{ flex: 1, height: skillH, borderRadius: '2px', background: i <= s.level ? ACCENT : '#E8EDEB' }} />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {filledLangs.length > 0 && (
            <div>
              <div style={secTitle}>{t.cvLangs}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: langGap }}>
                {filledLangs.map(l => (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <span style={{ fontSize: sparse ? '9.5pt' : '8.5pt', fontWeight: '500', color: '#1a1a1a' }}>{l.name}</span>
                    <span style={{ fontSize: '7pt', fontWeight: '700', color: DARK, background: LIGHT, padding: '1px 5px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                      {t.levelLabels[Math.min(l.level, 5)] || ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {filledInterests.length > 0 && (
            <div>
              <div style={secTitle}>{t.cvInterests}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {filledInterests.map(interest => (
                  <span key={interest.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: sparse ? '8pt' : '7.5pt', background: LIGHT, color: DARK, padding: '2px 7px', borderRadius: '20px' }}>
                    <IIcon name={interest.icon} size={8} color={ACCENT} />
                    {interest.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {filledSkills.length === 0 && filledLangs.length === 0 && filledInterests.length === 0 && <div style={{ flex: 1 }} />}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: `${secGap}px 22px`, display: 'flex', flexDirection: 'column', gap: `${secGap}px` }}>
          {d.profile && (
            <div>
              <div style={secTitle}>{t.cvProfile}</div>
              <p style={{ fontSize: bodyFont, lineHeight: 1.78, color: '#334155', margin: 0, textAlign: isRTL ? 'right' : 'left' }}>{d.profile}</p>
            </div>
          )}
          {filledExps.length > 0 && (
            <div>
              <div style={secTitle}>{t.cvExp}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${itemGap}px` }}>
                {filledExps.map(e => (
                  <div key={e.id} style={{ position: 'relative', paddingLeft: isRTL ? 0 : '14px', paddingRight: isRTL ? '14px' : 0, borderLeft: isRTL ? 'none' : `2px solid ${LIGHT}`, borderRight: isRTL ? `2px solid ${LIGHT}` : 'none' }}>
                    <div style={dot} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '2px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                      <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                        <span style={{ fontWeight: 'bold', fontSize: sparse ? '11pt' : '10pt' }}>{e.position}</span>
                        {e.company && <span style={{ color: ACCENT, fontSize: sparse ? '10pt' : '9.5pt', marginLeft: isRTL ? 0 : '4px', marginRight: isRTL ? '4px' : 0 }}> — {e.company}</span>}
                      </div>
                      <span style={{ fontSize: '7.5pt', color: '#6b7280', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {[e.startDate, e.current ? t.present : e.endDate].filter(Boolean).join(' – ')}
                      </span>
                    </div>
                    {e.city && <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '7.5pt', color: '#6b7280', marginBottom: '4px', textAlign: isRTL ? 'right' : 'left' }}><CIcon type="location" size={8} color="#9ca3af" />{e.city}</div>}
                    {e.description && <div style={{ fontSize: bodyFont, color: '#374151', lineHeight: 1.65, whiteSpace: 'pre-line', marginTop: '4px', textAlign: isRTL ? 'right' : 'left' }}>{e.description}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {filledEdus.length > 0 && (
            <div>
              <div style={secTitle}>{t.cvEdu}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${Math.max(itemGap - 4, 6)}px` }}>
                {filledEdus.map(e => (
                  <div key={e.id} style={{ position: 'relative', paddingLeft: isRTL ? 0 : '14px', paddingRight: isRTL ? '14px' : 0, borderLeft: isRTL ? 'none' : `2px solid ${LIGHT}`, borderRight: isRTL ? `2px solid ${LIGHT}` : 'none' }}>
                    <div style={dot} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                      <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                        <span style={{ fontWeight: 'bold', fontSize: sparse ? '11pt' : '10pt' }}>{e.degree}</span>
                        {e.school && <span style={{ color: ACCENT, fontSize: sparse ? '10pt' : '9.5pt', marginLeft: isRTL ? 0 : '4px', marginRight: isRTL ? '4px' : 0 }}> — {e.school}</span>}
                      </div>
                      {e.year && <span style={{ fontSize: '7.5pt', color: '#6b7280', whiteSpace: 'nowrap', flexShrink: 0 }}>{e.year}</span>}
                    </div>
                    {e.city && <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '7.5pt', color: '#6b7280', textAlign: isRTL ? 'right' : 'left' }}><CIcon type="location" size={8} color="#9ca3af" />{e.city}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {!d.profile && filledExps.length === 0 && filledEdus.length === 0 && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '9pt', fontStyle: 'italic', textAlign: 'center' }}>
              {t.emptyPreview}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '7px 32px', borderTop: `1.5px solid ${LIGHT}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F7FAF9', flexShrink: 0 }}>
        <span style={{ fontSize: '6pt', color: '#6b7280', fontFamily }}>{fullName}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/algserv-logo.jpg" alt="ALGSERV" style={{ height: '14px', width: 'auto', opacity: 0.45, objectFit: 'contain' }} />
          <span style={{ fontSize: '6pt', color: '#6b7280', fontFamily, letterSpacing: '0.4px' }}>CV Professionnel</span>
        </div>
      </div>
    </div>
  )
}
