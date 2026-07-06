'use client'
import { usePathname } from 'next/navigation'
import WhatsAppWidget from './WhatsappWidget'

export default function WhatsAppWidgetWrapper() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return <WhatsAppWidget />
}
