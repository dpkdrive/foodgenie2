import { Cinzel, Cormorant_Garamond, Jost } from 'next/font/google'
import Loading from '../components/Loader'
import WhatsAppWidgetWrapper from '../components/WhatsAppWidgetWrapper'
import './globals.css'
import SafeProvider from './SafeProvider'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
})


const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata = {
  title: 'FoodGenie — Culinary Magic, Delivered',
  description: 'Home-style, handcrafted recipes turned into extraordinary meals.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning
      className={`${cinzel.variable} ${cormorant.variable} ${jost.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Tiro+Devanagari+Hindi:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SafeProvider>
          <Loading />
          <WhatsAppWidgetWrapper />
          {children}
        </SafeProvider>
      </body>
    </html>
  )
}
