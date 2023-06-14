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
router.get('/system/get-patients-byid', userController.getPatientsById)
router.get('/system/get-specialty', userController.getSpecialtyInfor)

router.get('/system/get-infordoctor', userController.getInforDoctorbyId)
router.get('/system/get-schedule-byid', userController.getScheduleById)
router.get('/system/get-about-schedule', userController.getAboutScheduleById)
router.get('/system/get-data-user', userController.getdataUserByAccount)
router.get('/system/getlist-treatments', userController.getListTreatments)

router.post(
  '/system/create-request-treatment',
  userController.createRequestTreatment
)

router.post('/system/post-update-information', userController.UpdateInformation)
export default router
