export type Exp      = { id: string; position: string; company: string; city: string; startDate: string; endDate: string; current: boolean; description: string }
export type Edu      = { id: string; degree: string; school: string; city: string; year: string }
export type Skill    = { id: string; name: string; level: number }
export type Lang     = { id: string; name: string; level: number }
export type Interest = { id: string; name: string; icon: string }

export type CVData = {
  firstName: string; lastName: string; jobTitle: string
  email: string; phone: string; address: string; city: string; linkedin: string
  birthDate: string; nationality: string; maritalStatus: string; license: string
  profile: string
  photo: string
  exps: Exp[]; edus: Edu[]
  skills: Skill[]; tools: Skill[]; langs: Lang[]
  interests: Interest[]
}
