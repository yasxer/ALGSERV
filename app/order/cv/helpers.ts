let _c = 0
export function uid() { return String(++_c) }

export function tN(template: string, n: number) { return template.replace('{n}', String(n)) }

export function withAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export function darkenHex(hex: string, amount = 0.3): string {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * (1 - amount))
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * (1 - amount))
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * (1 - amount))
  return `rgb(${r},${g},${b})`
}
