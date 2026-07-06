"use client"
import { usePathname } from 'next/navigation'
import React from 'react'
import Navbar from '../components/Navbar'
import Image from 'next/image'
import Link from 'next/link'
import Footer from '../components/Footer'

function SafeProvider({children}) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <div>
      {!isAdmin && <Navbar />}
      <div>{children}</div>

      {!isAdmin && (
        <Footer />
      )}
    </div>
  )
}

export default SafeProvider