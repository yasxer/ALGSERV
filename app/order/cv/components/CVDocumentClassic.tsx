import { translations, LangKey } from '@/lib/i18n'
import { withAlpha } from '../helpers'
import type { CVData } from '../types'
import { IIcon, CIcon } from './Icons'

export function CVDocumentClassic({ d, lang, accentColor = '#8B5E3C' }: { d: CVData; lang: LangKey; accentColor?: string }) {
  const isRTL = lang === 'ar'
  const t = translations[lang].cv

  const filledExps      = d.exps.filter(e => e.position || e.company)
  const filledEdus      = d.edus.filter(e => e.degree || e.school)
  const filledSkills    = d.skills.filter(s => s.name)
  const filledTools     = d.tools.filter(s => s.name)
  const filledLangs     = d.langs.filter(l => l.name)
  const filledInterests = d.interests.filter(i => i.name)

  const fullName = [d.firstName, d.lastName].filter(Boolean).join(' ') || (isRTL ? 'الاسم الكامل' : lang === 'en' ? 'Full Name' : 'Prénom Nom')
  const initials = [d.firstName?.[0], d.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?'

  const fontFamily  = isRTL ? '"Arial", "Tahoma", sans-serif' : '"Segoe UI", "Helvetica Neue", Arial, sans-serif'
  const serifFamily = isRTL ? '"Arial", "Tahoma", sans-serif' : '"Georgia", "Times New Roman", serif'

  const ACCENT  = accentColor
  const ACCENT2 = withAlpha(accentColor, 0.5)
  const ACCENT3 = withAlpha(accentColor, 0.15)
  const BODY    = '#2d2d2d'
  const MUTED   = '#888'

  /* ── decorative helpers ─────────────────────────────────── */

  /* flanking ornament line: ─── ❖ ─── */
  const OrnamentDivider = ({ color = ACCENT2, my = 0 }: { color?: string; my?: number }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', margin: `${my}px auto`, width: '60%', justifyContent: 'center' }}>
      <div style={{ flex: 1, height: '1px', background: color }} />
      <svg width="8" height="8" viewBox="0 0 8 8"><polygon points="4,0 8,4 4,8 0,4" fill={color} /></svg>
      <div style={{ flex: 1, height: '1px', background: color }} />
    </div>
  )

  /* section title with small diamond prefix */
  const secTitle = (extra?: React.CSSProperties): React.CSSProperties => ({
    display: 'flex' as const,
    alignItems: 'center',
    gap: '6px',
    fontSize: '7.5pt',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
    color: BODY,
    marginBottom: '10px',
    paddingBottom: '5px',
    borderBottom: `1px solid ${ACCENT2}`,
    flexDirection: (isRTL ? 'row-reverse' : 'row') as 'row' | 'row-reverse',
    ...extra,
  })

  const Diamond = ({ size = 5 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 6 6" style={{ flexShrink: 0 }}>
      <polygon points="3,0 6,3 3,6 0,3" fill={ACCENT} />
    </svg>
  )

  return (
    <div style={{ width: '210mm', minHeight: '297mm', fontFamily, direction: isRTL ? 'rtl' : 'ltr', color: BODY, background: 'white', display: 'flex', flexDirection: 'column', border: `1px solid ${ACCENT3}` }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', padding: '28px 32px 0', background: `linear-gradient(180deg, ${ACCENT3} 0%, white 100%)` }}>

        {/* top thin accent line */}
        <div style={{ height: '3px', background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`, marginBottom: '18px' }} />

        {/* Name */}
        <div style={{ fontSize: '25pt', fontFamily: serifFamily, fontWeight: '400', letterSpacing: '6px', color: '#111', lineHeight: 1.1, textTransform: 'uppercase' }}>
          {fullName}
        </div>

        {/* CV label with flanking lines */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', margin: '8px 0 14px' }}>
          <div style={{ flex: 1, maxWidth: '60px', height: '1px', background: ACCENT2 }} />
          <span style={{ fontSize: '6.5pt', letterSpacing: '7px', color: MUTED, textTransform: 'uppercase' }}>CV</span>
          <div style={{ flex: 1, maxWidth: '60px', height: '1px', background: ACCENT2 }} />
        </div>

        {/* Monogram — double ring */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <div style={{ position: 'relative', width: '80px', height: '80px' }}>
            {/* outer decorative ring */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1px solid ${ACCENT2}` }} />
            {/* gap ring */}
            <div style={{ position: 'absolute', inset: '5px', borderRadius: '50%', border: `2px solid ${ACCENT}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: ACCENT3 }}>
              {d.photo
                ? <img src={d.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '17pt', fontWeight: 'bold', color: ACCENT, fontFamily: serifFamily }}>{initials}</span>
              }
            </div>
            {/* 4 small corner diamonds */}
            {[[-1,-1],[1,-1],[1,1],[-1,1]].map(([sx, sy], i) => (
              <svg key={i} width="6" height="6" viewBox="0 0 6 6"
                style={{ position: 'absolute', top: sx < 0 ? '-1px' : 'auto', bottom: sx > 0 ? '-1px' : 'auto', left: sy < 0 ? '50%' : 'auto', right: sy > 0 ? '50%' : 'auto', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
                <polygon points="3,0 6,3 3,6 0,3" fill={ACCENT} />
              </svg>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contact bar ─────────────────────────────────────── */}
      {(d.phone || d.email || d.city || d.address || d.linkedin) && (
        <div style={{ padding: '7px 32px 9px', display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', fontSize: '7.5pt', color: MUTED, borderTop: `1px solid ${ACCENT3}`, borderBottom: `1px solid ${ACCENT3}`, background: ACCENT3 }}>
          {d.phone    && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CIcon type="phone"    size={9} color={MUTED} />{d.phone}</span>}
          {d.email    && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CIcon type="email"    size={9} color={MUTED} />{d.email}</span>}
          {(d.city || d.address) && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CIcon type="location" size={9} color={MUTED} />{[d.address, d.city].filter(Boolean).join(', ')}</span>}
          {d.linkedin && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CIcon type="link"     size={9} color={MUTED} />{d.linkedin}</span>}
        </div>
      )}

      {/* ── Summary ─────────────────────────────────────────── */}
      {d.profile && (
        <div style={{ padding: '12px 32px 10px' }}>
          {/* ornament before SUMMARY */}
          <OrnamentDivider my={0} />
          <div style={{ textAlign: 'center', margin: '6px 0' }}>
            <span style={{ fontSize: '7pt', fontWeight: 'bold', letterSpacing: '3px', textTransform: 'uppercase', color: ACCENT }}>
              {t.sProfile}
            </span>
          </div>
          <OrnamentDivider my={0} />
          {/* summary box with double border effect */}
          <div style={{ position: 'relative', marginTop: '8px' }}>
            <div style={{ border: `1px solid ${ACCENT2}`, padding: '9px 14px', fontSize: '8.5pt', color: '#444', lineHeight: 1.75, textAlign: isRTL ? 'right' : 'left' }}>
              {d.profile}
            </div>
            {/* corner accents */}
            {[{top:'-3px',left:'-3px'},{top:'-3px',right:'-3px'},{bottom:'-3px',left:'-3px'},{bottom:'-3px',right:'-3px'}].map((pos,i) => (
              <div key={i} style={{ position: 'absolute', width: '6px', height: '6px', border: `2px solid ${ACCENT}`, ...pos as React.CSSProperties }} />
            ))}
          </div>
        </div>
      )}

      {/* ── Ornament divider before columns ─────────────────── */}
      <OrnamentDivider my={6} />

      {/* ── Two columns ─────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row' }}>

        {/* Left column */}
        <div style={{
          width: '68mm', padding: '14px 14px 16px 28px',
          borderRight: isRTL ? 'none' : `1px solid ${ACCENT3}`,
          borderLeft:  isRTL ? `1px solid ${ACCENT3}` : 'none',
          display: 'flex', flexDirection: 'column', gap: '18px',
        }}>

          {filledSkills.length > 0 && (
            <div>
              <div style={secTitle()}><Diamond />{t.cvSkills}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {filledSkills.map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', fontSize: '8.5pt', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <svg width="5" height="5" viewBox="0 0 5 5" style={{ flexShrink: 0, marginTop: '4px' }}><polygon points="2.5,0 5,2.5 2.5,5 0,2.5" fill={ACCENT} /></svg>
                    <span>{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filledEdus.length > 0 && (
            <div>
              <div style={secTitle()}><Diamond />{t.cvEdu}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filledEdus.map(e => (
                  <div key={e.id} style={{ textAlign: isRTL ? 'right' : 'left', paddingLeft: isRTL ? 0 : '8px', paddingRight: isRTL ? '8px' : 0, borderLeft: isRTL ? 'none' : `2px solid ${ACCENT3}`, borderRight: isRTL ? `2px solid ${ACCENT3}` : 'none' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '8.5pt', color: '#111' }}>{e.degree}</div>
                    {e.school && <div style={{ fontSize: '8pt', color: ACCENT, fontStyle: 'italic' }}>{e.school}{e.city ? `, ${e.city}` : ''}</div>}
                    {e.year   && <div style={{ fontSize: '7.5pt', color: MUTED, marginTop: '1px' }}>{e.year}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(d.birthDate || d.nationality || d.maritalStatus || d.license) && (
            <div>
              <div style={secTitle()}><Diamond />{t.cvPersonal}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '8pt', color: BODY, textAlign: isRTL ? 'right' : 'left' }}>
                {d.birthDate     && <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexDirection: isRTL ? 'row-reverse' : 'row' }}><CIcon type="calendar" size={9} color={MUTED} />{d.birthDate}</div>}
                {d.nationality   && <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexDirection: isRTL ? 'row-reverse' : 'row' }}><CIcon type="flag"     size={9} color={MUTED} />{d.nationality}</div>}
                {d.maritalStatus && <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexDirection: isRTL ? 'row-reverse' : 'row' }}><CIcon type="heart"    size={9} color={MUTED} />{d.maritalStatus}</div>}
                {d.license       && <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexDirection: isRTL ? 'row-reverse' : 'row' }}><CIcon type="id"       size={9} color={MUTED} />{d.license}</div>}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ flex: 1, padding: '14px 28px 16px 14px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {filledExps.length > 0 && (
            <div>
              <div style={secTitle()}><Diamond />{t.cvExp}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {filledExps.map(e => (
                  <div key={e.id} style={{ textAlign: isRTL ? 'right' : 'left' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '9pt', color: '#111', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{e.position}</div>
                    {e.company && (
                      <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginTop: '2px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <span style={{ fontSize: '8pt', color: ACCENT, fontStyle: 'italic' }}>{e.company}{e.city ? ` — ${e.city}` : ''}</span>
                      </div>
                    )}
                    {(e.startDate || e.endDate || e.current) && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px', background: ACCENT3, padding: '1px 7px', borderRadius: '20px' }}>
                        <span style={{ fontSize: '7pt', color: ACCENT, fontWeight: 'bold' }}>
                          {[e.startDate, e.current ? t.present : e.endDate].filter(Boolean).join(' — ')}
                        </span>
                      </div>
                    )}
                    {e.description && (
                      <div style={{ marginTop: '5px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {e.description.split('\n').filter(l => l.trim()).map((line, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '8pt', color: '#444', lineHeight: 1.6, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                            <svg width="5" height="5" viewBox="0 0 5 5" style={{ flexShrink: 0, marginTop: '4px' }}><polygon points="2.5,0 5,2.5 2.5,5 0,2.5" fill={ACCENT} /></svg>
                            <span>{line}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {filledTools.length > 0 && (
            <div>
              <div style={secTitle()}><Diamond />{t.cvTools}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {filledTools.map(s => (
                  <span key={s.id} style={{ fontSize: '8pt', color: ACCENT, padding: '2px 9px', border: `0.5px solid ${ACCENT2}`, borderRadius: '2px' }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {filledLangs.length > 0 && (
            <div>
              <div style={secTitle()}><Diamond />{t.cvLangs}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {filledLangs.map(l => (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '8.5pt', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                      <svg width="5" height="5" viewBox="0 0 5 5" style={{ flexShrink: 0 }}><polygon points="2.5,0 5,2.5 2.5,5 0,2.5" fill={ACCENT} /></svg>
                      {l.name}
                    </div>
                    <span style={{ color: ACCENT, letterSpacing: '1px', fontSize: '9pt' }}>{'★'.repeat(l.level)}{'☆'.repeat(5 - l.level)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filledInterests.length > 0 && (
            <div>
              <div style={secTitle()}><Diamond />{t.cvInterests}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {filledInterests.map(interest => (
                  <span key={interest.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '7.5pt', color: ACCENT, padding: '2px 9px', border: `0.5px solid ${ACCENT2}`, borderRadius: '20px', background: ACCENT3 }}>
                    <IIcon name={interest.icon} size={8} color={ACCENT} />
                    {interest.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {filledExps.length === 0 && filledTools.length === 0 && filledLangs.length === 0 && filledInterests.length === 0 && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '9pt', fontStyle: 'italic', textAlign: 'center' }}>
              {t.emptyPreview}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
      <div style={{ padding: '7px 28px', borderTop: `1px solid ${ACCENT3}`, background: ACCENT3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: '6pt', color: MUTED, fontFamily }}>{fullName}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/algserv-logo.jpg" alt="ALGSERV" style={{ height: '14px', width: 'auto', opacity: 0.45, objectFit: 'contain' }} />
          <span style={{ fontSize: '6pt', color: MUTED, fontFamily, letterSpacing: '0.4px' }}>CV Professionnel</span>
        </div>
      </div>
    </div>
  )
}
