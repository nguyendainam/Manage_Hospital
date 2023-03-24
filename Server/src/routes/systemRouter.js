import { Router } from 'express'
import SystemsController from '../controllers/systemsController.js'
import Test from '../controllers/testController.js'

const router = Router()

router.get('/system/get-all-hospitals', SystemsController.getallHospitals)
router.post('/system/create-hospitals', SystemsController.createNewHospitals)

// testing system routes
router.post('/system/upload-testing', Test.uploadImage)
router.get('/system/test-getting-image', Test.getImage)

export default router
