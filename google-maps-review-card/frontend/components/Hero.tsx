'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Star, Sparkles } from 'lucide-react'
import GoogleReviewCard from './GoogleReviewCard'

const REVIEWS = [
  {
    name: 'Anastasiia Koval', meta: 'Local Guide · 23 reviews', rating: 5,
    date: '2 weeks ago', text: 'Amazing spot! The latte art is stunning and pastries are perfectly fresh. Cozy atmosphere, friendly staff — will definitely be back.',
    initials: 'AK', avatarColor: '#1a73e8',
  },
  {
    name: 'Marco Vitelli', meta: 'Local Guide · 47 reviews', rating: 5,
    date: '1 month ago', text: "Best barbershop I've ever visited. Precise cuts, great atmosphere and the team really listens. My go-to place for the last 2 years.",
    initials: 'MV', avatarColor: '#ea4335',
  },
  {
    name: 'Sophie Laurent', meta: '31 reviews · 18 photos', rating: 5,
    date: '3 weeks ago', text: "Absolutely incredible results. The staff is professional, warm and genuinely passionate. I've recommended this place to everyone I know.",
    initials: 'SL', avatarColor: '#34a853',
  },
]

export default function Hero() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % REVIEWS.length), 4000)
    return () => clearInterval(t)
  }, [])

  const r = REVIEWS[active]

  return (
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16 px-4">

        {/* Background */}
        <div className="absolute inset-0 grid-bg opacity-100" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[min(700px,140vw)] h-[400px] rounded-full opacity-[0.07] pointer-events-none"
             style={{ background: 'radial-gradient(ellipse, #f59e0b 0%, transparent 65%)' }} />

        <div className="relative z-10 w-full max-w-6xl mx-auto">
          {/* ── Single column on mobile, two columns on lg ── */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-14 lg:items-center">

            {/* ── COPY ── */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">

              {/* Badge */}
              <div className="anim-fade-up inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 rounded-full px-3 py-1.5 mb-5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="text-xs font-medium text-amber-300 tracking-wide">Meta Ads · Google Ads · TikTok</span>
              </div>

              {/* Headline — smaller on mobile */}
              <h1
                  className="anim-fade-up delay-100 text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-tight mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
              >
                Turn 5-star reviews into{' '}
                <span className="shimmer-text italic">ads that convert.</span>
              </h1>

              {/* Subheadline */}
              <p className="anim-fade-up delay-200 text-base sm:text-lg text-white/50 leading-relaxed mb-6 max-w-md">
                Build pixel-perfect Google Maps review cards in seconds.
                Drop them into your creatives — and let{' '}
                <span className="text-white/80">social proof</span> do the heavy lifting.
              </p>

              {/* Stats row */}
              <div className="anim-fade-up delay-300 flex items-center justify-center lg:justify-start gap-6 mb-7">
                {[
                  { n: '3×',   label: 'higher CTR' },
                  { n: '41%',  label: 'lower CPL'  },
                  { n: '2min', label: 'to export'  },
                ].map(s => (
                    <div key={s.n} className="flex flex-col items-center lg:items-start">
                      <div className="text-xl sm:text-2xl font-bold text-amber-400" style={{ fontFamily: 'var(--font-display)' }}>{s.n}</div>
                      <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
                    </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="anim-fade-up delay-400 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link
                    href="/builder"
                    className="group flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#08090c] font-semibold px-6 py-3.5 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] shadow-xl shadow-amber-500/25 text-sm"
                >
                  Build your card — free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <a
                    href="#how-it-works"
                    className="flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-white/70 hover:text-white font-medium px-5 py-3.5 rounded-xl transition-all text-sm"
                >
                  See how it works
                </a>
              </div>

              {/* Social proof */}
              <div className="anim-fade-up delay-500 flex items-center gap-3 mt-5">
                <div className="flex -space-x-2">
                  {['#1a73e8','#ea4335','#34a853','#fbbc04','#9c27b0'].map((c, i) => (
                      <div
                          key={i}
                          className="w-7 h-7 rounded-full border-2 border-[#08090c] flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                          style={{ background: c }}
                      >
                        {['A','M','S','J','K'][i]}
                      </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                  </div>
                  <span className="text-xs text-white/40">2,400+ marketers use ReviewCard</span>
                </div>
              </div>
            </div>

            {/* ── CARD PREVIEW ── */}
            {/* On mobile: compact single card, centered, no background ghost card */}
            <div className="relative flex items-center justify-center mt-12 lg:mt-0 lg:justify-end">

              {/* Glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full opacity-15"
                     style={{ background: 'radial-gradient(ellipse, #f59e0b 0%, transparent 70%)' }} />
              </div>

              {/* Ghost card — hidden on mobile to avoid overflow */}
              <div className="hidden lg:block absolute right-2 top-4 w-60 opacity-35 anim-float-2 pointer-events-none">
                <GoogleReviewCard
                    name="Marco Vitelli" meta="Local Guide · 47 reviews"
                    rating={5} date="1 month ago"
                    text="Best barbershop I've ever visited. Precise cuts, great atmosphere."
                    initials="MV" avatarColor="#ea4335"
                />
              </div>

              {/* Main card — full width on mobile, fixed width on desktop */}
              <div
                  className="relative z-10 w-full max-w-xs sm:max-w-sm lg:w-72 drop-shadow-2xl anim-float"
                  key={active}
                  style={{ animation: 'floatY 5.5s ease-in-out infinite, fadeUp 0.5s ease both' }}
              >
                {/* Ad-frame wrapper */}
                <div
                    className="rounded-2xl overflow-hidden border border-white/10"
                    style={{ background: 'linear-gradient(135deg,#1a1d28 0%,#0d0f14 100%)' }}
                >
                  <div className="px-2 pt-2 pb-1">
                    <div className="text-[9px] font-mono text-white/25 mb-1.5 tracking-widest uppercase">
                      Ad Creative · 1080×1080
                    </div>
                    <div className="rounded-xl overflow-hidden">
                      <GoogleReviewCard
                          name={r.name} meta={r.meta} rating={r.rating}
                          date={r.date} text={r.text}
                          initials={r.initials} avatarColor={r.avatarColor}
                      />
                    </div>
                  </div>
                  {/* Fake ad bar */}
                  <div className="px-3 py-2 flex items-center justify-between">
                    <div className="text-[9px] text-white/30 font-mono">sponsored</div>
                    <div className="bg-amber-500 text-[#08090c] text-[9px] font-bold px-2 py-0.5 rounded">Learn More</div>
                  </div>
                </div>

                {/* PNG-ready badge */}
                <div className="absolute -top-3 -right-3 bg-[#13161e] border border-amber-500/30 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 shadow-xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[10px] font-medium text-amber-300">PNG ready</span>
                </div>
              </div>

              {/* Dot indicators */}
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex gap-1.5">
                {REVIEWS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`rounded-full transition-all ${i === active ? 'w-4 h-1.5 bg-amber-400' : 'w-1.5 h-1.5 bg-white/20'}`}
                    />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Scroll cue — hide on very small screens */}
        <div className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-white/25 pointer-events-none">
          <span className="text-[10px] tracking-widest uppercase font-medium">Scroll</span>
          <div className="w-px h-7 bg-gradient-to-b from-white/25 to-transparent" />
        </div>
      </section>
  )
}