import { Router } from 'express'
import SystemsController from '../controllers/systemsController.js'
import Test from '../controllers/testController.js'

const router = Router()

// get request
router.get('/system/get-all-hospitals', SystemsController.getallHospitals)
router.get('/system/get-hospital-by-id', SystemsController.getHospitalById)
router.get(
  '/system/get-all-special-hospitals',
  SystemsController.getAllSpecialHospitals
)
router.get('/system/get-allcode-bykey', SystemsController.getAllcodes)

// post request
router.post('/system/create-hospitals', SystemsController.createNewHospitals)

// testing system routes
router.post('/system/upload-testing', Test.uploadImage)
router.get('/system/test-getting-image', Test.getImage)
router.get('/system/test-getting-route', Test.TestingGetDataRoute)

export default router
