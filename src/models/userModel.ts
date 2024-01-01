import { Schema, model } from 'mongoose'
import { IUser } from '../types/types'
import crypto from 'crypto'

const UsersSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['lecturer', 'graduate'] },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
})

UsersSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex')

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.resetPasswordExpires = Date.now() + 10 * (60 * 1000) //Ten Minutes

  return resetToken
}

const Users = model<IUser | any>('Users', UsersSchema)

export default Users
