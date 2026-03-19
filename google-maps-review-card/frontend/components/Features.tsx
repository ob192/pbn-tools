import { ImageDown, Layers, Palette, Zap, ShieldCheck, LayoutTemplate } from 'lucide-react'

const FEATS = [
  { icon: Zap,            title: 'Live preview',         desc: 'Every keystroke updates the card in real-time. What you see is exactly what you export.' },
  { icon: ImageDown,      title: 'Hi-res PNG export',    desc: 'Cards export at 3× pixel density — razor-sharp on every screen and ad platform.' },
  { icon: LayoutTemplate, title: '4 export formats',     desc: 'Card only, 1:1, 4:5, and 9:16 — sized perfectly for Stories, Feed, and Reels.' },
  { icon: Palette,        title: 'Background themes',    desc: 'Transparent, solid colors, or stunning gradients. Your card, your brand palette.' },
  { icon: Layers,         title: 'Scores & photos',      desc: 'Add Food/Service/Atmosphere scores and attach up to 9 review photos like the real app.' },
  { icon: ShieldCheck,    title: 'Authentic look',        desc: 'Pixel-matched to actual Google Maps reviews. Reviewers recognize it instantly — and trust it.' },
]

export default function Features() {
  return (
    <section id="features" className="relative py-28">
      <div className="max-w-5xl mx-auto px-6">

        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-full px-3.5 py-1.5 mb-4">
            <span className="text-xs font-medium text-white/50 tracking-wide uppercase">Everything you need</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-normal mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Built for performance<br />
            <span className="italic text-amber-400">marketers.</span>
          </h2>
          <p className="text-white/45 text-lg max-w-lg mx-auto">
            Every detail is designed so your creative looks indistinguishable from the real review.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATS.map((f, i) => {
            const Icon = f.icon
            return (
              <div key={i} className="group bg-[#13161e] hover:bg-[#161a24] border border-white/[0.06] hover:border-amber-500/20 rounded-2xl p-6 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:bg-amber-500/15 transition-colors">
                  <Icon className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
