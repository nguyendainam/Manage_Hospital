import React, { Component } from 'react'
import { connect } from 'react-redux'
import './Contents.scss'
import { Route, Routes } from 'react-router-dom'
import ManageAccount from '../Admin/ManageAccount'

export class Contents extends Component {
  render () {
    return (
      <div className='contents'>
        <div className='main-contain'>
          <Routes>
            <Route path='/system/all-accout' element={<ManageAccount />} />
          </Routes>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Contents)
