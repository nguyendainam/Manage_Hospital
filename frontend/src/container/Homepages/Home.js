import React, { Component } from 'react'
import { connect } from 'react-redux'
import './Home.scss'
import Header from './Header/Header'
export class Home extends Component {
  render () {
    return (
      <>
        <Header />
      </>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
