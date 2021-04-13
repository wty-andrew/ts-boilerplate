import { Router } from 'express'

import { localAuth, protect } from '../middlewares/auth'
import { signup, login, logout, verify } from '../controllers/auth'

const router = Router()

router.post('/signup', signup)

router.post('/login', localAuth, login)

router.get('/logout', logout)

router.get('/verify', protect, verify) // check current user

export default router
