import Link from 'next/link'
import { Star } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/frontend/public" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Star className="w-3.5 h-3.5 text-[#08090c] fill-[#08090c]" />
            </div>
            <span className="font-semibold text-white/80 text-sm" style={{ fontFamily: 'var(--font-display)' }}>ReviewCard</span>
          </Link>

          <div className="flex items-center gap-7">
            {[['/', 'Home'], ['/builder', 'Builder'], ['#how-it-works', 'How it works'], ['#features', 'Features']].map(([href, label]) => (
              <Link key={href} href={href} className="text-xs text-white/30 hover:text-white/70 transition-colors">{label}</Link>
            ))}
          </div>

          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} ReviewCard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
