export const inputCls =
  'w-full rounded-lg border border-ink-500 bg-ink-700 px-3 py-2 text-sm text-gray-100 outline-none transition focus:border-brand-500'

export function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm text-gray-300">{label}</label>}
      {children}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  )
}

export function Range({ label, value, min, max, step = 1, suffix, onChange }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm text-gray-300">
        <span>{label}</span>
        <span className="text-gray-400">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand-500"
      />
    </div>
  )
}
