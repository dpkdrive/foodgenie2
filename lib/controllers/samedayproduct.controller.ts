import { connectDB } from '../db'
import SameDayProduct, { SameDayProductStatus, DeliveryTiming } from '../models/SameDayProduct'

const isObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id)
const byId = (id: string) =>
  isObjectId(id)
    ? { $or: [{ productId: id }, { _id: id }] }
    : { productId: id }

/* ── List products ── */
export async function getAllProducts(query: {
  status?:  SameDayProductStatus
  timing?:  DeliveryTiming
  search?:  string
  page?:    number
  limit?:   number
  published?: boolean
}) {
  await connectDB()

  const {
    status,
    timing,
    search,
    page  = 1,
    limit = 50,
    published,
  } = query

  const filter: Record<string, any> = {}
  if (status)    filter.status = status
  if (published) filter.status = 'Published'
  if (timing)    filter.timing = timing
  if (search) {
    filter.$or = [
      { title:       { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { productId:   { $regex: search, $options: 'i' } },
    ]
  }

  const skip = (page - 1) * limit
  const [data, total] = await Promise.all([
    SameDayProduct.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    SameDayProduct.countDocuments(filter),
  ])

  return { data, total, page, totalPages: Math.ceil(total / limit) }
}

/* ── Get one product ── */
export async function getProductById(id: string) {
  await connectDB()
  const product = await SameDayProduct.findOne(byId(id))
  if (!product) throw new Error('Product not found')
  return product
}

/* ── Create product ── */
export async function createProduct(data: {
  title:        string
  description?: string
  price:        number
  image?:       string
  unit?:        string
  timing:       DeliveryTiming
  status?:      SameDayProductStatus
}) {
  await connectDB()
  return SameDayProduct.create({
    ...data,
    status: data.status ?? 'Draft',
  })
}

/* ── Update product ── */
export async function updateProduct(id: string, data: Partial<{
  title:       string
  description: string
  price:       number
  image:       string
  unit:        string
  timing:      DeliveryTiming
  status:      SameDayProductStatus
}>) {
  await connectDB()
  const product = await SameDayProduct.findOneAndUpdate(
    byId(id),
    { $set: data },
    { new: true, runValidators: true }
  )
  if (!product) throw new Error('Product not found')
  return product
}

/* ── Delete product ── */
export async function deleteProduct(id: string) {
  await connectDB()
  const product = await SameDayProduct.findOneAndDelete(byId(id))
  if (!product) throw new Error('Product not found')
  return { message: 'Product deleted' }
}
