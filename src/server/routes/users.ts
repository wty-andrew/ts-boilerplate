import { Router } from 'express'

import { protect, permit } from '../middlewares/auth'
import { parseQuery } from '../middlewares/parse-query'
import { Role } from '../models/User'
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users'

const router = Router()

router.use(protect, permit(Role.Admin))

router.route('/').get(parseQuery(), getUsers).post(createUser)

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)

export default router
