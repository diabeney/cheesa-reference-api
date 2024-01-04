import mongoose, { Types } from 'mongoose'

const ReferenceSchema = new mongoose.Schema({
  graduateId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  lecturerId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  programme: {
    type: String,
    required: true
  },
  graduationYear: {
    type: String,
    required: true
  },
  referenceNumber: {
    type: String,
    required: true
  },
  indexNumber: {
    type: String,
    required: true
  },
  expectedDate: {
    type: Date,
    required: true
  },
  accepted: {
    type: String,
    default: 'null',
    enum: ['accepted', 'declined', 'null']
  },
  status: {
    type: String,
    default: 'not ready',
    enum: ['not ready', 'submitted']
  },
  destination: {
    type: String,
    required: true
  },
  transactionStatus: {
    type: String,
    default: 'pending',
    enum: ['pending', 'paid']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Reference = mongoose.model('Reference', ReferenceSchema)

export default Reference
