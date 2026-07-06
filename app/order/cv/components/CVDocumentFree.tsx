import { withAlpha } from '../helpers'
import type { CVData } from '../types'

/**
 * Free CV template — deliberately minimal: single column, French only, one fixed
 * accent color, no photo. This is the "battel" (free) counterpart to the paid
 * multi-template documents.
 */
export const FREE_ACCENT = '#0F766E'

export function CVDocumentFree({ d }: { d: CVData }) {
  const filledExps      = d.exps.filter(e => e.position || e.company)
  const filledEdus      = d.edus.filter(e => e.degree || e.school)
  const filledSkills    = d.skills.filter(s => s.name)
  const filledLangs     = d.langs.filter(l => l.name)
  const filledInterests = d.interests.filter(i => i.name)

  const fullName = [d.firstName, d.lastName].filter(Boolean).join(' ') || 'Prénom Nom'
  const contacts = [
    d.phone,
    d.email,
    [d.address, d.city].filter(Boolean).join(', '),
    d.linkedin,
  ].filter(Boolean)

  const ACCENT = FREE_ACCENT
  const INK = '#0F172A'
  const MUTED = '#64748B'
  const BODY = '#374151'
  const font = '"Segoe UI", "Helvetica Neue", Arial, sans-serif'

  const secTitle: React.CSSProperties = {
    fontSize: '10pt',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: ACCENT,
    marginBottom: '9px',
    paddingBottom: '4px',
    borderBottom: `1.5px solid ${ACCENT}`,
  }

  const chip: React.CSSProperties = {
    fontSize: '9pt',
    color: '#115E59',
    background: withAlpha(ACCENT, 0.1),
    borderRadius: '5px',
    padding: '3px 9px',
    whiteSpace: 'nowrap',
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section style={{ marginBottom: '17px' }}>
      <div style={secTitle}>{title}</div>
      {children}
    </section>
  )

  return (
    <div style={{ width: '210mm', minHeight: '297mm', background: 'white', color: BODY, fontFamily: font, padding: '20mm 18mm', direction: 'ltr' }}>

      {/* Header — no photo */}
      <div style={{ borderBottom: `3px solid ${ACCENT}`, paddingBottom: '13px', marginBottom: '18px' }}>
        <div style={{ fontSize: '25pt', fontWeight: 'bold', color: INK, lineHeight: 1.1 }}>{fullName}</div>
        {d.jobTitle && <div style={{ fontSize: '12pt', color: ACCENT, marginTop: '4px' }}>{d.jobTitle}</div>}
        {contacts.length > 0 && (
          <div style={{ fontSize: '9pt', color: MUTED, marginTop: '9px', display: 'flex', flexWrap: 'wrap', gap: '3px 14px' }}>
            {contacts.map((c, i) => <span key={i}>{c}</span>)}
          </div>
        )}
      </div>

      {d.profile && (
        <Section title="Profil">
          <p style={{ fontSize: '9.5pt', lineHeight: 1.6, margin: 0 }}>{d.profile}</p>
        </Section>
      )}

      {filledExps.length > 0 && (
        <Section title="Expérience professionnelle">
          {filledExps.map(e => (
            <div key={e.id} style={{ marginBottom: '11px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '10pt', fontWeight: 'bold', color: INK }}>
                  {e.position}{e.company ? ` — ${e.company}` : ''}
                </span>
                <span style={{ color: MUTED, fontSize: '9pt', whiteSpace: 'nowrap' }}>
                  {[e.startDate, e.current ? 'Présent' : e.endDate].filter(Boolean).join(' – ')}
                </span>
              </div>
              {e.city && <div style={{ fontSize: '9pt', color: MUTED, marginTop: '1px' }}>{e.city}</div>}
              {e.description && <p style={{ fontSize: '9pt', lineHeight: 1.55, margin: '4px 0 0', color: '#4B5563' }}>{e.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {filledEdus.length > 0 && (
        <Section title="Formation">
          {filledEdus.map(e => (
            <div key={e.id} style={{ marginBottom: '7px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontSize: '10pt' }}>
                <span style={{ fontWeight: 'bold', color: INK }}>{e.degree}</span>
                {e.school ? ` — ${e.school}` : ''}{e.city ? `, ${e.city}` : ''}
              </span>
              {e.year && <span style={{ color: MUTED, fontSize: '9pt', whiteSpace: 'nowrap' }}>{e.year}</span>}
            </div>
          ))}
        </Section>
      )}

      {filledSkills.length > 0 && (
        <Section title="Compétences">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 7px' }}>
            {filledSkills.map(s => <span key={s.id} style={chip}>{s.name}</span>)}
          </div>
        </Section>
      )}

      {filledLangs.length > 0 && (
        <Section title="Langues">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px' }}>
            {filledLangs.map(l => (
              <span key={l.id} style={{ fontSize: '9.5pt' }}>
                <span style={{ fontWeight: 'bold', color: INK }}>{l.name}</span>
                <span style={{ color: MUTED }}>{['', ' — Débutant', ' — Intermédiaire', ' — Bon', ' — Courant', ' — Bilingue'][l.level] ?? ''}</span>
              </span>
            ))}
          </div>
        </Section>
      )}

      {filledInterests.length > 0 && (
        <Section title="Centres d'intérêt">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 7px' }}>
            {filledInterests.map(i => <span key={i.id} style={chip}>{i.name}</span>)}
          </div>
        </Section>
      )}
    </div>
  )
}
