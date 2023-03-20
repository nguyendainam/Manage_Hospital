import React, { Component } from 'react'
import { connect } from 'react-redux'

export class Informations extends Component {
  render() {
    return (
      <div>Informations</div>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Informations)