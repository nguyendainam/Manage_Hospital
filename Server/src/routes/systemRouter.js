import { Router } from 'express'
import EmpController from '../controllers/employeeController.js'

const router = Router()
// GET
router.get('/system/get_all_accounts', EmpController.getAllAccounts)

//POST
router.post('/system/loggin-account', EmpController.logginAccout)

//UPDATE

//DELETE

export default router
