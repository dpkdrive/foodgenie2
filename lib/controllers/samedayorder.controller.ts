import { connectDB } from '../db'
import SameDayOrder, { SameDayOrderStatus } from '../models/SameDayOrder'

const isObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id)
const byId = (id: string) =>
  isObjectId(id)
    ? { $or: [{ orderId: id }, { _id: id }] }
    : { orderId: id }

/* ── List orders ── */
export async function getAllOrders(query: {
  status?:  SameDayOrderStatus
  search?:  string
  page?:    number
  limit?:   number
  dateFrom?: string
  dateTo?:   string
}) {
  await connectDB()

  const {
    status,
    search,
    page  = 1,
    limit = 20,
    dateFrom,
    dateTo,
  } = query

  const filter: Record<string, any> = {}
  if (status) filter.status = status
  if (search) {
    filter.$or = [
      { 'customer.name':  { $regex: search, $options: 'i' } },
      { 'customer.phone': { $regex: search, $options: 'i' } },
      { orderId:          { $regex: search, $options: 'i' } },
    ]
  }
  if (dateFrom || dateTo) {
    filter.createdAt = {}
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom)
    if (dateTo)   filter.createdAt.$lte = new Date(dateTo + 'T23:59:59.999Z')
  }

  const skip = (page - 1) * limit
  const [data, total] = await Promise.all([
    SameDayOrder.find(filter)
      .populate('items.productId', 'title image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    SameDayOrder.countDocuments(filter),
  ])

  return { data, total, page, totalPages: Math.ceil(total / limit) }
}

/* ── Get single order ── */
export async function getOrderById(id: string) {
  await connectDB()
  const order = await SameDayOrder.findOne(byId(id)).populate('items.productId', 'title image timing')
  if (!order) throw new Error('Order not found')
  return order
}

/* ── Place order ── */
export async function createOrder(data: {
  customer:  { name: string; phone: string; email?: string; address: string; lat?: number; lng?: number }
  items:     { productId: string; productRef: string; title: string; price: number; quantity: number; subtotal: number }[]
  timing:    string
  subtotal:  number
  deliveryFee?: number
  total:     number
  paymentMethod?: string
  transactionId?: string
  notes?:    string
}) {
  await connectDB()
  return SameDayOrder.create({
    ...data,
    deliveryFee:   data.deliveryFee ?? 0,
    paymentMethod: data.paymentMethod ?? 'Online',
    paymentStatus: 'Pending',
    status:        'Pending',
  })
}

/* ── Accept order (admin) ── */
export async function acceptOrder(id: string, adminId: string) {
  await connectDB()
  const order = await SameDayOrder.findOneAndUpdate(
    byId(id),
    { $set: { status: 'Accepted', acceptedBy: adminId, acceptedAt: new Date() } },
    { new: true }
  )
  if (!order) throw new Error('Order not found')
  return order
}

/* ── Update order status ── */
export async function updateOrderStatus(id: string, status: SameDayOrderStatus) {
  await connectDB()
  const order = await SameDayOrder.findOneAndUpdate(
    byId(id),
    { $set: { status } },
    { new: true }
  )
  if (!order) throw new Error('Order not found')
  return order
}

/* ── Update payment status ── */
export async function updatePaymentStatus(id: string, paymentStatus: 'Pending' | 'Paid' | 'Failed', transactionId?: string) {
  await connectDB()
  const update: Record<string, any> = { paymentStatus }
  if (transactionId) update.transactionId = transactionId
  const order = await SameDayOrder.findOneAndUpdate(byId(id), { $set: update }, { new: true })
  if (!order) throw new Error('Order not found')
  return order
}

/* ── Delete order ── */
export async function deleteOrder(id: string) {
  await connectDB()
  const order = await SameDayOrder.findOneAndDelete(byId(id))
  if (!order) throw new Error('Order not found')
  return { message: 'Order deleted' }
}

/* ── Dashboard stats ── */
export async function getOrderStats() {
  await connectDB()
  const [total, pending, accepted, preparing, outForDelivery, delivered, cancelled, revenue] = await Promise.all([
    SameDayOrder.countDocuments(),
    SameDayOrder.countDocuments({ status: 'Pending' }),
    SameDayOrder.countDocuments({ status: 'Accepted' }),
    SameDayOrder.countDocuments({ status: 'Preparing' }),
    SameDayOrder.countDocuments({ status: 'Out for Delivery' }),
    SameDayOrder.countDocuments({ status: 'Delivered' }),
    SameDayOrder.countDocuments({ status: 'Cancelled' }),
    SameDayOrder.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
  ])
  return { total, pending, accepted, preparing, outForDelivery, delivered, cancelled, revenue: revenue[0]?.total ?? 0 }
}
