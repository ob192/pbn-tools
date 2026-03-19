'use client'
import {
  useState, useRef, useCallback, useMemo, memo,
  startTransition, type ChangeEvent, type KeyboardEvent,
  type ReactNode, type TouchEvent as ReactTouchEvent,
} from 'react'
import Link from 'next/link'
import {
  Star, Download, Copy, ArrowLeft, Plus, X, Upload,
  Settings2, ChevronUp, ChevronDown,
} from 'lucide-react'

/* ══════════════════════════════════
   TYPES
══════════════════════════════════ */
interface Photo { url: string }
interface ScoreState { enabled: boolean; value: number }
interface Scores { food: ScoreState; service: ScoreState; atm: ScoreState }

/* ══════════════════════════════════
   PERFORMANCE UTILITIES
══════════════════════════════════ */
function useDeferredSetter<T>(setter: (v: T) => void) {
  return useCallback(
      (v: T) => startTransition(() => setter(v)),
      [setter],
  )
}

const EMPTY_PHOTOS: Photo[] = []

/* ══════════════════════════════════
   CONSTANTS
══════════════════════════════════ */
const PAL = ['#1a73e8','#ea4335','#34a853','#fbbc04','#9c27b0','#ff6d00','#00acc1'] as const

const RATIOS = {
  free:       { label: 'Card only', w: null,  h: null,  ar: null },
  square:     { label: '1 : 1',     w: 1080,  h: 1080,  ar: 1    },
  portrait43: { label: '4 : 5',     w: 1080,  h: 1350,  ar: 4/5  },
  portrait:   { label: '9 : 16',    w: 1080,  h: 1920,  ar: 9/16 },
} as const
type RatioKey = keyof typeof RATIOS

const RATIO_ICONS: Record<RatioKey, { w: number; h: number }> = {
  free: { w: 22, h: 16 }, square: { w: 18, h: 18 },
  portrait43: { w: 15, h: 19 }, portrait: { w: 12, h: 21 },
}

const BG_SWATCHES = [
  { value: 'transparent' },
  { value: '#ffffff',     bg: '#fff' },
  { value: '#000000',     bg: '#000' },
  { value: '#1a1a2e',     bg: '#1a1a2e' },
  { value: 'linear-gradient(135deg,#667eea,#764ba2)', bg: 'linear-gradient(135deg,#667eea,#764ba2)' },
  { value: 'linear-gradient(135deg,#f093fb,#f5576c)', bg: 'linear-gradient(135deg,#f093fb,#f5576c)' },
  { value: 'linear-gradient(135deg,#4facfe,#00f2fe)', bg: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
  { value: 'linear-gradient(135deg,#43e97b,#38f9d7)', bg: 'linear-gradient(135deg,#43e97b,#38f9d7)' },
  { value: 'linear-gradient(135deg,#fa8231,#f7b731)', bg: 'linear-gradient(135deg,#fa8231,#f7b731)' },
] as const

const checkerBg = {
  backgroundImage:
      'linear-gradient(45deg,#20233a 25%,transparent 25%),' +
      'linear-gradient(-45deg,#20233a 25%,transparent 25%),' +
      'linear-gradient(45deg,transparent 75%,#20233a 75%),' +
      'linear-gradient(-45deg,transparent 75%,#20233a 75%)',
  backgroundSize: '14px 14px',
  backgroundPosition: '0 0,0 7px,7px -7px,-7px 0',
  backgroundColor: '#171a2b',
} as const

const DRAWER_PEEK = 72
const PREV_MAX_W  = 420
const PREV_MAX_H  = 480

/* ══════════════════════════════════
   GOOGLE REVIEW CARD (memo'd)

   KEY FIX: All styles are INLINE so html2canvas
   can render them on cloned DOM nodes.
   Tailwind classes are only used as supplements
   for the live preview — every export-critical
   property is set via style={}.
══════════════════════════════════ */
const GmCard = memo(function GmCard({
                                      name, meta, avatarUrl, rating, date, text, currency, price, likes,
                                      photos, scores, id,
                                    }: {
  name: string; meta: string; avatarUrl: string; rating: number; date: string
  text: string; currency: string; price: string; likes: string
  photos: Photo[]; scores: Scores; id?: string
}) {
  const avatarBg = PAL[(name.charCodeAt(0) || 65) % PAL.length]
  const initials = useMemo(
      () => name.trim().split(' ').map(w => w[0] || '').slice(0, 2).join('').toUpperCase() || '?',
      [name],
  )
  const priceStr = currency && price ? currency + price : price || ''

  const specParts = useMemo(() => [
    scores.food.enabled    && `Food: ${scores.food.value}/5`,
    scores.service.enabled && `Service: ${scores.service.value}/5`,
    scores.atm.enabled     && `Atmosphere: ${scores.atm.value}/5`,
  ].filter(Boolean) as string[], [scores])

  const cols = photos.length === 1 ? 1 : photos.length === 2 ? 2 : 3

  return (
      <div
          id={id}
          style={{
            fontFamily: "'Roboto', sans-serif",
            color: '#202124',
            background: '#ffffff',
            borderRadius: '8px',
            padding: '1.07em',
            width: '100%',
            boxShadow: '0 1px 3px rgba(60,64,67,.15),0 4px 8px rgba(60,64,67,.1)',
            contain: 'layout style paint',
            position: 'relative',
            boxSizing: 'border-box',
          }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8em' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {avatarUrl ? (
                  <img
                      src={avatarUrl} alt={name}
                      style={{
                        width: '2.67em',
                        height: '2.67em',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                      loading="lazy" decoding="async"
                  />
              ) : (
                  <div
                      style={{
                        width: '2.67em',
                        height: '2.67em',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.93em',
                        fontWeight: 700,
                        fontFamily: "'Roboto', sans-serif",
                        background: avatarBg,
                      }}
                  >
                    {initials}
                  </div>
              )}
              <div style={{
                position: 'absolute',
                bottom: '-0.07em',
                right: '-0.07em',
                width: '0.93em',
                height: '0.93em',
                background: '#ff6d00',
                borderRadius: '50%',
                border: '2px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="6" height="6" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </div>
            </div>
            <div>
              <span style={{
                fontSize: '0.93em',
                fontWeight: 500,
                color: '#202124',
                display: 'block',
                letterSpacing: '0.01em',
                fontFamily: "'Roboto', sans-serif",
              }}>{name || 'Reviewer Name'}</span>
              <span style={{
                fontSize: '0.8em',
                color: '#70757a',
                marginTop: '0.1em',
                display: 'block',
                fontFamily: "'Roboto', sans-serif",
              }}>{meta || 'Local Guide'}</span>
            </div>
          </div>
          {/* Google G logo */}
          <svg width="1.33em" height="1.33em" viewBox="0 0 24 24" style={{ flexShrink: 0, opacity: 0.85 }} aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </div>

        {/* Stars + date */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '0.27em',
          gap: 0,
        }}>
          <div style={{ fontSize: '1.07em', letterSpacing: '-0.1em', marginRight: '0.53em', lineHeight: 1 }}
               aria-label={`${rating} of 5 stars`}>
            {[1,2,3,4,5].map(i => (
                <span key={i} style={{ color: i <= rating ? '#fbbc04' : '#dadce0' }} aria-hidden="true">★</span>
            ))}
          </div>
          <span style={{ fontSize: '0.8em', color: '#70757a', fontFamily: "'Roboto', sans-serif" }}>{date}</span>
        </div>

        {priceStr && (
            <div style={{ fontSize: '0.87em', color: '#3c4043', marginTop: '0.27em', fontFamily: "'Roboto', sans-serif" }}>
              {priceStr}
            </div>
        )}

        <div style={{
          fontSize: '0.93em',
          lineHeight: 1.43,
          marginTop: '0.53em',
          color: '#3c4043',
          fontFamily: "'Roboto', sans-serif",
        }}>
          {text || 'Review text will appear here...'}
        </div>

        {specParts.length > 0 && (
            <div style={{
              background: '#f1f3f4',
              borderRadius: '0.7em',
              padding: '0.65em 1em',
              marginTop: '0.9em',
              fontSize: '0.87em',
              color: '#3c4043',
              display: 'inline-flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.27em',
              fontFamily: "'Roboto', sans-serif",
            }}>
              {specParts.map((p, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.27em' }}>
                    {p}
                    {i < specParts.length - 1 && (
                        <span style={{ color: '#bdc1c6', margin: '0 0.6em', fontWeight: 300 }}>|</span>
                    )}
                  </span>
              ))}
            </div>
        )}

        {photos.length > 0 && (
            <div style={{
              display: 'grid',
              gap: '0.4em',
              marginTop: '1em',
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
            }}>
              {photos.map((p, i) => (
                  <img
                      key={i} src={p.url} alt=""
                      style={{
                        width: '100%',
                        aspectRatio: '1/1',
                        borderRadius: '0.4em',
                        objectFit: 'cover',
                        border: '1px solid rgba(0,0,0,.05)',
                        display: 'block',
                        minHeight: 0,
                      }}
                      loading="lazy" decoding="async"
                  />
              ))}
            </div>
        )}

        {/* Footer — fully inline so html2canvas preserves alignment */}
        <div style={{
          marginTop: '1.33em',
          display: 'flex',
          alignItems: 'center',
          gap: '1.6em',
        }}>
          <button type="button" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.53em',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: 0,
            fontFamily: "'Roboto', sans-serif",
            fontSize: '0.87em',
            fontWeight: 500,
            color: '#3c4043',
          }}>
            <svg style={{ width: '1.2em', height: '1.2em', flexShrink: 0 }} viewBox="0 0 24 24" fill="#d93025" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 'inherit', fontWeight: 'inherit', color: '#3c4043' }}>
              {likes || '4'}
            </span>
          </button>
          <button type="button" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.53em',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: 0,
            fontFamily: "'Roboto', sans-serif",
            fontSize: '0.87em',
            fontWeight: 500,
            color: '#3c4043',
          }}>
            <svg style={{ width: '1.2em', height: '1.2em', flexShrink: 0 }} viewBox="0 0 24 24" fill="#70757a" aria-hidden="true">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
            </svg>
            <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 'inherit', fontWeight: 'inherit', color: '#3c4043' }}>
              Share
            </span>
          </button>
        </div>
      </div>
  )
})

/* ══════════════════════════════════
   SMALL UI PRIMITIVES (memo'd)
══════════════════════════════════ */
const Field = memo(function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-wider text-white/35">{label}</label>
        {children}
      </div>
  )
})

const inputCls = "w-full bg-[#1a1d2b] border border-[#2e3250] rounded-xl px-3 py-2.5 text-sm text-[#dde1f0] outline-none focus:border-[#5c72f5] focus:ring-2 focus:ring-[#5c72f5]/20 transition-[border-color,box-shadow] placeholder:text-white/20"

const Toggle = memo(function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  const handleClick = useCallback(() => onChange(!checked), [checked, onChange])
  return (
      <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={handleClick}
          className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-amber-500' : 'bg-[#2e3250]'}`}
      >
      <span
          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm will-change-transform"
          style={{ transform: checked ? 'translateX(16px)' : 'translateX(2px)', transition: 'transform .15s ease' }}
      />
      </button>
  )
})

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
      <div className="border-b border-[#252840] px-4 py-4 flex flex-col gap-3.5" style={{ contain: 'layout style' }}>
        <h3 className="text-[10px] font-semibold uppercase tracking-[.12em] text-white/30">{title}</h3>
        {children}
      </div>
  )
}

/* ══════════════════════════════════
   PHOTO THUMBNAIL (memo'd per-item)
══════════════════════════════════ */
const PhotoThumb = memo(function PhotoThumb({ url, onRemove }: { url: string; onRemove: () => void }) {
  return (
      <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#2e3250] group flex-shrink-0">
        <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
        <button
            type="button" onClick={onRemove}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            aria-label="Remove photo"
        >
          <X className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
  )
})

/* ══════════════════════════════════
   RATIO BUTTON (memo'd)
══════════════════════════════════ */
const RatioBtn = memo(function RatioBtn({
                                          k, label, active, onSelect,
                                        }: {
  k: RatioKey; label: string; active: boolean; onSelect: (k: RatioKey) => void
}) {
  const ic = RATIO_ICONS[k]
  const handleClick = useCallback(() => onSelect(k), [k, onSelect])
  return (
      <button
          type="button" onClick={handleClick}
          className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-[9px] font-medium transition-[border-color,background-color,color] ${
              active
                  ? 'border-amber-500 bg-[#20233a] text-amber-300 shadow-sm shadow-amber-500/20'
                  : 'border-[#2e3250] bg-[#1a1d2b] text-white/35 hover:text-white/60 hover:border-[#3a3f60]'
          }`}
      >
        <div className="border-[1.5px] border-current rounded-[2px]" style={{ width: ic.w, height: ic.h }} />
        {label}
      </button>
  )
})

/* ══════════════════════════════════
   BG SWATCH BUTTON (memo'd)
══════════════════════════════════ */
const SwatchBtn = memo(function SwatchBtn({
                                            sw, active, onSelect,
                                          }: {
  sw: typeof BG_SWATCHES[number]; active: boolean; onSelect: (v: string) => void
}) {
  const handleClick = useCallback(() => onSelect(sw.value), [sw.value, onSelect])
  const isTransparent = sw.value === 'transparent'
  return (
      <button
          type="button" title={sw.value} onClick={handleClick}
          className={`w-8 h-8 rounded-lg border-2 transition-[border-color,transform] hover:scale-110 active:scale-95 flex-shrink-0 ${
              active ? 'border-white shadow-md' : 'border-transparent'
          }`}
          style={
            isTransparent
                ? {
                  backgroundImage:
                      'linear-gradient(45deg,#666 25%,transparent 25%),' +
                      'linear-gradient(-45deg,#666 25%,transparent 25%),' +
                      'linear-gradient(45deg,transparent 75%,#666 75%),' +
                      'linear-gradient(-45deg,transparent 75%,#666 75%)',
                  backgroundSize: '8px 8px',
                  backgroundPosition: '0 0,0 4px,4px -4px,-4px 0',
                  backgroundColor: '#333',
                }
                : { background: (sw as { bg?: string }).bg }
          }
      />
  )
})

/* ══════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════ */
export default function BuilderClient() {
  const fileRef   = useRef<HTMLInputElement>(null)
  const touchRef  = useRef<{ startY: number; startH: string } | null>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  /* ── UI state ── */
  const [advanced,  setAdvanced]  = useState(false)
  const [toast,     setToast]     = useState('')
  const [rendering, setRendering] = useState(false)
  const [modal,     setModal]     = useState<{ src: string; label: string } | null>(null)
  const [drawer,    setDrawer]    = useState<'closed' | 'peek' | 'open'>('peek')

  /* ── Form state ── */
  const [name,      setName]      = useState('Anastasiia Koval')
  const [meta,      setMeta]      = useState('Local Guide · 23 reviews · 14 photos')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [rating,    setRating]    = useState(5)
  const [hoverStar, setHoverStar] = useState(0)
  const [date,      setDate]      = useState('2 weeks ago')
  const [text,      setText]      = useState('Amazing spot! The latte art is stunning and the pastries are out of this world fresh. Cozy atmosphere, friendly staff — will definitely be back.')
  const [currency,  setCurrency]  = useState('')
  const [price,     setPrice]     = useState('')
  const [likes,     setLikes]     = useState('4')
  const [photos,    setPhotos]    = useState<Photo[]>(EMPTY_PHOTOS)
  const [photoUrl,  setPhotoUrl]  = useState('')
  const [scores,    setScores]    = useState<Scores>({
    food:    { enabled: false, value: 5 },
    service: { enabled: false, value: 5 },
    atm:     { enabled: false, value: 5 },
  })
  const [ratio,    setRatio]    = useState<RatioKey>('free')
  const [canvasBg, setCanvasBg] = useState('transparent')

  const setTextDeferred = useDeferredSetter(setText)
  const setMetaDeferred = useDeferredSetter(setMeta)

  /* ── Toast ── */
  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2600)
  }, [])

  /* ── Photos ── */
  const addPhotoUrl = useCallback(() => {
    const v = photoUrl.trim()
    if (!v) return
    setPhotos(p => [...p, { url: v }])
    setPhotoUrl('')
  }, [photoUrl])

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach(f => {
      const r = new FileReader()
      r.onload = e => setPhotos(p => [...p, { url: e.target?.result as string }])
      r.readAsDataURL(f)
    })
  }, [])

  const removePhoto = useCallback((idx: number) => {
    setPhotos(p => p.filter((_, j) => j !== idx))
  }, [])

  /* ── Touch-based drawer swipe ── */
  const onTouchStart = useCallback((e: ReactTouchEvent) => {
    touchRef.current = {
      startY: e.touches[0].clientY,
      startH: drawerRef.current?.style.height || '',
    }
  }, [])

  const onTouchEnd = useCallback((e: ReactTouchEvent) => {
    if (!touchRef.current) return
    const dy = touchRef.current.startY - e.changedTouches[0].clientY
    if (dy > 60) setDrawer(d => d === 'closed' ? 'peek' : 'open')
    else if (dy < -60) setDrawer(d => d === 'open' ? 'peek' : 'closed')
    touchRef.current = null
  }, [])

  /* ── PNG export ── */
  const exportPng = useCallback(async () => {
    setRendering(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const cfg = RATIOS[ratio]
      const card = document.getElementById('gm-preview-card')
      if (!card) throw new Error('Card not found')

      let finalCanvas: HTMLCanvasElement

      if (ratio === 'free') {
        /*
         * Card-only mode: clone the card off-screen and render at 3×.
         * Because all card styles are inline, the clone is self-contained.
         */
        const computedFs = parseFloat(getComputedStyle(card).fontSize) || 15
        const host = document.createElement('div')
        host.style.cssText = 'position:fixed;top:-9999px;left:-9999px;display:inline-block;background:transparent'
        const clone = card.cloneNode(true) as HTMLElement
        clone.style.cssText = [
          `width:${card.offsetWidth}px`,
          `font-size:${computedFs}px`,
          `padding:${(computedFs * 1.07).toFixed(1)}px`,
          "background:#ffffff",
          "backdrop-filter:none",
          "-webkit-backdrop-filter:none",
          "border:none",
          "border-radius:8px",
          "box-shadow:0 1px 3px rgba(60,64,67,.15),0 4px 8px rgba(60,64,67,.1)",
          "color:#202124",
          "font-family:Roboto,sans-serif",
          "position:relative",
          "overflow:hidden",
          "box-sizing:border-box",
        ].join(';')
        host.appendChild(clone)
        document.body.appendChild(host)
        finalCanvas = await html2canvas(host, {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
        })
        document.body.removeChild(host)

      } else {
        /*
         * Ratio mode: render card at exact export width, composite on background.
         */
        const exportW = cfg.w!
        const exportH = cfg.h!
        const hPadFrac = 0.06
        const exportCardW = Math.round(exportW * (1 - hPadFrac * 2))
        const exportFontSize = Math.max(10, Math.min(28, 15 * exportCardW / 420))

        const host = document.createElement('div')
        host.style.cssText = `position:fixed;top:-9999px;left:-9999px;display:inline-block;width:${exportCardW}px`
        const clone = card.cloneNode(true) as HTMLElement
        clone.style.cssText = [
          `width:${exportCardW}px`,
          `font-size:${exportFontSize}px`,
          `padding:${(exportFontSize * 1.07).toFixed(1)}px`,
          "background:#ffffff",
          "backdrop-filter:none",
          "-webkit-backdrop-filter:none",
          "border:none",
          "border-radius:8px",
          "box-shadow:0 2px 8px rgba(60,64,67,.2)",
          "color:#202124",
          "font-family:Roboto,sans-serif",
          "position:relative",
          "overflow:visible",
          "box-sizing:border-box",
        ].join(';')
        host.appendChild(clone)
        document.body.appendChild(host)

        const SCALE = 2
        const cardBmp = await html2canvas(host, {
          scale: SCALE,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          width: exportCardW,
        })
        document.body.removeChild(host)

        const out = document.createElement('canvas')
        out.width = exportW; out.height = exportH
        const ctx = out.getContext('2d')!

        if (canvasBg !== 'transparent') {
          if (canvasBg.startsWith('linear') || canvasBg.startsWith('radial')) {
            const tmp = document.createElement('div')
            tmp.style.cssText = `position:fixed;top:-9999px;left:-9999px;width:${exportW}px;height:${exportH}px;background:${canvasBg}`
            document.body.appendChild(tmp)
            const gbg = await html2canvas(tmp, { scale: 1, backgroundColor: null, logging: false })
            document.body.removeChild(tmp)
            ctx.drawImage(gbg, 0, 0, exportW, exportH)
          } else {
            ctx.fillStyle = canvasBg
            ctx.fillRect(0, 0, exportW, exportH)
          }
        }

        const cardDrawW = exportCardW
        const cardDrawH = cardBmp.height / SCALE
        ctx.drawImage(
            cardBmp,
            Math.round((exportW - cardDrawW) / 2),
            Math.round((exportH - cardDrawH) / 2),
            cardDrawW, cardDrawH,
        )
        finalCanvas = out
      }

      const src = finalCanvas.toDataURL('image/png')
      const lbl = ratio === 'free'
          ? 'Card only · transparent PNG'
          : `${cfg.label} · ${cfg.w}×${cfg.h}px`
      setModal({ src, label: lbl })
    } catch (e) {
      console.error(e)
      showToast('Render failed — try again')
    } finally {
      setRendering(false)
    }
  }, [ratio, canvasBg, showToast])

  const saveModal = useCallback(() => {
    if (!modal) return
    const a = document.createElement('a')
    a.href = modal.src
    a.download = `gmaps-review-${name.replace(/\s+/g, '-').toLowerCase()}.png`
    a.click()
    setModal(null)
  }, [modal, name])

  const copyHtml = useCallback(() => {
    const el = document.getElementById('gm-preview-card')
    if (!el) return
    navigator.clipboard.writeText(el.outerHTML).then(() => showToast('HTML copied!'))
  }, [showToast])

  const closeModal = useCallback(() => setModal(null), [])

  /* ── Preview frame sizing ── */
  const frameDims = useMemo(() => {
    const cfg = RATIOS[ratio]
    if (ratio === 'free' || !cfg.ar) return null
    let w: number, h: number
    if (cfg.ar >= 1) { w = Math.min(PREV_MAX_W, PREV_MAX_H * cfg.ar); h = w / cfg.ar }
    else             { h = Math.min(PREV_MAX_H, PREV_MAX_W / cfg.ar); w = h * cfg.ar }
    return { w: Math.round(w), h: Math.round(h) }
  }, [ratio])

  const drawerHeight = drawer === 'closed' ? DRAWER_PEEK + 'px'
      : drawer === 'peek' ? '55vh' : '88vh'

  /* ── Score handlers ── */
  const toggleScore = useCallback((k: 'food' | 'service' | 'atm', v: boolean) => {
    setScores(s => ({ ...s, [k]: { ...s[k], enabled: v } }))
  }, [])
  const setScoreValue = useCallback((k: 'food' | 'service' | 'atm', v: number) => {
    setScores(s => ({ ...s, [k]: { ...s[k], value: v } }))
  }, [])

  /* ═══════════════════════════════════════════
     SIDEBAR CONTENT
  ═══════════════════════════════════════════ */
  const SidebarContent = useMemo(() => (
      <>
        <Section title="Reviewer">
          <Field label="Name">
            <input className={inputCls} value={name} onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} placeholder="Full name" />
          </Field>
          <Field label="Meta line">
            <input className={inputCls} value={meta} onChange={(e: ChangeEvent<HTMLInputElement>) => setMetaDeferred(e.target.value)} placeholder="Local Guide · N reviews" />
          </Field>
          <Field label="Avatar URL (blank = initials)">
            <input className={inputCls} type="url" value={avatarUrl} onChange={(e: ChangeEvent<HTMLInputElement>) => setAvatarUrl(e.target.value)} placeholder="https://…" />
          </Field>
        </Section>

        <Section title="Review">
          <Field label="Rating">
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                  <button
                      key={i} type="button"
                      onMouseEnter={() => setHoverStar(i)} onMouseLeave={() => setHoverStar(0)}
                      onClick={() => setRating(i)}
                      className="text-2xl leading-none active:scale-95"
                      style={{ transform: 'translateZ(0)' }}
                  >
                    <span style={{ color: i <= (hoverStar || rating) ? '#f5a41e' : '#2e3250' }}>★</span>
                  </button>
              ))}
            </div>
          </Field>
          <Field label="Date">
            <input className={inputCls} value={date} onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)} placeholder="2 weeks ago" />
          </Field>
          <Field label="Review text">
          <textarea
              className={inputCls} rows={3}
              style={{ resize: 'none', lineHeight: '1.55' }}
              value={text}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTextDeferred(e.target.value)}
              placeholder="Write the review…"
          />
          </Field>
          <Field label="Price range (optional)">
            <div className="flex gap-2">
              <select
                  className={inputCls}
                  style={{ width: 'auto', flexShrink: 0, cursor: 'pointer' }}
                  value={currency}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setCurrency(e.target.value)}
              >
                <option value="">—</option>
                <option value="₴">₴ UAH</option>
                <option value="$">$ USD</option>
                <option value="€">€ EUR</option>
                <option value="£">£ GBP</option>
              </select>
              <input className={inputCls} value={price} onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)} placeholder="100–300" />
            </div>
          </Field>
          <Field label="Helpful count">
            <input className={inputCls} type="number" min="0" value={likes} onChange={(e: ChangeEvent<HTMLInputElement>) => setLikes(e.target.value)} />
          </Field>
        </Section>

        <Section title="Photos">
          <div className="flex gap-2">
            <input
                className={inputCls} type="url" value={photoUrl}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPhotoUrl(e.target.value)}
                onKeyDown={(e: KeyboardEvent) => e.key === 'Enter' && addPhotoUrl()}
                placeholder="Paste image URL…"
            />
            <button
                type="button" onClick={addPhotoUrl}
                className="flex-shrink-0 h-10 px-3 bg-[#1a1d2b] border border-[#2e3250] rounded-xl text-xs font-medium text-white/50 hover:bg-[#5c72f5] hover:border-[#5c72f5] hover:text-white transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {photos.map((p, i) => (
                <PhotoThumb key={i} url={p.url} onRemove={() => removePhoto(i)} />
            ))}
            <button
                type="button" onClick={() => fileRef.current?.click()}
                className="w-14 h-14 rounded-lg border-2 border-dashed border-[#2e3250] hover:border-[#5c72f5] flex flex-col items-center justify-center gap-0.5 text-white/30 hover:text-[#5c72f5] transition-colors text-[9px] font-medium flex-shrink-0"
            >
              <Upload className="w-4 h-4" />Upload
            </button>
            <input
                ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                onChange={e => { handleFiles(e.target.files); e.target.value = '' }}
            />
          </div>
        </Section>

        {advanced && (
            <Section title="Scores (optional)">
              {(['food', 'service', 'atm'] as const).map(k => (
                  <div key={k} className="flex items-center gap-3">
                    <Toggle checked={scores[k].enabled} onChange={v => toggleScore(k, v)} />
                    <span className="text-sm text-white/60 flex-1 capitalize">{k === 'atm' ? 'Atmosphere' : k}</span>
                    <input
                        type="number" min={1} max={5} disabled={!scores[k].enabled}
                        value={scores[k].value}
                        onChange={e => setScoreValue(k, Number(e.target.value))}
                        className="w-12 text-center bg-[#1a1d2b] border border-[#2e3250] rounded-lg py-1.5 text-sm text-[#dde1f0] outline-none disabled:opacity-20 font-mono"
                    />
                  </div>
              ))}
            </Section>
        )}

        {advanced && (
            <Section title="Export Background">
              <div className="flex flex-wrap gap-2">
                {BG_SWATCHES.map(sw => (
                    <SwatchBtn key={sw.value} sw={sw} active={canvasBg === sw.value} onSelect={setCanvasBg} />
                ))}
              </div>
            </Section>
        )}

        <Section title="Export Format">
          <div className="grid grid-cols-4 gap-2">
            {(Object.entries(RATIOS) as [RatioKey, typeof RATIOS[RatioKey]][]).map(([key, val]) => (
                <RatioBtn key={key} k={key} label={val.label} active={ratio === key} onSelect={setRatio} />
            ))}
          </div>
        </Section>

        <div className="px-4 py-4 flex flex-col gap-2.5">
          <button
              type="button" onClick={exportPng} disabled={rendering}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#5c72f5] to-[#3fd68a] text-white font-semibold py-3 rounded-xl text-sm transition-opacity hover:opacity-90 active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#5c72f5]/25"
          >
            {rendering
                ? <><span className="inline-block animate-spin">⟳</span> Rendering…</>
                : <><Download className="w-4 h-4" /> Download PNG</>
            }
          </button>
          <button
              type="button" onClick={copyHtml}
              className="w-full flex items-center justify-center gap-2 bg-[#1a1d2b] border border-[#2e3250] text-white/50 hover:text-white/80 hover:border-[#3a3f60] font-medium py-2.5 rounded-xl text-sm transition-colors"
          >
            <Copy className="w-3.5 h-3.5" /> Copy HTML
          </button>
        </div>

        <div className="h-8" />
      </>
  ), [
    name, meta, avatarUrl, rating, hoverStar, date, text, currency, price, likes,
    photos, photoUrl, scores, advanced, canvasBg, ratio, rendering,
    addPhotoUrl, removePhoto, handleFiles, toggleScore, setScoreValue,
    exportPng, copyHtml, setTextDeferred, setMetaDeferred,
  ])

  /* ═══════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════ */
  return (
      <div
          className="flex flex-col bg-[#0d0f17] text-[#dde1f0] overflow-hidden"
          style={{ height: '100dvh', fontFamily: 'var(--font-body)', contain: 'strict' }}
      >
        {/* ══ TOP BAR ══ */}
        <header className="flex items-center justify-between px-4 py-2.5 bg-[#13151f] border-b border-[#252840] flex-shrink-0 z-40">
          <div className="flex items-center gap-3 min-w-0">
            <Link
                href="/frontend/public"
                className="flex items-center gap-1.5 text-white/40 hover:text-white/80 transition-colors text-xs flex-shrink-0"
                prefetch={false}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <div className="w-px h-4 bg-white/10 flex-shrink-0" aria-hidden="true" />
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
                <Star className="w-3 h-3 text-[#08090c] fill-[#08090c]" />
              </div>
              <span className="text-sm font-semibold truncate" style={{ fontFamily: 'var(--font-display)' }}>
              ReviewCard Builder
            </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex bg-[#1a1d2b] border border-[#252840] rounded-lg p-0.5">
              <button
                  type="button" onClick={() => setAdvanced(false)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${!advanced ? 'bg-[#20233a] text-white' : 'text-white/40 hover:text-white/70'}`}
              >
                Basic
              </button>
              <button
                  type="button" onClick={() => setAdvanced(true)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${advanced ? 'bg-[#20233a] text-white' : 'text-white/40 hover:text-white/70'}`}
              >
                Advanced
              </button>
            </div>
          </div>
        </header>

        {/* ══ BODY ══ */}
        <div className="flex flex-1 overflow-hidden relative">

          {/* ── DESKTOP SIDEBAR ── */}
          <aside
              className="hidden md:flex w-[300px] flex-shrink-0 bg-[#13151f] border-r border-[#252840] flex-col overflow-y-auto"
              style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
          >
            {SidebarContent}
          </aside>

          {/* ── PREVIEW AREA ── */}
          <main
              className="flex-1 flex flex-col items-center justify-center overflow-auto"
              style={{
                background: 'radial-gradient(ellipse at 20% 20%,rgba(92,114,245,.06) 0,transparent 50%), radial-gradient(ellipse at 80% 80%,rgba(63,214,138,.04) 0,transparent 50%), #0d0f17',
                paddingBottom: drawer !== 'open' ? `${DRAWER_PEEK + 16}px` : '16px',
              }}
          >
            <p className="text-[10px] tracking-[.14em] uppercase font-medium text-white/25 mb-5 select-none">
              Live Preview
            </p>

            {ratio === 'free' ? (
                <div className="w-full max-w-sm px-4">
                  <GmCard
                      id="gm-preview-card"
                      name={name} meta={meta} avatarUrl={avatarUrl} rating={rating}
                      date={date} text={text} currency={currency} price={price}
                      likes={likes} photos={photos} scores={scores}
                  />
                </div>
            ) : (
                <div
                    className="relative flex items-center justify-center rounded-xl overflow-hidden flex-shrink-0 mx-4"
                    style={{
                      width: frameDims ? Math.min(frameDims.w, typeof window !== 'undefined' ? window.innerWidth - 32 : 400) + 'px' : undefined,
                      height: frameDims ? frameDims.h + 'px' : undefined,
                      ...(canvasBg === 'transparent' ? checkerBg : { background: canvasBg }),
                      contain: 'layout paint',
                      transition: 'width .3s ease, height .3s ease',
                    }}
                >
                  <div className="w-[88%]">
                    <GmCard
                        id="gm-preview-card"
                        name={name} meta={meta} avatarUrl={avatarUrl} rating={rating}
                        date={date} text={text} currency={currency} price={price}
                        likes={likes} photos={photos} scores={scores}
                    />
                  </div>
                </div>
            )}
          </main>

          {/* ── MOBILE BOTTOM DRAWER ── */}
          <div
              ref={drawerRef}
              className="md:hidden fixed left-0 right-0 bottom-0 z-30 flex flex-col bg-[#13151f] border-t border-[#252840]"
              style={{
                height: drawerHeight,
                transition: 'height .3s cubic-bezier(.32,.72,0,1)',
                willChange: 'height',
                contain: 'layout style',
              }}
          >
            <div
                className="flex items-center justify-between px-4 cursor-pointer select-none flex-shrink-0 touch-manipulation"
                style={{ height: DRAWER_PEEK + 'px' }}
                onClick={() => setDrawer(d => d === 'open' ? 'peek' : 'open')}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-white/80">Edit Card</span>
                {drawer !== 'open' && (
                    <span className="text-xs text-white/35 ml-1">· tap to expand</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={e => { e.stopPropagation(); exportPng() }}
                    disabled={rendering}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-[#5c72f5] to-[#3fd68a] text-white font-semibold px-3 py-1.5 rounded-xl text-xs active:scale-95 disabled:opacity-50 touch-manipulation"
                >
                  {rendering
                      ? <span className="inline-block animate-spin text-sm">⟳</span>
                      : <Download className="w-3.5 h-3.5" />
                  }
                  <span className="hidden xs:inline">Export</span>
                </button>
                <div className="text-white/40">
                  {drawer === 'open' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </div>
              </div>
            </div>

            <div
                className="flex-1 overflow-y-auto"
                style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
            >
              {SidebarContent}
            </div>
          </div>
        </div>

        {/* ══ DOWNLOAD MODAL ══ */}
        {modal && (
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-end sm:items-center justify-center p-0 sm:p-5"
                onClick={e => { if (e.target === e.currentTarget) closeModal() }}
            >
              <div
                  className="bg-[#161820] border border-[#2e3250] rounded-t-2xl sm:rounded-2xl p-5 w-full sm:max-w-md flex flex-col gap-4 shadow-2xl"
                  role="dialog" aria-modal="true" aria-label="Download preview"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold">Ready to download</h2>
                    <p className="text-xs text-white/40 mt-0.5">{modal.label}</p>
                  </div>
                  <button type="button" onClick={closeModal} className="text-white/30 hover:text-white p-1" aria-label="Close">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <img
                    src={modal.src} alt="preview"
                    className="max-w-full rounded-xl border border-[#2e3250] object-contain"
                    style={{ maxHeight: '40vh', ...checkerBg }}
                />
                <div className="flex gap-2.5">
                  <button
                      type="button" onClick={saveModal}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#5c72f5] to-[#3fd68a] text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity touch-manipulation"
                  >
                    <Download className="w-4 h-4" /> Save PNG
                  </button>
                  <button
                      type="button" onClick={closeModal}
                      className="flex-1 bg-[#1a1d2b] border border-[#2e3250] text-white/50 hover:text-white/80 font-medium py-3 rounded-xl text-sm transition-colors touch-manipulation"
                  >
                    Cancel
                  </button>
                </div>
                <div className="sm:hidden h-4" />
              </div>
            </div>
        )}

        {/* ══ TOAST ══ */}
        {toast && (
            <div
                className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 bg-[#13151f] border border-[#2e3250] rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-2xl z-50 pointer-events-none whitespace-nowrap"
                role="status" aria-live="polite"
            >
              {toast}
            </div>
        )}
      </div>
  )
}