'use client'

import { useCallback } from 'react'
import { translations, LangKey } from '@/lib/i18n'

const arHelp = translations['ar'].cv.help
import { uid, tN } from '../helpers'
import type { CVData, Exp, Edu, Skill, Lang, Interest } from '../types'
import { CVDocumentBlue } from './CVDocumentBlue'
import { CVDocumentGreen } from './CVDocumentGreen'
import { CVDocumentClassic } from './CVDocumentClassic'
import { CVDocumentFree } from './CVDocumentFree'
import { CVDocumentEuropean } from './CVDocumentEuropean'
import { CVDocumentCanadian } from './CVDocumentCanadian'
import { ColorPicker } from './ColorPicker'
import { printDocument } from '@/lib/printDoc'
import { IconPicker } from './IconPicker'
import { FormSection, DeleteBtn, AddBtn, LevelDots, StarLevel, inputCls, labelCls } from './FormHelpers'

type Props = {
  d: CVData
  setD: React.Dispatch<React.SetStateAction<CVData>>
  template: string
  lang: LangKey
  docLang: LangKey
  accentColor: string
  setAccentColor: (c: string) => void
  paid?: boolean
  onPay?: () => void
  paying?: boolean
  free?: boolean
  onTemplateChange?: (id: string) => void
}

export function CVForm({ d, setD, template, lang, docLang, accentColor, setAccentColor, paid, onPay, paying, free, onTemplateChange }: Props) {
  const t = translations[lang].cv
  const isRTL = lang === 'ar'
  const unlocked = paid || free
  const download = () => printDocument([d.firstName, d.lastName].filter(Boolean).join(' ') || 'CV')

  // Field visibility per CV format.
  const isPro = template === 'blue' || template === 'classic' || template === 'green'
  const showPhoto = !free && template !== 'canadian'
  const showPersonalExtra = template === 'blue' || template === 'european' // birth date, nationality, marital, licence
  const showTools = template === 'blue' || template === 'classic' || template === 'european'
  const showColor = !free && isPro
  const showSwitcher = isPro && !!onTemplateChange

  const set = useCallback(<K extends keyof CVData>(k: K, v: CVData[K]) => {
    setD(prev => ({ ...prev, [k]: v }))
  }, [setD])

  const handlePhoto = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => set('photo', ev.target?.result as string ?? '')
    reader.readAsDataURL(file)
  }, [set])

  const initials = [d.firstName?.[0], d.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?'

  function addExp()                                       { set('exps',      [...d.exps,      { id: uid(), position: '', company: '', city: '', startDate: '', endDate: '', current: false, description: '' }]) }
  function delExp(id: string)                             { set('exps',      d.exps.filter(e => e.id !== id)) }
  function setExp(id: string, f: keyof Exp, v: string | boolean) { set('exps', d.exps.map(e => e.id === id ? { ...e, [f]: v } : e)) }

  function addEdu()                                       { set('edus',      [...d.edus,      { id: uid(), degree: '', school: '', city: '', year: '' }]) }
  function delEdu(id: string)                             { set('edus',      d.edus.filter(e => e.id !== id)) }
  function setEdu(id: string, f: keyof Edu, v: string)   { set('edus',      d.edus.map(e => e.id === id ? { ...e, [f]: v } : e)) }

  function addSkill()                                     { set('skills',    [...d.skills,    { id: uid(), name: '', level: 3 }]) }
  function delSkill(id: string)                           { set('skills',    d.skills.filter(s => s.id !== id)) }
  function setSkill(id: string, f: keyof Skill, v: string | number) { set('skills', d.skills.map(s => s.id === id ? { ...s, [f]: v } : s)) }

  function addTool()                                      { set('tools',     [...d.tools,     { id: uid(), name: '', level: 3 }]) }
  function delTool(id: string)                            { set('tools',     d.tools.filter(s => s.id !== id)) }
  function setTool(id: string, f: keyof Skill, v: string | number)  { set('tools',  d.tools.map(s => s.id === id ? { ...s, [f]: v } : s)) }

  function addLang()                                      { set('langs',     [...d.langs,     { id: uid(), name: '', level: 3 }]) }
  function delLang(id: string)                            { set('langs',     d.langs.filter(l => l.id !== id)) }
  function setLang(id: string, f: keyof Lang, v: string | number)   { set('langs',  d.langs.map(l => l.id === id ? { ...l, [f]: v } : l)) }

  function addInterest()                                  { set('interests', [...d.interests, { id: uid(), name: '', icon: 'book' }]) }
  function delInterest(id: string)                        { set('interests', d.interests.filter(i => i.id !== id)) }
  function setInterest(id: string, f: keyof Interest, v: string) { set('interests', d.interests.map(i => i.id === id ? { ...i, [f]: v } : i)) }

  const CVDoc = template === 'free' ? CVDocumentFree
    : template === 'european' ? CVDocumentEuropean
    : template === 'canadian' ? CVDocumentCanadian
    : template === 'blue' ? CVDocumentBlue
    : template === 'classic' ? CVDocumentClassic
    : CVDocumentGreen

  const XBtn = ({ onClick }: { onClick: () => void }) => (
    <button type="button" onClick={onClick} className="shrink-0 text-ink-500 hover:text-red-500 transition-colors">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
    </button>
  )

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_288px] gap-6 items-start">

        {/* Form columns */}
        <div className="flex flex-col gap-4">

          {showSwitcher && (
            <FormSection title={t.chooseTemplate}>
              <div className="grid grid-cols-3 gap-2.5">
                {([
                  { id: 'blue',    hex: '#1B4F8C', name: t.templateBlue.name },
                  { id: 'classic', hex: '#8B5E3C', name: t.templateClassicCV.name },
                  { id: 'green',   hex: '#0E7C5A', name: t.templateGreen.name },
                ] as const).map(tpl => (
                  <button key={tpl.id} type="button" onClick={() => onTemplateChange(tpl.id)}
                    className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-xs font-semibold transition-all ${template === tpl.id ? 'shadow-sm' : 'border-border hover:border-ink-300'}`}
                    style={template === tpl.id ? { borderColor: tpl.hex, color: tpl.hex, background: `${tpl.hex}0d` } : { color: '#475569' }}>
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: tpl.hex }} />
                    <span className="truncate">{tpl.name}</span>
                  </button>
                ))}
              </div>
            </FormSection>
          )}

          {showColor && (
            <FormSection title={t.sColor}>
              <ColorPicker value={accentColor} onChange={setAccentColor} />
            </FormSection>
          )}

          <FormSection title={t.sPersonal} helpText={t.help.personal} helpTextAr={arHelp.personal}>
            {/* Photo — hidden for free and Canadian (photoless) formats */}
            {showPhoto && (
              <div className="mb-5">
                <label className={labelCls}>{t.photo}</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-surface shrink-0">
                    {d.photo
                      ? <img src={d.photo} alt="" className="w-full h-full object-cover" />
                      : <span className="text-xl font-bold text-ink-400">{initials}</span>
                    }
                  </div>
                  <div className="flex flex-col gap-2">
                    <input type="file" accept="image/*" onChange={handlePhoto}
                      className="text-xs text-ink-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 file:cursor-pointer file:transition-colors" />
                    {d.photo && (
                      <button type="button" onClick={() => set('photo', '')}
                        className="text-xs text-red-500 hover:text-red-700 text-left transition-colors">
                        {t.removePhoto}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>{t.firstName}</label>
                <input className={inputCls} type="text" value={d.firstName} onChange={e => set('firstName', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>{t.lastName}</label>
                <input className={inputCls} type="text" value={d.lastName} onChange={e => set('lastName', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>{t.jobTitle}</label>
                <input className={inputCls} type="text" value={d.jobTitle} onChange={e => set('jobTitle', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>{t.email}</label>
                <input className={inputCls} type="email" value={d.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>{t.phone}</label>
                <input className={inputCls} type="tel" value={d.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>{t.address}</label>
                <input className={inputCls} type="text" value={d.address} onChange={e => set('address', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>{t.city}</label>
                <input className={inputCls} type="text" value={d.city} onChange={e => set('city', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>{t.linkedin}</label>
                <input className={inputCls} type="text" value={d.linkedin} onChange={e => set('linkedin', e.target.value)} />
              </div>
              {showPersonalExtra && (
                <>
                  <div>
                    <label className={labelCls}>{t.birthDate}</label>
                    <input className={inputCls} type="text" placeholder="01/01/1995" value={d.birthDate} onChange={e => set('birthDate', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t.nationality}</label>
                    <input className={inputCls} type="text" value={d.nationality} onChange={e => set('nationality', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t.maritalStatus}</label>
                    <input className={inputCls} type="text" value={d.maritalStatus} onChange={e => set('maritalStatus', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t.license}</label>
                    <input className={inputCls} type="text" placeholder="B" value={d.license} onChange={e => set('license', e.target.value)} />
                  </div>
                </>
              )}
            </div>
          </FormSection>

          <FormSection title={t.sProfile} helpText={t.help.profile} helpTextAr={arHelp.profile}>
            <textarea className={inputCls + ' resize-none'} rows={4}
              value={d.profile} onChange={e => set('profile', e.target.value)} />
          </FormSection>

          <FormSection title={t.sExp} helpText={t.help.exp} helpTextAr={arHelp.exp}>
            {d.exps.length === 0 && <p className="text-xs text-ink-500 text-center py-4 mb-2">{t.noExp}</p>}
            {d.exps.map((exp, i) => (
              <div key={exp.id} className="border border-border rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-ink-500">{tN(t.expN, i + 1)}</span>
                  <DeleteBtn label={t.delete} onClick={() => delExp(exp.id)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>{t.position}</label>
                    <input className={inputCls} type="text" value={exp.position} onChange={e => setExp(exp.id, 'position', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t.company}</label>
                    <input className={inputCls} type="text" value={exp.company} onChange={e => setExp(exp.id, 'company', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t.city}</label>
                    <input className={inputCls} type="text" value={exp.city} onChange={e => setExp(exp.id, 'city', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t.startDate}</label>
                    <input className={inputCls} type="text" placeholder="Jan 2020" value={exp.startDate} onChange={e => setExp(exp.id, 'startDate', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t.endDate}</label>
                    <input className={inputCls} type="text" placeholder="Déc 2023" disabled={exp.current} value={exp.current ? '' : exp.endDate} onChange={e => setExp(exp.id, 'endDate', e.target.value)} />
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input type="checkbox" id={`cur-${exp.id}`} checked={exp.current} onChange={e => setExp(exp.id, 'current', e.target.checked)} className="accent-emerald-700 w-4 h-4" />
                    <label htmlFor={`cur-${exp.id}`} className="text-xs text-ink-700 cursor-pointer">{t.currentJob}</label>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>{t.taskDesc}</label>
                    <textarea className={inputCls + ' resize-none'} rows={3}
                      value={exp.description} onChange={e => setExp(exp.id, 'description', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
            <AddBtn onClick={addExp} label={t.addExp} />
          </FormSection>

          <FormSection title={t.sEdu} helpText={t.help.edu} helpTextAr={arHelp.edu}>
            {d.edus.length === 0 && <p className="text-xs text-ink-500 text-center py-4 mb-2">{t.noEdu}</p>}
            {d.edus.map((edu, i) => (
              <div key={edu.id} className="border border-border rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-ink-500">{tN(t.eduN, i + 1)}</span>
                  <DeleteBtn label={t.delete} onClick={() => delEdu(edu.id)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>{t.degree}</label>
                    <input className={inputCls} type="text" value={edu.degree} onChange={e => setEdu(edu.id, 'degree', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t.school}</label>
                    <input className={inputCls} type="text" value={edu.school} onChange={e => setEdu(edu.id, 'school', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t.city}</label>
                    <input className={inputCls} type="text" value={edu.city} onChange={e => setEdu(edu.id, 'city', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t.gradYear}</label>
                    <input className={inputCls} type="text" placeholder="2022" value={edu.year} onChange={e => setEdu(edu.id, 'year', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
            <AddBtn onClick={addEdu} label={t.addEdu} />
          </FormSection>

          <FormSection title={t.sSkills} helpText={t.help.skills} helpTextAr={arHelp.skills}>
            {d.skills.map((skill, i) => (
              <div key={skill.id} className="flex items-center gap-3 mb-3">
                <input className={inputCls} type="text" placeholder={`${t.skillName} ${i + 1}`}
                  value={skill.name} onChange={e => setSkill(skill.id, 'name', e.target.value)} />
                <LevelDots level={skill.level} onChange={n => setSkill(skill.id, 'level', n)} />
                <XBtn onClick={() => delSkill(skill.id)} />
              </div>
            ))}
            <AddBtn onClick={addSkill} label={t.addSkill} />
          </FormSection>

          {showTools && (
            <FormSection title={t.sTools} helpText={t.help.tools} helpTextAr={arHelp.tools}>
              {d.tools.map((tool, i) => (
                <div key={tool.id} className="flex items-center gap-3 mb-3">
                  <input className={inputCls} type="text" placeholder={`${t.toolName} ${i + 1}`}
                    value={tool.name} onChange={e => setTool(tool.id, 'name', e.target.value)} />
                  <LevelDots level={tool.level} onChange={n => setTool(tool.id, 'level', n)} />
                  <XBtn onClick={() => delTool(tool.id)} />
                </div>
              ))}
              <AddBtn onClick={addTool} label={t.addTool} />
            </FormSection>
          )}

          <FormSection title={t.sLangs} helpText={t.help.langs} helpTextAr={arHelp.langs}>
            {d.langs.map(l => (
              <div key={l.id} className="flex items-center gap-3 mb-3">
                <input className={inputCls} type="text" placeholder={t.langName}
                  value={l.name} onChange={e => setLang(l.id, 'name', e.target.value)} />
                <StarLevel level={l.level} onChange={n => setLang(l.id, 'level', n)} />
                <XBtn onClick={() => delLang(l.id)} />
              </div>
            ))}
            <AddBtn onClick={addLang} label={t.addLang} />
          </FormSection>

          <FormSection title={t.sInterests} helpText={t.help.interests} helpTextAr={arHelp.interests}>
            {d.interests.map((interest, i) => (
              <div key={interest.id} className="flex items-center gap-3 mb-3">
                <IconPicker value={interest.icon} onChange={icon => setInterest(interest.id, 'icon', icon)} />
                <input className={inputCls} type="text" placeholder={`${t.interestName} ${i + 1}`}
                  value={interest.name} onChange={e => setInterest(interest.id, 'name', e.target.value)} />
                <XBtn onClick={() => delInterest(interest.id)} />
              </div>
            ))}
            <AddBtn onClick={addInterest} label={t.addInterest} />
          </FormSection>
        </div>

        {/* Sticky preview */}
        <div className="hidden xl:block xl:sticky xl:top-20">
          <div className="border border-border rounded-2xl p-5 bg-white shadow-sm">
            <p className="text-xs font-semibold text-ink-900 mb-0.5">{t.preview}</p>
            <p className="text-xs text-slate-600 mb-4">{t.previewSub}</p>
            <div dir="ltr" className="w-full overflow-hidden rounded-xl border border-border bg-white mb-4" style={{ aspectRatio: '210 / 297' }}>
              <div style={{ transform: 'scale(0.312)', transformOrigin: 'top left', width: '794px', pointerEvents: 'none', userSelect: 'none' }}>
                <CVDoc d={d} lang={docLang} accentColor={accentColor} />
              </div>
            </div>
            {unlocked ? (
              <button type="button" onClick={download}
                className="w-full bg-emerald-700 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-emerald-500 active:scale-[.98] transition-all duration-200 flex items-center justify-center gap-2">
                <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
                  <path d="M9 12V3M9 12l-3-3M9 12l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 15h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {free ? ({ fr: 'Télécharger gratuitement', en: 'Download for free', ar: 'تحميل مجاني' }[lang] ?? 'Télécharger gratuitement') : t.download}
              </button>
            ) : (
              <button type="button" onClick={onPay} disabled={paying}
                className="w-full bg-emerald-700 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-emerald-500 active:scale-[.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60">
                {paying ? (
                  <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity=".3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                )}
                Payer 500 DA & Télécharger
              </button>
            )}
            {unlocked && <p className="text-[10px] text-ink-500 text-center mt-3">{t.printHint}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
