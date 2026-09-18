export default function Alert({ type = 'info', children }) {
  const map = {
    success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    error: 'border-red-500/40 bg-red-500/10 text-red-300',
    warning: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    info: 'border-brand-500/40 bg-brand-500/10 text-brand-200',
  }
  return (
    <div className={`mt-4 rounded-lg border px-4 py-3 text-sm ${map[type] || map.info}`}>{children}</div>
  )
}
