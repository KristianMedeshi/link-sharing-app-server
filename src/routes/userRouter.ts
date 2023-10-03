import { Router } from 'express'

import UserController from '../controllers/UserController'
import authMiddleware from '../middleware/authMiddleware'

const router = Router()

router.get('/', authMiddleware, UserController.authorized)
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/info', authMiddleware, UserController.info)
router.get('/:infoId', UserController.info)
router.put('/save', authMiddleware, UserController.save)

export default router
