import axios from '../axios.js'

export const LogginSystem = async data => {
  return await axios.post('/system/loggin-account-by-role', data)
}

export const fetchAllHos_Service = async (role, idHos) => {
  return await axios.get(
    `/system/get-all-hospitals?role=${role}&idserver=${idHos}`
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

export const getInforPatientById = async (idServer, idPatient) => {
  return await axios.get(
    `/system/get-patients-byid?idServer=${idServer}&idPatient=${idPatient}`
  )
}

export const getDoctorByIdSpe = async (idServer, id_Spe, page) => {
  return await axios.get(
    `/system/get-listdoctor-bySpe?idServer=${idServer}&id_Spe=${id_Spe}&page=${page}`
  )
}
export const getAllScheduleDr_ByDate = async (idServer, id_Doctor, date) => {
  return await axios.get(
    `/system/get-allschedule-doctor?idServer=${idServer}&id_Doctor=${id_Doctor}&date=${date}`
  )
}

export const createNewBooking = async formData => {
  return await axios.post(`/system/create-new-booking`, formData)
}

export const getAllScheduleBookings = async (idServer, date, page) => {
  return await axios.get(
    `/system/getall-schedule-booking?idServer=${idServer}&date=${date}&page=${page}`
  )
}

export const AcceptBookings = async (idServer, token) => {
  return await axios.get(
    `/system/comfirmbooking?idServer=${idServer}&token=${token}`
  )
}

export const getAllPatientsSchedule = async (idSchedule, idServer, page) => {
  return await axios.get(
    `/system/getall-patient-booking?idSchedule=${idSchedule}&idServer=${idServer}&page=${page}`
  )
}

export const getAlldoctorByIdSpe = async (idServer, idSpe) => {
  return await axios.get(
    `/system/getall-doctor-Spe?idServer=${idServer}&id_Spe=${idSpe}`
  )
}
export const TreatmentPatient = async formData => {
  return await axios.post('/system/patient-treatment', formData)
}
export const getInfor_About_Pat = async (
  idServer,
  id_Infor_Pat,
  id_Hospital
) => {
  return await axios.get(
    `/system/getinfor-Pat?idServer=${idServer}&id_Infor_Pat=${id_Infor_Pat}&id_Hospital=${id_Hospital}`
  )
}

export const checkStatusPatient = async (idServer, idPatient) => {
  return await axios.get(
    `/system/getStatus-Patient?idServer=${idServer}&idPatient=${idPatient}`
  )
}

export const finishedTreatment = async formData => {
  return await axios.put('/system/finished-treatment', formData)
}

export const getPATtreatmenting = async (idServer, idHospital, page) => {
  return await axios.get(
    `/system/getlist-PATtreatment?idServer=${idServer}&idHospital=${idHospital}&page=${page}`
  )
}

export const getInforDoctor = async (idServer, emailUser) => {
  return await axios.get(
    `/system/getall-informationsDr?idServer=${idServer}&emailUser=${emailUser}`
  )
}
export const CreateNewHistory = async formData => {
  return await axios.post('/system/create-histories', formData)
}

export const SaveTreatment = async formData => {
  return await axios.post('/system/post-histories-treatment', formData)
}

export const GetListHistoriesTreatment = async (idServer, pageNumber) => {
  return await axios.get(
    `/system/get-list-treatment?idServer=${idServer}&page=${pageNumber}`
  )
}

export const getIdDoctor_ByEmail = async (idServer, email) => {
  return await axios.get(
    `/system/getidDoctor-byEmail?idServer=${idServer}&email=${email}`
  )
}

export const getDataHistories = async (idServer, idDoctor, page, dateExam) => {
  return await axios.get(
    `/system/getschedule-byDr?idServer=${idServer}&idDoctor=${idDoctor}&page=${page}&dateExam=${dateExam}`
  )
}

export const getListRequest = async (idServer, date) => {
  return await axios.get(
    `/system/get-requesttreatments?idServer=${idServer}&date=${date}`
  )
}

export const comfirmRequest = async (idServer, RequestId, action) => {
  return await axios.get(
    `/system/get-confirm-request?idServer=${idServer}&RequestId=${RequestId}&action=${action}`
  )
}

export const getArrTreatMent = async idServer => {
  return await axios.get(`/system/get-arr-Treatment?idServer=${idServer}`)
}

export const getAboutTreatmentRoom = async (idServer, id_Room) => {
  return await axios.get(
    `/system/getinfor-treatment?idServer=${idServer}&id_Room=${id_Room}`
  )
}

// /system/creat-treatments

export const createTreatments = async formData => {
  return await axios.post('/system/creat-treatments', formData)
}
//

export const UpdateInforUser = async formData => {
  return await axios.post('/system/post-update-information', formData)
}

//
//
//
//////////////
// testing....
export const testing_upload = async formData => {
  return await axios.post('/system/upload-testing', formData)
}
