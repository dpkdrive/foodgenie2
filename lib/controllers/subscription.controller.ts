import { connectDB } from '../db'
import Subscription, { SubscriptionStatus } from '../models/Subscription'

const isObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id)
const byId = (id: string) =>
  isObjectId(id)
    ? { $or: [{ subscriptionId: id }, { _id: id }] }
    : { subscriptionId: id }

/* ── Get all subscriptions (with filter/search/sort/pagination) ── */
export async function getAllSubscriptions(query: {
  status?:    SubscriptionStatus
  planType?:  'Fixed' | 'Customized' | 'Bespoke'
  search?:    string
  sortBy?:    string
  order?:     'asc' | 'desc'
  page?:      number
  limit?:     number
  dateFrom?:  string
  dateTo?:    string
  dateField?: 'startDate' | 'createdAt'
}) {
  await connectDB()

  const {
    status,
    planType,
    search,
    sortBy    = 'createdAt',
    order     = 'desc',
    page      = 1,
    limit     = 20,
    dateFrom,
    dateTo,
    dateField = 'startDate',
  } = query

  const filter: Record<string, any> = {}
  if (status)   filter.status   = status
  if (planType) filter.planType = planType
  if (search) {
    filter.$or = [
      { 'customer.name':  { $regex: search, $options: 'i' } },
      { 'customer.phone': { $regex: search, $options: 'i' } },
      { 'customer.email': { $regex: search, $options: 'i' } },
      { subscriptionId:   { $regex: search, $options: 'i' } },
      { plan:             { $regex: search, $options: 'i' } },
    ]
  }
  if (dateFrom || dateTo) {
    filter[dateField] = {}
    if (dateFrom) filter[dateField].$gte = new Date(dateFrom)
    if (dateTo)   filter[dateField].$lte = new Date(dateTo + 'T23:59:59.999Z')
  }

  const sortOrder = order === 'asc' ? 1 : -1
  const skip = (page - 1) * limit

  const [data, total] = await Promise.all([
    Subscription.find(filter).sort({ [sortBy]: sortOrder }).skip(skip).limit(limit),
    Subscription.countDocuments(filter),
  ])

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

/* ── Get single subscription ── */
export async function getSubscriptionById(id: string) {
  await connectDB()
  const sub = await Subscription.findOne(byId(id))
  if (!sub) throw new Error('Subscription not found')
  return sub
}

/* ── Create subscription ── */
export async function createSubscription(data: {
  customer:  { name: string; phone: string; email?: string; address: string }
  plan:      string
  planType?: 'Fixed' | 'Customized' | 'Bespoke'
  category?: string
  meals:     string
  startDate: string
  endDate:   string
  amount:    number
  notes?:    string
}) {
  await connectDB()
  const sub = await Subscription.create({
    ...data,
    approved: false,
    status:   'Pending',
  })
  return sub
}

/* ── Update subscription ── */
export async function updateSubscription(id: string, data: Partial<{
  plan:      string
  meals:     string
  startDate: string
  endDate:   string
  amount:    number
  status:    SubscriptionStatus
  notes:     string
  customer:  { name?: string; phone?: string; email?: string; address?: string }
}>) {
  await connectDB()
  const sub = await Subscription.findOneAndUpdate(
    byId(id),
    { $set: data },
    { new: true, runValidators: true }
  )
  if (!sub) throw new Error('Subscription not found')
  return sub
}

/* ── Approve subscription ── */
export async function approveSubscription(id: string, adminId: string) {
  await connectDB()
  const sub = await Subscription.findOneAndUpdate(
    byId(id),
    { $set: { approved: true, approvedBy: adminId, approvedAt: new Date() } },
    { new: true }
  )
  if (!sub) throw new Error('Subscription not found')
  return sub
}

/* ── Update status ── */
export async function updateStatus(id: string, status: SubscriptionStatus) {
  await connectDB()
  const sub = await Subscription.findOneAndUpdate(
    byId(id),
    { $set: { status } },
    { new: true }
  )
  if (!sub) throw new Error('Subscription not found')
  return sub
}

/* ── Delete subscription ── */
export async function deleteSubscription(id: string) {
  await connectDB()
  const sub = await Subscription.findOneAndDelete(byId(id))
  if (!sub) throw new Error('Subscription not found')
  return { message: 'Subscription deleted' }
}

/* ── Monthly breakdown for charts ── */
export async function getMonthlyStats(opts?: {
  dateFrom?:  string
  dateTo?:    string
  dateField?: 'startDate' | 'createdAt'
}) {
  await connectDB()

  const field = opts?.dateField ?? 'startDate'
  const matchFilter: Record<string, any> = {}
  if (opts?.dateFrom || opts?.dateTo) {
    matchFilter[field] = {}
    if (opts?.dateFrom) matchFilter[field].$gte = new Date(opts.dateFrom)
    if (opts?.dateTo)   matchFilter[field].$lte = new Date(opts.dateTo + 'T23:59:59.999Z')
  }

  const rows = await Subscription.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: {
          year:  { $year:  `$${field}` },
          month: { $month: `$${field}` },
        },
        subscriptions: { $sum: 1 },
        revenue:       { $sum: '$amount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ])

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return rows.map(r => ({
    month:         `${MONTHS[r._id.month - 1]} ${r._id.year}`,
    subscriptions: r.subscriptions,
    revenue:       r.revenue,
  }))
}

/* ── Dashboard stats ── */
export async function getStats(opts?: {
  dateFrom?:  string
  dateTo?:    string
  dateField?: 'startDate' | 'createdAt'
}) {
  await connectDB()

  const baseFilter: Record<string, any> = {}
  if (opts?.dateFrom || opts?.dateTo) {
    const field = opts?.dateField ?? 'startDate'
    baseFilter[field] = {}
    if (opts?.dateFrom) baseFilter[field].$gte = new Date(opts.dateFrom)
    if (opts?.dateTo)   baseFilter[field].$lte = new Date(opts.dateTo + 'T23:59:59.999Z')
  }

  const [total, active, paused, completed, cancelled, revenue] = await Promise.all([
    Subscription.countDocuments(baseFilter),
    Subscription.countDocuments({ ...baseFilter, status: 'Active' }),
    Subscription.countDocuments({ ...baseFilter, status: 'Paused' }),
    Subscription.countDocuments({ ...baseFilter, status: 'Completed' }),
    Subscription.countDocuments({ ...baseFilter, status: 'Cancelled' }),
    Subscription.aggregate([{ $match: baseFilter }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
  ])
  return {
    total,
    active,
    paused,
    completed,
    cancelled,
    revenue: revenue[0]?.total ?? 0,
  }
}
