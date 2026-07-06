"use client"
import React, { useState } from 'react'

const PHONE = '919958093268'
const WA_URL = `https://wa.me/${PHONE}?text=${encodeURIComponent("Hi! I'm interested in FoodGenie meal subscriptions. 🫕")}`

function WhatsAppWidget() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <style>{`
        .waw-fab:hover { background: linear-gradient(135deg,#c9a84c,#ac8c39,#8a6e2a) !important; filter: none !important; }
        .waw-cta:hover { background: linear-gradient(135deg,#c9a84c,#ac8c39,#8a6e2a) !important; color: #fff !important; filter: none !important; }
        .waw-bubble {
          animation: waw-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes waw-pop {
          from { opacity: 0; transform: scale(0.7) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .waw-ping {
          animation: waw-ping 2.2s ease-in-out infinite;
        }
        @keyframes waw-ping {
          0%,100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(172,140,57,0.5); }
          50%      { transform: scale(1.05); box-shadow: 0 0 0 14px rgba(172,140,57,0); }
        }
        .waw-dot {
          animation: waw-bounce 1.2s infinite;
        }
        .waw-dot:nth-child(2) { animation-delay: 0.2s; }
        .waw-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes waw-bounce {
          0%,80%,100% { transform: translateY(0); opacity: 0.4; }
          40%          { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .waw-shimmer {
          animation: shimmer 3s linear infinite;
        }
        .waw-btn-shimmer {
          animation: shimmer 2.5s linear infinite;
        }
      `}</style>

      {open && (
        <div className="waw-bubble" style={{ position:'fixed', bottom:'112px', right:'28px', width:'320px', zIndex:9999 }}>
          <div style={{
            background:'#fff',
            border:'1px solid rgba(172,140,57,0.2)',
            borderRadius:'22px',
            overflow:'hidden',
            boxShadow:'0 16px 56px rgba(0,0,0,0.22), 0 2px 8px rgba(172,140,57,0.15)',
          }}>
            {/* Header */}
            <div style={{
              background:'linear-gradient(135deg,#1c1a14,#2a2416,#1c1a14)',
              padding:'18px 20px',
              display:'flex',
              alignItems:'center',
              gap:'14px',
              position:'relative',
              overflow:'hidden',
            }}>
              {/* Shimmer overlay */}
              <div className="waw-shimmer" style={{
                position:'absolute', inset:0,
                background:'linear-gradient(90deg,transparent 0%,rgba(172,140,57,0.12) 50%,transparent 100%)',
                backgroundSize:'200% 100%',
              }} />
              <div style={{
                width:'50px', height:'50px', borderRadius:'50%',
                background:'linear-gradient(135deg,#c9a84c,#8a6e2a)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'1.5rem', flexShrink:0,
                boxShadow:'0 2px 12px rgba(172,140,57,0.4)',
                position:'relative', zIndex:1,
              }}>🫕</div>
              <div style={{ flex:1, position:'relative', zIndex:1 }}>
                <div style={{ color:'#f5e8c0', fontWeight:700, fontSize:'0.95rem', letterSpacing:'0.02em', fontFamily:'Georgia,serif' }}>
                  Food Genie
                </div>
                <div style={{ color:'rgba(245,232,192,0.6)', fontSize:'0.7rem', marginTop:'3px', display:'flex', alignItems:'center', gap:'5px' }}>
                  <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#c9a84c', boxShadow:'0 0 6px rgba(201,168,76,0.8)', flexShrink:0, display:'inline-block' }} />
                  Typically replies instantly
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{
                background:'rgba(172,140,57,0.15)', border:'1px solid rgba(172,140,57,0.25)',
                borderRadius:'50%', width:'30px', height:'30px', cursor:'pointer',
                color:'#c9a84c', fontSize:'0.85rem', display:'flex', alignItems:'center',
                justifyContent:'center', flexShrink:0, position:'relative', zIndex:1,
              }}>✕</button>
            </div>

            {/* Chat preview */}
            <div style={{
              background:'#faf6ef',
              backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ac8c39' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              padding:'18px 16px', minHeight:'120px', display:'flex', alignItems:'flex-start',
            }}>
              <div style={{
                background:'#fff', borderRadius:'0 14px 14px 14px',
                padding:'12px 16px', maxWidth:'85%',
                boxShadow:'0 2px 8px rgba(172,140,57,0.1), 0 1px 3px rgba(0,0,0,0.06)',
                border:'1px solid rgba(172,140,57,0.1)',
              }}>
                <p style={{ margin:0, fontSize:'0.83rem', color:'#2a200a', lineHeight:1.55 }}>
                  👋 Namaste! Looking for healthy home-style meals? We'd love to help you get started.
                </p>
                <div style={{ display:'flex', gap:'5px', marginTop:'10px', alignItems:'center' }}>
                  {[0,1,2].map(i => (
                    <span key={i} className="waw-dot" style={{
                      width:'7px', height:'7px', borderRadius:'50%',
                      background:'#ac8c39', display:'inline-block',
                      animationDelay:`${i*0.2}s`,
                    }} />
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div style={{ padding:'16px', background:'#fff', borderTop:'1px solid rgba(172,140,57,0.1)' }}>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="waw-cta" style={{
                display:'flex', alignItems:'center', justifyContent:'center', gap:'9px',
                background:'linear-gradient(135deg,#c9a84c,#ac8c39,#8a6e2a)',
                color:'#fff', borderRadius:'12px', padding:'14px',
                textDecoration:'none', fontWeight:700, fontSize:'0.88rem',
                letterSpacing:'0.02em', boxShadow:'0 4px 16px rgba(172,140,57,0.35)',
                position:'relative', overflow:'hidden',
              }}>
                <div className="waw-btn-shimmer" style={{
                  position:'absolute', inset:0,
                  background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)',
                  backgroundSize:'200% 100%',
                }} />
                <WhatsAppIcon size={22} />
                <span style={{ position:'relative', zIndex:1 }}>Chat on WhatsApp</span>
              </a>
              <p style={{ margin:'9px 0 0', textAlign:'center', fontSize:'0.65rem', color:'rgba(172,140,57,0.55)', letterSpacing:'0.01em' }}>
                No spam · Just food conversations 🌿
              </p>
            </div>
          </div>

          {/* Arrow */}
          <div style={{
            position:'absolute', bottom:'-9px', right:'30px',
            width:0, height:0,
            borderLeft:'9px solid transparent', borderRight:'9px solid transparent',
            borderTop:'9px solid #fff',
            filter:'drop-shadow(0 3px 3px rgba(0,0,0,0.07))',
          }} />
        </div>
      )}

      {/* FAB */}
      <button
        className="waw-ping waw-fab"
        onClick={() => setOpen(!open)}
        style={{
          position:'fixed', bottom:'28px', right:'28px', zIndex:9999,
          width:'68px', height:'68px', borderRadius:'50%',
          background:'linear-gradient(135deg,#c9a84c,#ac8c39,#8a6e2a)',
          border:'none', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 6px 30px rgba(172,140,57,0.5), 0 2px 8px rgba(0,0,0,0.3)',
        }}
        aria-label="Chat on WhatsApp"
      >
        {open
          ? <span style={{ color:'#fff', fontSize:'1.2rem', fontWeight:700 }}>✕</span>
          : <WhatsAppIcon size={30} />
        }
      </button>
    </>
  )
}

function WhatsAppIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12.004 2C6.477 2 2.004 6.473 2.004 12c0 1.989.58 3.842 1.579 5.405L2 22l4.728-1.558A9.953 9.953 0 0012.004 22C17.53 22 22 17.527 22 12S17.53 2 12.004 2zm0 18.214a8.205 8.205 0 01-4.186-1.145l-.3-.178-3.107 1.024 1.043-3.034-.196-.312A8.187 8.187 0 013.787 12c0-4.53 3.686-8.215 8.217-8.215 4.53 0 8.216 3.686 8.216 8.215s-3.686 8.214-8.216 8.214z"/>
    </svg>
  )
}

export default WhatsAppWidget