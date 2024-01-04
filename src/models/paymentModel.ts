import { Types } from 'mongoose'
import { Schema, model } from 'mongoose'

const PaymentSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
})

const Payments = model('Payments', PaymentSchema)
export default Payments
