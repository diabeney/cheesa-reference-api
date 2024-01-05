import express from 'express'
import { handlePayment, verifyPayment } from '../../controllers/PaystackPayment'
import { getAllPayments, getPaymentsByUserId } from '../../db/payment'

const router = express.Router()

router.post('/accept-payment', handlePayment)
router.get('/verify-payment/:reference', verifyPayment)
router.get('/:userId', getPaymentsByUserId)
router.get('/', getAllPayments)

export { router as PaymentRoutes }
