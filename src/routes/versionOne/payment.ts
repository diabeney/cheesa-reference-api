import express from 'express'
import { handlePayment, verifyPayment } from '../../controllers/PaystackPayment'

const router = express.Router()

router.post('/accept-payment', handlePayment)
router.get('/verify-payment/:reference', verifyPayment)

export { router as PaymentRoutes }
