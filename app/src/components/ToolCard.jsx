import { Link } from 'react-router-dom'

export default function ToolCard({ tool }) {
  const Icon = tool.Icon
  return (
    <Link
      to={`/tool/${tool.id}`}
      className="group rounded-2xl border border-ink-500 bg-ink-800 p-5 transition hover:border-brand-500/60 hover:shadow-glow"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-semibold text-white">{tool.title}</h3>
      <p className="mt-1 text-sm text-gray-400">{tool.desc}</p>
      <span className="mt-3 inline-block text-sm text-brand-300 opacity-0 transition group-hover:opacity-100">开始使用 →</span>
    </Link>
  )
}
