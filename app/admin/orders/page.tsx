'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authHeaders } from '@/lib/client-auth'

const gold  = '#c9a96e'
const green = '#2d4a28'

type OrderStatus = 'Pending' | 'Active' | 'Paused' | 'Completed' | 'Cancelled'
const ALL_STATUSES: (OrderStatus | 'All')[] = ['All', 'Pending', 'Active', 'Paused', 'Completed', 'Cancelled']

const STATUS_STYLE: Record<OrderStatus, { bg: string; color: string }> = {
  Pending:   { bg: '#f3e8ff', color: '#7c3aed' },
  Active:    { bg: '#dcfce7', color: '#16a34a' },
  Paused:    { bg: '#fef9c3', color: '#ca8a04' },
  Completed: { bg: '#e0f2fe', color: '#0369a1' },
  Cancelled: { bg: '#fee2e2', color: '#dc2626' },
}

export default function OrdersPage() {
  const router = useRouter()

  const [subs,    setSubs]    = useState<any[]>([])
  const [total,   setTotal]   = useState(0)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  const [search,     setSearch]     = useState('')
  const [filter,     setFilter]     = useState<OrderStatus | 'All'>('All')
  const [planFilter, setPlanFilter] = useState<'All' | 'Fixed' | 'Customized' | 'Bespoke'>('All')
  const [sortKey,    setSortKey]    = useState('createdAt')
  const [sortDir,    setSortDir]    = useState<'asc' | 'desc'>('desc')
  const [page,       setPage]       = useState(1)
  const [dateFrom,   setDateFrom]   = useState('')
  const [dateTo,     setDateTo]     = useState('')
  const [dateField,  setDateField]  = useState<'startDate' | 'createdAt'>('startDate')
  const limit = 20

  const clearDates = () => { setDateFrom(''); setDateTo(''); setPage(1) }

  const fetchSubs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page:      String(page),
        limit:     String(limit),
        sortBy:    sortKey,
        order:     sortDir,
        dateField,
        ...(filter     !== 'All' && { status:   filter }),
        ...(planFilter !== 'All' && { planType: planFilter }),
        ...(search.trim()        && { search:   search.trim() }),
        ...(dateFrom          && { dateFrom }),
        ...(dateTo            && { dateTo }),
      })
      const res  = await fetch(`/api/subscriptions?${params}`, { headers: authHeaders() })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message ?? 'Failed to load')
      setSubs(data.data)
      setTotal(data.total)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [search, filter, planFilter, sortKey, sortDir, page])

  useEffect(() => { fetchSubs() }, [fetchSubs])

  /* debounce search */
  const [searchInput, setSearchInput] = useState('')
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1) }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  /* re-fetch on date change */
  useEffect(() => { setPage(1) }, [dateFrom, dateTo, dateField])

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/subscriptions/${id}/approve`, {
        method: 'POST', headers: authHeaders(),
      })
      const data = await res.json()
      if (data.success) {
        setSubs(prev => prev.map(s => s.subscriptionId === id || s._id === id ? { ...s, approved: true } : s))
      }
    } catch {}
  }

  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    setUpdatingStatus(id)
    try {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method:  'PATCH',
        headers: authHeaders(),
        body:    JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setSubs(prev => prev.map(s =>
          s.subscriptionId === id || s._id === id ? { ...s, status: newStatus } : s
        ))
      }
    } catch {}
    finally { setUpdatingStatus(null) }
  }

  const SortIcon = ({ k }: { k: string }) => (
    <span style={{ marginLeft: 4, opacity: sortKey === k ? 1 : 0.3, fontSize: '0.7rem' }}>
      {sortKey === k ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  )

  const totalPages = Math.ceil(total / limit)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111', margin: '0 0 3px', fontFamily: 'var(--font-cinzel), serif', letterSpacing: '0.04em' }}>Subscriptions</h1>
          <p style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.4)', margin: 0 }}>
            {loading ? 'Loading...' : `${total} subscription${total !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 12, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Row 1 — search + status */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="Search by name, phone, ID, plan..."
              style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', color: '#111' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {ALL_STATUSES.map(s => (
              <button key={s} onClick={() => { setFilter(s); setPage(1) }}
                style={{
                  padding: '6px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer', border: 'none',
                  background: filter === s ? green : '#f3f4f6',
                  color:      filter === s ? '#fff' : 'rgba(0,0,0,0.55)',
                }}>
                {s}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Plan Type</span>
            {(['All', 'Fixed', 'Customized', 'Bespoke'] as const).map(t => (
              <button key={t} onClick={() => { setPlanFilter(t); setPage(1) }}
                style={{
                  padding: '6px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer', border: 'none',
                  background: planFilter === t
                    ? t === 'Bespoke' ? '#7c3aed' : t === 'Customized' ? gold : t === 'Fixed' ? green : green
                    : '#f3f4f6',
                  color: planFilter === t ? '#fff' : 'rgba(0,0,0,0.55)',
                }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2 — date filter */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', paddingTop: 10, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>Date Filter</span>

          {/* Field selector */}
          <select
            value={dateField}
            onChange={e => setDateField(e.target.value as 'startDate' | 'createdAt')}
            style={{ padding: '7px 10px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.78rem', color: '#111', outline: 'none', background: '#fff', cursor: 'pointer' }}>
            <option value="startDate">Start Date</option>
            <option value="createdAt">Created At</option>
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)' }}>From</span>
            <input
              type="date" value={dateFrom}
              onChange={e => { setDateFrom(e.target.value); setPage(1) }}
              style={{ padding: '7px 10px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.78rem', color: '#111', outline: 'none', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)' }}>To</span>
            <input
              type="date" value={dateTo} min={dateFrom}
              onChange={e => { setDateTo(e.target.value); setPage(1) }}
              style={{ padding: '7px 10px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.78rem', color: '#111', outline: 'none', cursor: 'pointer' }}
            />
          </div>

          {(dateFrom || dateTo) && (
            <button onClick={clearDates}
              style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #fca5a5', background: '#fff', color: '#dc2626', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
              ✕ Clear
            </button>
          )}

          {(dateFrom || dateTo) && (
            <span style={{ fontSize: '0.72rem', color: gold, fontWeight: 600 }}>
              {dateFrom && dateTo ? `${dateFrom} → ${dateTo}` : dateFrom ? `From ${dateFrom}` : `Until ${dateTo}`}
            </span>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '12px 16px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, fontSize: '0.83rem', color: '#dc2626' }}>
          ⚠ {error} — <button onClick={fetchSubs} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.83rem' }}>Retry</button>
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                {([
                  { label: 'Sub ID',     key: 'subscriptionId' },
                  { label: 'Customer',   key: null              },
                  { label: 'Plan',       key: null              },
                  { label: 'Plan Type',  key: null              },
                  { label: 'Category',   key: null              },
                  { label: 'Meals',      key: null              },
                  { label: 'Start Date', key: 'startDate'       },
                  { label: 'Amount',     key: 'amount'          },
                  { label: 'Status',     key: null              },
                  { label: 'Approval',   key: null              },
                  { label: 'Invoice',    key: null              },
                ] as const).map(({ label, key }) => (
                  <th key={label}
                    onClick={key ? () => toggleSort(key) : undefined}
                    style={{
                      padding: '11px 16px', textAlign: 'left', fontWeight: 600,
                      color: 'rgba(0,0,0,0.4)', fontSize: '0.7rem',
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      whiteSpace: 'nowrap', cursor: key ? 'pointer' : 'default', userSelect: 'none',
                    }}>
                    {label}{key && <SortIcon k={key} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} style={{ padding: '48px', textAlign: 'center', color: 'rgba(0,0,0,0.35)', fontSize: '0.85rem' }}>
                    Loading subscriptions...
                  </td>
                </tr>
              ) : subs.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ padding: '48px', textAlign: 'center', color: 'rgba(0,0,0,0.35)', fontSize: '0.85rem' }}>
                    No subscriptions found
                  </td>
                </tr>
              ) : subs.map((o, i) => (
                <tr key={o._id}
                  style={{ borderBottom: i < subs.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '13px 16px', color: gold, fontWeight: 700, whiteSpace: 'nowrap' }}>{o.subscriptionId}</td>
                  <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: 600, color: '#111' }}>{o.customer?.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.4)', marginTop: 1 }}>{o.customer?.phone}</div>
                  </td>
                  <td style={{ padding: '13px 16px', color: 'rgba(0,0,0,0.65)', maxWidth: 180 }}>{o.plan}</td>
                  <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{
                      display: 'inline-block', padding: '2px 10px', fontSize: '0.68rem',
                      borderRadius: 20, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                      background: o.planType === 'Customized' ? 'rgba(201,169,110,0.12)' : o.planType === 'Bespoke' ? 'rgba(124,58,237,0.08)' : 'rgba(45,74,40,0.08)',
                      color: o.planType === 'Customized' ? gold : o.planType === 'Bespoke' ? '#7c3aed' : green,
                      border: `1px solid ${o.planType === 'Customized' ? 'rgba(201,169,110,0.35)' : o.planType === 'Bespoke' ? 'rgba(124,58,237,0.25)' : 'rgba(45,74,40,0.2)'}`,
                    }}>
                      {o.planType || 'Fixed'}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', color: 'rgba(0,0,0,0.55)', whiteSpace: 'nowrap', maxWidth: 160 }}>{o.category || '—'}</td>
                  <td style={{ padding: '13px 16px', color: 'rgba(0,0,0,0.55)', whiteSpace: 'nowrap' }}>{o.meals}</td>
                  <td style={{ padding: '13px 16px', color: 'rgba(0,0,0,0.55)', whiteSpace: 'nowrap' }}>
                    {o.startDate ? new Date(o.startDate).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td style={{ padding: '13px 16px', color: '#111', fontWeight: 700, whiteSpace: 'nowrap' }}>₹{o.amount?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                    {(() => {
                      const st    = o.status as OrderStatus
                      const s     = STATUS_STYLE[st] ?? { bg: '#f3f4f6', color: '#111' }
                      const rowId = o.subscriptionId ?? o._id
                      const busy  = updatingStatus === rowId
                      return (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <select
                            value={st}
                            disabled={busy}
                            onChange={e => handleStatusChange(rowId, e.target.value as OrderStatus)}
                            style={{
                              background:   busy ? '#f3f4f6' : s.bg,
                              color:        busy ? '#aaa'    : s.color,
                              border:       'none',
                              borderRadius: 20,
                              padding:      '5px 28px 5px 10px',
                              fontSize:     '0.7rem',
                              fontWeight:   700,
                              cursor:       busy ? 'not-allowed' : 'pointer',
                              outline:      'none',
                              appearance:   'none',
                              WebkitAppearance: 'none',
                            }}
                          >
                            {(['Pending','Active','Paused','Completed','Cancelled'] as OrderStatus[]).map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <span style={{
                            position: 'absolute', right: 9, top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '0.55rem', pointerEvents: 'none',
                            color: busy ? '#aaa' : (STATUS_STYLE[st] ?? { color: '#111' }).color,
                          }}>▼</span>
                        </div>
                      )
                    })()}
                  </td>
                  <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                    {o.approved
                      ? <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700 }}>✓ Approved</span>
                      : <button onClick={() => handleApprove(o.subscriptionId ?? o._id)}
                          style={{ background: '#fef9c3', color: '#ca8a04', padding: '4px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                          ⏳ Approve
                        </button>
                    }
                  </td>
                  <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                    <button onClick={() => router.push(`/admin/orders/${o.subscriptionId ?? o._id}/invoice`)}
                      style={{ padding: '6px 14px', borderRadius: 7, border: `1.5px solid ${gold}`, background: '#fff', color: gold, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: '12px 18px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'rgba(0,0,0,0.4)' }}>
            <span>Page {page} of {totalPages} · {total} total</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ padding: '5px 14px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#ccc' : '#111', fontSize: '0.78rem' }}>
                ← Prev
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ padding: '5px 14px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', color: page === totalPages ? '#ccc' : '#111', fontSize: '0.78rem' }}>
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
