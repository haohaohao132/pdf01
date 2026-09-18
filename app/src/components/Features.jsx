import { ShieldCheck, Zap, Gift, Lock } from 'lucide-react'
import { FEATURES } from '../content'

const ICONS = { 本地处理: ShieldCheck, 极速处理: Zap, 完全免费: Gift, 隐私安全: Lock }

export default function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {FEATURES.map((f) => {
          const Icon = ICONS[f.title] || ShieldCheck
          return (
            <div key={f.title} className="rounded-2xl border border-ink-500 bg-ink-800 p-5">
              <Icon className="h-7 w-7 text-brand-400" />
              <h3 className="mt-3 font-semibold text-white">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{f.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
