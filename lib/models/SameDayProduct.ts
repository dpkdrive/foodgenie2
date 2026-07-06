import mongoose, { Schema, Document, Model } from 'mongoose'

export type SameDayProductStatus = 'Published' | 'Draft' | 'Pending'

export type DeliveryTiming = string

export interface ISameDayProduct extends Document {
  productId:   string
  title:        string
  description:  string
  price:        number
  image:        string
  unit:         string
  timing:       DeliveryTiming
  status:       SameDayProductStatus
  featured:     boolean
  createdAt:    Date
  updatedAt:    Date
}

const SameDayProductSchema = new Schema<ISameDayProduct>(
  {
    productId: {
      type:   String,
      unique: true,
    },

    title: {
      type:     String,
      required: [true, 'Title is required'],
      trim:     true,
    },

    description: {
      type:    String,
      default: '',
      trim:    true,
    },

    price: {
      type:     Number,
      required: [true, 'Price is required'],
      min:      [0, 'Price cannot be negative'],
    },

    image: {
      type:    String,
      default: '',
    },

    unit: {
      type:    String,
      default: '',
      trim:    true,
    },

    timing: {
      type:     String,
      required: [true, 'Timing is required'],
      trim:     true,
    },

    status: {
      type:    String,
      enum:    ['Published', 'Draft', 'Pending'],
      default: 'Draft',
    },

    featured: {
      type:    Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'samedayproducts',
  }
)

SameDayProductSchema.pre('save', async function () {
  if (this.isNew) {
    const last = await mongoose.model('SameDayProduct')
      .findOne({ productId: /^SDP-/ })
      .sort({ productId: -1 })
      .select('productId')
      .lean() as { productId?: string } | null
    const lastNum = last?.productId ? parseInt(last.productId.replace('SDP-', ''), 10) : 0
    this.productId = `SDP-${String(lastNum + 1).padStart(3, '0')}`
  }
})

SameDayProductSchema.index({ status: 1 })
SameDayProductSchema.index({ timing: 1 })

if (process.env.NODE_ENV !== 'production') {
  delete (mongoose.models as any).SameDayProduct
}

const SameDayProduct: Model<ISameDayProduct> =
  (mongoose.models.SameDayProduct as Model<ISameDayProduct>) ??
  mongoose.model<ISameDayProduct>('SameDayProduct', SameDayProductSchema)

export default SameDayProduct
