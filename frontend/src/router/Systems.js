import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Routes, Route } from 'react-router-dom'

import Login from '../container/Systems/Login/Login'
import Header from '../container/Systems/PartWebsite/Header'
import Dashboard from '../container/Systems/Page/dashboard'
import '../../src/assess/style/system.scss'
import ManageHospital from '../container/Systems/Hospital/ManageHospital'
import UpdateInfor from '../container/Systems/Hospital/UpdateInfor'
import Test from '../container/Systems/Testexample/test'
import ListEmployee from '../container/Systems/Doctors/ListEmployee'
import AddnewEmployee from '../container/Systems/Doctors/AddnewEmployee'
import GetAllPatients from '../container/Systems/Patients/getAllPatients'
import ManageSpecialty from '../container/Systems/Hospital/ManageSpecialty'
import ManageClinics from '../container/Systems/Hospital/ManageClinics'
import ManageTreatment from '../container/Systems/Hospital/ManageTreatment'
import InforDoctor from '../container/Systems/Doctors/UpdateInforDoctor'
import ListDoctor from '../container/Systems/Doctors/ListDoctor'
import Booking from '../container/Systems/Booking/Booking'
import ListBooking from '../container/Systems/Booking/ListBooking'
import PatientTreatment from '../container/Systems/Patients/ListPatientTreatment'
import AddnewSchedule from '../container/Systems/ActDoctors/AddnewSchedule'
import HistoriesTreat from '../container/Systems/Treatment/HistoriesTreat'
import AppointMent from '../container/Systems/ActDoctors/AppointMent'
import ListRequest_Treat from '../container/Systems/Booking/ListRequest_Treat'
export class Systems extends Component {
  render () {
    const isLogined = this.props.isLogined

    return (
      <div>
        {isLogined === false ? (
          <Login />
        ) : (
          <>
            <div className='from-system-main'>
              <div className='form-header-system'>
                <Header />
              </div>

              <div className='form-content'>
                <Routes>
                  <Route path='/' element={<Dashboard />} />
                  <Route path='/all-hospital' element={<ManageHospital />} />
                  <Route path='/update-hospital' element={<UpdateInfor />} />
                  <Route path='/test-upload' element={<Test />} />
                  <Route path='/list-employee' element={<ListEmployee />} />
                  <Route path='/list-patient' element={<GetAllPatients />} />
                  <Route path='/manage-clinics' element={<ManageClinics />} />
                  <Route path='/infor-doctors' element={<InforDoctor />} />
                  <Route path='/list-doctors' element={<ListDoctor />} />
                  <Route path='/booking-schedule' element={<Booking />} />
                  <Route path='/add-newschedule' element={<AddnewSchedule />} />
                  <Route path='/list-treatment' element={<HistoriesTreat />} />
                  <Route path='/appointment-dr' element={<AppointMent />} />
                  <Route
                    path='/request-treatment'
                    element={<ListRequest_Treat />}
                  />

                  <Route
                    path='/patient-treatment'
                    element={<PatientTreatment />}
                  />
                  <Route
                    path='/list-booking-schedule'
                    element={<ListBooking />}
                  />

                  <Route
                    path='/add-new-employee'
                    element={<AddnewEmployee />}
                  />
                  <Route
                    path='/manage-treatment'
                    element={<ManageTreatment />}
                  />
                  <Route
                    path='/manage-specialty'
                    element={<ManageSpecialty />}
                  />
                </Routes>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isLogined: state.admin.isLogin
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Systems)
