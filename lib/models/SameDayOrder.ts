import mongoose, { Schema, Document, Model } from 'mongoose'

export type SameDayOrderStatus = 'Pending' | 'Accepted' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled'

export interface ISameDayOrderItem {
  productId:   mongoose.Types.ObjectId
  productRef:  string   // SDP-001 etc.
  title:        string
  price:        number
  quantity:     number
  subtotal:     number
}

export interface ISameDayOrder extends Document {
  orderId:      string
  customer: {
    name:     string
    phone:    string
    email:    string
    address:  string
    lat:      number
    lng:      number
  }
  items:        ISameDayOrderItem[]
  timing:       string
  subtotal:     number
  deliveryFee:  number
  gst:          number
  total:        number
  paymentMethod: string
  paymentStatus: 'Pending' | 'Paid' | 'Failed'
  transactionId: string
  status:       SameDayOrderStatus
  acceptedBy:   mongoose.Types.ObjectId | null
  acceptedAt:   Date | null
  notes:        string
  createdAt:    Date
  updatedAt:    Date
}

const OrderItemSchema = new Schema<ISameDayOrderItem>(
  {
    productId:  { type: mongoose.Schema.Types.ObjectId, ref: 'SameDayProduct', required: true },
    productRef: { type: String, default: '' },
    title:      { type: String, required: true },
    price:      { type: Number, required: true },
    quantity:   { type: Number, required: true, min: 1 },
    subtotal:   { type: Number, required: true },
  },
  { _id: false }
)

const SameDayOrderSchema = new Schema<ISameDayOrder>(
  {
    orderId: {
      type:   String,
      unique: true,
    },

    customer: {
      name: {
        type:     String,
        required: [true, 'Customer name is required'],
        trim:     true,
      },
      phone: {
        type:     String,
        required: [true, 'Phone is required'],
        trim:     true,
        match:    [/^[6-9]\d{9}$/, 'Invalid Indian phone number'],
      },
      email: {
        type:      String,
        default:   '',
        lowercase: true,
        trim:      true,
      },
      address: {
        type:     String,
        required: [true, 'Address is required'],
        trim:     true,
      },
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },

    items: {
      type:     [OrderItemSchema],
      required: true,
      validate: {
        validator: (v: any[]) => v.length > 0,
        message:   'At least one item is required',
      },
    },

    timing: {
      type:     String,
      required: [true, 'Delivery timing is required'],
    },

    subtotal:    { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    gst:         { type: Number, default: 0, min: 0 },
    total:       { type: Number, required: true, min: 0 },

    paymentMethod: { type: String, default: 'Online' },
    paymentStatus: {
      type:    String,
      enum:    ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    transactionId: { type: String, default: '' },

    status: {
      type:    String,
      enum:    ['Pending', 'Accepted', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },

    acceptedBy: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'Admin',
      default: null,
    },
    acceptedAt: { type: Date, default: null },

    notes: { type: String, default: '', trim: true },
  },
  {
    timestamps: true,
    collection: 'samedayorders',
  }
)

SameDayOrderSchema.pre('save', async function () {
  if (this.isNew) {
    const count   = await mongoose.model('SameDayOrder').countDocuments()
    this.orderId  = `SDO-${String(count + 1).padStart(4, '0')}`
  }
})

SameDayOrderSchema.index({ 'customer.phone': 1 })
SameDayOrderSchema.index({ status: 1 })
SameDayOrderSchema.index({ createdAt: -1 })

if (process.env.NODE_ENV !== 'production') {
  delete (mongoose.models as any).SameDayOrder
}

const SameDayOrder: Model<ISameDayOrder> =
  (mongoose.models.SameDayOrder as Model<ISameDayOrder>) ??
  mongoose.model<ISameDayOrder>('SameDayOrder', SameDayOrderSchema)

export default SameDayOrder
