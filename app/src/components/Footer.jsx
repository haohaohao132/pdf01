import { SITE } from '../content'

export default function Footer() {
  return (
    <footer className="border-t border-ink-500/60 bg-ink-900">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-gray-500">
        <p>{SITE.footer}</p>
        <p className="mt-2">© {new Date().getFullYear()} {SITE.name} · {SITE.nameEn}</p>
      </div>
    </footer>
  )
}
