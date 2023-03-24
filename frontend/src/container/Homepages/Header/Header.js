import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import './Header.scss'

export class Header extends Component {
  render () {
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
                <Link to='/home/login'>
                  <button type='button' className='btn btn-outline-primary'>
                    Login
                  </button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
