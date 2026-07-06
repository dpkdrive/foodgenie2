import type { CSSProperties } from 'react'
import { Timer, MapPin } from 'lucide-react'

const DishSpecialIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 4 }}>
    {/* cloche dome */}
    <path d="M4 12C4 7.58 7.58 4 12 4s8 3.58 8 8"/>
    {/* base plate */}
    <line x1="2" y1="12" x2="22" y2="12"/>
    <line x1="5" y1="16" x2="19" y2="16"/>
    {/* handle on top */}
    <path d="M11 4V2.5a1 1 0 0 1 2 0V4"/>
  </svg>
)

export default function DeliveryPage() {
  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
      <h1 style={{
        fontFamily: 'var(--font-cinzel), serif',
        fontSize: 'clamp(2rem,6vw,4rem)',
        fontWeight: 400,
        color: '#fff',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        lineHeight: 1.15,
        margin: '0 0 48px',
        textAlign: 'center',
      }}>
        DELIVERY SCHEDULE
      </h1>

      <div style={{ maxWidth: 680, width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={ROW}>
          <Timer size={22} strokeWidth={1.6} style={ICON} />
          <p style={P}>
            By default, all meals are delivered together in the morning between <span style={HIGHLIGHT}>7:00 AM and 10:00 AM</span>.
          </p>
        </div>

        <div style={ROW}>
          <DishSpecialIcon />
          <p style={P}>
            You can choose to have dinner delivered separately in the evening between <span style={HIGHLIGHT}>6:00 PM and 8:00 PM</span> for an additional <span style={HIGHLIGHT}>₹49 per day</span>. This add-on can be activated anytime during your plan. Contact us to enable it.
          </p>
        </div>

        <div style={ROW}>
          <MapPin size={22} strokeWidth={1.6} style={ICON} />
          <p style={P}>
            Pause or cancel meals for any day and carry them forward — you can also change your delivery location for the next day by <span style={HIGHLIGHT}>6:00 PM</span> via email, call, or WhatsApp.
          </p>
        </div>

        <p style={{ ...P, borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 20, fontSize: '0.88rem', paddingLeft: 0 }}>
          <span style={{ fontWeight: 500 }}>Note:</span> Free delivery is available within our serviceable areas only. Outside these areas, delivery is either unavailable or chargeable.
        </p>

      </div>
    </div>
  )
}

const ROW: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 14,
}

const ICON: CSSProperties = {
  color: '#fff',
  flexShrink: 0,
  marginTop: 4,
}

const P: CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontSize: '1.05rem',
  fontWeight: 500,
  lineHeight: 1.85,
  color: '#fff',
  margin: 0,
}

const HIGHLIGHT: CSSProperties = {
  color: '#fff',
}
