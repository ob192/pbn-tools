import { Star } from 'lucide-react'

const TESTIMONIALS = [
  { name: 'Dmytro K.', role: 'Media Buyer, e-com', text: "Our CTR on review-card creatives is 3.1× higher than lifestyle photos. This tool paid for itself in the first week.", stars: 5, seed: 'dmytro-k' },
  { name: 'Sarah M.', role: 'Agency Founder', text: "I use ReviewCard for every local client. We go from brief to exported asset in literally 90 seconds.", stars: 5, seed: 'sarah-m' },
  { name: 'Ivan P.', role: 'Restaurant Owner', text: "Dropped a review card into our Facebook feed ads and our cost per reservation dropped 38% immediately.", stars: 5, seed: 'ivan-p' },
  { name: 'Lena B.', role: 'Performance Marketer', text: "Finally a tool that understands ad creatives. The 9:16 format for Instagram Stories is absolutely perfect.", stars: 5, seed: 'lena-b' },
  { name: 'Tom W.', role: 'Google Ads Specialist', text: "The transparent PNG export is a game changer. I can drop the card into any template in Canva instantly.", stars: 5, seed: 'tom-w' },
  { name: 'Oksana V.', role: 'Local Business Owner', text: "I knew my reviews were good, now I can actually show them in ads. My spa bookings are up 60% this quarter.", stars: 5, seed: 'oksana-v' },
]

export default function SocialProof() {
  return (
      <section className="relative py-28 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl lg:text-5xl font-normal mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Marketers who switched<br />
              <span className="italic text-amber-400">don't go back.</span>
            </h2>
            <p className="text-white/40 text-lg">2,400+ businesses use ReviewCard every month.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
                <div key={i} className="bg-[#13161e] border border-white/[0.06] rounded-2xl p-6">
                  <div className="flex mb-3">
                    {Array(t.stars).fill(0).map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-white/65 leading-relaxed mb-4">{t.text}</p>
                  <div className="flex items-center gap-3">
                    <img
                        src={`https://api.dicebear.com/9.x/notionists/svg?seed=${t.seed}`}
                        alt={t.name}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white/80">{t.name}</div>
                      <div className="text-[10px] text-white/35">{t.role}</div>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </section>
  )
}