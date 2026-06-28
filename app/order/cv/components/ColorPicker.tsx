import { COLOR_PRESETS } from '../constants'

const inputCls = 'w-full bg-white border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all duration-150'

export function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {COLOR_PRESETS.map(c => (
          <button key={c} type="button" onClick={() => onChange(c)} title={c}
            className="w-7 h-7 rounded-full transition-all shrink-0"
            style={{
              background: c,
              outline: value.toLowerCase() === c.toLowerCase() ? `3px solid ${c}` : '3px solid transparent',
              outlineOffset: '2px',
            }} />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <input type="color" value={value.length === 7 ? value : '#000000'} onChange={e => onChange(e.target.value)}
          className="w-9 h-9 rounded-lg cursor-pointer border border-border" style={{ padding: '2px' }} />
        <input type="text" value={value}
          onChange={e => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) onChange(e.target.value) }}
          className={inputCls + ' font-mono text-xs'}
          style={{ maxWidth: '110px' }} placeholder="#1B4F8C" />
      </div>
    </div>
  )
}
