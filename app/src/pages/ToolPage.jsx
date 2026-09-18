import { useParams, Link } from 'react-router-dom'
import { registry } from '../tools/registry'
import { toolById, COMMON } from '../content'

export default function ToolPage() {
  const { id } = useParams()
  const entry = registry.find((t) => t.id === id)
  if (!entry) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-gray-400">未找到该工具</div>
  }
  const Tool = entry.component
  const meta = toolById(id)
  const Icon = entry.Icon

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/" className="text-sm text-brand-300 hover:underline">
        ← {COMMON.back}
      </Link>
      <div className="mt-4 rounded-2xl border border-ink-500 bg-ink-800 p-6">
        <div className="flex items-center gap-3">
          <Icon className="h-7 w-7 text-brand-400" />
          <div>
            <h1 className="text-xl font-bold text-white">{meta.title}</h1>
            <p className="text-sm text-gray-400">{meta.desc}</p>
          </div>
        </div>
        <div className="mt-6">
          <Tool />
        </div>
      </div>
    </div>
  )
}
