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

export default {
  getAllAccounts,
  logginAccout
}
