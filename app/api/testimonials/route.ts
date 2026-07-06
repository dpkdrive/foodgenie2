import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Testimonial from '@/lib/models/Testimonial'

/* GET /api/testimonials — public */
export async function GET() {
  try {
    await connectDB()
    const list = await Testimonial.find({ active: true }).sort({ order: 1, createdAt: 1 }).lean()
    return NextResponse.json({ success: true, data: list })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

/* POST /api/testimonials — admin only */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  try {
    await connectDB()
    const body = await req.json()
    const t = await Testimonial.create(body)
    return NextResponse.json({ success: true, data: t }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 })
  }
}
