'use client'
import { useState, useEffect } from 'react'

const gold = 'var(--gold)'
const green = 'var(--green)'

const TABS = [
  { key: '35min - 60min', label: '35 – 60 Min', sub: 'Express delivery' },
  { key: '2hrs - 4hrs', label: '2 – 4 Hours', sub: 'Standard delivery' },
]

/* ── Delivery check (pincode → haversine via /api/delivery-check) ── */
async function checkDelivery(pincode) {
  const geoRes = await fetch(
    `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json&limit=1&addressdetails=1`,
    { headers: { 'Accept-Language': 'en' } }
  )
  const geo = await geoRes.json()
  if (!geo.length) throw new Error('Pincode not found')
  const lat = parseFloat(geo[0].lat)
  const lng = parseFloat(geo[0].lon)
  const res = await fetch(`/api/delivery-check?lat=${lat}&lng=${lng}`)
  console.log(res, "products11")
  const data = await res.json()
  if (!data.success) throw new Error(data.message ?? 'Delivery check failed')
  return { ...data, lat, lng }
}

/* ── Steps ── */
const STEPS = ['Products', 'Your Details', 'Review & Pay']

export default function SameDayDeliveryPage() {
  const [step, setStep] = useState(0) // 0 products, 1 details, 2 review
  const [products, setProducts] = useState([])
  const [loadingP, setLoadingP] = useState(true)
  const [searching, setSearching] = useState(false)
  const [cart, setCart] = useState({}) // { productId: qty }
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', pincode: '', notes: '' })
  const [delivery, setDelivery] = useState(null) // result from delivery check
  const [pinState, setPinState] = useState('idle') // idle | checking | ok | err | blocked
  const [pinErr, setPinErr] = useState('')
  const [activeTab, setActiveTab] = useState('35min - 60min')
  const [search, setSearch] = useState('')
  const [placing, setPlacing] = useState(false)
  const [success, setSuccess] = useState(null)
  const [imgModal, setImgModal] = useState(null) // { src, title }

  const fetchProducts = (q = '', isSearch = false) => {
    if (isSearch) setSearching(true); else setLoadingP(true)
    const params = new URLSearchParams()
    if (q) params.set('search', q)
    fetch(`/api/same-day/products?${params}`)
      .then(r => r.json())
      .then(r => {
        if (r.success) {
          const sorted = [...(r.data ?? [])].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
          setProducts(sorted)
          if (!q) {
            const firstMatch = TABS.find(t => r.data.some(p => p.timing === t.key))
            if (firstMatch) setActiveTab(firstMatch.key)
          }
        }
      })
      .finally(() => { if (isSearch) setSearching(false); else setLoadingP(false) })
  }

  useEffect(() => { fetchProducts() }, [])

  useEffect(() => {
    const t = setTimeout(() => fetchProducts(search.trim(), true), 350)
    return () => clearTimeout(t)
  }, [search])

  /* ── Cart helpers ── */
  const setQty = (id, delta) => {
    setCart(prev => {
      const cur = prev[id] ?? 0
      const next = Math.max(0, cur + delta)
      if (next === 0) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: next }
    })
  }

  const cartItems = products
    .filter(p => cart[p._id] > 0)
    .map(p => ({ ...p, qty: cart[p._id] }))

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0)
  const deliveryFee = 0
  const gst = Math.round(subtotal * 0.07)
  const total = subtotal + gst

  /* ── Pincode check ── */
  const handlePinCheck = async () => {
    const pin = form.pincode.trim()
    if (!/^\d{6}$/.test(pin)) { setPinErr('Enter a valid 6-digit pincode'); setPinState('err'); return }
    setPinState('checking'); setPinErr('')
    try {
      const result = await checkDelivery(pin)
      if (result.notDeliverable || !result.serviceable) {
        setPinState('blocked')
        setPinErr('Not Deliverable Area — we do not deliver to this location.')
        setDelivery(null)
      } else {
        setPinState('ok')
        setDelivery(result)
      }
    } catch (e) {
      setPinState('err')
      setPinErr(e.message)
      setDelivery(null)
    }
  }

  const handleGPS = () => {
    if (!navigator.geolocation) { setPinErr('GPS not supported'); setPinState('err'); return }
    setPinState('checking'); setPinErr('')
    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const { latitude: lat, longitude: lng } = pos.coords
          const res = await fetch(`/api/delivery-check?lat=${lat}&lng=${lng}`)
          const data = await res.json()
          if (!data.success) throw new Error(data.message)
          if (data.notDeliverable || !data.serviceable) {
            setPinState('blocked'); setPinErr('Not Deliverable Area — we do not deliver to this location.'); setDelivery(null)
          } else {
            setPinState('ok'); setDelivery({ ...data, lat, lng })
          }
        } catch (e) { setPinState('err'); setPinErr(e.message); setDelivery(null) }
      },
      () => { setPinState('err'); setPinErr('Location permission denied.') }
    )
  }

  /* ── Place order ── */
  const handlePlaceOrder = async () => {
    setPlacing(true)
    try {
      const items = cartItems.map(i => ({
        productId: i._id,
        productRef: i.productId,
        title: i.title,
        price: i.price,
        quantity: i.qty,
        subtotal: i.price * i.qty,
      }))
      const res = await fetch('/api/same-day/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: form.name,
            phone: form.phone,
            email: form.email,
            address: form.address,
            lat: delivery?.lat ?? 0,
            lng: delivery?.lng ?? 0,
          },
          items,
          timing: cartItems[0]?.timing ?? '',
          subtotal,
          deliveryFee,
          gst,
          total,
          notes: form.notes,
        }),
      })
      const data = await res.json()
      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl
      } else {
        alert(data.message ?? 'Failed to initiate payment')
      }
    } finally {
      setPlacing(false)
    }
  }

  /* ── Success screen ── */
  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 60px' }}>
        <div style={{ background: '#fff', maxWidth: 480, width: '100%', padding: '48px 40px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.07)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.6rem' }}>✓</div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', letterSpacing: '0.12em', color: green, margin: '0 0 8px' }}>Order Placed!</h2>
          <p style={{ color: 'rgba(0,0,0,0.5)', fontSize: '0.85rem', margin: '0 0 20px' }}>Your order has been received. We'll confirm and prepare it shortly.</p>
          <p style={{ fontFamily: 'monospace', fontSize: '0.95rem', color: gold, fontWeight: 700, margin: '0 0 28px', letterSpacing: '0.08em' }}>{success.orderId}</p>
          <div style={{ background: '#f8f5f0', padding: '16px', marginBottom: 28, textAlign: 'left', fontSize: '0.82rem' }}>
            <p style={{ margin: '0 0 6px' }}><strong>Total:</strong> ₹{total.toLocaleString('en-IN')}</p>
            <p style={{ margin: '0 0 6px' }}><strong>Delivery:</strong> {form.address}</p>
            <p style={{ margin: 0 }}><strong>Contact:</strong> {form.phone}</p>
          </div>
          <a href="/" style={{ display: 'inline-block', background: green, color: '#fff', padding: '11px 28px', textDecoration: 'none', fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>← Back to Home</a>
        </div>
      </div>
    )
  }

  return (
    <>
      <div style={{ minHeight: '100vh', background: '#f5f0e8', paddingTop: 80 }}>

        {/* Hero */}
        <div style={{ background: green, padding: '40px 24px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.85rem', letterSpacing: '0.28em', color: gold, textTransform: 'uppercase', margin: '0 0 10px', fontWeight: "700" }}>FoodGenie</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '0.14em', color: '#fff', margin: '0 0 10px', textTransform: 'uppercase', fontWeight: 400 }}>Same Day Delivery</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', margin: 0 }}>Fresh meals delivered to your door today</p>
        </div>

        {/* Steps */}
        <div style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)', padding: '0 24px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex' }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '14px 0', gap: 8, opacity: i > step ? 0.35 : 1 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  background: i < step ? gold : i === step ? green : 'transparent',
                  border: `1.5px solid ${i === step ? green : gold}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.68rem', color: i <= step ? '#fff' : gold, fontWeight: 700,
                }}>{i < step ? '✓' : i + 1}</div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.1em', color: i === step ? green : 'rgba(0,0,0,0.45)', textTransform: 'uppercase' }}>{s}</span>
                {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.1)', marginLeft: 8 }} />}
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px 80px' }}>

          {/* ═══════════════ STEP 0: Products ═══════════════ */}
          {step === 0 && (
            <>
              {loadingP && <p style={{ textAlign: 'center', color: 'rgba(0,0,0,0.35)', padding: 40 }}>Loading menu…</p>}
              {!loadingP && products.length === 0 && (
                <p style={{ textAlign: 'center', color: 'rgba(0,0,0,0.35)', padding: 40 }}>No items available today. Check back soon!</p>
              )}

              {!loadingP && products.length > 0 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                    <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', letterSpacing: '0.12em', color: green, margin: 0, textTransform: 'uppercase' }}>Today's Menu</h2>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search items…"
                        style={{ border: '1px solid rgba(0,0,0,0.15)', padding: '8px 36px 8px 12px', fontSize: '0.82rem', outline: 'none', width: 200, background: '#fff', color: '#111' }}
                      />
                      {search
                        ? <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'rgba(0,0,0,0.35)', lineHeight: 1 }}>×</button>
                        : <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: 'rgba(0,0,0,0.3)' }}>⌕</span>
                      }
                    </div>
                  </div>

                  {/* ── Tabs ── */}
                  <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '2px solid rgba(0,0,0,0.08)' }}>
                    {TABS.map(tab => {
                      const active = activeTab === tab.key
                      const count = products.filter(p => p.timing === tab.key).length
                      return (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                          style={{
                            background: active ? green : 'transparent',
                            color: active ? '#fff' : 'rgba(0,0,0,0.5)',
                            border: 'none',
                            borderBottom: active ? `2px solid ${green}` : '2px solid transparent',
                            padding: '12px 28px',
                            cursor: 'pointer',
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: '0.95rem',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginBottom: -2,
                            transition: 'all 0.2s',
                            textAlign: 'left',
                          }}>
                          <span style={{ display: 'block', fontWeight: 600 }}>{tab.label}</span>
                          <span style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.06em', opacity: 0.75, marginTop: 2 }}>{tab.sub}</span>
                          {count > 0 && (
                            <span style={{ display: 'inline-block', marginTop: 4, background: active ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.08)', color: active ? '#fff' : 'rgba(0,0,0,0.5)', fontSize: '0.6rem', padding: '1px 7px', borderRadius: 20 }}>{count} items</span>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* ── Filtered table ── */}
                  {searching && <p style={{ textAlign: 'center', color: 'rgba(0,0,0,0.35)', padding: '16px 0', fontSize: '0.82rem' }}>Searching…</p>}
                  {!searching && (() => {
                    const knownKeys = TABS.map(t => t.key)
                    const group = products.filter(p =>
                      p.timing === activeTab ||
                      (!knownKeys.includes(p.timing) && activeTab === TABS[0].key)
                    )
                    if (group.length === 0) return (
                      <p style={{ textAlign: 'center', color: 'rgba(0,0,0,0.35)', padding: '32px 0' }}>{search.trim() ? `No results for "${search.trim()}"` : 'No items available for this slot.'}</p>
                    )
                    return (
                      <div style={{ marginBottom: 28 }}>
                        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', overflow: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', background: '#fafaf9' }}>
                                {['', 'Item', 'Unit', 'Price', 'Qty'].map(h => (
                                  <th key={h} style={{ padding: '11px 16px', textAlign: h === 'Qty' || h === 'Price' ? 'right' : 'left', fontFamily: 'Cormorant Garamond, serif', fontSize: '0.6rem', letterSpacing: '0.16em', color: 'rgba(0,0,0,0.38)', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {group.map((p, i) => {
                                const now = new Date()
                                const h = now.getHours()
                                const inWindow = h >= 9 && h < 23
                                const qty = cart[p._id] ?? 0
                                const hasInfo = !knownKeys.includes(p.timing)
                                const disabled = hasInfo && !inWindow
                                return (
                                  <tr key={p._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', opacity: disabled ? 0.55 : 1, background: disabled ? '#fafaf9' : qty > 0 ? 'rgba(201,169,110,0.05)' : i % 2 === 0 ? '#fff' : '#fafaf9' }}>
                                    <td style={{ padding: '10px 16px', width: 56 }}>
                                      {p.image
                                        ? <img src={p.image} alt={p.title} onClick={() => setImgModal({ src: p.image, title: p.title })} style={{ width: 48, height: 48, objectFit: 'cover', border: '1px solid rgba(0,0,0,0.07)', cursor: 'zoom-in' }} />
                                        : <div style={{ width: 48, height: 48, background: '#f0ece4', border: '1px solid rgba(0,0,0,0.07)' }} />
                                      }
                                    </td>
                                    <td style={{ padding: '10px 16px' }}>
                                      <p style={{ margin: 0, fontWeight: 600, color: '#111' }}>{p.title}</p>
                                      {p.description && <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: 'rgba(0,0,0,0.45)' }}>{p.description}</p>}
                                      {disabled && <span style={{ display: 'inline-block', marginTop: 4, fontSize: '0.65rem', color: '#991b1b', background: '#fee2e2', padding: '2px 8px', fontWeight: 600, letterSpacing: '0.04em' }}>Orders not accepting — available 09:00 AM to 11:00 PM</span>}
                                    </td>
                                    <td style={{ padding: '10px 16px', fontSize: '0.78rem', color: 'rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}>
                                      {p.unit || '—'}
                                    </td>
                                    <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: green, whiteSpace: 'nowrap' }}>
                                      ₹{p.price.toLocaleString('en-IN')}
                                    </td>
                                    <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                                      {disabled ? (
                                        <span style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.25)' }}>—</span>
                                      ) : (
                                        <div style={{ display: 'inline-flex', alignItems: 'center', border: `1px solid ${qty > 0 ? gold : 'rgba(0,0,0,0.15)'}`, background: '#fff' }}>
                                          <button onClick={() => setQty(p._id, -1)} disabled={qty === 0}
                                            style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: qty > 0 ? 'pointer' : 'default', fontSize: '1rem', color: qty > 0 ? green : 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                          <span style={{ width: 32, textAlign: 'center', fontSize: '0.85rem', fontWeight: qty > 0 ? 600 : 400, color: qty > 0 ? green : 'rgba(0,0,0,0.35)' }}>{qty}</span>
                                          <button onClick={() => setQty(p._id, 1)}
                                            style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                )
                              })}

                            </tbody>
                          </table>
                        </div>
                      </div>
                    )
                  })()}

                  {/* Cart summary */}
                  {cartItems.length > 0 && (
                    <div style={{ background: '#fff', border: '1px solid rgba(201,169,110,0.3)', padding: '20px 24px', marginBottom: 20 }}>
                      <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', letterSpacing: '0.1em', color: green, margin: '0 0 14px', textTransform: 'uppercase' }}>Your Order</h3>
                      {cartItems.map(i => (
                        <div key={i._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '0.85rem', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                          <span style={{ color: '#333' }}>{i.title} <span style={{ color: 'rgba(0,0,0,0.4)' }}>× {i.qty}</span></span>
                          <span style={{ fontWeight: 600, color: green }}>₹{(i.price * i.qty).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontSize: '1rem', fontWeight: 700, color: green }}>
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <p style={{ fontSize: '0.72rem', color: '#16a34a', margin: '4px 0 0' }}>Free delivery</p>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setStep(1)}
                      disabled={cartItems.length === 0}
                      style={{ background: cartItems.length > 0 ? green : 'rgba(0,0,0,0.2)', color: '#fff', border: 'none', padding: '13px 36px', fontSize: '0.82rem', cursor: cartItems.length > 0 ? 'pointer' : 'default', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      Continue →
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {/* ═══════════════ STEP 1: Details ═══════════════ */}
          {step === 1 && (
            <div style={{ maxWidth: 560 }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', letterSpacing: '0.12em', color: green, margin: '0 0 24px', textTransform: 'uppercase' }}>Your Details</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <FormField label="Full Name *">
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name"
                    style={inputSt} />
                </FormField>

                <FormField label="Phone Number *">
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="10-digit mobile number"
                    style={inputSt} maxLength={10} />
                </FormField>

                <FormField label="Email (optional)">
                  <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com"
                    style={inputSt} type="email" />
                </FormField>

                <FormField label="Delivery Address *">
                  <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Full address with landmark"
                    rows={3} style={{ ...inputSt, resize: 'vertical' }} />
                </FormField>

                {/* Pincode + delivery check */}
                <FormField label="Pincode *">
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input value={form.pincode} onChange={e => {
                      setForm(f => ({ ...f, pincode: e.target.value }))
                      if (pinState !== 'idle') { setPinState('idle'); setDelivery(null) }
                    }} placeholder="6-digit pincode" maxLength={6} style={{ ...inputSt, flex: 1 }} />
                    <button type="button" onClick={handlePinCheck}
                      style={{ background: green, color: '#fff', border: 'none', padding: '0 18px', fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap', letterSpacing: '0.06em' }}>
                      Check
                    </button>
                  </div>
                  <button type="button" onClick={handleGPS}
                    style={{ background: 'none', border: `1px solid ${green}`, color: green, padding: '7px 14px', fontSize: '0.72rem', cursor: 'pointer', marginTop: 8, letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M1 12h4M19 12h4" /></svg>
                    Use GPS
                  </button>

                  {pinState === 'checking' && <p style={{ fontSize: '0.78rem', color: 'rgba(0,0,0,0.4)', margin: '8px 0 0' }}>Checking delivery availability…</p>}
                  {pinState === 'ok' && delivery && (
                    <div style={{ marginTop: 8, padding: '10px 14px', background: delivery.serviceable ? '#f0fdf4' : '#fff7ed', border: `1px solid ${delivery.serviceable ? '#86efac' : '#fed7aa'}` }}>
                      <p style={{ margin: 0, color: '#16a34a', fontWeight: 600, fontSize: '0.85rem' }}>✓ Free Delivery to your area</p>
                      <p style={{ margin: '3px 0 0', fontSize: '0.72rem', color: 'rgba(0,0,0,0.4)' }}>{delivery.distanceKm} km from our kitchen</p>
                    </div>
                  )}
                  {pinState === 'blocked' && (
                    <div style={{ marginTop: 8, padding: '10px 14px', background: '#fee2e2', border: '1px solid #fca5a5' }}>
                      <p style={{ margin: 0, color: '#dc2626', fontWeight: 700, fontSize: '0.85rem' }}>✕ Not Deliverable Area</p>
                      <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: '#b91c1c' }}>We do not deliver to this location. Please try a different address.</p>
                    </div>
                  )}
                  {pinState === 'err' && (
                    <p style={{ margin: '8px 0 0', fontSize: '0.78rem', color: '#dc2626' }}>{pinErr}</p>
                  )}
                </FormField>

                <FormField label="Order Note (optional)">
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    rows={3} style={{ ...inputSt, resize: 'vertical' }}
                    placeholder="Any special instructions, allergies, or requests…" />
                </FormField>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
                <button onClick={() => setStep(0)} style={{ border: '1px solid rgba(0,0,0,0.15)', background: '#fff', padding: '11px 22px', fontSize: '0.8rem', cursor: 'pointer' }}>← Back</button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!form.name || !form.phone || !form.address || !/^\d{6}$/.test(form.pincode) || pinState === 'blocked'}
                  style={{ flex: 1, background: (form.name && form.phone && form.address && /^\d{6}$/.test(form.pincode) && pinState !== 'blocked') ? green : 'rgba(0,0,0,0.2)', color: '#fff', border: 'none', padding: '11px 22px', fontSize: '0.82rem', cursor: (form.name && form.phone && form.address && /^\d{6}$/.test(form.pincode) && pinState !== 'blocked') ? 'pointer' : 'default', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Review Order →
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════ STEP 2: Review & Pay ═══════════════ */}
          {step === 2 && (
            <div style={{ maxWidth: 560 }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', letterSpacing: '0.12em', color: green, margin: '0 0 24px', textTransform: 'uppercase' }}>Review & Pay</h2>

              {/* Order summary */}
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', marginBottom: 20 }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#fafaf9' }}>
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.75rem', letterSpacing: '0.14em', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', margin: 0 }}>Order Items</p>
                </div>
                <div style={{ padding: '0 20px' }}>
                  {cartItems.map(i => (
                    <div key={i._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.04)', fontSize: '0.85rem' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 500, color: '#111' }}>{i.title}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'rgba(0,0,0,0.4)' }}>{TABS.find(t => t.key === i.timing)?.label ?? i.timing}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, color: 'rgba(0,0,0,0.5)' }}>{i.qty} × ₹{i.price.toLocaleString('en-IN')}</p>
                        <p style={{ margin: '2px 0 0', fontWeight: 600, color: green }}>₹{(i.price * i.qty).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer */}
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', padding: '16px 20px', marginBottom: 20 }}>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.72rem', letterSpacing: '0.14em', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', margin: '0 0 10px' }}>Deliver To</p>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: '#111' }}>{form.name}</p>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'rgba(0,0,0,0.55)' }}>{form.phone}</p>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'rgba(0,0,0,0.55)' }}>{form.address}</p>
                {form.notes && (
                  <p style={{ margin: '8px 0 0', fontSize: '0.82rem', color: '#333', background: '#f8f5f0', padding: '8px 10px', borderLeft: `3px solid ${gold}` }}>
                    <span style={{ fontSize: '0.68rem', color: 'rgba(0,0,0,0.4)', display: 'block', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Note</span>
                    {form.notes}
                  </p>
                )}
              </div>

              {/* Price breakdown */}
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', padding: '16px 20px', marginBottom: 28 }}>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.72rem', letterSpacing: '0.14em', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', margin: '0 0 12px' }}>Price Details</p>
                <PriceRow label="Subtotal" value={`₹${subtotal.toLocaleString('en-IN')}`} />
                <PriceRow label="GST & Other Taxes" value={`₹${gst.toLocaleString('en-IN')}`} />
                <PriceRow label="Delivery Fee" value="Free" />
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)', marginTop: 10, paddingTop: 10 }}>
                  <PriceRow label="Total" value={`₹${total.toLocaleString('en-IN')}`} bold />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(1)} style={{ border: '1px solid rgba(0,0,0,0.15)', background: '#fff', padding: '13px 22px', fontSize: '0.8rem', cursor: 'pointer' }}>← Back</button>
                <button onClick={handlePlaceOrder} disabled={placing}
                  style={{ flex: 1, background: placing ? 'rgba(0,0,0,0.3)' : gold, color: '#fff', border: 'none', padding: '13px 22px', fontSize: '0.9rem', cursor: placing ? 'default' : 'pointer', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600 }}>
                  {placing ? 'Placing Order…' : `Pay ₹${total.toLocaleString('en-IN')} →`}
                </button>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.35)', marginTop: 10, textAlign: 'center' }}>
                Payment is processed securely. Our team will confirm your order shortly.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Image Modal */}
      {imgModal && (
        <div onClick={() => setImgModal(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, cursor: 'zoom-out' }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: 480, width: '100%' }}>
            <img src={imgModal.src} alt={imgModal.title}
              style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', display: 'block', background: '#fff' }} />
            {imgModal.title && (
              <p style={{ margin: 0, background: '#fff', padding: '10px 16px', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', letterSpacing: '0.08em', color: '#111' }}>{imgModal.title}</p>
            )}
            <button onClick={() => setImgModal(null)}
              style={{ position: 'absolute', top: -14, right: -14, width: 32, height: 32, borderRadius: '50%', background: '#fff', border: 'none', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.25)', color: '#333' }}>×</button>
          </div>
        </div>
      )}
    </>
  )
}

function FormField({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.45)', display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}

function PriceRow({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '0.85rem' }}>
      <span style={{ color: 'rgba(0,0,0,0.5)' }}>{label}</span>
      <span style={{ fontWeight: bold ? 700 : 500, color: bold ? green : '#333' }}>{value}</span>
    </div>
  )
}

const inputSt = {
  width: '100%', border: '1px solid rgba(0,0,0,0.14)', background: '#fff',
  padding: '10px 14px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box',
}
