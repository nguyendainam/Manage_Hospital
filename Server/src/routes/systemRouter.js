import { Router } from 'express'
import SystemsController from '../controllers/systemsController.js'
import Test from '../controllers/testController.js'
import HomepageController from '../controllers/HomepageController.js'

const router = Router()

// HOSPITAL
router.get('/system/get-all-hospitals', SystemsController.getallHospitals)
router.get('/system/get-hospital-by-id', SystemsController.getHospitalById)
router.get(
  '/system/get-all-special-hospitals',
  SystemsController.getAllSpecialHospitals
)
router.get('/system/get-allcode-bykey', SystemsController.getAllcodes)
router.post('/system/create-hospitals', SystemsController.createNewHospitals)

// SPECIALTIES HOSPITAL

router.post('/system/create-specialty', SystemsController.createNewSpecialty)
router.get('/system/getall-specialty', SystemsController.getAllSpecialty)
router.post('/system/update-specialty', SystemsController.updateSpecialty)
router.put('/system/delete-specialty', SystemsController.deleteSpecialty)
router.get('/system/getlist-spe-by-idServer', SystemsController.getListSpebyId)

// CLINICS
router.get('/system/getall-clinics', SystemsController.getAllClinics)
router.post('/system/create-clinics', SystemsController.createNewClinics)
router.put('/system/update-clinics', SystemsController.updateClinics)
router.put('/system/delete-clinics', SystemsController.deleteClinics)
router.get(
  '/system/getlist-clinics-byidServer',
  SystemsController.getListClibyId
)

// Treatment_rooms

router.get('/system/getall-treatment', SystemsController.getAllTreatment)
router.post('/system/create-treatment', SystemsController.createNewTreatment)
router.put('/system/update-treatment', SystemsController.updateTreatment)

// bed hospital

router.post('/system/create-bed-hospital', SystemsController.createBedHospital)
router.get('/system/get-bed-hospital', SystemsController.getbedHospital)
router.put('/system/delete-bed-hospital', SystemsController.deletebedhospital)

// histories treatment

router.post(
  '/system/post-histories-treatment',
  SystemsController.postHistoriesTreatment
)

router.get(
  '/system/get-list-treatment',
  SystemsController.getListHistoryTreatment
)

// testing system routes
router.post('/system/upload-testing', Test.uploadImage)
router.get('/system/test-getting-image', Test.getImage)
router.get('/system/test-getting-route', Test.TestingGetDataRoute)

//HOME PAGES

router.get('/system/get-home-pages', HomepageController.getDataHomePage)
router.get('/system/get-data-hospital', HomepageController.getDataHospital)

router.get('/system/get-arr-Treatment', SystemsController.getArrTreatment)
router.get('/system/getinfor-treatment', SystemsController.getInforTreatment)

export default router
