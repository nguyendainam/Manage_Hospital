import axios from '../axios.js'

export const LogginSystem = async data => {
  return await axios.post('/system/loggin-account', data)
}

export const fetchAllHos_Service = async () => {
  return await axios.get('/system/get-all-hospitals')
}

export const createNewHos_Service = async formData => {
  return await axios.post('/system/create-hospitals', formData)
}

// testing....
export const testing_upload = async formData => {
  return await axios.post('/system/upload-testing', formData)
}
