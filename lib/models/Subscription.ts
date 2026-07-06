import mongoose, { Schema, Document, Model } from 'mongoose'

export type SubscriptionStatus = 'Pending' | 'Active' | 'Paused' | 'Completed' | 'Cancelled'
export type PlanType = string
export type MealType = string

export interface ISubscription extends Document {
  subscriptionId: string               // e.g. FG-001 (auto-generated)
  customer: {
    name:    string
    phone:   string
    email:   string
    address: string
  }
  plan:       PlanType
  planType:   'Fixed' | 'Customized' | 'Bespoke'
  category:   string
  meals:      MealType
  startDate:  Date
  endDate:    Date
  amount:     number
  status:     SubscriptionStatus
  approved:   boolean
  approvedBy: mongoose.Types.ObjectId | null   // ref → Admin
  approvedAt: Date | null
  notes:      string
  createdAt:  Date
  updatedAt:  Date
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    subscriptionId: {
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
    },

    plan: {
      type:     String,
      required: [true, 'Plan is required'],
      trim:     true,
    },

    planType: {
      type:    String,
      enum:    ['Fixed', 'Customized', 'Bespoke'],
      default: 'Fixed',
    },

    category: {
      type:    String,
      default: '',
      trim:    true,
    },

    meals: {
      type:     String,
      required: [true, 'Meals selection is required'],
      trim:     true,
    },

    startDate: {
      type:     Date,
      required: [true, 'Start date is required'],
    },

    endDate: {
      type:     Date,
      required: [true, 'End date is required'],
    },

    amount: {
      type:     Number,
      required: [true, 'Amount is required'],
      min:      [0, 'Amount cannot be negative'],
    },

    status: {
      type:    String,
      enum:    ['Pending', 'Active', 'Paused', 'Completed', 'Cancelled'],
      default: 'Pending',
    },

    approved: {
      type:    Boolean,
      default: false,
    },

    approvedBy: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'Admin',
      default: null,
    },

    approvedAt: {
      type:    Date,
      default: null,
    },

    notes: {
      type:    String,
      default: '',
      trim:    true,
    },
  },
  {
    timestamps: true,
    collection: 'subscriptions',
  }
)

/* ── Auto-generate subscriptionId before save ── */
SubscriptionSchema.pre('save', async function () {
  if (this.isNew) {
    const count = await mongoose.model('Subscription').countDocuments()
    this.subscriptionId = `FG-${String(count + 1).padStart(3, '0')}`
  }
})

/* ── Indexes ── */
SubscriptionSchema.index({ 'customer.phone': 1 })
SubscriptionSchema.index({ 'customer.email': 1 })
SubscriptionSchema.index({ status: 1 })
SubscriptionSchema.index({ approved: 1 })
SubscriptionSchema.index({ startDate: -1 })

/* In dev, delete cached model so schema changes take effect without restart */
if (process.env.NODE_ENV !== 'production') {
  delete (mongoose.models as any).Subscription
}

const Subscription: Model<ISubscription> =
  (mongoose.models.Subscription as Model<ISubscription>) ??
  mongoose.model<ISubscription>('Subscription', SubscriptionSchema)

export default Subscription
