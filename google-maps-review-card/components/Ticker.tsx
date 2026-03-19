export default function Ticker() {
  const items = [
    '★ Meta Ads', '★ Google Ads', '★ TikTok Ads', '★ YouTube Ads',
    '★ Instagram Stories', '★ Reels', '★ Facebook Feed', '★ Display Network',
    '★ Retargeting', '★ Lookalike Audiences', '★ Local Campaigns', '★ Performance Max',
  ]
  const doubled = [...items, ...items]

  return (
    <div className="py-5 border-y border-white/[0.06] overflow-hidden bg-[#0d0f14]/70 backdrop-blur-sm">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <span key={i} className="mx-6 text-xs font-medium text-white/30 whitespace-nowrap tracking-wide">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
