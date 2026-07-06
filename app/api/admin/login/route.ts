import { NextRequest, NextResponse } from 'next/server'
import { loginAdmin } from '@/lib/controllers/admin.controller'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password)
      return NextResponse.json({ success: false, message: 'Email and password are required.' }, { status: 400 })

    const result = await loginAdmin(email, password)
    return NextResponse.json({ success: true, ...result })

  } catch (err: any) {
    const status = err.message === 'Invalid email or password' ? 401 : 500
    const message = status === 500 ? 'Server error. Please try again.' : err.message
    return NextResponse.json({ success: false, message }, { status })
  }
}
