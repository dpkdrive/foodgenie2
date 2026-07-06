import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ITestimonial extends Document {
  text:     string
  name:     string
  role:     string
  duration: string
  rating:   number
  active:   boolean
  order:    number
  createdAt: Date
  updatedAt: Date
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    text:     { type: String, required: true, trim: true },
    name:     { type: String, required: true, trim: true },
    role:     { type: String, default: '',    trim: true },
    duration: { type: String, default: '',    trim: true },
    rating:   { type: Number,  default: 5, min: 1, max: 5 },
    active:   { type: Boolean, default: true },
    order:    { type: Number,  default: 0    },
  },
  { timestamps: true }
)

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ??
  mongoose.model<ITestimonial>('Testimonial', TestimonialSchema)

export default Testimonial
