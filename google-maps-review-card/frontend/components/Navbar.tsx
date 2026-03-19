'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Star, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className={`max-w-5xl mx-auto flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0d0f14]/90 backdrop-blur-xl border border-white/[0.07] shadow-2xl shadow-black/50'
          : 'bg-[#0d0f14]/60 backdrop-blur-md border border-white/[0.04]'
      }`}>

        {/* Logo */}
        <Link href="/frontend/public" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
            <Star className="w-4 h-4 text-[#08090c] fill-[#08090c]" />
          </div>
          <span className="font-semibold text-white text-sm tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            ReviewCard
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {[['#how-it-works', 'How it works'], ['#features', 'Features'], ['#use-cases', 'Use cases']].map(([href, label]) => (
            <Link key={href} href={href} className="text-sm text-white/45 hover:text-white/90 transition-colors font-medium">
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/builder" className="text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-[#08090c] px-4 py-2 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-amber-500/25">
            Try free →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white/60 hover:text-white p-1" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden max-w-5xl mx-auto mt-2 rounded-2xl border border-white/[0.06] bg-[#0d0f14]/95 backdrop-blur-xl px-5 py-4 flex flex-col gap-1">
          {[['#how-it-works', 'How it works'], ['#features', 'Features'], ['#use-cases', 'Use cases']].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className="text-sm text-white/60 hover:text-white py-2.5 border-b border-white/[0.05] transition-colors">
              {label}
            </Link>
          ))}
          <Link href="/builder" onClick={() => setOpen(false)}
            className="mt-2 text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-[#08090c] px-4 py-2.5 rounded-xl transition-all text-center">
            Try for free →
          </Link>
        </div>
      )}
    </header>
  )
}
