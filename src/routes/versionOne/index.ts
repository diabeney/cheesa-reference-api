import express from 'express'
import { AuthRoutes } from './auth'
import { verifyToken } from '../../middleware'
import { UserRoutes } from './users'
import { ReferenceRoutes } from './reference'
import { PaymentRoutes } from './payment'

const router = express.Router()

router.get('/', (_, res) => res.send('Hello'))

router.use('/auth', AuthRoutes)
router.use('/users', verifyToken, UserRoutes)
router.use('/reference', verifyToken, ReferenceRoutes)
router.use('/payment', verifyToken, PaymentRoutes)

// the /posts route is for testing purposes
router.get('/posts', verifyToken, (_, res) => {
  res.status(200).json({ posts: ['one', 'two', 'three'] })
})

export { router as VERSION_ONE_ROUTER }
