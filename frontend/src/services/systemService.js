import axios from '../axios.js'

export const LogginSystem = async data => {
  return await axios.post('/system/loggin-account', data)
}
