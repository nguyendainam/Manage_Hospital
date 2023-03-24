import React, { Component } from 'react'
import { connect } from 'react-redux'
import './Header.scss'
import {
  getAdminLogin,
  getAdminLogout
} from '../../../redux/slices/adminSlices'

import Navigator from '../../../components/Navigator'

export class Header extends Component {
  componentDidMount () {
    this.props.getAdminLogin()
  }

  handleLogout = () => {
    this.props.getAdminLogout()
    console.log(this.props.account)
  }

  render () {
    console.log('accout fromm header', this.props.Loggined)
    console.log('accout fromm header', this.props.account)
    let account = this.props.account

    return (
      <div className='container-header'>
        
        <div className='form-header'>
          <div className='infor-header'>
            <p className='email-loggin'>{account}</p>
            <button
              type='button'
              className='btn btn-outline-primary'
              onClick={this.handleLogout}
            >
              Logout
            </button>
          </div>
          <div className='navbar-header'>
            <Navigator />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  Loggined: state.admin.isLogin,
  account: state.admin.admin
})

const mapDispatchToProps = { getAdminLogin, getAdminLogout }

export default connect(mapStateToProps, mapDispatchToProps)(Header)
