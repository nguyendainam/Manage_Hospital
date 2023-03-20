import UserServices from '../services/userServices.js'

let getAccounts = async (req, res) => {
  try {
    let data = await UserServices.getallAccounts()
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from getdataUser Controller'
    })
  }
}

let createNewAccounts = async (req, res) => {
  try {
    let data = await UserServices.createNewAccounts(req.body)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from getdataUser Controller'
    })
  }
}

let LoginUsers = async (req, res) => {
  try {
    let data = await UserServices.LoginUsers(req.body)
    return res.status(200).json(data)
  } catch (e) {
    // console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from getdataUser Controller'
    })
  }
}

let RegisterUsers = async (req, res) => {
  try {
    let data = await UserServices.RegisterUsersService(req.body)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from getdataUser Controller'
    })
  }
}

export default {
  getAccounts,
  createNewAccounts,
  LoginUsers,
  RegisterUsers
}
