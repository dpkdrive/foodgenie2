import { NextRequest, NextResponse } from 'next/server'
import { getAllSubscriptions, createSubscription, getStats, getMonthlyStats } from '@/lib/controllers/subscription.controller'
import { requireAuth } from '@/lib/auth'

/* GET /api/subscriptions — list with filter/search/sort/pagination */
export async function GET(req: NextRequest) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  try {
    const { searchParams } = new URL(req.url)
    const query = {
      status:    searchParams.get('status')    as any ?? undefined,
      planType:  searchParams.get('planType')  as any ?? undefined,
      search:    searchParams.get('search')    ?? undefined,
      sortBy:    searchParams.get('sortBy')    ?? 'createdAt',
      order:     (searchParams.get('order')    ?? 'desc') as 'asc' | 'desc',
      page:      Number(searchParams.get('page')  ?? 1),
      limit:     Number(searchParams.get('limit') ?? 20),
      dateFrom:  searchParams.get('dateFrom')  ?? undefined,
      dateTo:    searchParams.get('dateTo')    ?? undefined,
      dateField: (searchParams.get('dateField') ?? 'startDate') as 'startDate' | 'createdAt',
    }

    /* monthly=true → return monthly breakdown for charts */
    if (searchParams.get('monthly') === 'true') {
      const data = await getMonthlyStats({
        dateFrom:  query.dateFrom,
        dateTo:    query.dateTo,
        dateField: query.dateField,
      })
      return NextResponse.json({ success: true, data })
    }

    /* stats=true → return dashboard stats instead */
    if (searchParams.get('stats') === 'true') {
      const stats = await getStats({
        dateFrom:  query.dateFrom,
        dateTo:    query.dateTo,
        dateField: query.dateField,
      })
      return NextResponse.json({ success: true, data: stats })
    }

    const result = await getAllSubscriptions(query)
    return NextResponse.json({ success: true, ...result })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

/* POST /api/subscriptions — create new subscription */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const sub  = await createSubscription(body)
    return NextResponse.json({ success: true, data: sub }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 })
  }
}
