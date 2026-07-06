'use client'
import { useState, useEffect, useRef } from 'react'

interface DeliveryResult {
  chargePerDay:    number
  distanceKm:      number
  serviceable:     boolean
  notDeliverable?: boolean
  lat:             number
  lng:             number
}

interface Props {
  pincode:  string
  mode?:    'bespoke'
  onResult: (result: DeliveryResult | null) => void
}

async function checkCoords(lat: number, lng: number, mode?: 'bespoke') {
  const url  = `/api/delivery-check?lat=${lat}&lng=${lng}${mode === 'bespoke' ? '&type=bespoke' : ''}`
  const res  = await fetch(url)
  const data = await res.json()
  if (!data.success) throw new Error(data.message ?? 'Check failed')
  return data as {
    serviceable:          boolean
    notDeliverable?:      boolean
    distanceKm:           number
    radiusKm:             number
    label:                string
    overAreaPricePerKm?:  number
    deliveryChargePerDay: number
  }
}

export default function DeliveryCheck({ pincode, mode, onResult }: Props) {
  const [state,      setState]      = useState<'idle' | 'checking' | 'done' | 'error'>('idle')
  const [result,     setResult]     = useState<any>(null)
  const [errMsg,     setErrMsg]     = useState('')
  const [gpsLoading, setGpsLoading] = useState(false)
  const lastCheckedPin = useRef('')

  const gold  = '#c9a96e'
  const green = '#2d4a28'

  const applyResult = (data: any, lat: number, lng: number) => {
    setResult(data)
    setState('done')
    onResult({
      chargePerDay:    data.deliveryChargePerDay,
      distanceKm:      data.distanceKm,
      serviceable:     data.serviceable,
      notDeliverable:  data.notDeliverable ?? false,
      lat,
      lng,
    })
  }

  /* Auto-check when pincode reaches 6 digits */
  useEffect(() => {
    if (!/^\d{6}$/.test(pincode)) {
      if (state !== 'idle') {
        setState('idle')
        setResult(null)
        onResult(null)
      }
      return
    }
    if (pincode === lastCheckedPin.current) return
    lastCheckedPin.current = pincode

    setState('checking')
    setErrMsg('')

    fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json&limit=1&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    )
      .then(r => r.json())
      .then(async geo => {
        if (!geo.length) throw new Error('Pincode not found. Please check and try again.')
        const country = geo[0].address?.country_code
        if (country && country !== 'in') throw new Error('Invalid Indian pincode.')
        const lat = parseFloat(geo[0].lat)
        const lng = parseFloat(geo[0].lon)
        if (lat < 6 || lat > 38 || lng < 68 || lng > 98) throw new Error('Could not locate this pincode.')
        const data = await checkCoords(lat, lng, mode)
        applyResult(data, lat, lng)
      })
      .catch((e: any) => {
        setState('error')
        setErrMsg(e.message)
        onResult(null)
      })
  }, [pincode])

  const handleGPS = () => {
    if (!navigator.geolocation) { setErrMsg('GPS not supported in this browser.'); setState('error'); return }
    setGpsLoading(true)
    setState('checking')
    setErrMsg('')
    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const lat  = pos.coords.latitude
          const lng  = pos.coords.longitude
          const data = await checkCoords(lat, lng)
          applyResult(data, lat, lng)
        } catch (e: any) {
          setState('error'); setErrMsg(e.message)
          onResult(null)
        } finally {
          setGpsLoading(false)
        }
      },
      () => {
        setState('error')
        setErrMsg('Location permission denied. Please allow and try again.')
        setGpsLoading(false)
        onResult(null)
      }
    )
  }

  const borderColor = 'var(--border, #e5e7eb)'
  const bg          = '#faf9f7'

  const labelStyle: React.CSSProperties = {
    fontSize: '0.65rem', textTransform: 'uppercase',
    letterSpacing: '0.18em', fontFamily: 'var(--font-cinzel), serif',
    color: gold, margin: '0 0 10px', display: 'block',
  }

  return (
    <div style={{ border: `1.5px solid ${borderColor}`, background: bg, padding: '16px 18px', marginTop: 8, transition: 'border-color 0.3s, background 0.3s' }}>
      <span style={labelStyle}>Delivery Check</span>

      {/* GPS button */}
      {state !== 'done' && (
        <button
          type="button"
          onClick={handleGPS}
          disabled={gpsLoading || state === 'checking'}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 16px', background: 'transparent',
            border: `1px solid ${green}`, color: green, cursor: 'pointer',
            fontFamily: 'var(--font-cinzel), serif', fontSize: '0.68rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            marginBottom: 10, opacity: gpsLoading ? 0.6 : 1,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/></svg>
          {gpsLoading ? 'Detecting...' : 'Use GPS Instead'}
        </button>
      )}

      {/* Checking */}
      {state === 'checking' && (
        <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(0,0,0,0.45)' }}>Checking delivery availability...</p>
      )}

      {/* Error */}
      {state === 'error' && (
        <p style={{ margin: 0, fontSize: '0.78rem', color: '#dc2626' }}>{errMsg}</p>
      )}

      {/* Idle — hint */}
      {state === 'idle' && (
        <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(0,0,0,0.4)' }}>
          Enter your 6-digit pincode above to check delivery availability.
        </p>
      )}

      {/* Result */}
      {state === 'done' && result && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            {result.serviceable ? (
              <p style={{ margin: 0, fontWeight: 700, color: '#16a34a', fontSize: '0.9rem' }}>
                ✓ Free Delivery
              </p>
            ) : result.notDeliverable ? (
              <p style={{ margin: 0, fontWeight: 700, color: '#dc2626', fontSize: '0.9rem' }}>
                ✕ Not Deliverable
              </p>
            ) : (
              <p style={{ margin: 0, fontWeight: 700, color: '#c9a96e', fontSize: '0.9rem' }}>
                Delivery: ₹{result.deliveryChargePerDay}/day
              </p>
            )}
            <button
              type="button"
              onClick={() => { setState('idle'); setResult(null); lastCheckedPin.current = ''; onResult(null) }}
              style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.4)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'nowrap' }}
            >
              Re-check
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
