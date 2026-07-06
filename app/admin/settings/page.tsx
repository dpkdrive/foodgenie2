'use client'
import { useState, useRef, useEffect } from 'react'
import { authHeaders, getToken } from '@/lib/client-auth'

const PACKAGES = [
  { key: 'balancedFood',   label: 'Balanced Food' },
  { key: 'lowCalories',    label: 'Low Calories' },
  { key: 'bespokePackage', label: 'Bespoke Package' },
]

const SOCIAL_FIELDS = [
  { key: 'facebook',  label: 'Facebook',    placeholder: 'https://facebook.com/foodgenie' },
  { key: 'instagram', label: 'Instagram',   placeholder: 'https://instagram.com/foodgenie' },
  { key: 'youtube',   label: 'YouTube',     placeholder: 'https://youtube.com/@foodgenie' },
  { key: 'twitter',   label: 'Twitter / X', placeholder: 'https://twitter.com/foodgenie' },
]

const gold  = '#c9a96e'
const green = '#2d4a28'

type BannerMap  = Record<string, string[]>
type SocialMap  = Record<string, string>

export default function SettingsPage() {
  /* ── banners ── */
  const [banners,   setBanners]   = useState<BannerMap>({})
  const [uploading, setUploading] = useState<string | null>(null)
  const [uploadErr, setUploadErr] = useState<string | null>(null)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  /* ── password ── */
  const [curPass,     setCurPass]     = useState('')
  const [newPass,     setNewPass]     = useState('')
  const [confPass,    setConfPass]    = useState('')
  const [passMsg,     setPassMsg]     = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [passLoading, setPassLoading] = useState(false)

  /* ── social ── */
  const [social,        setSocial]        = useState<SocialMap>({})
  const [socialMsg,     setSocialMsg]     = useState<string | null>(null)
  const [socialLoading, setSocialLoading] = useState(false)

  /* ── bulk order image ── */
  const [bulkImg,        setBulkImg]        = useState('')
  const [bulkUploading,  setBulkUploading]  = useState(false)
  const [bulkErr,        setBulkErr]        = useState<string | null>(null)
  const bulkFileRef = useRef<HTMLInputElement | null>(null)

  /* ── service area ── */
  const [area,        setArea]        = useState({ enabled: true, lat: '', lng: '', radiusKm: '5', bespokeRadiusKm: '10', label: '', overAreaPricePerKm: '10' })
  const [areaMsg,     setAreaMsg]     = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [areaLoading, setAreaLoading] = useState(false)
  const [detecting,   setDetecting]   = useState(false)

  /* Load banners + social + serviceArea from DB on mount */
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(({ data }) => {
        if (!data) return
        const bMap: BannerMap = {}
        if (data.banners) {
          Object.entries(data.banners).forEach(([pkg, list]: [string, any]) => {
            if (Array.isArray(list) && list.length > 0)
              bMap[pkg] = list.map((b: any) => b.url ?? b)
          })
        }
        setBanners(bMap)
        if (data.socialLinks)   setSocial(data.socialLinks)
        if (data.bulkOrderImage?.url) setBulkImg(data.bulkOrderImage.url)
        if (data.serviceArea) setArea({
          enabled:            data.serviceArea.enabled ?? true,
          lat:                String(data.serviceArea.lat ?? ''),
          lng:                String(data.serviceArea.lng ?? ''),
          radiusKm:           String(data.serviceArea.radiusKm ?? '5'),
          bespokeRadiusKm:    String(data.serviceArea.bespokeRadiusKm ?? '10'),
          label:              data.serviceArea.label ?? '',
          overAreaPricePerKm: String(data.serviceArea.overAreaPricePerKm ?? '10'),
        })
      })
      .catch(() => {})
  }, [])

  /* ── Banner upload → /api/upload → public/uploads ── */
  const handleBannerChange = async (key: string, files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(key)
    setUploadErr(null)

    try {
      const form = new FormData()
      form.append('packageKey', key)
      Array.from(files).forEach(f => form.append('files', f))

      const res  = await fetch('/api/upload', {
        method:  'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body:    form,
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setUploadErr(data.message ?? 'Upload failed.')
        return
      }

      /* Append new URLs to state */
      setBanners(prev => ({
        ...prev,
        [key]: [...(prev[key] ?? []), ...data.urls],
      }))
    } catch {
      setUploadErr('Server error during upload.')
    } finally {
      setUploading(null)
    }
  }

  /* ── Remove banner (from DB + state) ── */
  const removeImage = async (key: string, url: string, idx: number) => {
    try {
      await fetch('/api/settings/banners', {
        method:  'DELETE',
        headers: authHeaders(),
        body:    JSON.stringify({ packageKey: key, url }),
      })
    } catch {}
    setBanners(prev => {
      const next = { ...prev, [key]: prev[key].filter((_, i) => i !== idx) }
      if (!next[key].length) delete next[key]
      return next
    })
  }

  /* ── Bulk order image upload ── */
  const [bulkMsg, setBulkMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const handleBulkUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setBulkUploading(true)
    setBulkErr(null)
    setBulkMsg(null)
    try {
      const form = new FormData()
      form.append('packageKey', 'bulkOrderMenu')
      form.append('files', files[0])
      const res  = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${getToken()}` }, body: form })
      const data = await res.json()
      if (!res.ok || !data.success) { setBulkErr(data.message ?? 'Upload failed.'); return }
      setBulkImg(data.urls[0])
      setBulkMsg({ type: 'ok', text: 'Image saved successfully.' })
      setTimeout(() => setBulkMsg(null), 3000)
    } catch {
      setBulkErr('Server error during upload.')
    } finally {
      setBulkUploading(false)
    }
  }

  const handleBulkRemove = async () => {
    setBulkMsg(null)
    try {
      const res  = await fetch('/api/settings', { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ type: 'removeBulkOrder' }) })
      const data = await res.json()
      if (data.success) {
        setBulkImg('')
        setBulkMsg({ type: 'ok', text: 'Image removed.' })
        setTimeout(() => setBulkMsg(null), 3000)
      }
    } catch {}
  }

  /* ── Password change ── */
  const handlePasswordSave = async () => {
    setPassMsg(null)
    if (!curPass || !newPass || !confPass) { setPassMsg({ type: 'err', text: 'All fields are required.' }); return }
    if (newPass.length < 6)               { setPassMsg({ type: 'err', text: 'New password must be at least 6 characters.' }); return }
    if (newPass !== confPass)             { setPassMsg({ type: 'err', text: 'New passwords do not match.' }); return }

    setPassLoading(true)
    try {
      const res  = await fetch('/api/admin', {
        method:  'PATCH',
        headers: authHeaders(),
        body:    JSON.stringify({ currentPassword: curPass, newPassword: newPass }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setPassMsg({ type: 'err', text: data.message ?? 'Failed to update password.' })
      } else {
        setCurPass(''); setNewPass(''); setConfPass('')
        setPassMsg({ type: 'ok', text: 'Password updated successfully.' })
      }
    } catch {
      setPassMsg({ type: 'err', text: 'Server error. Please try again.' })
    } finally {
      setPassLoading(false)
    }
  }

  /* ── Social links ── */
  const handleSocialSave = async () => {
    setSocialLoading(true)
    try {
      const res  = await fetch('/api/settings', {
        method:  'PATCH',
        headers: authHeaders(),
        body:    JSON.stringify({ type: 'social', ...social }),
      })
      const data = await res.json()
      setSocialMsg(data.success ? 'Social media links saved.' : (data.message ?? 'Failed to save.'))
    } catch {
      setSocialMsg('Server error. Please try again.')
    } finally {
      setSocialLoading(false)
      setTimeout(() => setSocialMsg(null), 3000)
    }
  }

  /* ── Service area save ── */
  const handleAreaSave = async () => {
    setAreaMsg(null)
    const lat = parseFloat(area.lat)
    const lng = parseFloat(area.lng)
    const radiusKm = parseFloat(area.radiusKm)
    if (area.enabled && (isNaN(lat) || isNaN(lng))) {
      setAreaMsg({ type: 'err', text: 'Valid latitude and longitude are required.' }); return
    }
    if (isNaN(radiusKm) || radiusKm <= 0) {
      setAreaMsg({ type: 'err', text: 'Radius must be a positive number.' }); return
    }
    const bespokeRadiusKm = parseFloat(area.bespokeRadiusKm)
    if (isNaN(bespokeRadiusKm) || bespokeRadiusKm <= 0) {
      setAreaMsg({ type: 'err', text: 'Bespoke radius must be a positive number.' }); return
    }
    const overAreaPricePerKm = parseFloat(area.overAreaPricePerKm)
    if (isNaN(overAreaPricePerKm) || overAreaPricePerKm < 0) {
      setAreaMsg({ type: 'err', text: 'Over area price must be a valid number.' }); return
    }
    setAreaLoading(true)
    try {
      const res  = await fetch('/api/settings', {
        method:  'PATCH',
        headers: authHeaders(),
        body:    JSON.stringify({ type: 'serviceArea', enabled: area.enabled, lat, lng, radiusKm, bespokeRadiusKm, label: area.label, overAreaPricePerKm }),
      })
      const data = await res.json()
      setAreaMsg(data.success
        ? { type: 'ok',  text: 'Service area saved.' }
        : { type: 'err', text: data.message ?? 'Failed to save.' })
    } catch {
      setAreaMsg({ type: 'err', text: 'Server error.' })
    } finally {
      setAreaLoading(false)
      setTimeout(() => setAreaMsg(null), 3000)
    }
  }

  /* ── Detect current location for admin convenience ── */
  const handleDetectLocation = () => {
    if (!navigator.geolocation) return
    setDetecting(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setArea(a => ({ ...a, lat: String(pos.coords.latitude.toFixed(6)), lng: String(pos.coords.longitude.toFixed(6)) }))
        setDetecting(false)
      },
      () => { setDetecting(false) }
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 720 }}>

      {/* Page title */}
      <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111', margin: '0 0 3px', fontFamily: 'var(--font-cinzel), serif', letterSpacing: '0.04em' }}>Settings</h1>
        <p style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.4)', margin: 0 }}>Manage banners, password and social links</p>
      </div>

      {/* ── 1. BANNERS ── */}
      <section style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>Package Banners</p>
          <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)' }}>
            Saved to <code style={{ background: '#f3f4f6', padding: '1px 6px', borderRadius: 4, fontSize: '0.72rem' }}>public/uploads/</code>
          </p>
        </div>

        {uploadErr && (
          <div style={{ margin: '12px 24px 0', padding: '10px 14px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, fontSize: '0.8rem', color: '#dc2626' }}>
            ⚠ {uploadErr}
          </div>
        )}

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {PACKAGES.map(pkg => {
            const imgs = banners[pkg.key] ?? []
            return (
              <div key={pkg.key} style={{ paddingBottom: 24, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', color: '#111' }}>{pkg.label}</p>
                    <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'rgba(0,0,0,0.4)' }}>{imgs.length} image{imgs.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <input
                      type="file" accept="image/*" multiple
                      ref={el => { fileRefs.current[pkg.key] = el }}
                      style={{ display: 'none' }}
                      onChange={e => { handleBannerChange(pkg.key, e.target.files); e.target.value = '' }}
                    />
                    <button
                      onClick={() => fileRefs.current[pkg.key]?.click()}
                      disabled={uploading === pkg.key}
                      style={{
                        padding: '8px 20px', borderRadius: 7, border: `1.5px solid ${gold}`,
                        background: uploading === pkg.key ? 'rgba(201,169,110,0.1)' : gold,
                        color: uploading === pkg.key ? gold : '#fff',
                        fontSize: '0.78rem', fontWeight: 600, cursor: uploading === pkg.key ? 'not-allowed' : 'pointer',
                      }}>
                      {uploading === pkg.key ? 'Uploading...' : '+ Add Images'}
                    </button>
                  </div>
                </div>

                {imgs.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px,1fr))', gap: 10 }}>
                    {imgs.map((src, idx) => (
                      <div key={idx} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', aspectRatio: '4/3', border: '1px solid rgba(0,0,0,0.08)' }}>
                        <img src={src} alt={`${pkg.label} ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        <button
                          onClick={() => removeImage(pkg.key, src, idx)}
                          style={{
                            position: 'absolute', top: 5, right: 5,
                            width: 22, height: 22, borderRadius: '50%',
                            background: 'rgba(0,0,0,0.6)', border: 'none',
                            color: '#fff', fontSize: '0.7rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>✕</button>
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.35)', padding: '3px 6px', fontSize: '0.6rem', color: '#fff' }}>
                          #{idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ border: '1.5px dashed rgba(0,0,0,0.12)', borderRadius: 10, padding: '28px 0', textAlign: 'center', background: '#fafafa' }}>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(0,0,0,0.3)' }}>No images · click "Add Images" to upload</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 2. BULK ORDER MENU IMAGE ── */}
      <section style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>Bulk Order Menu</p>
          <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)' }}>
            Image shown on the Bulk Order page — click to upload a new one
          </p>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {bulkErr && (
            <div style={{ padding: '10px 14px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, fontSize: '0.8rem', color: '#dc2626' }}>
              ⚠ {bulkErr}
            </div>
          )}

          {bulkMsg && (
            <div style={{
              padding: '10px 14px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 500,
              background: bulkMsg.type === 'ok' ? '#dcfce7' : '#fee2e2',
              color:      bulkMsg.type === 'ok' ? '#16a34a' : '#dc2626',
              border:     `1px solid ${bulkMsg.type === 'ok' ? '#86efac' : '#fca5a5'}`,
            }}>{bulkMsg.text}</div>
          )}

          {bulkImg ? (
            <div style={{ maxWidth: 420 }}>
              <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', marginBottom: 12 }}>
                <img src={bulkImg} alt="Bulk Order Menu" style={{ width: '100%', display: 'block', objectFit: 'contain', maxHeight: 320 }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => bulkFileRef.current?.click()}
                  disabled={bulkUploading}
                  style={{ padding: '8px 20px', borderRadius: 7, border: `1.5px solid ${gold}`, background: gold, color: '#fff', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                  {bulkUploading ? 'Uploading...' : 'Replace Image'}
                </button>
                <button
                  onClick={handleBulkRemove}
                  style={{ padding: '8px 20px', borderRadius: 7, border: '1.5px solid #fca5a5', background: '#fff', color: '#dc2626', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => bulkFileRef.current?.click()}
              style={{ border: '1.5px dashed rgba(0,0,0,0.15)', borderRadius: 10, padding: '40px 0', textAlign: 'center', background: '#fafafa', cursor: 'pointer' }}>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(0,0,0,0.4)' }}>
                {bulkUploading ? 'Uploading...' : 'Click to upload Bulk Order Menu image'}
              </p>
            </div>
          )}

          <input
            type="file" accept="image/*"
            ref={bulkFileRef}
            style={{ display: 'none' }}
            onChange={e => { handleBulkUpload(e.target.files); e.target.value = '' }}
          />

          {!bulkImg && (
            <button
              onClick={() => bulkFileRef.current?.click()}
              disabled={bulkUploading}
              style={{ alignSelf: 'flex-start', padding: '9px 22px', borderRadius: 8, border: `1.5px solid ${gold}`, background: gold, color: '#fff', fontSize: '0.78rem', fontWeight: 600, cursor: bulkUploading ? 'not-allowed' : 'pointer' }}>
              {bulkUploading ? 'Uploading...' : '+ Upload Image'}
            </button>
          )}
        </div>
      </section>

      {/* ── 3. PASSWORD ── */}
      <section style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>Change Password</p>
          <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)' }}>Update your admin login password</p>
        </div>
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {passMsg && (
            <div style={{
              padding: '10px 14px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 500,
              background: passMsg.type === 'ok' ? '#dcfce7' : '#fee2e2',
              color:      passMsg.type === 'ok' ? '#16a34a' : '#dc2626',
              border:     `1px solid ${passMsg.type === 'ok' ? '#86efac' : '#fca5a5'}`,
            }}>{passMsg.text}</div>
          )}
          {[
            { label: 'Current Password', val: curPass,  set: setCurPass  },
            { label: 'New Password',     val: newPass,  set: setNewPass  },
            { label: 'Confirm Password', val: confPass, set: setConfPass },
          ].map(f => (
            <div key={f.label}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(0,0,0,0.5)', marginBottom: 6 }}>{f.label}</label>
              <input
                type="password" value={f.val} onChange={e => f.set(e.target.value)}
                style={{ width: '100%', padding: '9px 14px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', color: '#111' }}
              />
            </div>
          ))}
          <button onClick={handlePasswordSave} disabled={passLoading}
            style={{ alignSelf: 'flex-start', padding: '10px 24px', borderRadius: 8, border: 'none', background: passLoading ? '#aaa' : green, color: '#fff', fontSize: '0.82rem', fontWeight: 600, cursor: passLoading ? 'not-allowed' : 'pointer', letterSpacing: '0.03em' }}>
            {passLoading ? 'Saving...' : 'Save Password'}
          </button>
        </div>
      </section>

      {/* ── 4. SOCIAL MEDIA ── */}
      <section style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>Social Media Links</p>
          <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)' }}>These links appear in the website footer</p>
        </div>
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {socialMsg && (
            <div style={{ padding: '10px 14px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 500, background: '#dcfce7', color: '#16a34a', border: '1px solid #86efac' }}>{socialMsg}</div>
          )}
          {SOCIAL_FIELDS.map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(0,0,0,0.5)', marginBottom: 6 }}>{f.label}</label>
              <input
                type="url" value={social[f.key] ?? ''} placeholder={f.placeholder}
                onChange={e => setSocial(s => ({ ...s, [f.key]: e.target.value }))}
                style={{ width: '100%', padding: '9px 14px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', color: '#111' }}
              />
            </div>
          ))}
          <button onClick={handleSocialSave} disabled={socialLoading}
            style={{ alignSelf: 'flex-start', padding: '10px 24px', borderRadius: 8, border: 'none', background: socialLoading ? '#aaa' : green, color: '#fff', fontSize: '0.82rem', fontWeight: 600, cursor: socialLoading ? 'not-allowed' : 'pointer', letterSpacing: '0.03em' }}>
            {socialLoading ? 'Saving...' : 'Save Links'}
          </button>
        </div>
      </section>

      {/* ── 5. SERVICE AREA ── */}
      <section style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>Service Area</p>
            <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)' }}>Only allow bookings within this radius</p>
          </div>
          {/* Enable toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.5)', fontWeight: 600 }}>{area.enabled ? 'Enabled' : 'Disabled'}</span>
            <div
              onClick={() => setArea(a => ({ ...a, enabled: !a.enabled }))}
              style={{
                width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
                background: area.enabled ? green : '#d1d5db',
                position: 'relative', transition: 'background 0.2s',
              }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 3,
                left: area.enabled ? 23 : 3,
                transition: 'left 0.2s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }} />
            </div>
          </label>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, opacity: area.enabled ? 1 : 0.45, pointerEvents: area.enabled ? 'auto' : 'none' }}>
          {areaMsg && (
            <div style={{
              padding: '10px 14px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 500,
              background: areaMsg.type === 'ok' ? '#dcfce7' : '#fee2e2',
              color:      areaMsg.type === 'ok' ? '#16a34a' : '#dc2626',
              border:     `1px solid ${areaMsg.type === 'ok' ? '#86efac' : '#fca5a5'}`,
            }}>{areaMsg.text}</div>
          )}

          {/* Label */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(0,0,0,0.5)', marginBottom: 6 }}>
              Location Label <span style={{ fontWeight: 400, opacity: 0.6 }}>(shown to customers)</span>
            </label>
            <input
              type="text" value={area.label} placeholder="e.g. Sector 18, Noida"
              onChange={e => setArea(a => ({ ...a, label: e.target.value }))}
              style={{ width: '100%', padding: '9px 14px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', color: '#111' }}
            />
          </div>

          {/* Lat / Lng */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(0,0,0,0.5)', marginBottom: 6 }}>Latitude</label>
              <input
                type="number" step="any" value={area.lat} placeholder="28.613939"
                onChange={e => setArea(a => ({ ...a, lat: e.target.value }))}
                style={{ width: '100%', padding: '9px 14px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', color: '#111' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(0,0,0,0.5)', marginBottom: 6 }}>Longitude</label>
              <input
                type="number" step="any" value={area.lng} placeholder="77.209023"
                onChange={e => setArea(a => ({ ...a, lng: e.target.value }))}
                style={{ width: '100%', padding: '9px 14px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', color: '#111' }}
              />
            </div>
          </div>

          {/* Auto-detect button */}
          <button onClick={handleDetectLocation} disabled={detecting}
            style={{ alignSelf: 'flex-start', padding: '8px 18px', borderRadius: 8, border: `1.5px solid ${gold}`, background: '#fff', color: gold, fontSize: '0.78rem', fontWeight: 600, cursor: detecting ? 'not-allowed' : 'pointer' }}>
            {detecting ? 'Detecting...' : 'Use My Current Location'}
          </button>

          {/* Free Delivery Radius */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(0,0,0,0.5)', marginBottom: 6 }}>
              Free Delivery Radius — <span style={{ color: gold, fontWeight: 700 }}>{area.radiusKm} km</span>
            </label>
            <input
              type="range" min="1" max="50" step="0.5"
              value={area.radiusKm}
              onChange={e => setArea(a => ({ ...a, radiusKm: e.target.value }))}
              style={{ width: '100%', accentColor: gold }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(0,0,0,0.35)', marginTop: 4 }}>
              <span>1 km</span><span>50 km</span>
            </div>
          </div>

          {/* Bespoke Delivery Radius */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(0,0,0,0.5)', marginBottom: 6 }}>
              Bespoke Delivery Radius — <span style={{ color: '#7c3aed', fontWeight: 700 }}>{area.bespokeRadiusKm} km</span>
            </label>
            <input
              type="range" min="1" max="100" step="0.5"
              value={area.bespokeRadiusKm}
              onChange={e => setArea(a => ({ ...a, bespokeRadiusKm: e.target.value }))}
              style={{ width: '100%', accentColor: '#7c3aed' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(0,0,0,0.35)', marginTop: 4 }}>
              <span>1 km</span><span>100 km</span>
            </div>
            <p style={{ margin: '5px 0 0', fontSize: '0.72rem', color: 'rgba(0,0,0,0.35)' }}>
              Bespoke (Bride to be) plan only delivers within this radius. Outside = Not Deliverable.
            </p>
          </div>

          {/* Over area price */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(0,0,0,0.5)', marginBottom: 6 }}>
              Over Area Delivery Price <span style={{ fontWeight: 400 }}>(₹ per km beyond free radius)</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.4)', fontWeight: 600 }}>₹</span>
              <input
                type="number" min="0" step="1"
                value={area.overAreaPricePerKm}
                onChange={e => setArea(a => ({ ...a, overAreaPricePerKm: e.target.value }))}
                style={{ width: 120, padding: '9px 14px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.85rem', outline: 'none', color: '#111' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)' }}>per km</span>
            </div>
            <p style={{ margin: '5px 0 0', fontSize: '0.72rem', color: 'rgba(0,0,0,0.35)' }}>
              Customers outside the free radius will be charged ₹{area.overAreaPricePerKm}/km × extra distance
            </p>
          </div>

          <button onClick={handleAreaSave} disabled={areaLoading}
            style={{ alignSelf: 'flex-start', padding: '10px 24px', borderRadius: 8, border: 'none', background: areaLoading ? '#aaa' : green, color: '#fff', fontSize: '0.82rem', fontWeight: 600, cursor: areaLoading ? 'not-allowed' : 'pointer' }}>
            {areaLoading ? 'Saving...' : 'Save Service Area'}
          </button>
        </div>
      </section>

    </div>
  )
}
