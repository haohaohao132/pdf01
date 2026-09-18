export default function Button({ children, onClick, disabled, primary, className = '' }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed'
  const tone = primary
    ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-glow'
    : 'bg-ink-600 hover:bg-ink-500 text-gray-200 border border-ink-500'
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${tone} ${className}`}>
      {children}
    </button>
  )
}
