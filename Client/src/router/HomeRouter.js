import React, { Component } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../container/Homepages/Home'
import Informations from '../container/Homepages/Informations'
import Logins from '../container/Homepages/Login/Login'

export default class HomeRouter extends Component {
  render () {
    return (
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home-infor' element={<Informations />} />
        <Route path='/home/login' element={<Logins />} />
      </Routes>
    )
  }
}
