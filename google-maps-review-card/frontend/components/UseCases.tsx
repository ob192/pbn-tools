import GoogleReviewCard from './GoogleReviewCard'

const CASES = [
  {
    industry: 'Restaurant & Café',
    bg: 'linear-gradient(135deg,#ff6b35,#f7b731)',
    card: {
      name: 'Olena Melnyk', meta: 'Local Guide · 38 reviews', rating: 5,
      date: '5 days ago', text: 'Best brunch in the city hands down. The eggs benedict were perfect and the coffee was exceptional.',
      initials: 'OM', avatarColor: '#ff6d00',
    },
  },
  {
    industry: 'Beauty & Salon',
    bg: 'linear-gradient(135deg,#f093fb,#f5576c)',
    card: {
      name: 'Kateryna Shevchenko', meta: '19 reviews · 12 photos', rating: 5,
      date: '2 weeks ago', text: "The best salon experience I've had. They really took the time to understand exactly what I wanted.",
      initials: 'KS', avatarColor: '#9c27b0',
    },
  },
  {
    industry: 'Fitness & Health',
    bg: 'linear-gradient(135deg,#43e97b,#38f9d7)',
    card: {
      name: 'Artem Bondarenko', meta: 'Local Guide · 54 reviews', rating: 5,
      date: '1 week ago', text: 'Amazing trainers, clean facilities, and the results speak for themselves. Signed up for another 6 months.',
      initials: 'AB', avatarColor: '#1a73e8',
    },
  },
]

export default function UseCases() {
  return (
    <section id="use-cases" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-full px-3.5 py-1.5 mb-4">
            <span className="text-xs font-medium text-white/50 tracking-wide uppercase">Works for every industry</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-normal mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Your industry, your<br />
            <span className="italic text-amber-400">social proof.</span>
          </h2>
          <p className="text-white/45 text-lg max-w-lg mx-auto">
            Whether you run a restaurant, clinic, or gym — review cards outperform stock imagery in every A/B test.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {CASES.map((c, i) => (
            <div key={i} className="group">
              {/* Ad frame */}
              <div className="rounded-2xl overflow-hidden border border-white/[0.07] transition-transform duration-300 group-hover:-translate-y-1">
                {/* Gradient header */}
                <div className="h-28 flex items-center justify-center text-center px-4" style={{ background: c.bg }}>
                  <p className="text-white font-bold text-lg drop-shadow-lg leading-tight">
                    {c.industry}
                  </p>
                </div>
                {/* Review card */}
                <div className="p-3 bg-[#13161e]">
                  <GoogleReviewCard {...c.card} />
                </div>
                {/* CTA bar */}
                <div className="bg-[#0d0f14] px-4 py-3 flex items-center justify-between border-t border-white/[0.05]">
                  <span className="text-[10px] text-white/30">Sponsored</span>
                  <div className="rounded-lg px-3 py-1 text-[10px] font-semibold text-[#08090c]"
                    style={{ background: c.bg }}>
                    Book Now
                  </div>
                </div>
              </div>
              <p className="text-xs text-white/30 text-center mt-2">{c.industry} campaign creative</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
