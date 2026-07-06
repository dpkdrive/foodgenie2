'use client'
import { useEffect } from 'react'

export default function ScrollReveal() {
  useEffect(() => {
  const timeout = setTimeout(() => {
    const els = document.querySelectorAll('.rv')

    if (!els.length) return

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          obs.unobserve(e.target)
        }
      })
    }, { threshold: 0.1 })

    els.forEach(el => obs.observe(el))
  }, 200)

  return () => clearTimeout(timeout)
}, [])

  return null
}