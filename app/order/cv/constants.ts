import { uid } from './helpers'
import type { CVData } from './types'

export const BLANK: CVData = {
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

export const INTEREST_ICONS = [
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

export const INTEREST_PATHS: Record<string, string[]> = {
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

export const CONTACT_PATHS: Record<string, string[]> = {
  phone:    ["M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"],
  email:    ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z", "M22 6l-10 7L2 6"],
  location: ["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z", "M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  link:     ["M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"],
  calendar: ["M8 2v4", "M16 2v4", "M3 6h18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z", "M3 10h18"],
  flag:     ["M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", "M4 22v-7"],
  heart:    ["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"],
  id:       ["M1 4h22v16H1z", "M1 10h22"],
}

export const COLOR_PRESETS = [
  '#1B4F8C', '#0E7C5A', '#1E3A5F', '#7C3AED',
  '#B91C1C', '#B45309', '#0F766E', '#334155',
  '#111827', '#9D174D', '#0369A1', '#065F46',
]
