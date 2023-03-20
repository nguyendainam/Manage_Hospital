import React, { Component } from 'react'
import { connect } from 'react-redux'
import {getAllAccounts} from '../services/userServices'

export class index extends Component {

  constructor(props) {
    super(props)
    this.state ={
      users: []
    }
  }

  render() {
    const data = getAllAccounts() 
  
   console.log(data.then((res) => {
    console.log(res.data);
   }))
    
    return (
      <div>index</div>
    )
  }
}

const mapStateToProps = (state) => ({
users: state.user.userList

})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(index)