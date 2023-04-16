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

export const getListDoctors = async (role, idserver, page) => {
  return await axios.get(
    `/system/get_list_employee?role=${role}&&idserver=${idserver}&&page=${page}`
  )
}

export const getListAllCodes = async (key, idServer) => {
  return await axios.get(
    `/system/get-allcode-bykey?key=${key}&idServer=${idServer}`
  )
}

export const createNewEmployee = async formData => {
  return await axios.post('/system/create-new-employee', formData)
}
export const UpdateEmployee_Services = async formData => {
  return await axios.post('/system/update-employee', formData)
}

export const getListPatients = async (idServer, page) => {
  return await axios.get(
    `/system/users-getall?idServer=${idServer}&page=${page}`
  )
}

export const CreateorUpdatePatient = async formData => {
  return await axios.post('/system/users-createorupdate', formData)
}

//=======================SPECIALTY==============================

export const GetAllSpecialty = async (idServer, page) => {
  return await axios.get(
    `/system/getall-specialty?idServer=${idServer}&page=${page}`
  )
}

export const CreateNewSpecialty = async formData => {
  return await axios.post('/system/create-specialty', formData)
}

export const UpdateSpecialty = async formData => {
  return await axios.post(`/system/update-specialty`, formData)
}

export const GetListSpebyidServer = async id => {
  return await axios.get(`/system/getlist-spe-by-idServer?id=${id}`)
}

// '
//=======================CLINICS============================

export const getAllClinics = async (idServer, page) => {
  return await axios.get(
    `/system/getall-clinics?idServer=${idServer}&page=${page}`
  )
}

export const createNewClinics = async formData => {
  return await axios.post('/system/create-clinics', formData)
}

export const UpdateClinics = async formData => {
  return await axios.put(`/system/update-clinics`, formData)
}
//

export const GetListClinicsidServer = async (id, id_Spe) => {
  return await axios.get(
    `/system/getlist-clinics-byidServer?idServer=${id}&id_Spe=${id_Spe}`
  )
}
// ======================== TREATMENTS

export const getAllTreatments = async idServer => {
  return await axios.get(`/system/getall-treatment?key=${idServer}`)
}

export const createNewTreatments = async formData => {
  return await axios.post(`/system/create-treatment`, formData)
}

export const updateTreatments = async formData => {
  return await axios.put(`/system/update-treatment`, formData)
}

//  ======================== BEDS ========================

export const getBedTreatments = async (page, idServer, id_Room) => {
  return await axios.get(
    `/system/get-bed-hospital?&page=${page}&idServer=${idServer}&id_Room=${id_Room}`
  )
}

export const createBedTreatments = async formData => {
  return await axios.post(`/system/create-bed-hospital`, formData)
}

export const deleteBedTreatments = async formData => {
  return await axios.put(`/system/delete-bed-hospital`, formData)
}

// OTHER =================================================================
export const getListDoctorSlices = async idServer => {
  return await axios.get(`/system/get_list_doctor?idServer=${idServer}`)
}

export const getInforDoctorById = async (idServer, id_Employee) => {
  return await axios.get(
    `/system/getinfor_Doctor?idServer=${idServer}&id_Employee=${id_Employee}`
  )
}

export const postInforDoctor = async formData => {
  return await axios.post(`/system/information-doctors`, formData)
}

export const getAllDoctor = async (idServer, id_Spe, page) => {
  return await axios.get(
    `/system/get-all-doctor?idServer=${idServer}&id_Spe=${id_Spe}&page=${page}`
  )
}

export const createNewSchedule = async formData => {
  return await axios.post(`/system/create-schedule`, formData)
}

export const getListBooking_Dr = async (idServer, id_Doctor, date, page) => {
  return await axios.get(
    `/system/get-schedule-doctor?idServer=${idServer}&id_Doctor=${id_Doctor}&date=${date}&page=${page}`
  )
}
//
//
//////////////
// testing....
export const testing_upload = async formData => {
  return await axios.post('/system/upload-testing', formData)
}
