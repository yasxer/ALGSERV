import { withAlpha } from '../helpers'
import type { CVData } from '../types'
import { CIcon } from './Icons'
import type { LangKey } from '@/lib/i18n'

/** Recognised European (Europass-inspired) format: photo, personal details, CEFR languages. */
export const EU_ACCENT = '#003399'

const CEFR = ['', 'A1', 'A2', 'B1', 'B2', 'C1'] // level 1..5 → CEFR

const L: Record<LangKey, Record<string, string>> = {
  fr: { personal: 'Informations personnelles', dob: 'Date de naissance', nat: 'Nationalité', permis: 'Permis de conduire', profile: 'Profil', exp: 'Expérience professionnelle', edu: 'Éducation et formation', langs: 'Compétences linguistiques', skills: 'Compétences', tools: 'Compétences numériques', interests: "Centres d'intérêt", present: 'Présent' },
  en: { personal: 'Personal information', dob: 'Date of birth', nat: 'Nationality', permis: 'Driving licence', profile: 'Profile', exp: 'Work experience', edu: 'Education and training', langs: 'Language skills', skills: 'Skills', tools: 'Digital skills', interests: 'Interests', present: 'Present' },
  ar: { personal: 'المعلومات الشخصية', dob: 'تاريخ الميلاد', nat: 'الجنسية', permis: 'رخصة السياقة', profile: 'الملف الشخصي', exp: 'الخبرة المهنية', edu: 'التعليم والتكوين', langs: 'المهارات اللغوية', skills: 'المهارات', tools: 'المهارات الرقمية', interests: 'الاهتمامات', present: 'حالياً' },
}

export function CVDocumentEuropean({ d, lang = 'fr', accentColor = EU_ACCENT }: { d: CVData; lang?: LangKey; accentColor?: string }) {
  const isRTL = lang === 'ar'
  const t = L[lang] ?? L.fr
  const ACCENT = accentColor

  const filledExps      = d.exps.filter(e => e.position || e.company)
  const filledEdus      = d.edus.filter(e => e.degree || e.school)
  const filledSkills    = d.skills.filter(s => s.name)
  const filledTools     = d.tools.filter(s => s.name)
  const filledLangs     = d.langs.filter(l => l.name)
  const filledInterests = d.interests.filter(i => i.name)

  const fullName = [d.firstName, d.lastName].filter(Boolean).join(' ') || 'Prénom Nom'
  const initials = [d.firstName?.[0], d.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?'
  const INK = '#0F172A', MUTED = '#64748B', BODY = '#374151'
  const font = isRTL ? '"Arial", "Tahoma", sans-serif' : '"Segoe UI", "Helvetica Neue", Arial, sans-serif'

  const secTitle: React.CSSProperties = {
    fontSize: '9pt', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px',
    color: ACCENT, marginBottom: '8px', paddingBottom: '4px', borderBottom: `1.5px solid ${ACCENT}`,
    textAlign: isRTL ? 'right' : 'left',
  }
  const sideTitle: React.CSSProperties = { ...secTitle, fontSize: '8pt' }

  return (
    <div style={{ width: '210mm', minHeight: '297mm', background: 'white', color: BODY, fontFamily: font, direction: isRTL ? 'rtl' : 'ltr', display: 'flex', flexDirection: 'column' }}>

      {/* Header band */}
      <div style={{ background: ACCENT, color: 'white', padding: '22px 26px', display: 'flex', alignItems: 'center', gap: '18px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
        <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
          {d.photo
            ? <img src={d.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: '22pt', fontWeight: 'bold', color: 'white' }}>{initials}</span>}
        </div>
        <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
          <div style={{ fontSize: '23pt', fontWeight: 'bold', lineHeight: 1.1 }}>{fullName}</div>
          {d.jobTitle && <div style={{ fontSize: '11pt', opacity: 0.9, marginTop: '4px' }}>{d.jobTitle}</div>}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row' }}>

        {/* Sidebar */}
        <div style={{ width: '66mm', background: withAlpha(ACCENT, 0.05), padding: '20px 15px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={sideTitle}>{t.personal}</div>
            <div style={{ fontSize: '8.5pt', lineHeight: 1.7, color: BODY }}>
              {d.birthDate && <div><span style={{ color: MUTED }}>{t.dob}: </span>{d.birthDate}</div>}
              {d.nationality && <div><span style={{ color: MUTED }}>{t.nat}: </span>{d.nationality}</div>}
              {d.license && <div><span style={{ color: MUTED }}>{t.permis}: </span>{d.license}</div>}
              {d.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}><CIcon type="phone" size={9} color={ACCENT} />{d.phone}</div>}
              {d.email && <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><CIcon type="email" size={9} color={ACCENT} />{d.email}</div>}
              {(d.address || d.city) && <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><CIcon type="location" size={9} color={ACCENT} />{[d.address, d.city].filter(Boolean).join(', ')}</div>}
              {d.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><CIcon type="link" size={9} color={ACCENT} />{d.linkedin}</div>}
            </div>
          </div>

          {filledLangs.length > 0 && (
            <div>
              <div style={sideTitle}>{t.langs}</div>
              {filledLangs.map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8.5pt', marginBottom: '3px' }}>
                  <span style={{ color: INK }}>{l.name}</span>
                  <span style={{ fontWeight: 'bold', color: ACCENT }}>{CEFR[l.level] ?? ''}</span>
                </div>
              ))}
            </div>
          )}

          {filledSkills.length > 0 && (
            <div>
              <div style={sideTitle}>{t.skills}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {filledSkills.map(s => <span key={s.id} style={{ fontSize: '8pt', background: withAlpha(ACCENT, 0.1), color: ACCENT, borderRadius: '4px', padding: '2px 7px' }}>{s.name}</span>)}
              </div>
            </div>
          )}

          {filledTools.length > 0 && (
            <div>
              <div style={sideTitle}>{t.tools}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {filledTools.map(s => <span key={s.id} style={{ fontSize: '8pt', background: withAlpha(ACCENT, 0.1), color: ACCENT, borderRadius: '4px', padding: '2px 7px' }}>{s.name}</span>)}
              </div>
            </div>
          )}

          {filledInterests.length > 0 && (
            <div>
              <div style={sideTitle}>{t.interests}</div>
              <div style={{ fontSize: '8.5pt', color: BODY, lineHeight: 1.6 }}>{filledInterests.map(i => i.name).join(' · ')}</div>
            </div>
          )}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {d.profile && (
            <div>
              <div style={secTitle}>{t.profile}</div>
              <p style={{ fontSize: '9.5pt', lineHeight: 1.6, margin: 0 }}>{d.profile}</p>
            </div>
          )}

          {filledExps.length > 0 && (
            <div>
              <div style={secTitle}>{t.exp}</div>
              {filledExps.map(e => (
                <div key={e.id} style={{ marginBottom: '11px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <span style={{ fontSize: '10pt', fontWeight: 'bold', color: INK }}>{e.position}{e.company ? ` — ${e.company}` : ''}</span>
                    <span style={{ color: MUTED, fontSize: '8.5pt', whiteSpace: 'nowrap' }}>{[e.startDate, e.current ? t.present : e.endDate].filter(Boolean).join(' – ')}</span>
                  </div>
                  {e.city && <div style={{ fontSize: '8.5pt', color: MUTED }}>{e.city}</div>}
                  {e.description && <p style={{ fontSize: '9pt', lineHeight: 1.55, margin: '3px 0 0', color: '#4B5563' }}>{e.description}</p>}
                </div>
              ))}
            </div>
          )}

          {filledEdus.length > 0 && (
            <div>
              <div style={secTitle}>{t.edu}</div>
              {filledEdus.map(e => (
                <div key={e.id} style={{ marginBottom: '7px', display: 'flex', justifyContent: 'space-between', gap: '10px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <span style={{ fontSize: '9.5pt' }}><span style={{ fontWeight: 'bold', color: INK }}>{e.degree}</span>{e.school ? ` — ${e.school}` : ''}{e.city ? `, ${e.city}` : ''}</span>
                  {e.year && <span style={{ color: MUTED, fontSize: '8.5pt', whiteSpace: 'nowrap' }}>{e.year}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
