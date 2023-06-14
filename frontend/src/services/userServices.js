import axios from '../axios'

export const getAllAccounts = async () => {
  return await axios.get('/users')
}

export const GetListHospitals = async () => {
  return await axios.get('/system/get-home-pages')
}

export const GetDataHospitals = async idHos => {
  return await axios.get(`/system/get-data-hospital?idHos=${idHos}`)
}

export const GetDataSpecialty = async (idServer, idSpe) => {
  return await axios.get(
    `/system/get-specialty?idServer=${idServer}&idSpe=${idSpe}`
  )
}

export const getInformationDoctors = async (idServer, idDoctor) => {
  return await axios.get(
    `/system/get-infordoctor?idServer=${idServer}&idDoctor=${idDoctor}`
  )
}

export const getScheduleDoctors = async (idServer, idDoctor, date) => {
  return await axios.get(
    `/system/get-schedule-byid?idServer=${idServer}&idDoctor=${idDoctor}&date=${date}`
  )
}

export const getInforAboutSchedule = async (idServer, idSchedule) => {
  return await axios.get(
    `/system/get-about-schedule?idServer=${idServer}&idSchedule=${idSchedule}`
  )
}

export const Loggin_User = async formData => {
  return await axios.post(`/login-users`, formData)
}

export const Register_User = async formData => {
  return await axios.post(`/register-user`, formData)
}

export const getDataAboutUser = async email => {
  return await axios.get(`/system/get-data-user?email=${email}`)
}

export const getListTreatment = async idHos => {
  return await axios.get(`/system/getlist-treatments?idHos=${idHos}`)
}

export const createNewTreatment = async formdata => {
  return await axios.post(`/system/create-request-treatment`, formdata)
}
