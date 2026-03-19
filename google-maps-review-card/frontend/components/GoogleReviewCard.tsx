import React from 'react'

interface ReviewCardProps {
  name?: string
  meta?: string
  rating?: number
  date?: string
  text?: string
  initials?: string
  avatarColor?: string
  className?: string
  style?: React.CSSProperties
}

const STAR_COLOR = '#fbbc04'
const STAR_EMPTY = '#dadce0'

export default function GoogleReviewCard({
  name = 'Anastasiia Koval',
  meta = 'Local Guide · 23 reviews',
  rating = 5,
  date = '2 weeks ago',
  text = 'Amazing spot! The latte art is stunning and the pastries are fresh. Cozy atmosphere, friendly staff — will definitely be back.',
  initials = 'AK',
  avatarColor = '#1a73e8',
  className = '',
  style,
}: ReviewCardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-xl p-4 w-full ${className}`}
      style={{ fontFamily: 'DM Sans, Roboto, sans-serif', color: '#202124', ...style }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: avatarColor }}>
              {initials}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center">
              <svg width="6" height="6" viewBox="0 0 24 24" fill="white">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium leading-tight">{name}</div>
            <div className="text-xs text-[#70757a] mt-0.5">{meta}</div>
          </div>
        </div>
        {/* Google G */}
        <svg width="18" height="18" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5 opacity-80">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      </div>

      {/* Stars + date */}
      <div className="flex items-center gap-2 mt-2">
        <div className="flex" style={{ letterSpacing: '-2px' }}>
          {[1,2,3,4,5].map(i => (
            <span key={i} style={{ color: i <= rating ? STAR_COLOR : STAR_EMPTY, fontSize: '15px' }}>★</span>
          ))}
        </div>
        <span className="text-xs text-[#70757a]">{date}</span>
      </div>

      {/* Review text */}
      <p className="text-sm leading-snug mt-2 text-[#3c4043]">{text}</p>

      {/* Footer */}
      <div className="flex items-center gap-5 mt-3 pt-2.5 border-t border-[#f1f3f4]">
        <button className="flex items-center gap-1.5 text-xs font-medium text-[#3c4043]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#d93025">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          Helpful (4)
        </button>
        <button className="flex items-center gap-1.5 text-xs font-medium text-[#3c4043]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#70757a">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
          </svg>
          Share
        </button>
      </div>
    </div>
  )
}
