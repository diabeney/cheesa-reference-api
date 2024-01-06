import { Types } from 'mongoose'
import { Schema, model } from 'mongoose'

const VerificationSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    unique: true,
    required: true
  }
})

const Verification = model('Verification', VerificationSchema)
export default Verification
