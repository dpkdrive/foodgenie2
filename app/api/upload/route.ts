import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join, extname } from 'path'
import { requireAuth } from '@/lib/auth'
import { addBanner, updateBulkOrderImage } from '@/lib/controllers/settings.controller'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

type PackageKey = 'balancedFood' | 'lowCalories' | 'bespokePackage' | 'bulkOrderMenu'
const VALID_KEYS: PackageKey[] = ['balancedFood', 'lowCalories', 'bespokePackage', 'bulkOrderMenu']

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
const MAX_SIZE_MB   = 5

export async function POST(req: NextRequest) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth

  try {
    const formData   = await req.formData()
    const files      = formData.getAll('files') as File[]
    const packageKey = formData.get('packageKey') as PackageKey

    if (!VALID_KEYS.includes(packageKey))
      return NextResponse.json({ success: false, message: 'Invalid packageKey' }, { status: 400 })

    if (!files || files.length === 0)
      return NextResponse.json({ success: false, message: 'No files provided' }, { status: 400 })

    /* Ensure uploads dir exists */
    await mkdir(UPLOAD_DIR, { recursive: true })

    const uploaded: string[] = []

    for (const file of files) {
      /* Validate type */
      if (!ALLOWED_TYPES.includes(file.type))
        return NextResponse.json({ success: false, message: `Invalid file type: ${file.type}. Only JPG, PNG, WEBP allowed.` }, { status: 400 })

      /* Validate size */
      if (file.size > MAX_SIZE_MB * 1024 * 1024)
        return NextResponse.json({ success: false, message: `File too large. Max ${MAX_SIZE_MB}MB allowed.` }, { status: 400 })

      /* Unique filename: timestamp + random + original ext */
      const ext      = extname(file.name) || '.jpg'
      const filename = `${packageKey}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}${ext}`
      const filepath = join(UPLOAD_DIR, filename)

      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(filepath, buffer)

      const url = `/uploads/${filename}`
      uploaded.push(url)

      /* Save to MongoDB Settings */
      if (packageKey === 'bulkOrderMenu') {
        await updateBulkOrderImage(url, file.name, auth.id)
      } else {
        await addBanner(packageKey as 'balancedFood' | 'lowCalories' | 'bespokePackage', { url, altText: file.name, order: 0 }, auth.id)
      }
    }

    return NextResponse.json({ success: true, urls: uploaded })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
