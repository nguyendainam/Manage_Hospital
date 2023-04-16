import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import ManageAccount from '../container/Systems/Admin/ManageAccount'
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
                  <Route path='/allcount' element={<ManageAccount />} />
                  <Route path='/all-hospital' element={<ManageHospital />} />
                  <Route path='/update-hospital' element={<UpdateInfor />} />
                  <Route path='/test-upload' element={<Test />} />
                  <Route path='/list-employee' element={<ListEmployee />} />
                  <Route path='/list-patient' element={<GetAllPatients />} />
                  <Route path='/manage-clinics' element={<ManageClinics />} />
                  <Route path='/infor-doctors' element={<InforDoctor />} />
                  <Route path='/list-doctors' element={<ListDoctor />} />

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
