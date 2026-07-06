import type { CVData } from '../types'
import type { LangKey } from '@/lib/i18n'

/**
 * Recognised Canadian format. Deliberately omits photo, date of birth,
 * nationality, gender and marital status (anti-discrimination norms) and
 * emphasises a summary, achievements, languages and references on request.
 */
export const CA_ACCENT = '#0F172A'

const LEVELS = ['', 'Notions', 'Intermédiaire', 'Fonctionnel', 'Avancé', 'Courant']

const L: Record<LangKey, Record<string, string>> = {
  fr: { summary: 'Sommaire', exp: 'Expérience professionnelle', edu: 'Formation', skills: 'Compétences', langs: 'Langues', interests: "Centres d'intérêt", present: 'Présent', refs: 'Références disponibles sur demande' },
  en: { summary: 'Summary', exp: 'Professional experience', edu: 'Education', skills: 'Skills', langs: 'Languages', interests: 'Interests', present: 'Present', refs: 'References available upon request' },
  ar: { summary: 'الملخص المهني', exp: 'الخبرة المهنية', edu: 'التعليم', skills: 'المهارات', langs: 'اللغات', interests: 'الاهتمامات', present: 'حالياً', refs: 'المراجع متوفرة عند الطلب' },
}

export function CVDocumentCanadian({ d, lang = 'fr', accentColor = CA_ACCENT }: { d: CVData; lang?: LangKey; accentColor?: string }) {
  const isRTL = lang === 'ar'
  const t = L[lang] ?? L.fr
  const ACCENT = accentColor

  const filledExps      = d.exps.filter(e => e.position || e.company)
  const filledEdus      = d.edus.filter(e => e.degree || e.school)
  const filledSkills    = d.skills.filter(s => s.name)
  const filledLangs     = d.langs.filter(l => l.name)
  const filledInterests = d.interests.filter(i => i.name)

  const fullName = [d.firstName, d.lastName].filter(Boolean).join(' ') || 'Prénom Nom'
  const contacts = [d.phone, d.email, [d.address, d.city].filter(Boolean).join(', '), d.linkedin].filter(Boolean)
  const INK = '#0F172A', MUTED = '#64748B', BODY = '#374151'
  const font = isRTL ? '"Arial", "Tahoma", sans-serif' : '"Segoe UI", "Helvetica Neue", Arial, sans-serif'

  const secTitle: React.CSSProperties = {
    fontSize: '10pt', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px',
    color: ACCENT, marginBottom: '9px', paddingBottom: '4px', borderBottom: `1.5px solid ${ACCENT}`,
    textAlign: isRTL ? 'right' : 'left',
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section style={{ marginBottom: '16px' }}><div style={secTitle}>{title}</div>{children}</section>
  )

  return (
    <div style={{ width: '210mm', minHeight: '297mm', background: 'white', color: BODY, fontFamily: font, padding: '20mm 18mm', direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }}>

      {/* Header — no photo, no personal identifiers */}
      <div style={{ textAlign: 'center', borderBottom: `2.5px solid ${ACCENT}`, paddingBottom: '13px', marginBottom: '17px' }}>
        <div style={{ fontSize: '24pt', fontWeight: 'bold', color: INK, lineHeight: 1.1, letterSpacing: '0.5px' }}>{fullName}</div>
        {d.jobTitle && <div style={{ fontSize: '11.5pt', color: ACCENT, marginTop: '4px' }}>{d.jobTitle}</div>}
        {contacts.length > 0 && (
          <div style={{ fontSize: '9pt', color: MUTED, marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '2px 12px', justifyContent: 'center' }}>
            {contacts.map((c, i) => <span key={i}>{c}</span>)}
          </div>
        )}
      </div>

      {d.profile && (
        <Section title={t.summary}>
          <p style={{ fontSize: '9.5pt', lineHeight: 1.6, margin: 0 }}>{d.profile}</p>
        </Section>
      )}

      {filledExps.length > 0 && (
        <Section title={t.exp}>
          {filledExps.map(e => (
            <div key={e.id} style={{ marginBottom: '11px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <span style={{ fontSize: '10pt', fontWeight: 'bold', color: INK }}>{e.position}{e.company ? ` — ${e.company}` : ''}</span>
                <span style={{ color: MUTED, fontSize: '9pt', whiteSpace: 'nowrap' }}>{[e.startDate, e.current ? t.present : e.endDate].filter(Boolean).join(' – ')}</span>
              </div>
              {e.city && <div style={{ fontSize: '9pt', color: MUTED, marginTop: '1px' }}>{e.city}</div>}
              {e.description && <p style={{ fontSize: '9pt', lineHeight: 1.55, margin: '4px 0 0', color: '#4B5563' }}>{e.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {filledEdus.length > 0 && (
        <Section title={t.edu}>
          {filledEdus.map(e => (
            <div key={e.id} style={{ marginBottom: '7px', display: 'flex', justifyContent: 'space-between', gap: '10px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span style={{ fontSize: '10pt' }}><span style={{ fontWeight: 'bold', color: INK }}>{e.degree}</span>{e.school ? ` — ${e.school}` : ''}{e.city ? `, ${e.city}` : ''}</span>
              {e.year && <span style={{ color: MUTED, fontSize: '9pt', whiteSpace: 'nowrap' }}>{e.year}</span>}
            </div>
          ))}
        </Section>
      )}

      {filledSkills.length > 0 && (
        <Section title={t.skills}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 7px' }}>
            {filledSkills.map(s => <span key={s.id} style={{ fontSize: '9pt', border: `1px solid ${ACCENT}`, color: ACCENT, borderRadius: '5px', padding: '2px 9px' }}>{s.name}</span>)}
          </div>
        </Section>
      )}

      {filledLangs.length > 0 && (
        <Section title={t.langs}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px' }}>
            {filledLangs.map(l => (
              <span key={l.id} style={{ fontSize: '9.5pt' }}>
                <span style={{ fontWeight: 'bold', color: INK }}>{l.name}</span>
                <span style={{ color: MUTED }}>{LEVELS[l.level] ? ` — ${LEVELS[l.level]}` : ''}</span>
              </span>
            ))}
          </div>
        </Section>
      )}

      {filledInterests.length > 0 && (
        <Section title={t.interests}>
          <div style={{ fontSize: '9.5pt', color: BODY }}>{filledInterests.map(i => i.name).join(' · ')}</div>
        </Section>
      )}

      <p style={{ fontSize: '8.5pt', color: MUTED, fontStyle: 'italic', marginTop: '8px', textAlign: 'center' }}>{t.refs}</p>
    </div>
  )
}
