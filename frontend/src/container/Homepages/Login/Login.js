import React, { Component } from 'react'
import { connect } from 'react-redux'
import './Logins.scss'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeftLong } from '@fortawesome/free-solid-svg-icons'
import { Loggin_User, Register_User } from '../../../services/userServices'
import FormData from 'form-data'
import { fetchGenderData } from '../../../redux/slices/systemSlices'
import { Navigate } from 'react-router-dom'
import {
  getDataUser_Dispatch,
  getLogginUser,
  getDataPatients_Dispatch
} from '../../../redux/slices/userSlices'

export class Logins extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLogin: true,
      email: '',
      password: '',
      textErr: '',
      showErr: 'false',
      fullname: '',
      birthday: '',
      address: '',
      phoneNumber: '',
      selectedGender: '',
      isLoggedIn: false
    }
  }

  componentDidMount () {
    this.props.fetchGenderData('ALL')
  }

  componentDidUpdate (prevProps) {}

  handleRegister () {
    this.setState({
      isLogin: !this.state.isLogin
    })
  }

  // GET VALUES FROM TAG INPUT
  handleOnChangeInput = (event, id) => {
    let coppyState = []
    coppyState[id] = event.target.value
    this.setState({ ...coppyState })
  }

  handleLogin = async () => {
    let { email, password } = this.state
    if (!email || !password) {
      this.setState({
        textErr: 'Không được để trống',
        showErr: true
      })
    } else {
      let formdata = new FormData()
      formdata.append('email', email)
      formdata.append('password', password)

      let getdata = await Loggin_User(formdata)

      if (getdata.data.errCode === 0) {
        console.log(getdata.data.data)

        let arrData = {
          id_Account: getdata.data.data.id_Account,
          emailUser: getdata.data.data.emailUser
        }

        this.props.getDataPatients_Dispatch(getdata.data.data.emailUser)
        this.props.getDataUser_Dispatch(arrData)
        this.props.getLogginUser()
      } else if (getdata.data.errCode !== 0) {
        let textError = getdata.data.errMessage
        console.log(getdata.data.errMessage)
        this.setState({
          showErr: true,
          textErr: textError
        })
      }
    }
  }

  RegisterUser = async () => {
    let {
      email,
      password,
      selectedGender,
      fullname,
      birthday,
      address,
      phoneNumber
    } = this.state

    let { listgender } = this.props
    if (!selectedGender) {
      selectedGender = listgender[0].keymap_Code
    }
    if (
      !email ||
      !password ||
      !fullname ||
      !birthday ||
      !address ||
      !phoneNumber
    ) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    } else {
      let formdata = new FormData()
      formdata.append('email', email)
      formdata.append('idServer', 'ALL')
      formdata.append('password', password)
      formdata.append('fullname', fullname)
      formdata.append('birthday', birthday)
      formdata.append('address', address)
      formdata.append('phoneNumber', phoneNumber)
      formdata.append('gender', selectedGender)

      let sendData = await Register_User(formdata)
      if (sendData.data.errCode === 0) {
        alert('Tạo Tài khoản thành công')
        this.setState({
          isLoggedIn: true
        })
        this.getLogginByUser()
      } else if (sendData.data.errCode !== 0) {
        this.setState({
          textErr: sendData.data.errMessage,
          showErr: true
        })
      }
    }
  }

  render () {
    let {
      isLogin,
      email,
      password,
      showErr,
      textErr,
      selectedGender,
      fullname,
      birthday,
      address,
      phoneNumber
    } = this.state

    let { listgender } = this.props
    if (this.props.isUserLogin === true) {
      return <Navigate to='/home' />
    } else {
      return (
        <>
          <div className='main-view'>
            <div className='background-img'>
              <div className='form-login'>
                <div className='image-float-left'></div>
                <div className='input-float-left'>
                  <div>
                    <Link
                      style={{ textDecoration: 'none' }}
                      onClick={() => window.history.back()}
                    >
                      <FontAwesomeIcon icon={faLeftLong} /> Quay lại
                    </Link>
                  </div>
                  <div className='login'>
                    {isLogin && isLogin === true ? (
                      <>
                        {/* LOGIN */}
                        <span className='title-login'> Đăng Nhập </span>
                        <div className='form-input'>
                          <div>
                            <span>Email</span>
                            <input
                              type='email'
                              className='form-control'
                              onChange={event =>
                                this.handleOnChangeInput(event, 'email')
                              }
                              value={email}
                            />
                          </div>
                          <div>
                            <span>Password</span>
                            <input
                              type='password'
                              className='form-control'
                              onChange={event =>
                                this.handleOnChangeInput(event, 'password')
                              }
                              value={password}
                            />
                          </div>

                          {showErr && showErr === true ? (
                            <span
                              style={{
                                color: 'red',
                                fontSize: '14px',
                                fontStyle: 'italic'
                              }}
                            >
                              {textErr}
                            </span>
                          ) : (
                            ''
                          )}
                        </div>

                        <div>
                          <button
                            className='btn btn-info mr-4'
                            onClick={() => this.handleLogin()}
                          >
                            đăng nhập
                          </button>
                          <button
                            className='btn btn-outline-info'
                            onClick={() => this.handleRegister()}
                          >
                            đăng ký
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* REGISTER */}
                        <span className='title-login'> Đăng Ký </span>

                        <div className='form-input-register'>
                          <div className='a-row'>
                            <div>
                              <span>Email</span>
                              <input
                                type='email'
                                className='text-input'
                                value={email}
                                onChange={event =>
                                  this.handleOnChangeInput(event, 'email')
                                }
                              />
                            </div>
                            <div>
                              <span>Mật Khẩu</span>
                              <input
                                type='password'
                                className='text-input'
                                value={password}
                                onChange={event =>
                                  this.handleOnChangeInput(event, 'password')
                                }
                              />
                            </div>
                          </div>
                          <div className='a-row'>
                            <div>
                              <span>Tên</span>
                              <input
                                type='text'
                                className='text-input1'
                                value={fullname}
                                onChange={event =>
                                  this.handleOnChangeInput(event, 'fullname')
                                }
                              />
                            </div>
                            <div>
                              <span>Ngày Sinh</span>
                              <input
                                type='date'
                                className='text-input2'
                                onChange={event =>
                                  this.handleOnChangeInput(event, 'birthday')
                                }
                                value={birthday}
                              />
                            </div>
                          </div>
                          <div className='a-row'>
                            <div>
                              <span>Địa Chỉ</span>
                              <input
                                type='text'
                                className='text-input1'
                                onChange={event =>
                                  this.handleOnChangeInput(event, 'address')
                                }
                                value={address}
                              />
                            </div>
                            <div>
                              <span>Số Điện Thoại</span>
                              <input
                                type='number'
                                className='text-input2'
                                maxLength={10}
                                onChange={event =>
                                  this.handleOnChangeInput(event, 'phoneNumber')
                                }
                                value={phoneNumber}
                              />
                            </div>
                          </div>
                          <div className='a-row'>
                            <div>
                              <span>Giới tính</span>
                              <select
                                type='date'
                                className='text-input2'
                                onChange={item =>
                                  this.handleOnChangeInput(
                                    item,
                                    'selectedGender'
                                  )
                                }
                                value={selectedGender}
                              >
                                {listgender &&
                                  listgender.length > 0 &&
                                  listgender.map((item, index) => {
                                    return (
                                      <option
                                        key={index}
                                        value={item.keymap_Code}
                                      >
                                        {item.value_Code}
                                      </option>
                                    )
                                  })}
                              </select>
                            </div>
                          </div>
                          {showErr && showErr === true ? (
                            <span>{textErr}</span>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div>
                          <button
                            className='btn btn-info mr-4'
                            onClick={() => this.RegisterUser()}
                          >
                            Xác nhận đăng ký
                          </button>

                          <button
                            className='btn btn-info mr-4'
                            onClick={() => this.handleRegister()}
                          >
                            Quay lại
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )
    }
  }
}

const mapStateToProps = state => ({
  listgender: state.system.listgender,
  dataUser: state.user.dataUser,
  isUserLogin: state.user.isUserLogin
})

const mapDispatchToProps = {
  fetchGenderData,
  getDataUser_Dispatch,
  getLogginUser,
  getDataPatients_Dispatch
}

export default connect(mapStateToProps, mapDispatchToProps)(Logins)
