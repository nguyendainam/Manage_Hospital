import { Router } from 'express'
import userController from '../controllers/userController.js'

const router = Router()

// user ..........
router.get('/users', userController.getAccounts)
router.post('/post-users', userController.createNewAccounts)
router.post('/login-users', userController.LoginUsers)
router.post('/register-user', userController.RegisterUsers)

// user in admin dashboard

router.get('/system/users-getall', userController.getListUsers)
router.post('/system/users-createorupdate', userController.CreateAndUpdateUsers)

export default router
