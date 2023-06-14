import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import './Header.scss'
import { getLogOutUser, getClearUser } from '../../../redux/slices/userSlices'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
export class Header extends Component {
  handleLogOutUser = () => {
    this.props.getLogOutUser()
    this.props.getClearUser()
  }
  render () {
    let { dataUser, checkLoginUser } = this.props

    return (
      <>
        <div className='container-header'>
          <div className='header'>
            <ul className='navbar-nav'>
              <li className='nav-item'>
                <div className='Logo'></div>
              </li>
              <li className='nav-item'>
                <p className='name_tag'>Chuyên Khoa</p>
                <p className='name_tittle'>Tìm bác sĩ theo chuyên khoa</p>
              </li>
              <li className='nav-item'>
                <p className='name_tag'>Cơ sở y tế</p>
                <p className='name_tittle'>Tìm bác sĩ theo chuyên khoa</p>
              </li>
              <li className='nav-item'>
                <p className='name_tag'>Bác sĩ</p>
                <p className='name_tittle'>Tìm bác sĩ theo chuyên khoa</p>
              </li>

              <li className='button-item'>
                {checkLoginUser === false ? (
                  <>
                    <Link to='/home/login'>
                      <button type='button' className='btn btn-outline-primary'>
                        Đăng nhập
                      </button>
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      className='btn btn-primary sm '
                      onClick={() => this.handleLogOutUser()}
                    >
                      Đăng Xuất
                    </button>
                    <Link to={`/user/${dataUser.id_Account}`}>
                      <div style={{ paddingLeft: '20px', fontSize: '30px' }}>
                        <FontAwesomeIcon
                          icon={faUserCircle}
                          size='lg'
                          style={{ color: '#f0f2f5' }}
                        />
                      </div>
                    </Link>
                  </>
                )}
              </li>
            </ul>
          </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = state => ({
  dataUser: state.user.dataUser,
  checkLoginUser: state.user.isUserLogin
})

const mapDispatchToProps = {
  getLogOutUser,
  getClearUser
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
