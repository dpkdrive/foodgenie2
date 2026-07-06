'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const QUICK_LINKS = [
  ['/#about',            'About Us'],
  ['/#menu',             'Food Menu'],
  ['/#subscription',     'Subscription Plans'],
  ['/#testimonials',     'Customer Reviews'],
  ['/delivery-schedule', 'Delivery Schedule'],
  ['/contact',           'Contact Us'],
  ['/term-condition',    'Terms & Conditions'],
  ['/privacy-policy',    'Privacy Policy'],
  ['/refund-policy',     'Refund Policy'],
]

const BG   = '#091b15'
const GOLD = 'var(--gold)'
const INTER = 'Inter, sans-serif'

const SECTION_LABEL: React.CSSProperties = {
  fontFamily:    INTER,
  fontSize:      '0.62rem',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color:         'rgba(255,255,255,0.55)',
  marginBottom:  16,
  display:       'block',
}

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2H15C13.67 2 12.4 2.53 11.46 3.46 10.53 4.4 10 5.67 10 7v3H7v4h3v8h4v-8h3l1-4h-4V7c0-.27.1-.52.29-.71.18-.18.43-.29.71-.29H18V2z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4.5"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
)

const YouTubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29.94 29.94 0 001 12a29.94 29.94 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29.94 29.94 0 0023 12a29.94 29.94 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const SOCIAL_ICONS: Record<string, { icon: React.FC; label: string }> = {
  facebook:  { icon: FacebookIcon,  label: 'Facebook'  },
  instagram: { icon: InstagramIcon, label: 'Instagram' },
  youtube:   { icon: YouTubeIcon,   label: 'YouTube'   },
  twitter:   { icon: TwitterIcon,   label: 'Twitter/X' },
}

function Footer() {
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({})
  const [email, setEmail] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(({ data }) => { if (data?.socialLinks) setSocialLinks(data.socialLinks) })
      .catch(() => {})
  }, [])

  const activeSocials = Object.entries(SOCIAL_ICONS).filter(
    ([key]) => socialLinks[key]?.trim()
  )

  return (
    <footer style={{ background: BG, color: '#fff' }}>
      <div className='padding-top pb-4 px-8'>

        {/* ── Logo ── */}
        <div style={{ marginBottom: 36 }}>
          <span style={{
            fontFamily:    'var(--font-cinzel), serif',
            fontSize:      '1.3rem',
            fontWeight:    300,
            letterSpacing: '0.14em',
            color:         '#fff',
          }}>
            FOOD<span style={{ color: GOLD }}>GENIE</span>
          </span>
        </div>

        {/* ── Subscribe ── */}
        <div style={{ marginBottom: 40 }}>
          <span style={SECTION_LABEL}>Subscribe for latest updates</span>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email Address"
              style={{
                flex:            1,
                background:      'transparent',
                border:          'none',
                borderBottom:    '1px solid rgba(255,255,255,0.35)',
                outline:         'none',
                color:           '#fff',
                fontFamily:      INTER,
                fontSize:        '0.9rem',
                fontWeight:      300,
                padding:         '10px 0',
                marginRight:     16,
              }}
            />
            <button
              className="hover:bg-white hover:text-[#091b15] active:scale-[0.98] transition-all duration-300"
              style={{
                background:    'transparent',
                border:        '1px solid rgba(255,255,255,0.45)',
                color:         '#fff',
                fontFamily:    INTER,
                fontSize:      '0.62rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                padding:       '10px 22px',
                cursor:        'pointer',
                whiteSpace:    'nowrap',
              }}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* ── For Bookings Contact ── */}
        <div style={{ marginBottom: 8 }}>
          <span style={SECTION_LABEL}>For Bookings Contact</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
            <a href="tel:+919958093268" style={{
              fontFamily:     INTER,
              fontSize:       '1rem',
              color:          '#fff',
              textDecoration: 'none',
              letterSpacing:  '0.02em',
            }}>
              +91 99580 93268
            </a>
            <a href="mailto:support@foodgenie.com" style={{
              fontFamily:     INTER,
              fontSize:       '1rem',
              color:          '#fff',
              textDecoration: 'none',
            }}>
              support@foodgenie.com
            </a>
          </div>
          {/* ── Call Now ── */}
        <a
          href="tel:+919958093268"
          style={{
            display:        'block',
            maxWidth:          '240px',
            background:     GOLD,
            textAlign:      'center',
            padding:        '16px 24px',
            fontFamily:     INTER,
            fontSize:       '0.72rem',
            fontWeight:     400,
            letterSpacing:  '0.28em',
            textTransform:  'uppercase',
            color:          '#fff',
            textDecoration: 'none',
            marginTop:      24,
            marginBottom:   40,
          }}
        >
          Call Now
        </a>
        </div>



        {/* ── Customer Support ── */}
        {/* <div style={{ marginBottom: 40 }}>
          <span style={SECTION_LABEL}>Customer Support</span>
          <a href="mailto:support@foodgenie.com" style={{
            display:        'block',
            fontFamily:     INTER,
            fontSize:       '1rem',
            color:          '#fff',
            textDecoration: 'none',
            marginBottom:   6,
          }}>
            support@foodgenie.com
          </a>
          <a href="mailto:feedback@foodgenie.com" style={{
            display:        'block',
            fontFamily:     INTER,
            fontSize:       '1rem',
            color:          '#fff',
            textDecoration: 'none',
          }}>
            feedback@foodgenie.com
          </a>
        </div> */}

        {/* ── Connect With Us ── */}
        {activeSocials.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <span style={SECTION_LABEL}>Connect With Us</span>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', paddingTop: 4 }}>
              {activeSocials.map(([key, { icon: Icon, label }]) => (
                <a
                  key={key}
                  href={socialLinks[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{ color: '#fff', textDecoration: 'none', opacity: 0.75 }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0.75')}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Quick Links ── */}
        <div>
          <span style={SECTION_LABEL}>Quick Links</span>
          <div style={{
            display:             'grid',
            gridTemplateColumns: '1fr 1fr',
            columnGap:           24,
          }}>
            {QUICK_LINKS.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontFamily:     INTER,
                  fontSize:       '1rem',
                  color:          '#fff',
                  textDecoration: 'none',
                  padding:        '10px 0',
                  display:        'block',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={e => (e.currentTarget.style.color = '#fff')}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        borderTop:      '1px solid rgba(255,255,255,0.08)',
        padding:        '14px clamp(20px,5vw,52px)',
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        flexWrap:       'wrap',
        gap:            8,
        fontFamily:     INTER,
        fontSize:       '0.7rem',
        letterSpacing:  '0.04em',
        color:          'rgba(255,255,255,0.4)',
      }}>
        <span>© {new Date().getFullYear()} FoodGenie. All rights reserved.</span>
        <span>Designed by <span style={{ color: GOLD, fontWeight: 500 }}>MSSOFTPC</span></span>
      </div>

    </footer>
  )
}

export default Footer
