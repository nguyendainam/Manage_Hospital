import React, { Component } from 'react'
import { connect } from 'react-redux'
import './Home.scss'
import Header from './Header/Header'
import ImageShow from './Header/ImageShow'
import AboutHospital from './View/AboutHospital'
export class Home extends Component {
  render () {
    return (
      <div className='containerHome'>
        <Header />
        <ImageShow />
        <AboutHospital />
      </div>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
