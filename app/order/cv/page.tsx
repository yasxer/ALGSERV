'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

// ─── Types ────────────────────────────────────────────────────────────────────

type Exp      = { id: string; position: string; company: string; city: string; startDate: string; endDate: string; current: boolean; description: string }
type Edu      = { id: string; degree: string; school: string; city: string; year: string }
type Skill    = { id: string; name: string; level: number }
type Lang     = { id: string; name: string; level: number }
type Interest = { id: string; name: string; icon: string }

type CVData = {
  firstName: string; lastName: string; jobTitle: string
  email: string; phone: string; address: string; city: string; linkedin: string
  birthDate: string; nationality: string; maritalStatus: string; license: string
  profile: string
  photo: string
  exps: Exp[]; edus: Edu[]
  skills: Skill[]; tools: Skill[]; langs: Lang[]
  interests: Interest[]
}

let _c = 0
function uid() { return String(++_c) }

const BLANK: CVData = {
  firstName: '', lastName: '', jobTitle: '',
  email: '', phone: '', address: '', city: '', linkedin: '',
  birthDate: '', nationality: '', maritalStatus: '', license: '',
  profile: '', photo: '',
  exps: [], edus: [], skills: [], tools: [], langs: [],
  interests: [
    { id: uid(), name: '', icon: 'book' },
    { id: uid(), name: '', icon: 'music' },
  ],
}

// ─── i18n ────────────────────────────────────────────────────────────────────

type LangKey = 'fr' | 'en' | 'ar'

const T = {
  fr: {
    firstName: 'Prénom', lastName: 'Nom', jobTitle: 'Titre / Poste visé',
    email: 'Email', phone: 'Téléphone', address: 'Adresse', city: 'Ville',
    linkedin: 'LinkedIn / Site web',
    birthDate: 'Date de naissance', nationality: 'Nationalité',
    maritalStatus: 'Situation familiale', license: 'Permis de conduire',
    photo: 'Photo (optionnel)', removePhoto: 'Supprimer',
    position: 'Poste', company: 'Entreprise', startDate: 'Début', endDate: 'Fin',
    currentJob: 'Poste actuel', taskDesc: 'Missions & réalisations',
    degree: 'Diplôme / Certification', school: 'Établissement', gradYear: "Année d'obtention",
    skillName: 'Compétence', toolName: 'Outil (Word, Excel…)', langName: 'Langue',
    interestName: "Centre d'intérêt",
    sPersonal: 'Informations personnelles', sProfile: 'Profil / Résumé',
    sExp: 'Expérience professionnelle', sEdu: 'Formation',
    sSkills: 'Compétences', sTools: 'Outils informatiques',
    sLangs: 'Langues', sInterests: "Centres d'intérêt",
    addExp: 'Ajouter une expérience', addEdu: 'Ajouter une formation',
    addSkill: 'Ajouter une compétence', addTool: 'Ajouter un outil',
    addLang: 'Ajouter une langue', addInterest: "Ajouter un centre d'intérêt",
    delete: 'Supprimer', download: 'Télécharger en PDF', preview: 'Aperçu du CV',
    previewSub: 'Mis à jour en temps réel.',
    printHint: "Choisissez « Enregistrer en PDF » dans la boîte d'impression",
    back: 'Retour',
    expN: (n: number) => `Expérience ${n}`,
    eduN: (n: number) => `Formation ${n}`,
    cvProfile: 'Profil', cvExp: 'Expériences professionnelles', cvEdu: 'Formations',
    cvSkills: 'Compétences', cvTools: 'Outils informatiques',
    cvLangs: 'Langues', cvInterests: "Centres d'intérêt",
    cvPersonal: 'Informations personnelles',
    present: 'Présent',
    levelLabels: ['', 'Débutant', 'Intermédiaire', 'Courant', 'Bilingue', 'Natif'] as string[],
    noExp: 'Aucune expérience ajoutée', noEdu: 'Aucune formation ajoutée',
    chooseTemplate: 'Choisissez votre modèle', chooseTemplateSub: 'Sélectionnez le design qui vous représente le mieux.',
    chooseLang: 'Langue du CV', chooseLangSub: 'La langue détermine le sens du texte et les titres des sections.',
    fillForm: 'Remplissez vos informations', fillFormSub: "Laissez vides les champs qui ne s'appliquent pas.",
    continue: 'Continuer', select: 'Sélectionner', selected: '✓ Sélectionné',
    step: 'Étape', of: 'sur',
    emptyPreview: 'Remplissez le formulaire pour voir votre CV',
  },
  en: {
    firstName: 'First name', lastName: 'Last name', jobTitle: 'Job title / Target role',
    email: 'Email', phone: 'Phone', address: 'Address', city: 'City',
    linkedin: 'LinkedIn / Website',
    birthDate: 'Date of birth', nationality: 'Nationality',
    maritalStatus: 'Marital status', license: "Driver's license",
    photo: 'Photo (optional)', removePhoto: 'Remove',
    position: 'Position', company: 'Company', startDate: 'Start', endDate: 'End',
    currentJob: 'Current position', taskDesc: 'Responsibilities & achievements',
    degree: 'Degree / Certification', school: 'Institution', gradYear: 'Graduation year',
    skillName: 'Skill', toolName: 'Tool (Word, Excel…)', langName: 'Language',
    interestName: 'Interest',
    sPersonal: 'Personal information', sProfile: 'Profile / Summary',
    sExp: 'Work experience', sEdu: 'Education',
    sSkills: 'Skills', sTools: 'Computer tools',
    sLangs: 'Languages', sInterests: 'Interests',
    addExp: 'Add experience', addEdu: 'Add education',
    addSkill: 'Add skill', addTool: 'Add tool',
    addLang: 'Add language', addInterest: 'Add interest',
    delete: 'Delete', download: 'Download PDF', preview: 'CV Preview',
    previewSub: 'Updated in real time.',
    printHint: 'Choose "Save as PDF" in the print dialog',
    back: 'Back',
    expN: (n: number) => `Experience ${n}`,
    eduN: (n: number) => `Education ${n}`,
    cvProfile: 'Profile', cvExp: 'Work experience', cvEdu: 'Education',
    cvSkills: 'Skills', cvTools: 'Computer tools',
    cvLangs: 'Languages', cvInterests: 'Interests',
    cvPersonal: 'Personal information',
    present: 'Present',
    levelLabels: ['', 'Beginner', 'Intermediate', 'Fluent', 'Bilingual', 'Native'] as string[],
    noExp: 'No experience added', noEdu: 'No education added',
    chooseTemplate: 'Choose your template', chooseTemplateSub: 'Select the design that represents you best.',
    chooseLang: 'CV language', chooseLangSub: 'Language determines text direction and section labels.',
    fillForm: 'Fill in your information', fillFormSub: 'Leave blank any fields that do not apply.',
    continue: 'Continue', select: 'Select', selected: '✓ Selected',
    step: 'Step', of: 'of',
    emptyPreview: 'Fill in the form to see your CV',
  },
  ar: {
    firstName: 'الاسم', lastName: 'اللقب', jobTitle: 'المسمى الوظيفي المطلوب',
    email: 'البريد الإلكتروني', phone: 'الهاتف', address: 'العنوان', city: 'المدينة',
    linkedin: 'لينكد إن / الموقع',
    birthDate: 'تاريخ الميلاد', nationality: 'الجنسية',
    maritalStatus: 'الحالة الاجتماعية', license: 'رخصة القيادة',
    photo: 'الصورة (اختياري)', removePhoto: 'حذف',
    position: 'المنصب', company: 'الشركة / المؤسسة', startDate: 'البداية', endDate: 'النهاية',
    currentJob: 'منصب حالي', taskDesc: 'المهام والإنجازات',
    degree: 'الشهادة / الدبلوم', school: 'المؤسسة التعليمية', gradYear: 'سنة التخرج',
    skillName: 'مهارة', toolName: 'أداة (Word, Excel…)', langName: 'لغة',
    interestName: 'اهتمام',
    sPersonal: 'المعلومات الشخصية', sProfile: 'الملف الشخصي',
    sExp: 'الخبرات المهنية', sEdu: 'التعليم والتكوين',
    sSkills: 'المهارات', sTools: 'الأدوات التقنية',
    sLangs: 'اللغات', sInterests: 'الاهتمامات',
    addExp: 'إضافة خبرة', addEdu: 'إضافة تكوين',
    addSkill: 'إضافة مهارة', addTool: 'إضافة أداة',
    addLang: 'إضافة لغة', addInterest: 'إضافة اهتمام',
    delete: 'حذف', download: 'تحميل PDF', preview: 'معاينة السيرة الذاتية',
    previewSub: 'يتحدث في الوقت الفعلي.',
    printHint: 'اختر "حفظ كـ PDF" في مربع الطباعة',
    back: 'رجوع',
    expN: (n: number) => `خبرة ${n}`,
    eduN: (n: number) => `تعليم ${n}`,
    cvProfile: 'الملف الشخصي', cvExp: 'الخبرات المهنية', cvEdu: 'التعليم',
    cvSkills: 'المهارات', cvTools: 'الأدوات التقنية',
    cvLangs: 'اللغات', cvInterests: 'الاهتمامات',
    cvPersonal: 'المعلومات الشخصية',
    present: 'الحاضر',
    levelLabels: ['', 'مبتدئ', 'متوسط', 'جيد', 'ثنائي اللغة', 'لغة أم'] as string[],
    noExp: 'لم تتم إضافة خبرة', noEdu: 'لم تتم إضافة تعليم',
    chooseTemplate: 'اختر القالب', chooseTemplateSub: 'اختر التصميم الذي يمثلك أكثر.',
    chooseLang: 'لغة السيرة الذاتية', chooseLangSub: 'تحدد اللغة اتجاه النص وعناوين الأقسام.',
    fillForm: 'أدخل معلوماتك', fillFormSub: 'اترك الحقول الفارغة التي لا تنطبق عليك.',
    continue: 'متابعة', select: 'اختيار', selected: '✓ مختار',
    step: 'خطوة', of: 'من',
    emptyPreview: 'أدخل معلوماتك لرؤية سيرتك الذاتية',
  },
} as const

// ─── Interest icons ───────────────────────────────────────────────────────────

const INTEREST_ICONS = [
  { key: 'book',    label: 'Lecture'  },
  { key: 'music',   label: 'Musique'  },
  { key: 'sport',   label: 'Sport'    },
  { key: 'travel',  label: 'Voyage'   },
  { key: 'cinema',  label: 'Cinéma'   },
  { key: 'tech',    label: 'Tech'     },
  { key: 'art',     label: 'Art'      },
  { key: 'food',    label: 'Cuisine'  },
  { key: 'nature',  label: 'Nature'   },
  { key: 'photo',   label: 'Photo'    },
  { key: 'game',    label: 'Jeux'     },
  { key: 'fitness', label: 'Fitness'  },
]

const INTEREST_PATHS: Record<string, string[]> = {
  book:    ["M4 19.5A2.5 2.5 0 0 1 6.5 17H20", "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"],
  music:   ["M9 18V5l12-2v13", "M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
  sport:   ["M22 12h-4l-3 9L9 3l-3 9H2"],
  travel:  ["M3 11l19-9-9 19-2-8-8-2z"],
  cinema:  ["M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z", "M7 3v18", "M17 3v18", "M3 12h18"],
  tech:    ["M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"],
  art:     ["M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z", "M16 8L2 22"],
  food:    ["M18 8h1a4 4 0 0 1 0 8h-1", "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z", "M6 1v3", "M10 1v3", "M14 1v3"],
  nature:  ["M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0z", "M12 1v2", "M12 21v2", "M4.22 4.22l1.42 1.42", "M18.36 18.36l1.42 1.42", "M1 12h2", "M21 12h2", "M4.22 19.78l1.42-1.42", "M18.36 5.64l1.42-1.42"],
  photo:   ["M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z", "M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  game:    ["M6 12h2m2-2v4m5-1h.5M18 11h.5", "M17.32 5H6.68a4 4 0 0 0-3.978 3.59l-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258l-.017-.151A4 4 0 0 0 17.32 5z"],
  fitness: ["M13 2L3 14h9l-1 8 10-12h-9l1-8z"],
}

function IIcon({ name, size = 11, color = 'currentColor' }: { name: string; size?: number; color?: string }) {
  const paths = INTEREST_PATHS[name] || INTEREST_PATHS.book
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  )
}

// ─── Contact icons ────────────────────────────────────────────────────────────

const CONTACT_PATHS: Record<string, string[]> = {
  phone:    ["M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"],
  email:    ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z", "M22 6l-10 7L2 6"],
  location: ["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z", "M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  link:     ["M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"],
  calendar: ["M8 2v4", "M16 2v4", "M3 6h18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z", "M3 10h18"],
  flag:     ["M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", "M4 22v-7"],
  heart:    ["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"],
  id:       ["M1 4h22v16H1z", "M1 10h22"],
}

function CIcon({ type, size = 10, color = 'currentColor' }: { type: string; size?: number; color?: string }) {
  const paths = CONTACT_PATHS[type] || []
  if (!paths.length) return null
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'inline-block' }}>
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  )
}

// ─── Icon picker (interests form) ─────────────────────────────────────────────

function IconPicker({ value, onChange }: { value: string; onChange: (icon: string) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-9 h-9 border border-border rounded-lg flex items-center justify-center hover:border-emerald-700 transition-colors shrink-0 bg-white">
        <IIcon name={value} size={16} color="#047857" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-10 left-0 z-20 bg-white border border-border rounded-xl shadow-lg p-2 grid grid-cols-4 gap-1" style={{ width: '164px' }}>
            {INTEREST_ICONS.map(ic => (
              <button key={ic.key} type="button" title={ic.label}
                onClick={() => { onChange(ic.key); setOpen(false) }}
                className={`w-9 h-9 rounded-lg flex items-center justify-center hover:bg-emerald-50 transition-colors ${value === ic.key ? 'bg-emerald-100 border border-emerald-600' : ''}`}>
                <IIcon name={ic.key} size={15} color={value === ic.key ? '#047857' : '#64748B'} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Form helpers ─────────────────────────────────────────────────────────────

const inputCls = 'w-full bg-white border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all duration-150'
const labelCls = 'block text-xs font-semibold text-ink-900 mb-1.5'

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-2xl p-5 bg-white">
      <h3 className="text-sm font-semibold text-ink-900 mb-4 pb-3 border-b border-border">{title}</h3>
      {children}
    </div>
  )
}

function DeleteBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors">
      {label}
    </button>
  )
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick}
      className="w-full border border-dashed border-emerald-700/40 text-emerald-700 hover:bg-emerald-100/50 text-xs font-semibold py-2.5 rounded-xl transition-colors duration-150">
      + {label}
    </button>
  )
}

function LevelDots({ level, onChange }: { level: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1.5 shrink-0" title="Niveau (1 → 5)">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}
          className={`w-4 h-4 rounded-full border-2 transition-all duration-100 ${n <= level ? 'bg-emerald-700 border-emerald-700' : 'border-border bg-white hover:border-emerald-700/50'}`} />
      ))}
    </div>
  )
}

function StarLevel({ level, onChange }: { level: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-0.5 shrink-0">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}
          className={`text-lg leading-none transition-colors ${n <= level ? 'text-emerald-700' : 'text-border hover:text-emerald-700/40'}`}>
          ★
        </button>
      ))}
    </div>
  )
}

// ─── Blue CV Template ─────────────────────────────────────────────────────────

function CVDocumentBlue({ d, lang }: { d: CVData; lang: LangKey }) {
  const isRTL = lang === 'ar'
  const t = T[lang]

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

  const BLUE = '#1B4F8C'
  const SBG  = '#F4F7FB'
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
      <div style={{ padding: `${hdrPad}px 28px`, display: 'flex', alignItems: 'flex-start', gap: '18px', flexDirection: isRTL ? 'row-reverse' : 'row', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ width: `${circleSize}px`, height: `${circleSize}px`, borderRadius: '50%', background: '#E0E7EF', border: `2px solid ${BLUE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
          {d.photo
            ? <img src={d.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: initFont, fontWeight: 'bold', color: BLUE }}>{initials}</span>
          }
        </div>
        <div style={{ flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
          <div style={{ fontSize: nameSize, fontWeight: 'bold', color: '#0F172A', lineHeight: 1.1, marginBottom: '4px' }}>{fullName}</div>
          {d.jobTitle && <div style={{ fontSize: titleSize, color: BLUE, marginBottom: '8px', letterSpacing: '0.2px' }}>{d.jobTitle}</div>}
          {d.profile  && <div style={{ fontSize: bodyFont, color: '#64748B', lineHeight: 1.65, maxWidth: '370px' }}>{d.profile}</div>}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '8pt', color: BODY, textAlign: isRTL ? 'right' : 'left' }}>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                  <span key={interest.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '7.5pt', background: '#EEF3FB', color: BLUE, padding: '3px 9px', borderRadius: '20px', border: `0.5px solid ${BLUE}30` }}>
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
    </div>
  )
}

// ─── Green CV Template ────────────────────────────────────────────────────────

function CVDocumentGreen({ d, lang }: { d: CVData; lang: LangKey }) {
  const isRTL = lang === 'ar'
  const t = T[lang]

  const filledExps      = d.exps.filter(e => e.position || e.company)
  const filledEdus      = d.edus.filter(e => e.degree || e.school)
  const filledSkills    = [...d.skills, ...d.tools].filter(s => s.name)
  const filledLangs     = d.langs.filter(l => l.name)
  const filledInterests = d.interests.filter(i => i.name)

  const score = (d.profile ? 2 : 0) + filledExps.length * 3 + filledEdus.length * 2 + filledSkills.length * 0.5 + filledLangs.length * 0.5 + (filledInterests.length > 0 ? 1 : 0)
  const sparse = score < 5
  const dense  = score > 14

  const bodyFont  = sparse ? '10.5pt' : dense ? '8.5pt'  : '9.5pt'
  const secGap    = sparse ? 28       : dense ? 13       : 20
  const itemGap   = sparse ? 22       : dense ? 9        : 14
  const hdrPad    = sparse ? 38       : dense ? 24       : 32
  const nameSize  = sparse ? '26pt'   : dense ? '19pt'   : '22pt'
  const titleSize = sparse ? '10pt'   : dense ? '7.5pt'  : '9pt'
  const circleSize = sparse ? 62      : dense ? 44       : 54
  const initFont  = sparse ? '20pt'   : dense ? '13pt'   : '17pt'
  const skillH    = sparse ? '4px'    : '3px'
  const skillGap  = sparse ? '10px'   : dense ? '5px'    : '7px'
  const langGap   = sparse ? '9px'    : dense ? '4px'    : '6px'

  const initials = [d.firstName?.[0], d.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?'
  const fullName = [d.firstName, d.lastName].filter(Boolean).join(' ') || (isRTL ? 'الاسم الكامل' : lang === 'en' ? 'Full Name' : 'Prénom Nom')
  const fontFamily = isRTL ? '"Arial", "Tahoma", sans-serif' : '"Segoe UI", "Helvetica Neue", Arial, sans-serif'

  const secTitle: React.CSSProperties = {
    fontSize: '7pt', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.6px',
    color: '#0E7C5A', marginBottom: '9px', paddingBottom: '5px',
    borderBottom: '1.5px solid #0E7C5A', display: 'block',
    textAlign: isRTL ? 'right' : 'left',
  }
  const dot: React.CSSProperties = {
    position: 'absolute', left: isRTL ? 'auto' : '-5px', right: isRTL ? '-5px' : 'auto',
    top: '5px', width: '8px', height: '8px', borderRadius: '50%',
    background: '#0E7C5A', border: '1.5px solid white',
  }

  return (
    <div style={{ width: '210mm', minHeight: '297mm', fontFamily, direction: isRTL ? 'rtl' : 'ltr', color: '#1a1a1a', background: 'white', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(120deg, #064E3B 0%, #0E7C5A 100%)', padding: `${hdrPad}px 32px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
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
                      {[1,2,3,4,5].map(i => <div key={i} style={{ flex: 1, height: skillH, borderRadius: '2px', background: i <= s.level ? '#0E7C5A' : '#E8EDEB' }} />)}
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
                    <span style={{ fontSize: '7pt', fontWeight: '700', color: '#065f46', background: '#D1FAE5', padding: '1px 5px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
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
                  <span key={interest.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: sparse ? '8pt' : '7.5pt', background: '#D1FAE5', color: '#065f46', padding: '2px 7px', borderRadius: '20px' }}>
                    <IIcon name={interest.icon} size={8} color="#0E7C5A" />
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
                  <div key={e.id} style={{ position: 'relative', paddingLeft: isRTL ? 0 : '14px', paddingRight: isRTL ? '14px' : 0, borderLeft: isRTL ? 'none' : '2px solid #D1FAE5', borderRight: isRTL ? '2px solid #D1FAE5' : 'none' }}>
                    <div style={dot} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '2px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                      <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                        <span style={{ fontWeight: 'bold', fontSize: sparse ? '11pt' : '10pt' }}>{e.position}</span>
                        {e.company && <span style={{ color: '#0E7C5A', fontSize: sparse ? '10pt' : '9.5pt', marginLeft: isRTL ? 0 : '4px', marginRight: isRTL ? '4px' : 0 }}> — {e.company}</span>}
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
                  <div key={e.id} style={{ position: 'relative', paddingLeft: isRTL ? 0 : '14px', paddingRight: isRTL ? '14px' : 0, borderLeft: isRTL ? 'none' : '2px solid #D1FAE5', borderRight: isRTL ? '2px solid #D1FAE5' : 'none' }}>
                    <div style={dot} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                      <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                        <span style={{ fontWeight: 'bold', fontSize: sparse ? '11pt' : '10pt' }}>{e.degree}</span>
                        {e.school && <span style={{ color: '#0E7C5A', fontSize: sparse ? '10pt' : '9.5pt', marginLeft: isRTL ? 0 : '4px', marginRight: isRTL ? '4px' : 0 }}> — {e.school}</span>}
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
    </div>
  )
}

// ─── Template thumbnails ──────────────────────────────────────────────────────

function BlueThumbnail() {
  return (
    <div style={{ width: '100%', height: '100%', background: 'white', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      <div style={{ padding: '8px 10px', display: 'flex', gap: '6px', alignItems: 'center', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#E0E7EF', border: '1.5px solid #1B4F8C', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: '5px', background: '#0F172A', borderRadius: '2px', width: '55%', marginBottom: '3px' }} />
          <div style={{ height: '3px', background: '#1B4F8C', borderRadius: '2px', width: '35%' }} />
        </div>
      </div>
      <div style={{ height: '8px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '4px', alignItems: 'center', padding: '0 10px' }}>
        {[30,40,25].map((w, i) => <div key={i} style={{ height: '2px', background: '#CBD5E1', borderRadius: '1px', width: `${w}%` }} />)}
      </div>
      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ width: '38%', background: '#F4F7FB', padding: '6px 5px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {[['1B4F8C',70],['1B4F8C',55],['1B4F8C',45]].map(([c,w], i) => (
            <div key={i}>
              <div style={{ height: '2px', background: `#${c}`, width: `${w}%`, marginBottom: '3px', opacity: 0.6 }} />
              {[80,60].map((bw,j) => (
                <div key={j} style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
                  {[1,2,3,4,5].map(k => <div key={k} style={{ flex: 1, height: '2px', borderRadius: '1px', background: k <= (j === 0 ? 4 : 3) ? '#1B4F8C' : '#D1DCE8' }} />)}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: '6px 7px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ height: '2px', background: '#1B4F8C', width: '70%', marginBottom: '3px', opacity: 0.6 }} />
          {[85,65,75,50].map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: '3px', alignItems: 'flex-start' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#1B4F8C', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: '3px', background: '#1a1a1a', width: `${w}%`, borderRadius: '1px', marginBottom: '2px' }} />
                <div style={{ height: '2px', background: '#CBD5E1', width: `${w * 0.7}%`, borderRadius: '1px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function GreenThumbnail() {
  return (
    <div style={{ width: '100%', height: '100%', background: 'white', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      <div style={{ background: 'linear-gradient(120deg, #064E3B 0%, #0E7C5A 100%)', padding: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.4)', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.9)', borderRadius: '2px', width: '50%', marginBottom: '3px' }} />
          <div style={{ height: '3px', background: 'rgba(167,243,208,0.8)', borderRadius: '2px', width: '30%' }} />
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ width: '38%', background: '#F7FAF9', borderRight: '1px solid #E8EDEB', padding: '6px 5px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {[70,55,45].map((w, i) => (
            <div key={i}>
              <div style={{ height: '2px', background: '#0E7C5A', width: `${w}%`, marginBottom: '3px', opacity: 0.6 }} />
              {[4,3].map((lvl, j) => (
                <div key={j} style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
                  {[1,2,3,4,5].map(k => <div key={k} style={{ flex: 1, height: '2px', borderRadius: '1px', background: k <= lvl ? '#0E7C5A' : '#E8EDEB' }} />)}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: '6px 7px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ height: '2px', background: '#0E7C5A', width: '70%', marginBottom: '3px', opacity: 0.6 }} />
          {[85,65,75,50].map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: '3px', alignItems: 'flex-start' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0E7C5A', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: '3px', background: '#1a1a1a', width: `${w}%`, borderRadius: '1px', marginBottom: '2px' }} />
                <div style={{ height: '2px', background: '#D1FAE5', width: `${w * 0.7}%`, borderRadius: '1px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Step 1: Template Picker ──────────────────────────────────────────────────

function TemplateStep({ onSelect }: { onSelect: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null)

  const templates = [
    { id: 'blue',  name: 'Classique Bleu',  sub: 'Layout structuré, sidebar claire, idéal pour tous les secteurs', accentHex: '#1B4F8C', Thumb: BlueThumbnail },
    { id: 'green', name: 'Moderne Vert',    sub: 'En-tête dégradé élégant, design contemporain et percutant',      accentHex: '#0E7C5A', Thumb: GreenThumbnail },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-2">Étape 1 sur 3</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-ink-900 tracking-tight mb-2">Choisissez votre modèle</h1>
        <p className="text-slate-600 text-sm">Sélectionnez le design qui vous représente le mieux.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto w-full">
        {templates.map(tpl => (
          <button key={tpl.id} type="button"
            onClick={() => onSelect(tpl.id)}
            onMouseEnter={() => setHovered(tpl.id)}
            onMouseLeave={() => setHovered(null)}
            className={`group text-left border-2 rounded-2xl overflow-hidden transition-all duration-200 ${hovered === tpl.id ? 'shadow-lg -translate-y-0.5' : 'shadow-sm'}`}
            style={{ borderColor: hovered === tpl.id ? tpl.accentHex : '#E8EDEB' }}>
            <div className="w-full bg-surface" style={{ aspectRatio: '210/150' }}>
              <tpl.Thumb />
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: tpl.accentHex }} />
                <span className="font-semibold text-ink-900 text-sm">{tpl.name}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{tpl.sub}</p>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold" style={{ color: tpl.accentHex }}>
                Sélectionner
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Step 2: Language Picker ──────────────────────────────────────────────────

function LanguageStep({ template, onSelect, onBack }: { template: string; onSelect: (lang: LangKey) => void; onBack: () => void }) {
  const langs: { id: LangKey; flag: string; label: string; sub: string; dir: string }[] = [
    { id: 'fr', flag: '🇫🇷', label: 'Français', sub: 'Gauche → Droite', dir: 'LTR' },
    { id: 'en', flag: '🇬🇧', label: 'English',  sub: 'Left → Right',    dir: 'LTR' },
    { id: 'ar', flag: '🇩🇿', label: 'العربية',   sub: 'يمين ← يسار',    dir: 'RTL' },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-2">Étape 2 sur 3</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-ink-900 tracking-tight mb-2">Langue du CV</h1>
        <p className="text-slate-600 text-sm">La langue détermine le sens du texte et les titres des sections.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto w-full">
        {langs.map(l => (
          <button key={l.id} type="button"
            onClick={() => onSelect(l.id)}
            className="group text-left border border-border rounded-2xl p-5 bg-white hover:border-emerald-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="text-3xl mb-3">{l.flag}</div>
            <div className="font-semibold text-ink-900 text-sm mb-0.5">{l.label}</div>
            <div className="text-xs text-slate-600 mb-3">{l.sub}</div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-surface text-ink-700 px-2 py-1 rounded-lg border border-border">
              {l.dir}
            </span>
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <button type="button" onClick={onBack}
          className="inline-flex items-center gap-1.5 text-ink-500 text-xs hover:text-ink-900 transition-colors">
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Retour au choix du modèle
        </button>
      </div>
    </div>
  )
}

// ─── Step 3: Form ─────────────────────────────────────────────────────────────

function CVForm({ d, setD, template, lang }: { d: CVData; setD: React.Dispatch<React.SetStateAction<CVData>>; template: string; lang: LangKey }) {
  const t = T[lang]
  const isRTL = lang === 'ar'

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

  function addExp()  { set('exps',  [...d.exps,  { id: uid(), position: '', company: '', city: '', startDate: '', endDate: '', current: false, description: '' }]) }
  function delExp(id: string)  { set('exps',  d.exps.filter(e => e.id !== id)) }
  function setExp(id: string, f: keyof Exp, v: string | boolean)  { set('exps',  d.exps.map(e => e.id === id ? { ...e, [f]: v } : e)) }

  function addEdu()  { set('edus',  [...d.edus,  { id: uid(), degree: '', school: '', city: '', year: '' }]) }
  function delEdu(id: string)  { set('edus',  d.edus.filter(e => e.id !== id)) }
  function setEdu(id: string, f: keyof Edu, v: string)  { set('edus',  d.edus.map(e => e.id === id ? { ...e, [f]: v } : e)) }

  function addSkill() { set('skills', [...d.skills, { id: uid(), name: '', level: 3 }]) }
  function delSkill(id: string)  { set('skills', d.skills.filter(s => s.id !== id)) }
  function setSkill(id: string, f: keyof Skill, v: string | number) { set('skills', d.skills.map(s => s.id === id ? { ...s, [f]: v } : s)) }

  function addTool()  { set('tools',  [...d.tools,  { id: uid(), name: '', level: 3 }]) }
  function delTool(id: string)  { set('tools',  d.tools.filter(s => s.id !== id)) }
  function setTool(id: string, f: keyof Skill, v: string | number) { set('tools',  d.tools.map(s => s.id === id ? { ...s, [f]: v } : s)) }

  function addLang()  { set('langs',  [...d.langs,  { id: uid(), name: '', level: 3 }]) }
  function delLang(id: string)  { set('langs',  d.langs.filter(l => l.id !== id)) }
  function setLang(id: string, f: keyof Lang, v: string | number) { set('langs',  d.langs.map(l => l.id === id ? { ...l, [f]: v } : l)) }

  function addInterest()  { set('interests', [...d.interests, { id: uid(), name: '', icon: 'book' }]) }
  function delInterest(id: string) { set('interests', d.interests.filter(i => i.id !== id)) }
  function setInterest(id: string, f: keyof Interest, v: string) { set('interests', d.interests.map(i => i.id === id ? { ...i, [f]: v } : i)) }

  const CVDoc = template === 'blue' ? CVDocumentBlue : CVDocumentGreen

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_288px] gap-6 items-start">

        {/* Form */}
        <div className="flex flex-col gap-4">

          <FormSection title={t.sPersonal}>
            {/* Photo */}
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
              {template === 'blue' && (
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

          <FormSection title={t.sProfile}>
            <textarea className={inputCls + ' resize-none'} rows={4}
              value={d.profile} onChange={e => set('profile', e.target.value)} />
          </FormSection>

          <FormSection title={t.sExp}>
            {d.exps.length === 0 && <p className="text-xs text-ink-500 text-center py-4 mb-2">{t.noExp}</p>}
            {d.exps.map((exp, i) => (
              <div key={exp.id} className="border border-border rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-ink-500">{t.expN(i + 1)}</span>
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

          <FormSection title={t.sEdu}>
            {d.edus.length === 0 && <p className="text-xs text-ink-500 text-center py-4 mb-2">{t.noEdu}</p>}
            {d.edus.map((edu, i) => (
              <div key={edu.id} className="border border-border rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-ink-500">{t.eduN(i + 1)}</span>
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

          <FormSection title={t.sSkills}>
            {d.skills.map((skill, i) => (
              <div key={skill.id} className="flex items-center gap-3 mb-3">
                <input className={inputCls} type="text" placeholder={`${t.skillName} ${i + 1}`}
                  value={skill.name} onChange={e => setSkill(skill.id, 'name', e.target.value)} />
                <LevelDots level={skill.level} onChange={n => setSkill(skill.id, 'level', n)} />
                <button type="button" onClick={() => delSkill(skill.id)} className="shrink-0 text-ink-500 hover:text-red-500 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
              </div>
            ))}
            <AddBtn onClick={addSkill} label={t.addSkill} />
          </FormSection>

          {template === 'blue' && (
            <FormSection title={t.sTools}>
              {d.tools.map((tool, i) => (
                <div key={tool.id} className="flex items-center gap-3 mb-3">
                  <input className={inputCls} type="text" placeholder={`${t.toolName} ${i + 1}`}
                    value={tool.name} onChange={e => setTool(tool.id, 'name', e.target.value)} />
                  <LevelDots level={tool.level} onChange={n => setTool(tool.id, 'level', n)} />
                  <button type="button" onClick={() => delTool(tool.id)} className="shrink-0 text-ink-500 hover:text-red-500 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </button>
                </div>
              ))}
              <AddBtn onClick={addTool} label={t.addTool} />
            </FormSection>
          )}

          <FormSection title={t.sLangs}>
            {d.langs.map(l => (
              <div key={l.id} className="flex items-center gap-3 mb-3">
                <input className={inputCls} type="text" placeholder={t.langName}
                  value={l.name} onChange={e => setLang(l.id, 'name', e.target.value)} />
                <StarLevel level={l.level} onChange={n => setLang(l.id, 'level', n)} />
                <button type="button" onClick={() => delLang(l.id)} className="shrink-0 text-ink-500 hover:text-red-500 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
              </div>
            ))}
            <AddBtn onClick={addLang} label={t.addLang} />
          </FormSection>

          <FormSection title={t.sInterests}>
            {d.interests.map((interest, i) => (
              <div key={interest.id} className="flex items-center gap-3 mb-3">
                <IconPicker value={interest.icon} onChange={icon => setInterest(interest.id, 'icon', icon)} />
                <input className={inputCls} type="text" placeholder={`${t.interestName} ${i + 1}`}
                  value={interest.name} onChange={e => setInterest(interest.id, 'name', e.target.value)} />
                <button type="button" onClick={() => delInterest(interest.id)} className="shrink-0 text-ink-500 hover:text-red-500 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
              </div>
            ))}
            <AddBtn onClick={addInterest} label={t.addInterest} />
          </FormSection>
        </div>

        {/* Sticky preview sidebar */}
        <div className="hidden xl:block xl:sticky xl:top-20">
          <div className="border border-border rounded-2xl p-5 bg-white shadow-sm">
            <p className="text-xs font-semibold text-ink-900 mb-0.5">{t.preview}</p>
            <p className="text-xs text-slate-600 mb-4">{t.previewSub}</p>

            <div className="w-full overflow-hidden rounded-xl border border-border bg-white mb-4" style={{ aspectRatio: '210 / 297' }}>
              <div style={{ transform: 'scale(0.312)', transformOrigin: 'top left', width: '794px', pointerEvents: 'none', userSelect: 'none' }}>
                <CVDoc d={d} lang={lang} />
              </div>
            </div>

            <button type="button" onClick={() => window.print()}
              className="w-full bg-emerald-700 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-emerald-500 active:scale-[.98] transition-all duration-200 flex items-center justify-center gap-2">
              <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
                <path d="M9 12V3M9 12l-3-3M9 12l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 15h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {t.download}
            </button>

            <p className="text-[10px] text-ink-500 text-center mt-3">{t.printHint}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CVPage() {
  const [step, setStep] = useState<'template' | 'lang' | 'form'>('template')
  const [template, setTemplate] = useState<string>('blue')
  const [lang, setLang] = useState<LangKey>('fr')
  const [d, setD] = useState<CVData>(BLANK)

  const CVDoc = template === 'blue' ? CVDocumentBlue : CVDocumentGreen

  return (
    <>
      <style>{`
        .cv-print-only { display: none; }
        @media print {
          .cv-no-print   { display: none !important; }
          .cv-print-only { display: flex !important; }
          @page { margin: 0; size: A4 portrait; }
          body { background: white !important; overflow: visible !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      <div className="cv-print-only" aria-hidden="true">
        <CVDoc d={d} lang={lang} />
      </div>

      <div className="cv-no-print flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 bg-surface pb-28 xl:pb-0">
          <div className="w-full max-w-300 mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

            <Link href="/" className="inline-flex items-center gap-1.5 text-ink-500 text-xs hover:text-emerald-700 transition-colors mb-8">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Retour à l&apos;accueil
            </Link>

            {step === 'form' && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                  <button onClick={() => setStep('lang')}
                    className="inline-flex items-center gap-1.5 text-ink-500 text-xs hover:text-ink-900 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Retour
                  </button>
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold text-ink-900 tracking-tight">
                  {T[lang].fillForm}
                </h1>
                <p className="text-slate-600 text-sm mt-1.5">{T[lang].fillFormSub}</p>
              </div>
            )}

            {step === 'template' && <TemplateStep onSelect={id => { setTemplate(id); setStep('lang') }} />}
            {step === 'lang'     && <LanguageStep template={template} onSelect={l => { setLang(l); setStep('form') }} onBack={() => setStep('template')} />}
            {step === 'form'     && <CVForm d={d} setD={setD} template={template} lang={lang} />}
          </div>
        </main>

        <Footer />

        {step === 'form' && (
          <div className="xl:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border px-4 py-3.5 z-40">
            <button type="button" onClick={() => window.print()}
              className="w-full bg-emerald-700 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-emerald-500 active:scale-[.98] transition-all duration-200 flex items-center justify-center gap-2">
              <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
                <path d="M9 12V3M9 12l-3-3M9 12l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 15h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {T[lang].download}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
