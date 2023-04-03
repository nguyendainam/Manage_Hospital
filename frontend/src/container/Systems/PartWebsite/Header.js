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
  componentDidUpdate (prevProps) {
    if (this.props.account !== prevProps.account) {
    }
  }

  handleLogout = () => {
    this.props.getAdminLogout()
  }

  render () {
    let account = this.props.account.fullName
    let adminRoute = this.props.account.role_Account
    // console.log('Router serverrrrrrr', this.props.routeServer)

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
            <Navigator userRoute={adminRoute} />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  Loggined: state.admin.isLogin,
  account: state.admin.admins,
  routeServer: state.admin.routeServer
})

const mapDispatchToProps = { getAdminLogin, getAdminLogout }

export default connect(mapStateToProps, mapDispatchToProps)(Header)
