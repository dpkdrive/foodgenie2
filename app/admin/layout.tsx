'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LoginBody from './LoginBody'
import { isTokenValid, getAdminInfo, clearAuth } from '@/lib/client-auth'

const navItems = [
  {
    group: 'Overview',
    items: [
      {
        label: 'Dashboard',
        href: '/admin',
        icon: null,
      },
      {
        label: 'Subscriptions',
        href: '/admin/orders',
        icon: null,
      },
      {
        label: 'Testimonials',
        href: '/admin/testimonials',
        icon: null,
      },
      {
        label: 'Settings',
        href: '/admin/settings',
        icon: null,
      },
    ],
  },
  {
    group: 'Same Day Delivery',
    items: [
      {
        label: 'Products',
        href: '/admin/same-day/products',
        icon: null,
      },
      {
        label: 'Orders',
        href: '/admin/same-day/orders',
        icon: null,
      },
    ],
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [isLoggedIn,  setIsLoggedIn]  = useState(false)
  const [adminInfo,   setAdminInfo]   = useState<{ email: string; role: string } | null>(null)
  const [mounted,     setMounted]     = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('fg_token')
    const valid = isTokenValid(token)
    setIsLoggedIn(valid)
    if (valid) setAdminInfo(getAdminInfo())
    setMounted(true)

    /* auto-logout when token expires */
    if (token && !valid) clearAuth()
  }, [])

  const handleLogin = () => {
    setIsLoggedIn(true)
    setAdminInfo(getAdminInfo())
  }

  const handleLogout = () => {
    clearAuth()
    setIsLoggedIn(false)
    setAdminInfo(null)
  }

  if (!mounted) return null
  if (!isLoggedIn) return <LoginBody onLogin={handleLogin} />

  const currentLabel = navItems.flatMap(g => g.items).find(i => i.href === pathname)?.label ?? 'Dashboard'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif', background: '#f5f0e8' }}>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 20, background: 'rgba(0,0,0,0.5)' }}
          className="lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{
        position:   'fixed',
        top:        0,
        left:       0,
        height:     '100vh',
        zIndex:     30,
        display:    'flex',
        flexDirection: 'column',
        flexShrink: 0,
        width:      sidebarOpen ? 230 : 60,
        background: '#fff',
        borderRight:'1px solid rgba(0,0,0,0.07)',
        transition: 'width 0.3s ease',
        overflow:   'hidden',
      }}
        className={mobileOpen ? '' : '-translate-x-full lg:translate-x-0'}
      >
        {/* Brand */}
        <div style={{
          display:      'flex',
          alignItems:   'center',
          gap:          10,
          padding:      sidebarOpen ? '22px 20px' : '22px 0',
          justifyContent: sidebarOpen ? 'flex-start' : 'center',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          flexShrink:   0,
        }}>
          {sidebarOpen && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '0.82rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', margin: 0, lineHeight: 1 }}>FoodGenie</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.62rem', color: 'rgba(0,0,0,0.35)', margin: '4px 0 0', letterSpacing: '0.06em' }}>Admin Panel</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.3)', flexShrink: 0, padding: 4, display: 'flex' }}
            className="hidden lg:flex">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {sidebarOpen ? <polyline points="15 18 9 12 15 6"/> : <polyline points="9 18 15 12 9 6"/>}
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
          {navItems.map(group => (
            <div key={group.group} style={{ marginBottom: 20 }}>
              {sidebarOpen && (
                <p style={{
                  fontFamily: 'var(--font-cinzel), serif',
                  fontSize: '0.55rem', letterSpacing: '0.22em',
                  textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)',
                  padding: '0 10px', marginBottom: 6,
                }}>{group.group}</p>
              )}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {group.items.map(item => {
                  const active = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href + '/'))
                  return (
                    <li key={item.href}>
                      <Link href={item.href} onClick={() => setMobileOpen(false)}
                        title={!sidebarOpen ? item.label : undefined}
                        style={{
                          display:     'flex',
                          alignItems:  'center',
                          gap:         10,
                          padding:     sidebarOpen ? '9px 12px' : '9px 0',
                          justifyContent: sidebarOpen ? 'flex-start' : 'center',
                          borderRadius: 0,
                          textDecoration: 'none',
                          fontSize:    '0.82rem',
                          fontWeight:  active ? 500 : 400,
                          color:       active ? 'var(--gold)' : 'rgba(0,0,0,0.55)',
                          background:  active ? 'rgba(201,169,110,0.1)' : 'transparent',
                          borderLeft:  active ? '2px solid var(--gold)' : '2px solid transparent',
                          transition:  'all 0.18s',
                          position:    'relative',
                        }}>
                        {sidebarOpen && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
                        {/* Tooltip */}
                        {!sidebarOpen && (
                          <span style={{
                            position: 'absolute', left: '100%', marginLeft: 8,
                            padding: '6px 12px', background: '#2a2a2a', color: '#fff',
                            fontSize: '0.75rem', whiteSpace: 'nowrap', borderRadius: 4,
                            opacity: 0, pointerEvents: 'none', zIndex: 50,
                            border: '1px solid rgba(255,255,255,0.1)',
                          }} className="sidebar-tooltip">{item.label}</span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', margin: '0 12px', flexShrink: 0 }} />

        {/* User + Logout */}
        <div style={{ padding: '14px 12px', flexShrink: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(201,169,110,0.1)',
              border: '1px solid rgba(201,169,110,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-cinzel), serif', fontSize: '0.78rem', color: 'var(--gold)',
            }}>A</div>
            {sidebarOpen && (
              <>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 500, color: '#111', margin: 0, lineHeight: 1 }}>{adminInfo?.role === 'superadmin' ? 'Super Admin' : 'Admin'}</p>
                  <p style={{ fontSize: '0.65rem', color: 'rgba(0,0,0,0.4)', margin: '3px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{adminInfo?.email ?? ''}</p>
                </div>
                <button onClick={handleLogout} title="Logout"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.35)', padding: 4, display: 'flex', flexShrink: 0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="admin-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh', marginLeft: sidebarOpen ? 230 : 60, transition: 'margin-left 0.3s ease' }}>

        {/* Top bar */}
        <header style={{
          display:       'flex',
          alignItems:    'center',
          gap:           16,
          padding:       '0 24px',
          height:        56,
          flexShrink:    0,
          position:      'sticky',
          top:           0,
          zIndex:        10,
          background:    'rgba(245,240,232,0.95)',
          backdropFilter:'blur(12px)',
          borderBottom:  '1px solid rgba(201,169,110,0.2)',
        }}>
          {/* Mobile hamburger */}
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--green)', display: 'flex' }}
            className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
            <span style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--green)', fontWeight: 500 }}>Admin</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'rgba(201,169,110,0.6)' }}><polyline points="9 18 15 12 9 6"/></svg>
            <span style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)' }}>{currentLabel}</span>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: '#e8e0d0',
              border: '1px solid rgba(201,169,110,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-cinzel), serif', fontSize: '0.78rem', color: 'var(--gold)',
            }}>A</div>
          </div>
        </header>

        <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>{children}</main>
      </div>

      <style>{`
        .-translate-x-full { transform: translateX(-100%); }
        .lg\\:hidden { display: flex; }
        @media (min-width: 1024px) {
          .lg\\:hidden { display: none !important; }
          .lg\\:translate-x-0 { transform: translateX(0) !important; }
          .-translate-x-full { transform: translateX(0); }
        }
        @media (max-width: 1023px) {
          .admin-main { margin-left: 0 !important; }
        }
        nav a:hover { color: var(--gold) !important; background: rgba(201,169,110,0.06) !important; }
        nav li:hover .sidebar-tooltip { opacity: 1 !important; }
        @media print {
          aside, header { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; }
          .admin-main { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  )
}
