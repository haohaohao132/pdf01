export default function ProgressBar({ value = 0 }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-ink-600">
      <div
        className="h-full rounded-full bg-brand-500 transition-all duration-300"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}
