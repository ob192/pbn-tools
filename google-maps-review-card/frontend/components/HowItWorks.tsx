import { PenLine, Download, Rocket } from 'lucide-react'

const STEPS = [
  {
    icon: PenLine,
    num: '01',
    title: 'Fill in the details',
    desc: 'Enter the reviewer name, star rating, and review text. Add optional photos, scores, and a price range — just like the real thing.',
    accent: '#f59e0b',
  },
  {
    icon: Download,
    num: '02',
    title: 'Pick your format & export',
    desc: 'Choose Card only, 1:1 Square, 9:16 Story, or 4:5 Portrait. Download a crisp 3× high-res PNG — transparent or on any background.',
    accent: '#3fd68a',
  },
  {
    icon: Rocket,
    num: '03',
    title: 'Drop it into your ad creative',
    desc: 'Paste into Canva, Figma, or your ad manager. Watch your CTR climb as buyers see real social proof right in your creative.',
    accent: '#ff6b35',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-full px-3.5 py-1.5 mb-4">
            <span className="text-xs font-medium text-white/50 tracking-wide uppercase">Simple process</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-normal mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            From review to ready-to-run<br />
            <span className="italic text-amber-400">in under 2 minutes.</span>
          </h2>
          <p className="text-white/45 text-lg max-w-xl mx-auto">
            No design skills. No Photoshop. No waiting. Just fill, click, done.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="group relative bg-[#13161e] border border-white/[0.06] rounded-2xl p-7 hover:border-white/[0.12] transition-all duration-300">
                {/* Number */}
                <div className="text-xs font-mono text-white/20 mb-4 tracking-widest">{step.num}</div>

                {/* Icon */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                  style={{ background: `${step.accent}18`, border: `1px solid ${step.accent}30` }}>
                  <Icon className="w-5 h-5" style={{ color: step.accent }} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{step.desc}</p>

                {/* Connector line (not on last) */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-white/10 to-transparent" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
