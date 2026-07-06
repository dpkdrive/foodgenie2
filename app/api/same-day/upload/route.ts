import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join, extname } from 'path'
import { requireAuth } from '@/lib/auth'

const UPLOAD_DIR    = join(process.cwd(), 'public', 'uploads')
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
const MAX_SIZE_MB   = 5

export async function POST(req: NextRequest) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth

  try {
    const formData = await req.formData()
    const file     = formData.get('file') as File | null

    if (!file)
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 })

    if (!ALLOWED_TYPES.includes(file.type))
      return NextResponse.json({ success: false, message: `Invalid file type. Only JPG, PNG, WEBP allowed.` }, { status: 400 })

    if (file.size > MAX_SIZE_MB * 1024 * 1024)
      return NextResponse.json({ success: false, message: `File too large. Max ${MAX_SIZE_MB}MB.` }, { status: 400 })

    await mkdir(UPLOAD_DIR, { recursive: true })

    const ext      = extname(file.name) || '.jpg'
    const filename = `sameday-${Date.now()}-${Math.random().toString(36).slice(2, 7)}${ext}`
    const filepath = join(UPLOAD_DIR, filename)

    await writeFile(filepath, Buffer.from(await file.arrayBuffer()))

    return NextResponse.json({ success: true, url: `/uploads/${filename}` })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
