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

export default {
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
  getScheduleDoctor
}
