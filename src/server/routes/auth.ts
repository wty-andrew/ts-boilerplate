import { Router } from 'express'

import { localAuth, protect } from '../middlewares/auth'
import {
  signup,
  login,
  logout,
  verify,
  activateAccount,
  resendActivation,
  forgotPassword,
  resetPassword,
} from '../controllers/auth'

const router = Router()

router.post('/signup', signup)

router.post('/login', localAuth, login)

router.get('/logout', logout)

router.get('/verify', protect, verify) // check current user

router.post('/activation', activateAccount)

router.post('/resend-activation', resendActivation)

router.post('/forgot-password', forgotPassword)

router.post('/reset-password', resetPassword)

export default router
