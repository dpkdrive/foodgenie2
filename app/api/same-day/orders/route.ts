import { NextRequest, NextResponse } from 'next/server'
import { getAllOrders, createOrder, getOrderStats } from '@/lib/controllers/samedayorder.controller'
import { requireAuth } from '@/lib/auth'

/* GET /api/same-day/orders — admin only */
export async function GET(req: NextRequest) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  try {
    const { searchParams } = new URL(req.url)

    if (searchParams.get('stats') === 'true') {
      const stats = await getOrderStats()
      return NextResponse.json({ success: true, data: stats })
    }

    const result = await getAllOrders({
      status:   searchParams.get('status') as any ?? undefined,
      search:   searchParams.get('search') ?? undefined,
      page:     Number(searchParams.get('page') ?? 1),
      limit:    Number(searchParams.get('limit') ?? 20),
      dateFrom: searchParams.get('dateFrom') ?? undefined,
      dateTo:   searchParams.get('dateTo') ?? undefined,
    })

    return NextResponse.json({ success: true, ...result })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

/* POST /api/same-day/orders — public (customer places order) */
export async function POST(req: NextRequest) {
  try {
    const body  = await req.json()
    const order = await createOrder(body)
    return NextResponse.json({ success: true, data: order }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 })
  }
}
