import { translations, LangKey } from '@/lib/i18n'
import { withAlpha } from '../helpers'
import type { CVData } from '../types'
import { IIcon, CIcon } from './Icons'

export function CVDocumentBlue({ d, lang, accentColor = '#1B4F8C' }: { d: CVData; lang: LangKey; accentColor?: string }) {
  const isRTL = lang === 'ar'
  const t = translations[lang].cv

  const filledExps      = d.exps.filter(e => e.position || e.company)
  const filledEdus      = d.edus.filter(e => e.degree || e.school)
  const filledSkills    = d.skills.filter(s => s.name)
  const filledTools     = d.tools.filter(s => s.name)
  const filledLangs     = d.langs.filter(l => l.name)
  const filledInterests = d.interests.filter(i => i.name)

  const score  = (d.profile ? 2 : 0) + filledExps.length * 3 + filledEdus.length * 2 + (filledSkills.length + filledTools.length) * 0.5 + filledLangs.length * 0.5 + (filledInterests.length > 0 ? 1 : 0)
  const sparse = score < 5
  const dense  = score > 14

  const nameSize   = sparse ? '26pt' : dense ? '18pt' : '22pt'
  const titleSize  = sparse ? '11pt' : dense ? '8pt'  : '9.5pt'
  const bodyFont   = sparse ? '10pt' : dense ? '8pt'  : '9pt'
  const hdrPad     = sparse ? 28     : dense ? 18     : 24
  const circleSize = sparse ? 100    : dense ? 72     : 88
  const initFont   = sparse ? '24pt' : dense ? '15pt' : '20pt'

  const BLUE = accentColor
  const SBG  = withAlpha(accentColor, 0.06)
  const BODY = '#374151'

  const fontFamily = isRTL
    ? '"Arial", "Tahoma", sans-serif'
    : '"Segoe UI", "Helvetica Neue", Arial, sans-serif'

  const secTitle = (extra?: React.CSSProperties): React.CSSProperties => ({
    display: 'block',
    fontSize: '7.5pt',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1.4px',
    color: BLUE,
    marginBottom: '8px',
    paddingBottom: '5px',
    borderBottom: `1.5px solid ${BLUE}`,
    textAlign: isRTL ? 'right' : 'left',
    ...extra,
  })

  const dot: React.CSSProperties = {
    width: '8px', height: '8px', borderRadius: '50%',
    background: BLUE, flexShrink: 0, marginTop: '5px',
  }

  const fullName = [d.firstName, d.lastName].filter(Boolean).join(' ') || (isRTL ? 'الاسم الكامل' : lang === 'en' ? 'Full Name' : 'Prénom Nom')
  const initials = [d.firstName?.[0], d.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?'

  return (
    <div style={{ width: '210mm', minHeight: '297mm', fontFamily, direction: isRTL ? 'rtl' : 'ltr', color: BODY, background: 'white', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: `${hdrPad + 8}px 28px ${hdrPad}px`, display: 'flex', alignItems: 'flex-start', gap: '18px', flexDirection: isRTL ? 'row-reverse' : 'row', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ width: `${circleSize}px`, height: `${circleSize}px`, borderRadius: '50%', background: '#E0E7EF', border: `2px solid ${BLUE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
          {d.photo
            ? <img src={d.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: initFont, fontWeight: 'bold', color: BLUE }}>{initials}</span>
          }
        </div>
        <div style={{ flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
          <div style={{ fontSize: nameSize, fontWeight: 'bold', color: '#0F172A', lineHeight: 1.1, marginBottom: '4px' }}>{fullName}</div>
          {d.jobTitle && <div style={{ fontSize: titleSize, color: BLUE, marginBottom: '8px', letterSpacing: '0.2px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{d.jobTitle}</div>}
          {d.profile  && <div style={{ fontSize: bodyFont, color: '#64748B', lineHeight: 1.65, maxWidth: '370px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{d.profile}</div>}
        </div>
      </div>

      {/* Contact bar */}
      {(d.phone || d.email || d.city || d.address || d.linkedin) && (
        <div style={{ padding: '8px 28px', display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: isRTL ? 'flex-end' : 'flex-start', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: '7.5pt', color: '#475569' }}>
          {d.phone    && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CIcon type="phone" size={10} color="#475569" />{d.phone}</span>}
          {d.email    && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CIcon type="email" size={10} color="#475569" />{d.email}</span>}
          {(d.city || d.address) && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CIcon type="location" size={10} color="#475569" />{[d.address, d.city].filter(Boolean).join(', ')}</span>}
          {d.linkedin && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CIcon type="link" size={10} color="#475569" />{d.linkedin}</span>}
        </div>
      )}

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row' }}>

        {/* Sidebar */}
        <div style={{ width: '68mm', background: SBG, padding: '18px 14px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px', borderRight: isRTL ? 'none' : '1px solid #E2E8F0', borderLeft: isRTL ? '1px solid #E2E8F0' : 'none' }}>

          {(d.birthDate || d.nationality || d.maritalStatus || d.license) && (
            <div>
              <span style={secTitle()}>{t.cvPersonal}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '8pt', color: BODY, textAlign: isRTL ? 'right' : 'left' }}>
                {d.birthDate     && <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexDirection: isRTL ? 'row-reverse' : 'row' }}><CIcon type="calendar" size={9} color="#64748B" />{d.birthDate}</div>}
                {d.nationality   && <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexDirection: isRTL ? 'row-reverse' : 'row' }}><CIcon type="flag" size={9} color="#64748B" />{d.nationality}</div>}
                {d.maritalStatus && <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexDirection: isRTL ? 'row-reverse' : 'row' }}><CIcon type="heart" size={9} color="#64748B" />{d.maritalStatus}</div>}
                {d.license       && <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexDirection: isRTL ? 'row-reverse' : 'row' }}><CIcon type="id" size={9} color="#64748B" />{d.license}</div>}
              </div>
            </div>
          )}

          {filledSkills.length > 0 && (
            <div>
              <span style={secTitle()}>{t.cvSkills}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {filledSkills.map(s => (
                  <div key={s.id}>
                    <div style={{ fontSize: '8pt', marginBottom: '3px', textAlign: isRTL ? 'right' : 'left' }}>{s.name}</div>
                    <div style={{ display: 'flex', gap: '2px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                      {[1,2,3,4,5].map(i => <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i <= s.level ? BLUE : '#D1DCE8' }} />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filledTools.length > 0 && (
            <div>
              <span style={secTitle()}>{t.cvTools}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {filledTools.map(s => (
                  <div key={s.id}>
                    <div style={{ fontSize: '8pt', marginBottom: '3px', textAlign: isRTL ? 'right' : 'left' }}>{s.name}</div>
                    <div style={{ display: 'flex', gap: '2px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                      {[1,2,3,4,5].map(i => <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i <= s.level ? BLUE : '#D1DCE8' }} />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filledLangs.length > 0 && (
            <div>
              <span style={secTitle()}>{t.cvLangs}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {filledLangs.map(l => (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '8pt', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <span>{l.name}</span>
                    <span style={{ color: BLUE, letterSpacing: '1px', fontSize: '9pt' }}>{'★'.repeat(l.level)}{'☆'.repeat(5 - l.level)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {filledExps.length > 0 && (
            <div>
              <span style={secTitle()}>{t.cvExp}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: sparse ? '22px' : dense ? '8px' : '14px' }}>
                {filledExps.map(e => (
                  <div key={e.id} style={{ display: 'flex', gap: '8px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <div style={{ width: '54px', flexShrink: 0, fontSize: '7pt', color: BLUE, fontWeight: 'bold', paddingTop: '3px', textAlign: isRTL ? 'left' : 'right', lineHeight: 1.4 }}>
                      {e.startDate && <div>{e.startDate}</div>}
                      <div>{e.current ? t.present : e.endDate}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={dot} />
                      <div style={{ flex: 1, width: '1.5px', background: '#C0CDE0', marginTop: '3px' }} />
                    </div>
                    <div style={{ flex: 1, paddingBottom: '6px', textAlign: isRTL ? 'right' : 'left' }}>
                      <div style={{ fontWeight: 'bold', fontSize: sparse ? '10.5pt' : '9pt', color: '#0F172A' }}>{e.position}</div>
                      {e.company && <div style={{ fontSize: '8pt', color: '#64748B', fontStyle: 'italic', marginBottom: '3px' }}>{e.company}{e.city ? `, ${e.city}` : ''}</div>}
                      {e.description && <div style={{ fontSize: bodyFont, color: BODY, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{e.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filledEdus.length > 0 && (
            <div>
              <span style={secTitle()}>{t.cvEdu}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: sparse ? '20px' : dense ? '6px' : '12px' }}>
                {filledEdus.map(e => (
                  <div key={e.id} style={{ display: 'flex', gap: '8px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <div style={{ width: '54px', flexShrink: 0, fontSize: '7pt', color: BLUE, fontWeight: 'bold', paddingTop: '3px', textAlign: isRTL ? 'left' : 'right' }}>{e.year}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={dot} />
                      <div style={{ flex: 1, width: '1.5px', background: '#C0CDE0', marginTop: '3px' }} />
                    </div>
                    <div style={{ flex: 1, paddingBottom: '5px', textAlign: isRTL ? 'right' : 'left' }}>
                      <div style={{ fontWeight: 'bold', fontSize: sparse ? '10.5pt' : '9pt', color: '#0F172A' }}>{e.degree}</div>
                      {e.school && <div style={{ fontSize: '8pt', color: '#64748B', fontStyle: 'italic' }}>{e.school}{e.city ? `, ${e.city}` : ''}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filledInterests.length > 0 && (
            <div>
              <span style={secTitle()}>{t.cvInterests}</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {filledInterests.map(interest => (
                  <span key={interest.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '7.5pt', background: withAlpha(BLUE, 0.1), color: BLUE, padding: '3px 9px', borderRadius: '20px', border: `0.5px solid ${withAlpha(BLUE, 0.2)}` }}>
                    <IIcon name={interest.icon} size={9} color={BLUE} />
                    {interest.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {filledExps.length === 0 && filledEdus.length === 0 && filledInterests.length === 0 && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '9pt', fontStyle: 'italic', textAlign: 'center' }}>
              {t.emptyPreview}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '7px 28px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: SBG, flexShrink: 0 }}>
        <span style={{ fontSize: '6pt', color: '#94a3b8', fontFamily }}>{fullName}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/algserv-logo.jpg" alt="ALGSERV" style={{ height: '14px', width: 'auto', opacity: 0.45, objectFit: 'contain' }} />
          <span style={{ fontSize: '6pt', color: '#94a3b8', fontFamily, letterSpacing: '0.4px' }}>CV Professionnel</span>
        </div>
      </div>
    </div>
  )
}
