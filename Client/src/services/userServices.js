import axios from '../axios'

export const getAllAccounts = async () => {
  return await axios.get('/users')
}
