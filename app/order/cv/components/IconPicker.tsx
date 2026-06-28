'use client'

import { useState } from 'react'
import { INTEREST_ICONS } from '../constants'
import { IIcon } from './Icons'

export function IconPicker({ value, onChange }: { value: string; onChange: (icon: string) => void }) {
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
