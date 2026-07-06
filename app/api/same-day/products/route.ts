import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, createProduct } from '@/lib/controllers/samedayproduct.controller'
import { requireAuth } from '@/lib/auth'

/* GET /api/same-day/products — public for published, admin for all */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const isAdmin = searchParams.get('admin') === 'true'

    const auth = isAdmin ? requireAuth(req) : null
    if (isAdmin && auth instanceof NextResponse) return auth

    const result = await getAllProducts({
      status:    isAdmin ? (searchParams.get('status') as any ?? undefined) : undefined,
      published: !isAdmin,
      timing:    searchParams.get('timing') as any ?? undefined,
      search:    searchParams.get('search') ?? undefined,
      page:      Number(searchParams.get('page') ?? 1),
      limit:     Number(searchParams.get('limit') ?? 50),
    })

    return NextResponse.json({ success: true, ...result })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

/* POST /api/same-day/products — admin only */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  try {
    const body    = await req.json()
    const product = await createProduct(body)
    return NextResponse.json({ success: true, data: product }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 })
  }
}
