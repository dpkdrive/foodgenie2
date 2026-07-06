'use client'
import { useState, useEffect, useRef } from 'react'
import { authHeaders } from '@/lib/client-auth'

const gold  = '#c9a96e'
const green = '#2d4a28'

const TIMING_OPTIONS = ['35min - 60min', '2hrs - 4hrs']
const STATUS_OPTIONS = ['Published', 'Draft', 'Pending']

const STATUS_STYLE = {
  Published: { bg: '#dcfce7', color: '#16a34a' },
  Draft:     { bg: '#f3f4f6', color: '#6b7280' },
  Pending:   { bg: '#fef9c3', color: '#ca8a04' },
}

const EMPTY_FORM = {
  title: '', description: '', price: '', unit: '',
  timing: '35min - 60min', status: 'Draft', image: '', featured: false,
}

export default function SameDayProductsAdmin() {
  const [products, setProducts]   = useState([])
  const [loading,  setLoading]    = useState(true)
  const [search,   setSearch]     = useState('')
  const [statusF,  setStatusF]    = useState('')
  const [timingF,  setTimingF]    = useState('')
  const [showForm, setShowForm]   = useState(false)
  const [editing,  setEditing]    = useState(null)
  const [form,     setForm]       = useState(EMPTY_FORM)
  const [saving,   setSaving]     = useState(false)
  const [imgFile,  setImgFile]    = useState(null)
  const [imgPrev,  setImgPrev]    = useState('')
  const [delId,    setDelId]      = useState(null)
  const fileRef = useRef()

  const load = () => {
    setLoading(true)
    const q = new URLSearchParams({ admin: 'true' })
    if (statusF) q.set('status', statusF)
    if (timingF) q.set('timing', timingF)
    if (search)  q.set('search', search)
    fetch(`/api/same-day/products?${q}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(r => { if (r.success) setProducts(r.data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [statusF, timingF])

  const handleSearch = e => {
    e.preventDefault()
    load()
  }

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setImgFile(null)
    setImgPrev('')
    setShowForm(true)
  }

  const openEdit = p => {
    setEditing(p)
    setForm({
      title: p.title, description: p.description, price: String(p.price),
      unit: p.unit, timing: p.timing,
      status: p.status, image: p.image, featured: p.featured ?? false,
    })
    setImgFile(null)
    setImgPrev(p.image || '')
    setShowForm(true)
  }

  const handleImgChange = e => {
    const file = e.target.files[0]
    if (!file) return
    setImgFile(file)
    setImgPrev(URL.createObjectURL(file))
  }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      let imageUrl = form.image
      if (imgFile) {
        const fd = new FormData()
        fd.append('file', imgFile)
        const token = localStorage.getItem('fg_token')
        const r = await fetch('/api/same-day/upload', { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd })
        const d = await r.json()
        if (d.success && d.url) imageUrl = d.url
        else { alert(d.message ?? 'Image upload failed'); setSaving(false); return }
      }

      const body = {
        title:       form.title,
        description: form.description,
        price:       Number(form.price),
        unit:        form.unit,
        timing:      form.timing,
        status:      form.status,
        image:       imageUrl,
        featured:    form.featured,
      }

      const url    = editing ? `/api/same-day/products/${editing._id}` : '/api/same-day/products'
      const method = editing ? 'PATCH' : 'POST'
      const res    = await fetch(url, {
        method,
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.success) { setShowForm(false); load() }
      else alert(data.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!delId) return
    const res  = await fetch(`/api/same-day/products/${delId}`, { method: 'DELETE', headers: authHeaders() })
    const data = await res.json()
    if (data.success) { setDelId(null); load() }
    else alert(data.message)
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-cinzel, serif)', fontSize: '1.35rem', letterSpacing: '0.12em', color: green, margin: 0 }}>SAME DAY PRODUCTS</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(0,0,0,0.4)', margin: '4px 0 0' }}>Manage products available for same-day delivery</p>
        </div>
        <button onClick={openAdd} style={{ background: gold, color: '#fff', border: 'none', padding: '10px 22px', fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1, minWidth: 220 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
            style={{ flex: 1, border: '1px solid rgba(0,0,0,0.12)', background: '#fff', padding: '8px 12px', fontSize: '0.82rem', outline: 'none' }} />
          <button type="submit" style={{ background: green, color: '#fff', border: 'none', padding: '8px 16px', fontSize: '0.8rem', cursor: 'pointer' }}>Search</button>
        </form>
        <select value={timingF} onChange={e => setTimingF(e.target.value)}
          style={{ border: '1px solid rgba(0,0,0,0.12)', background: '#fff', padding: '8px 12px', fontSize: '0.82rem', cursor: 'pointer', outline: 'none' }}>
          <option value="">All Timings</option>
          {TIMING_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={statusF} onChange={e => setStatusF(e.target.value)}
          style={{ border: '1px solid rgba(0,0,0,0.12)', background: '#fff', padding: '8px 12px', fontSize: '0.82rem', cursor: 'pointer', outline: 'none' }}>
          <option value="">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', background: '#fafaf9' }}>
              {['ID', 'Image', 'Title', 'Price', 'Unit', 'Timing', 'Featured', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontFamily: 'var(--font-cinzel, serif)', fontSize: '0.6rem', letterSpacing: '0.14em', color: 'rgba(0,0,0,0.4)', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={9} style={{ padding: 40, textAlign: 'center', color: 'rgba(0,0,0,0.3)' }}>Loading…</td></tr>
            )}
            {!loading && products.length === 0 && (
              <tr><td colSpan={9} style={{ padding: 40, textAlign: 'center', color: 'rgba(0,0,0,0.3)' }}>No products found</td></tr>
            )}
            {products.map((p, i) => (
              <tr key={p._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: i % 2 === 0 ? '#fff' : '#fafaf9' }}>
                <td style={{ padding: '12px 14px', color: 'rgba(0,0,0,0.45)', fontFamily: 'monospace', fontSize: '0.75rem' }}>{p.productId}</td>
                <td style={{ padding: '10px 14px' }}>
                  {p.image
                    ? <img src={p.image} alt={p.title} style={{ width: 44, height: 44, objectFit: 'cover', border: '1px solid rgba(0,0,0,0.08)' }} />
                    : <div style={{ width: 44, height: 44, background: '#f0ece4', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'rgba(0,0,0,0.3)' }}>IMG</div>
                  }
                </td>
                <td style={{ padding: '12px 14px', fontWeight: 500, color: '#111' }}>
                  {p.title}
                </td>
                <td style={{ padding: '12px 14px', fontWeight: 600, color: green }}>₹{p.price.toLocaleString('en-IN')}</td>
                <td style={{ padding: '12px 14px', color: '#111' }}>{p.unit || '—'}</td>
                <td style={{ padding: '12px 14px', color: 'rgba(0,0,0,0.55)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{p.timing}</td>
                <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                  {p.featured
                    ? <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 600 }}>Yes</span>
                    : <span style={{ color: 'rgba(0,0,0,0.25)', fontSize: '0.75rem' }}>—</span>
                  }
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ ...STATUS_STYLE[p.status], padding: '3px 10px', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.04em' }}>{p.status}</span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(p)} style={{ background: 'none', border: '1px solid rgba(0,0,0,0.15)', padding: '5px 12px', fontSize: '0.75rem', cursor: 'pointer', color: '#333' }}>Edit</button>
                    <button onClick={() => setDelId(p._id)} style={{ background: 'none', border: '1px solid #fca5a5', padding: '5px 12px', fontSize: '0.75rem', cursor: 'pointer', color: '#dc2626' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'var(--font-cinzel, serif)', fontSize: '0.95rem', letterSpacing: '0.12em', color: green, margin: 0, textTransform: 'uppercase' }}>
                {editing ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'rgba(0,0,0,0.4)' }}>×</button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Image */}
              <div>
                <label style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.5)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Product Image</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div onClick={() => fileRef.current?.click()} style={{
                    width: 80, height: 80, border: '1px dashed rgba(0,0,0,0.2)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#fafaf9', overflow: 'hidden', flexShrink: 0,
                  }}>
                    {imgPrev
                      ? <img src={imgPrev} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '0.65rem', color: 'rgba(0,0,0,0.3)' }}>Click to upload</span>
                    }
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImgChange} />
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.5)', margin: 0 }}>JPG, PNG, WEBP — max 5MB</p>
                    {imgPrev && <button type="button" onClick={() => { setImgFile(null); setImgPrev(''); setForm(f => ({ ...f, image: '' })) }} style={{ background: 'none', border: 'none', fontSize: '0.72rem', color: '#dc2626', cursor: 'pointer', padding: 0, marginTop: 4 }}>Remove</button>}
                  </div>
                </div>
              </div>

              {/* Title */}
              <Field label="Title *" required>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
                  style={inputStyle} placeholder="e.g. Dal Makhani + Rice" />
              </Field>

              {/* Description */}
              <Field label="Description">
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }} placeholder="Brief product description…" />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {/* Price */}
                <Field label="Price (₹) *">
                  <input type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required
                    style={inputStyle} placeholder="0" />
                </Field>

                {/* Unit */}
                <Field label="Unit">
                  <input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                    style={inputStyle} placeholder="e.g. per plate, 500g, 1 box" />
                </Field>
              </div>

              {/* Timing */}
              <Field label="Delivery Timing *">
                <select value={form.timing} onChange={e => setForm(f => ({ ...f, timing: e.target.value }))} style={inputStyle}>
                  {TIMING_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>

              {/* Status */}
              <Field label="Status *">
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={inputStyle}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>

              {/* Featured */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 14px', border: '1px solid rgba(0,0,0,0.1)', background: form.featured ? '#fffbeb' : '#fafaf9' }}>
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                  style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#92400e' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: form.featured ? '#92400e' : 'rgba(0,0,0,0.5)' }}>Featured — show at top of listing</span>
              </label>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ border: '1px solid rgba(0,0,0,0.15)', background: '#fff', padding: '10px 22px', fontSize: '0.8rem', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  style={{ background: gold, color: '#fff', border: 'none', padding: '10px 28px', fontSize: '0.8rem', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                  {saving ? 'Saving…' : editing ? 'Update' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {delId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', padding: 32, maxWidth: 380, width: '100%', textAlign: 'center' }}>
            <p style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: 8 }}>Delete this product?</p>
            <p style={{ fontSize: '0.82rem', color: 'rgba(0,0,0,0.5)', marginBottom: 24 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setDelId(null)} style={{ border: '1px solid rgba(0,0,0,0.15)', background: '#fff', padding: '9px 22px', fontSize: '0.82rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleDelete} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '9px 22px', fontSize: '0.82rem', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children, required }) {
  return (
    <div>
      <label style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.5)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}{required && <span style={{ color: '#dc2626' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', border: '1px solid rgba(0,0,0,0.14)', background: '#fff',
  padding: '9px 12px', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box',
}
