import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'

export default function CTA() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Big glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-[0.12]"
        style={{ background: 'radial-gradient(ellipse, #f59e0b 0%, transparent 65%)' }} />

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        {/* Stars */}
        <div className="flex justify-center mb-6">
          {[1,2,3,4,5].map(i => (
            <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
          ))}
        </div>

        <h2 className="text-5xl lg:text-6xl font-normal mb-5 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Your best reviews<br />
          deserve to be <span className="shimmer-text italic">seen.</span>
        </h2>

        <p className="text-white/45 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Start building your first review card now — free, no account needed, export in 2 minutes.
        </p>

        <Link href="/builder/index.html"
          className="group inline-flex items-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-[#08090c] font-bold px-8 py-4 rounded-2xl transition-all hover:scale-[1.04] active:scale-[0.97] shadow-2xl shadow-amber-500/30 text-base">
          Build your review card — it's free
          <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <p className="text-xs text-white/25 mt-5">No account required · PNG export · Works in Canva, Figma, Meta Ads</p>
      </div>
    </section>
  )
}
