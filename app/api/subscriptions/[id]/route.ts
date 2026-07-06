import { NextRequest, NextResponse } from 'next/server'
import {
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  updateStatus,
} from '@/lib/controllers/subscription.controller'
import { requireAuth } from '@/lib/auth'

type Ctx = { params: Promise<{ id: string }> }

/* GET /api/subscriptions/:id */
export async function GET(req: NextRequest, ctx: Ctx) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  try {
    const { id } = await ctx.params
    const sub = await getSubscriptionById(id)
    return NextResponse.json({ success: true, data: sub })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 404 })
  }
}

/* PATCH /api/subscriptions/:id — update fields or status */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  try {
    const { id } = await ctx.params
    const body = await req.json()

    if (body.status && Object.keys(body).length === 1) {
      const sub = await updateStatus(id, body.status)
      return NextResponse.json({ success: true, data: sub })
    }

    const sub = await updateSubscription(id, body)
    return NextResponse.json({ success: true, data: sub })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 })
  }
}

/* DELETE /api/subscriptions/:id */
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  if (auth.role !== 'superadmin')
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  try {
    const { id } = await ctx.params
    const result = await deleteSubscription(id)
    return NextResponse.json({ success: true, ...result })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 404 })
  }
}
