import axios from '../axios.js'

export const LogginSystem = async data => {
  return await axios.post('/system/loggin-account-by-role', data)
}

export const fetchAllHos_Service = async (role, idHos) => {
  return await axios.get(
    `/system/get-all-hospitals?role=${role}&&idserver=${idHos}`
  )
}

export const createNewHos_Service = async formData => {
  return await axios.post('/system/create-hospitals', formData)
}

export const getHospitalById = async id => {
  return await axios.get(`/system/get-hospital-by-id?id=${id}`)
}

export const getListDoctors = async (role, idserver) => {
  return await axios.get(
    `/system/get_list_doctors?role=${role}&&idserver=${idserver}`
  )
}

export const getListAllCodes = async key => {
  console.log('key: ', key)
  return await axios.get(`/system/get-allcode-bykey?key=${key}`)
}

export const createNewEmployee = async formData => {
  return await axios.post('/system/create-new-employee', formData)
}
export const UpdateEmployee_Services = async formData => {
  return await axios.post('/system/update-employee', formData)
}

// testing....
export const testing_upload = async formData => {
  return await axios.post('/system/upload-testing', formData)
}
