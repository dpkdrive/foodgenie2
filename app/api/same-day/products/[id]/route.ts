import { NextRequest, NextResponse } from 'next/server'
import { getProductById, updateProduct, deleteProduct } from '@/lib/controllers/samedayproduct.controller'
import { requireAuth } from '@/lib/auth'

type Ctx = { params: Promise<{ id: string }> }

/* GET /api/same-day/products/:id */
export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params
    const product = await getProductById(id)
    return NextResponse.json({ success: true, data: product })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 404 })
  }
}

/* PATCH /api/same-day/products/:id — admin only */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  try {
    const { id } = await ctx.params
    const body    = await req.json()
    const product = await updateProduct(id, body)
    return NextResponse.json({ success: true, data: product })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 })
  }
}

/* DELETE /api/same-day/products/:id — admin only */
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  try {
    const { id }  = await ctx.params
    const result  = await deleteProduct(id)
    return NextResponse.json({ success: true, ...result })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 404 })
  }
}
