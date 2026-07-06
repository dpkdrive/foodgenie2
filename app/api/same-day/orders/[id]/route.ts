import { NextRequest, NextResponse } from 'next/server'
import { getOrderById, updateOrderStatus, updatePaymentStatus, deleteOrder } from '@/lib/controllers/samedayorder.controller'
import { requireAuth } from '@/lib/auth'

type Ctx = { params: Promise<{ id: string }> }

/* GET /api/same-day/orders/:id */
export async function GET(req: NextRequest, ctx: Ctx) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  try {
    const { id } = await ctx.params
    const order  = await getOrderById(id)
    return NextResponse.json({ success: true, data: order })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 404 })
  }
}

/* PATCH /api/same-day/orders/:id — update status or paymentStatus */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  try {
    const { id }                    = await ctx.params
    const { status, paymentStatus } = await req.json()
    if (paymentStatus) {
      const order = await updatePaymentStatus(id, paymentStatus)
      return NextResponse.json({ success: true, data: order })
    }
    const order = await updateOrderStatus(id, status)
    return NextResponse.json({ success: true, data: order })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 })
  }
}

/* DELETE /api/same-day/orders/:id — admin only */
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  try {
    const { id } = await ctx.params
    const result = await deleteOrder(id)
    return NextResponse.json({ success: true, ...result })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 404 })
  }
}
