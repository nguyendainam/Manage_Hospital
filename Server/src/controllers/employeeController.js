import EmployeeServices from '../services/employeeServices.js'

const getAllAccounts = async (req, res) => {
  try {
    const accounts = await EmployeeServices.getAllAccountsServices()
    res.status(200).json(accounts)
  } catch (e) {
    res.status(404).json({
      errCode: -1,
      errMessage: 'Error getting all accounts',
      error_is: e.message
    })
  }
}

const logginAccout = async (req, res) => {
  try {
    const account = await EmployeeServices.logginAccountServices(req.body)
    res.status(200).json(account)
  } catch (e) {
    res.status(200).json({
      errCode: -1,
      errMessage: 'Error logging in account',
      error_is: e.message
    })
  }
}

const logginAccoutByRoleId = async (req, res) => {
  try {
    const account = await EmployeeServices.logginAccoutByRole_Service(req.body)
    res.status(200).json(account)
  } catch (e) {
    res.status(200).json({
      errCode: -1,
      errMessage: 'Error logging in account',
      error_is: e.message
    })
  }
}

const getListEmployee = async (req, res) => {
  try {
    let data = await EmployeeServices.getListEmployee_Service(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from getListDoctors'
    })
  }
}

const createnewEmployee = async (req, res) => {
  try {
    let data = await EmployeeServices.createnewEmployee_Service(req)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error creating employee '
    })
  }
}

const updateEmployee = async (req, res) => {
  try {
    let data = await EmployeeServices.updateEmployee_Service(req)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from update Employee'
    })
  }
}
let getListDoctor = async (req, res) => {
  try {
    let data = await EmployeeServices.getListDoctor_Service(req.query.idServer)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from getListdoctor'
    })
  }
}

let getInformations_Doctors = async (req, res) => {
  try {
    let data = await EmployeeServices.getInformations_Doctors_Service(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from  getInformations_Doctors_Service'
    })
  }
}

let informationDoctors = async (req, res) => {
  try {
    let data = await EmployeeServices.informationDoctors_Service(req)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from information'
    })
  }
}

let getAllDoctor = async (req, res) => {
  try {
    let data = await EmployeeServices.getAllDoctor_Service(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from getAllDoctor'
    })
  }
}

let createSchedule = async (req, res) => {
  try {
    let data = await EmployeeServices.createNewSchedule_Service(req.body)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from createSchedule'
    })
  }
}

let getScheduleDoctor = async (req, res) => {
  try {
    let data = await EmployeeServices.getScheduleDoctor_Service(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from get Schedule '
    })
  }
}
let getListDoctorBySpe = async (req, res) => {
  try {
    let data = await EmployeeServices.getListDoctorBySpe_Service(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error From getListDoctorBySpe'
    })
  }
}

let getAllSchedulebyDate = async (req, res) => {
  try {
    let data = await EmployeeServices.getAllSchedulebyDate_Server(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'ERROR From getAllSchedule'
    })
  }
}

let createNewBooking = async (req, res) => {
  try {
    let data = await EmployeeServices.createNewBooking_Service(req.body)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from createNewBooking'
    })
  }
}

let getAllBooking = async (req, res) => {
  try {
    let data = await EmployeeServices.getAllBooking_Services(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from getAllBooking'
    })
  }
}

let comfirmBooking = async (req, res) => {
  try {
    let data = await EmployeeServices.comfirmBooking_Services(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from comfirmBooking'
    })
  }
}

let getAllPatientBooking = async (req, res) => {
  try {
    let data = await EmployeeServices.getAllPatientBooking_Services(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from comfirmBooking'
    })
  }
}

let createNewPatientInfor = async (req, res) => {
  try {
    let data = await EmployeeServices.createNewPatientInfor_Services(req.body)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Err from create new InforPatient '
    })
  }
}

let getAllDoctorBySpe = async (req, res) => {
  try {
    let data = await EmployeeServices.getAllDoctorBySpe_Services(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Err from getAllDoctorBySpe'
    })
  }
}

let PatientTreatment = async (req, res) => {
  try {
    let data = await EmployeeServices.PatientTreatment_Services(req.body)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Err from patient treatment'
    })
  }
}

let getInformations_Patients = async (req, res) => {
  try {
    let data = await EmployeeServices.getInformations_Pat_Services(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Err from getInformations_Patients '
    })
  }
}

let getStatusPatient = async (req, res) => {
  try {
    let data = await EmployeeServices.getStatusPatient_Services(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Err from getStatusPatient '
    })
  }
}

let FinishTreatment = async (req, res) => {
  try {
    let data = await EmployeeServices.FinishTreatment_Services(req.body)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Err from FinishTreatment'
    })
  }
}

let getListPATtreatment = async (req, res) => {
  try {
    let data = await EmployeeServices.getListPATtreatment_Services(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Err from getListPATtreatment'
    })
  }
}

let getAllInforDr = async (req, res) => {
  try {
    let data = await EmployeeServices.getAllInforDr_Services(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1
    })
  }
}

let CreateHistories = async (req, res) => {
  try {
    let data = await EmployeeServices.createNewHistories_Service(req)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(404).json({
      errCode: -1,
      errMessage: 'Error from  CreateHistories'
    })
  }
}

let getIdDoctorByEmail = async (req, res) => {
  try {
    let data = await EmployeeServices.getIdDoctorByEmail_Service(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from getIdDoctorByEmail'
    })
  }
}

let getAllSheduleByDr = async (req, res) => {
  try {
    let data = await EmployeeServices.getAllSheduleByDr_Service(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(404).json({
      errCode: -1,
      errMessage: 'Error from getAllSheduleByDr'
    })
  }
}

let getRequestTreat = async (req, res) => {
  try {
    let data = await EmployeeServices.getRequestTreat_Service(req.query)
    return res.status(200).json(data)
  } catch (e) {
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from getRequestTreat'
    })
  }
}

let getConfirmRequest = async (req, res) => {
  try {
    let data = await EmployeeServices.getConfirmRequest_Service(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from getConfirmRequest'
    })
  }
}

let createTreatmentsPatient = async (req, res) => {
  try {
    let data = await EmployeeServices.createTreatmentsPatient_Service(req.body)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from createTreatmentsPatient'
    })
  }
}

export default {
  getAllSheduleByDr,
  getAllAccounts,
  logginAccout,
  logginAccoutByRoleId,
  getListEmployee,
  createnewEmployee,
  updateEmployee,
  getListDoctor,
  informationDoctors,
  getInformations_Doctors,
  getAllDoctor,
  createSchedule,
  getScheduleDoctor,
  getListDoctorBySpe,
  getAllSchedulebyDate,
  createNewBooking,
  getAllBooking,
  comfirmBooking,
  getAllPatientBooking,
  createNewPatientInfor,
  getAllDoctorBySpe,
  PatientTreatment,
  getInformations_Patients,
  getStatusPatient,
  FinishTreatment,
  getListPATtreatment,
  getAllInforDr,
  CreateHistories,
  getIdDoctorByEmail,
  getRequestTreat,
  getConfirmRequest,
  createTreatmentsPatient
}
