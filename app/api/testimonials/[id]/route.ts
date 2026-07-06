import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Testimonial from '@/lib/models/Testimonial'

/* PATCH /api/testimonials/[id] — admin only */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  try {
    await connectDB()
    const body = await req.json()
    const t = await Testimonial.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })
    if (!t) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: t })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 })
  }
}

/* DELETE /api/testimonials/[id] — admin only */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  try {
    await connectDB()
    const t = await Testimonial.findByIdAndDelete(params.id)
    if (!t) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
