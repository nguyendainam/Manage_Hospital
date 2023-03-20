import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAdminLogin, getAboutAdmin } from '../../../redux/slices/adminSlices'
import { LogginSystem } from '../../../services/systemService'

import './Login.scss'
export class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLogin: true,
      email: '',
      password: '',
      errCode: false,
      message: 'aaaaaaaaaa'
    }
  }

  componentDidMount () {}
  componentDidUpdate () {}

  CheckLogin = async () => {
    let data = {
      email: this.state.email,
      password: this.state.password
    }
    if (!data.email || !data.password) {
      this.setState({
        errCode: true,
        message: 'Không được để trống thông tin'
      })
    } else {
      let datasend = await LogginSystem(data)
      if (datasend.data.errCode === 0) {
        this.props.getAdminLogin()
        this.props.getAboutAdmin(data.email)
      } else {
        if (datasend.data.errCode === 3) {
          this.setState({
            errCode: true,
            message: 'Vui lòng kiểm tra địa chỉ email'
          })
        } else if (datasend.data.errCode === 2) {
          this.setState({
            errCode: true,
            message: 'Vui lòng kiểm tra lại thông tin đăng nhập'
          })
        }
      }
    }
  }

  onChangeInput = (event, id) => {
    let coppySate = { ...this.state }
    coppySate[id] = event.target.value

    this.setState({
      ...coppySate
    })
  }

  render () {
    console.log('login....', this.props.isLogin)

    let { email, password, message, errCode } = this.state

    return (
      <div className='admin-login-page'>
        <div className='from-container'>
          <div className='form-input'>
            <p> LOGIN </p>
            <div className='input-login'>
              <input
                className='login__input'
                type='email'
                placeholder='UserName / Email'
                value={email}
                onChange={event => this.onChangeInput(event, 'email')}
              />
            </div>
            <div className='input-login'>
              <input
                className='login__input'
                type='password'
                placeholder='password'
                value={password}
                onChange={event => this.onChangeInput(event, 'password')}
              />
            </div>

            <div className='form-text'>
              {errCode === true ? (
                <p className='text-error'>{message} </p>
              ) : (
                <></>
              )}
            </div>
          </div>

          <button
            type='button'
            className='btn btn-outline-primary'
            onClick={() => this.CheckLogin()}
          >
            Login Now
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isLogin: state.admin.isLogin
})

const mapDispatchToProps = { getAdminLogin, getAboutAdmin }

export default connect(mapStateToProps, mapDispatchToProps)(Login)
