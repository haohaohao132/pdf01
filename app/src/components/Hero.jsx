import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { HERO } from '../content'
import Button from './Button'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
        <h1 className="bg-gradient-to-r from-white via-brand-100 to-brand-400 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
          {HERO.title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-gray-400 sm:text-lg">{HERO.subtitle}</p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {HERO.bullets.map((b) => (
            <span key={b} className="rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1 text-sm text-brand-200">
              {b}
            </span>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/tool/merge">
            <Button primary className="px-6 py-2.5">
              {HERO.ctaPrimary}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/">
            <Button className="px-6 py-2.5">{HERO.ctaSecondary}</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
