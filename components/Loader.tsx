'use client'

import { useState, useEffect, useRef } from 'react'

function LoadingOverlay() {
  const [phase, setPhase] = useState('visible')
  const minDoneRef   = useRef(false)
  const pageReadyRef = useRef(false)

  const tryExit = () => {
    if (minDoneRef.current && pageReadyRef.current) setPhase('exiting')
  }

  useEffect(() => {
    const t = setTimeout(() => { minDoneRef.current = true; tryExit() }, 500)
    const onReady = () => { pageReadyRef.current = true; tryExit() }
    if (document.readyState === 'complete') onReady()
    else window.addEventListener('load', onReady)
    return () => { clearTimeout(t); window.removeEventListener('load', onReady) }
  }, [])

  if (phase === 'done') return null

  return (
    <>
      <style>{`
        @keyframes fg-exit { from{opacity:1} to{opacity:0} }
        @keyframes fg-in   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @keyframes fg-dot2 { 0%,25%{opacity:0} 30%{opacity:1} 88%{opacity:1} 95%{opacity:0} 100%{opacity:0} }
        @keyframes fg-dot3 { 0%,55%{opacity:0} 60%{opacity:1} 88%{opacity:1} 95%{opacity:0} 100%{opacity:0} }

        .fg-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
        }
        .fg-overlay.fg-exiting {
          animation: fg-exit 0.6s ease forwards;
        }
        .fg-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 400;
          letter-spacing: 0.28em;
          color: var(--green, #1c1009);
          text-transform: uppercase;
          text-align: center;
          animation: fg-in 0.7s ease both;
          display: inline-flex; align-items: flex-end; gap: 0.05em;
        }
        .fg-dot { display: inline-block; }
        .fg-dot:nth-child(1) { opacity: 1; }
        .fg-dot:nth-child(2) { opacity: 0; animation: fg-dot2 1s infinite; }
        .fg-dot:nth-child(3) { opacity: 0; animation: fg-dot3 1s infinite; }
      `}</style>

      <div
        className={`fg-overlay${phase === 'exiting' ? ' fg-exiting' : ''}`}
        onAnimationEnd={() => phase === 'exiting' && setPhase('done')}
      >
        <span className="fg-text">
          Loading your Food partner
          <span className="fg-dot">.</span>
          <span className="fg-dot">.</span>
          <span className="fg-dot">.</span>
        </span>
      </div>
    </>
  )
}

export default function Loading() {
  return <LoadingOverlay />
}
