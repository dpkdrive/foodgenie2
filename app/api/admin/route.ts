import { NextRequest, NextResponse } from 'next/server'
import { getAllAdmins, createAdmin, changePassword } from '@/lib/controllers/admin.controller'
import { requireAuth } from '@/lib/auth'

/* GET /api/admin — list all admins */
export async function GET(req: NextRequest) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  if (auth.role !== 'superadmin')
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  try {
    const admins = await getAllAdmins()
    return NextResponse.json({ success: true, data: admins })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

/* POST /api/admin — create admin */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  if (auth.role !== 'superadmin')
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  try {
    const body = await req.json()
    const admin = await createAdmin(body)
    return NextResponse.json({ success: true, data: admin }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 })
  }
}

/* PATCH /api/admin — change own password */
export async function PATCH(req: NextRequest) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  try {
    const { currentPassword, newPassword } = await req.json()
    const result = await changePassword(auth.id, currentPassword, newPassword)
    return NextResponse.json({ success: true, ...result })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 })
  }
}
