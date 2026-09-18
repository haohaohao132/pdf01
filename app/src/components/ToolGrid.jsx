import { registry } from '../tools/registry'
import ToolCard from './ToolCard'
import { SECTION } from '../content'

export default function ToolGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">{SECTION.toolsTitle}</h2>
        <p className="mt-2 text-gray-400">{SECTION.toolsSubtitle}</p>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {registry.map((t) => (
          <ToolCard key={t.id} tool={t} />
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-gray-500">{SECTION.clickHint}</p>
    </section>
  )
}
