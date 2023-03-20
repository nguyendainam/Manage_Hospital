import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import ManageAccount from '../container/Systems/Admin/ManageAccount'
import Login from '../container/Systems/Login/Login'
import Header from '../container/Systems/PartWebsite/Header'

export class Systems extends Component {
  render () {
    const { isLogined } = this.props

    return (
      <div>
        {isLogined === false ? (
          <Login />
        ) : (
          <div>
            <Header />

            <Routes>
              <Route path='/allcount' element={<ManageAccount />} />
            </Routes>
          </div>
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
