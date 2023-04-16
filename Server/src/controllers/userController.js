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

// ===========================system=====================================

let getListUsers = async (req, res) => {
  try {
    let data = await UserServices.GetListUsers_Service(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Err from getListUsers'
    })
  }
}

let CreateAndUpdateUsers = async (req, res) => {
  try {
    let data = await UserServices.CreateAndUpdateUsers_Service(req)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Err from CreateAndUpdateUsers '
    })
  }
}

export default {
  getAccounts,
  createNewAccounts,
  LoginUsers,
  RegisterUsers,
  getListUsers,
  CreateAndUpdateUsers
}
