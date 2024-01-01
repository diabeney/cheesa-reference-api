import express from 'express'
import {
  handleLogin,
  handleRefreshToken,
  handleSignUp
} from '../../controllers/auth'

import { resetPassword } from '../../controllers/resetPassword'
import { forgotPassword } from '../../controllers/forgotPassword'

const router = express.Router()

router.post('/signup', handleSignUp)
router.post('/login', handleLogin)
router.post('/refresh', handleRefreshToken)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export { router as AuthRoutes }
