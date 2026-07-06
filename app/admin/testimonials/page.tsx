'use client'
import { useState, useEffect } from 'react'
import { authHeaders } from '@/lib/client-auth'

const gold  = '#c9a96e'
const green = '#2d4a28'

interface Testimonial {
  _id:      string
  text:     string
  name:     string
  role:     string
  duration: string
  rating:   number
  active:   boolean
  order:    number
}

const EMPTY = { text: '', name: '', role: '', duration: '', rating: 5, active: true, order: 0 }

export default function TestimonialsAdmin() {
  const [list,    setList]    = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [modal,   setModal]   = useState<'add' | 'edit' | null>(null)
  const [form,    setForm]    = useState<typeof EMPTY & { _id?: string }>(EMPTY)
  const [error,   setError]   = useState('')

  const fetchAll = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/testimonials', { headers: authHeaders() }).then(r => r.json())
      setList(res.data ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const openAdd  = () => { setForm(EMPTY); setError(''); setModal('add') }
  const openEdit = (t: Testimonial) => { setForm({ ...t }); setError(''); setModal('edit') }
  const closeModal = () => setModal(null)

  const handleSave = async () => {
    if (!form.text.trim() || !form.name.trim()) { setError('Text and Name are required.'); return }
    setSaving(true); setError('')
    try {
      const isEdit = modal === 'edit' && form._id
      const url    = isEdit ? `/api/testimonials/${form._id}` : '/api/testimonials'
      const method = isEdit ? 'PATCH' : 'POST'
      const res    = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(form) }).then(r => r.json())
      if (!res.success) throw new Error(res.message)
      closeModal()
      fetchAll()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return
    await fetch(`/api/testimonials/${id}`, { method: 'DELETE', headers: authHeaders() })
    fetchAll()
  }

  const toggleActive = async (t: Testimonial) => {
    await fetch(`/api/testimonials/${t._id}`, {
      method: 'PATCH', headers: authHeaders(),
      body: JSON.stringify({ active: !t.active }),
    })
    fetchAll()
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '1.1rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: green, margin: 0 }}>Testimonials</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(0,0,0,0.4)', margin: '4px 0 0' }}>Manage reviews displayed on the frontend</p>
        </div>
        <button onClick={openAdd} style={{
          background: gold, color: '#fff', border: 'none', cursor: 'pointer',
          padding: '9px 20px', fontSize: '0.78rem', letterSpacing: '0.08em',
          fontFamily: 'var(--font-cinzel), serif', textTransform: 'uppercase',
        }}>
          + Add New
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: '0.85rem' }}>Loading...</p>
      ) : list.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ color: 'rgba(0,0,0,0.35)', fontSize: '0.85rem' }}>No testimonials found. Add your first one.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                {['#', 'Name', 'Role', 'Duration', 'Rating', 'Review', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((t, i) => (
                <tr key={t._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: i % 2 === 0 ? '#fff' : 'rgba(245,240,232,0.4)' }}>
                  <td style={{ padding: '12px 16px', color: 'rgba(0,0,0,0.35)' }}>{t.order || i + 1}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: green, whiteSpace: 'nowrap' }}>{t.name}</td>
                  <td style={{ padding: '12px 16px', color: 'rgba(0,0,0,0.55)', whiteSpace: 'nowrap' }}>{t.role || '—'}</td>
                  <td style={{ padding: '12px 16px', color: 'rgba(0,0,0,0.55)', whiteSpace: 'nowrap' }}>{t.duration || '—'}</td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    {[1,2,3,4,5].map(s => (
                      <span key={s} style={{ color: s <= (t.rating ?? 5) ? gold : 'rgba(0,0,0,0.15)', fontSize: '0.85rem' }}>★</span>
                    ))}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'rgba(0,0,0,0.6)', maxWidth: 260 }}>
                    <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {t.text}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => toggleActive(t)}
                      style={{
                        padding: '3px 10px', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                        border: 'none', cursor: 'pointer', fontWeight: 500,
                        background: t.active ? '#dcfce7' : '#fee2e2',
                        color:      t.active ? '#16a34a' : '#dc2626',
                      }}
                    >
                      {t.active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEdit(t)} style={{ background: 'rgba(201,169,110,0.12)', color: gold, border: '1px solid rgba(201,169,110,0.3)', padding: '5px 12px', cursor: 'pointer', fontSize: '0.72rem' }}>Edit</button>
                      <button onClick={() => handleDelete(t._id)} style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '5px 12px', cursor: 'pointer', fontSize: '0.72rem' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 520, padding: 28, position: 'relative' }}>
            <h2 style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '0.9rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: green, margin: '0 0 24px' }}>
              {modal === 'add' ? 'New Testimonial' : 'Edit Testimonial'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Review Text *">
                <textarea
                  rows={4}
                  value={form.text}
                  onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                  style={inputStyle}
                  placeholder="Write the customer review..."
                />
              </Field>
              <Field label="Rating">
                <div style={{ display: 'flex', gap: 6, paddingTop: 4 }}>
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setForm(f => ({ ...f, rating: s }))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', padding: 0, lineHeight: 1, color: s <= form.rating ? gold : 'rgba(0,0,0,0.15)', transition: 'color 0.15s' }}>
                      ★
                    </button>
                  ))}
                </div>
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Name *">
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="Riya Kapoor" />
                </Field>
                <Field label="Role">
                  <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={inputStyle} placeholder="Monthly Subscriber · Delhi" />
                </Field>
                <Field label="Duration">
                  <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} style={inputStyle} placeholder="28 Days" />
                </Field>
                <Field label="Order (sort)">
                  <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} style={inputStyle} />
                </Field>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.8rem', color: 'rgba(0,0,0,0.6)' }}>
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
                Show on frontend
              </label>
            </div>

            {error && <p style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: 12 }}>{error}</p>}

            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={closeModal} style={{ padding: '9px 20px', border: '1px solid rgba(0,0,0,0.15)', background: 'transparent', cursor: 'pointer', fontSize: '0.78rem' }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: '9px 20px', background: gold, color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.78rem', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)', fontWeight: 500 }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '1px solid rgba(0,0,0,0.15)',
  fontSize: '0.82rem', outline: 'none', background: '#fafafa', boxSizing: 'border-box',
  fontFamily: 'inherit',
}
