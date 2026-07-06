'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const loginSchema = Yup.object({
  email:    Yup.string().email('Valid email address daalo').required('Email required hai'),
  password: Yup.string().min(6, 'Password kam se kam 6 characters ka hona chahiye').required('Password required hai'),
})

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [apiError, setApiError] = useState('')

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setLoading(true)
      setApiError('')
      // Simulate API call — replace with your real auth logic
      await new Promise(r => setTimeout(r, 1600))
      setLoading(false)
      // Demo: wrong password simulation
      if (values.password === 'wrong123') {
        setApiError('Email ya password galat hai. Dobara try karo.')
        return
      }
      setSuccess(true)
    },
  })

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col relative overflow-hidden">

      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{backgroundImage:'radial-gradient(circle at 80% 10%, rgba(176,125,58,0.10) 0%, transparent 50%), radial-gradient(circle at 10% 90%, rgba(48,61,43,0.08) 0%, transparent 50%)'}}/>

      {/* Decorative large letter */}
      <div className="pointer-events-none fixed top-1/2 right-[-60px] -translate-y-1/2 font-playfair text-[22rem] font-bold leading-none select-none z-0"
        style={{color:'rgba(48,61,43,0.04)'}}>G</div>


      {/* ── MAIN ── */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-[440px]">

          {/* Card */}
          <div className="bg-white border border-[var(--border)] rounded-[24px] shadow-[0_8px_48px_rgba(48,61,43,0.10)] overflow-hidden">

            {/* Card top strip */}
            <div className="h-1.5 w-full" style={{background:'linear-gradient(90deg,#303d2b,#b07d3a,#d4a055)'}}/>

            <div className="px-10 pt-9 pb-10">

                <>
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-[var(--green-pale)] border border-[rgba(48,61,43,0.18)] px-3.5 py-1.5 rounded-full text-[0.7rem] font-semibold text-[var(--green-mid)] uppercase tracking-[0.1em] mb-4">
                      ✦ Member Login
                    </div>
                    <h1 className="font-playfair text-[1.9rem] font-bold text-[var(--green)] leading-[1.1] tracking-[-0.02em]">
                      Welcome <em className="not-italic text-[var(--terracotta)]">Back</em>
                    </h1>
                    <p className="text-[0.84rem] text-[var(--text-muted)] mt-2 leading-[1.6]">
                     Login your account
                    </p>
                  </div>

                  {/* API Error */}
                  {apiError && (
                    <div className="mb-5 flex items-start gap-3 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3.5">
                      <span className="text-base flex-shrink-0 mt-0.5">⚠️</span>
                      <p className="text-[0.82rem] text-[#dc2626] leading-[1.6]">{apiError}</p>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-5">

                    {/* Email */}
                    <div>
                      <label className="block text-[0.75rem] font-semibold text-[var(--text-mid)] mb-1.5 tracking-[0.02em]">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-[0.9rem] pointer-events-none">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <rect x="2" y="4" width="20" height="16" rx="3"/>
                            <path d="M2 7l10 6 10-6"/>
                          </svg>
                        </div>
                        <input
                          id="email"
                          type="email"
                          placeholder="aapka@email.com"
                          autoComplete="email"
                          {...formik.getFieldProps('email')}
                          className={`w-full pl-10 pr-4 py-3.5 bg-[var(--cream)] border-[1.5px] rounded-xl outline-none font-inter text-[0.88rem] text-[var(--text)] transition-all placeholder:text-[var(--text-muted)]
                            ${formik.touched.email && formik.errors.email
                              ? 'border-[#ef4444] focus:border-[#ef4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
                              : 'border-[var(--border)] focus:border-[var(--green)] focus:shadow-[0_0_0_3px_rgba(48,61,43,0.08)] focus:bg-white'}`}
                        />
                      </div>
                      {formik.touched.email && formik.errors.email && (
                        <p className="mt-1.5 text-[0.74rem] text-[#ef4444] flex items-center gap-1">
                          <span>⚠</span> {formik.errors.email}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[0.75rem] font-semibold text-[var(--text-mid)] tracking-[0.02em]">
                          Password
                        </label>
                        <Link href="/forgot-password"
                          className="text-[0.74rem] text-[var(--gold)] font-medium no-underline transition-colors hover:text-[var(--gold-light)]">
                          Forget Pass?
                        </Link>
                      </div>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <rect x="3" y="11" width="18" height="11" rx="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                        </div>
                        <input
                          id="password"
                          type={showPass ? 'text' : 'password'}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          {...formik.getFieldProps('password')}
                          className={`w-full pl-10 pr-12 py-3.5 bg-[var(--cream)] border-[1.5px] rounded-xl outline-none font-inter text-[0.88rem] text-[var(--text)] transition-all placeholder:text-[var(--text-muted)]
                            ${formik.touched.password && formik.errors.password
                              ? 'border-[#ef4444] focus:border-[#ef4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
                              : 'border-[var(--border)] focus:border-[var(--green)] focus:shadow-[0_0_0_3px_rgba(48,61,43,0.08)] focus:bg-white'}`}
                        />
                        {/* Show/hide toggle */}
                        <button type="button" onClick={() => setShowPass(v => !v)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors hover:text-[var(--green)] p-1 rounded">
                          {showPass
                            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          }
                        </button>
                      </div>
                      {formik.touched.password && formik.errors.password && (
                        <p className="mt-1.5 text-[0.74rem] text-[#ef4444] flex items-center gap-1">
                          <span>⚠</span> {formik.errors.password}
                        </p>
                      )}
                    </div>

                    {/* Remember me */}
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <div className="relative flex-shrink-0">
                        <input type="checkbox" className="sr-only peer"/>
                        <div className="w-4.5 h-4.5 w-[18px] h-[18px] rounded-[5px] border-[1.5px] border-[var(--border)] bg-[var(--cream)] peer-checked:bg-[var(--green)] peer-checked:border-[var(--green)] transition-all"/>
                        <svg className="absolute inset-0 m-auto w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-[0.8rem] text-[var(--text-muted)] group-hover:text-[var(--text-mid)] transition-colors">Remind me?</span>
                    </label>

                    {/* Submit Button */}
                    <button type="submit" disabled={loading}
                      className="relative w-full py-4 rounded-xl font-bold text-[0.9rem] uppercase tracking-[0.06em] border-none cursor-pointer transition-all overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0 hover:-translate-y-0.5"
                      style={{background:'linear-gradient(135deg,#303d2b,#4a5e42)', color:'#fbf1e7', fontFamily:'Inter,sans-serif', boxShadow:'0 4px 20px rgba(48,61,43,0.25)'}}>
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          Logging in...
                        </span>
                      ) : 'Login'}
                    </button>

                  </form>

                  {/* Sign up link */}
                  <p className="text-center text-[0.82rem] text-[var(--text-muted)] mt-7">
                    Don't have an account?{' '}
                    <Link href="/#subscription" className="text-[var(--green)] font-semibold no-underline transition-colors hover:text-[var(--gold)]">
                      Purchase membership ✨
                    </Link>
                  </p>
                </>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-5 mt-6 flex-wrap">
            {['🔒 Secure Login'].map(b => (
              <span key={b} className="text-[0.72rem] text-[var(--text-muted)] font-medium">{b}</span>
            ))}
          </div>
        </div>
      </main>

    </div>
  )
}