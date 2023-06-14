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
    console.log(e)
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

let getPatientsById = async (req, res) => {
  try {
    let data = await UserServices.getPatientsById_Service(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Err from getPatientsById'
    })
  }
}

let getSpecialtyInfor = async (req, res) => {
  try {
    let data = await UserServices.getSpecialtyInfor_Service(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'getSpecialtyInfor'
    })
  }
}

let getInforDoctorbyId = async (req, res) => {
  try {
    let data = await UserServices.getInforDoctorbyId_Service(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Err from getInforDoctorbyId'
    })
  }
}

let getScheduleById = async (req, res) => {
  try {
    let data = await UserServices.getScheduleById_Service(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from getScheduleById'
    })
  }
}

let getAboutScheduleById = async (req, res) => {
  try {
    let data = await UserServices.getAboutScheduleById_Service(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Err from  getAboutScheduleById'
    })
  }
}

let getdataUserByAccount = async (req, res) => {
  try {
    let data = await UserServices.getInforUserByAccount_Service(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from getdataUserByAccount'
    })
  }
}

let getListTreatments = async (req, res) => {
  try {
    let data = await UserServices.getListTreatments_Service(req.query)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from getListTreatments'
    })
  }
}

let createRequestTreatment = async (req, res) => {
  try {
    let data = await UserServices.createNewRequestTreatment_Service(req.body)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from createRequestTreatment '
    })
  }
}

let UpdateInformation = async (req, res) => {
  try {
    let data = await UserServices.updateInforUser_Service(req)
    return res.status(200).json(data)
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode: -1,
      errMessage: 'Error from updateInforUser '
    })
  }
}

export default {
  getAccounts,
  createNewAccounts,
  LoginUsers,
  RegisterUsers,
  getListUsers,
  CreateAndUpdateUsers,
  getPatientsById,
  getSpecialtyInfor,
  getInforDoctorbyId,
  getScheduleById,
  getAboutScheduleById,
  getdataUserByAccount,
  getListTreatments,
  createRequestTreatment,
  UpdateInformation
}
