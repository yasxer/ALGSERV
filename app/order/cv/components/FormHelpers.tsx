'use client'

import { useState } from 'react'

export const inputCls = 'w-full bg-white border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all duration-150'
export const labelCls = 'block text-xs font-semibold text-ink-900 mb-1.5'

export function FormSection({ title, children, helpText }: { title: string; children: React.ReactNode; helpText?: string }) {
  const [showHelp, setShowHelp] = useState(false)
  return (
    <div className="border border-border rounded-2xl p-5 bg-white">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
        <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
        {helpText && (
          <button type="button" onClick={() => setShowHelp(true)}
            className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold flex items-center justify-center hover:bg-blue-100 transition-colors shrink-0 leading-none">
            ?
          </button>
        )}
      </div>
      {children}
      {showHelp && helpText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowHelp(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" dir="rtl" onClick={e => e.stopPropagation()}>
            <h4 className="text-sm font-bold text-ink-900 mb-3 text-right">{title}</h4>
            <p className="text-sm text-ink-700 leading-relaxed text-right whitespace-pre-line">{helpText}</p>
            <button type="button" onClick={() => setShowHelp(false)}
              className="mt-5 w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
              فهمت ✓
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function DeleteBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors">
      {label}
    </button>
  )
}

export function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick}
      className="w-full border border-dashed border-emerald-700/40 text-emerald-700 hover:bg-emerald-100/50 text-xs font-semibold py-2.5 rounded-xl transition-colors duration-150">
      + {label}
    </button>
  )
}

export function LevelDots({ level, onChange }: { level: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1.5 shrink-0" title="Niveau (1 → 5)">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}
          className={`w-4 h-4 rounded-full border-2 transition-all duration-100 ${n <= level ? 'bg-emerald-700 border-emerald-700' : 'border-border bg-white hover:border-emerald-700/50'}`} />
      ))}
    </div>
  )
}

export function StarLevel({ level, onChange }: { level: number; onChange: (n: number) => void }) {
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
