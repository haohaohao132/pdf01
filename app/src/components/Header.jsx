import { Link } from 'react-router-dom'
import { SITE } from '../content'

const logoUrl = import.meta.env.BASE_URL + 'logo.png'

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-ink-500/60 bg-ink-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoUrl} alt={SITE.logoAlt} className="h-8 w-8 rounded" />
          <span className="text-lg font-semibold text-white">{SITE.name}</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-gray-300">
          <Link to="/" className="hover:text-white">
            首页
          </Link>
          <Link to="/" className="hover:text-white">
            全部工具
          </Link>
        </nav>
      </div>
    </header>
  )
}
