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

const getListDoctors = async (req, res) => {
  try {
    let data = await EmployeeServices.getListDoctors_Service(req.query)
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

export default {
  getAllAccounts,
  logginAccout,
  logginAccoutByRoleId,
  getListDoctors,
  createnewEmployee,
  updateEmployee
}
