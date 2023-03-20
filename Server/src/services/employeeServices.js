import { getconnectData1, mssql } from '../database/dataServerTong.js'
import bcrypt, { hash } from 'bcrypt'
const salt = bcrypt.genSaltSync(10)

const getAllAccountsServices = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let pool = await getconnectData1()
      let result = await pool.request().query('SELECT * FROM accounts')
      resolve(result.recordset)
    } catch (e) {
      return reject(e)
    }
  })
}

const logginAccountServices = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.password) {
        return reject.status(200).json({
          errCode: 1,
          errMessage: 'Email and Password are required'
        })
      } else {
        let email = data.email
        let pool = await getconnectData1()
        let result = await pool
          .request()
          .input('emailUser', mssql.VarChar, email)
          .query('SELECT * FROM Accounts WHERE emailUser = @emailUser')

        if (result.recordset.length > 0) {
          let checkPassword = await bcrypt.compareSync(
            data.password,
            result.recordset[0].passwordUser
          )

          if (checkPassword === true) {
            resolve({
              errCode: 0,
              errMessage: 'login successful'
            })
          } else {
            resolve({
              errCode: 2,
              errMessage: 'Wrong password'
            })
          }
        } else if (result.recordset.length === 0) {
          resolve({
            errCode: 3,
            errMessage: 'User not found'
          })
        }
      }
    } catch (e) {
      return reject(e)
    }
  })
}

export default {
  getAllAccountsServices,
  logginAccountServices
}
