import { INTEREST_PATHS, CONTACT_PATHS } from '../constants'

export function IIcon({ name, size = 11, color = 'currentColor' }: { name: string; size?: number; color?: string }) {
  const paths = INTEREST_PATHS[name] || INTEREST_PATHS.book
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  )
}

export function CIcon({ type, size = 10, color = 'currentColor' }: { type: string; size?: number; color?: string }) {
  const paths = CONTACT_PATHS[type] || []
  if (!paths.length) return null
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'inline-block' }}>
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  )
}
