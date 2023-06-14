import React, { Component } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from '../container/Homepages/Home'
import Informations from '../container/Homepages/Informations'
import Logins from '../container/Homepages/Login/Login'
import Hospitals from '../container/Homepages/View/Hospitals'
import Specialty from '../container/Homepages/View/Sections/Specialty'
import UserPage from '../container/Homepages/View/User/UserPage'
import PageDoctor from '../container/Homepages/View/Doctor/PageDoctor'
export default class HomeRouter extends Component {
  render () {
    return (
      <Routes>
        <Route path='/home' element={<Home />} exact />
        <Route path='/' element={<Home />} />
        <Route path='/home-infor' element={<Informations />} />
        <Route path='/login' element={<Logins />} />
        <Route path='/:idHos' element={<Hospitals />} exact />
        <Route path='/user/:idAccount' element={<UserPage />} />
        <Route path='/specialty/:idHos/:idSpe' element={<Specialty />} />
        <Route path='/pagedoctor/:idHos/:idDoctor' element={<PageDoctor />} />
      </Routes>
    )
  }
}
