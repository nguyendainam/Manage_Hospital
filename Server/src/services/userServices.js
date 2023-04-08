import {
  getConnectServer,
  getconnectData1,
  mssql
} from '../database/dataServerTong.js'
import bcrypt from 'bcrypt'
const salt = bcrypt.genSaltSync(10)

const hashUserPassword = password => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt)
      resolve(hashPassword)
    } catch (e) {
      reject(e)
    }
  })
}

let getallAccounts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let pool = await getconnectData1()

      let data = await pool.request().query('select * from Accounts')
      //  console.log('data is.......', data)
      resolve({
        errCode: 0,
        data: data.recordset
      })

      // reject.json('Accounts')
    } catch (e) {
      reject(e)
    }
  })
}

let checkEmail = email => {
  return new Promise(async (resolve, reject) => {
    try {
      let pool = await getconnectData1()
      let result = await pool
        .request()
        .input('emailUser', mssql.VarChar, email)
        .query(
          `select distinct emailUser from Accounts where emailUser like  @emailUser `
        )
      if (result.recordset.length > 0) {
        resolve({
          errCode: -1,
          errMessage: 'Email already exists'
        })
      } else {
        resolve({
          errCode: 0,
          errMessage: 'valid email'
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

let checkid_User = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let id = (Math.random() + 1).toString(36).substring(2)
      let pool = await getConnectServer('ALL')
      let result = await pool
        .request()
        .input('id_Patient', mssql.VarChar, id)
        .query('SELECT id_Patient FROM Patients WHERE id_Patient = @id_Patient')

      if (result.recordset.length > 0) {
        let newid = (Math.random() + 1).toString(36).substring(2)
        return (id = newid)
      } else {
        resolve({ id_Patient: id })
      }
    } catch (e) {
      reject(e)
    }
  })
}

let createNewAccounts = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.password) {
        resolve({
          errCode: -1,
          errMessage: 'Missing data required....'
        })
      } else {
        let passwordHash = await hashUserPassword(data.password)
        let email = await checkEmail(data.email)
        let id = (Math.random() + 1).toString(36).substring(2)

        let roleId = ''
        if (!data.roleId) {
          roleId = 'R1'
        } else {
          roleId = data.roleId
        }
        if (email.errCode === -1) {
          resolve({
            errCode: -2,
            errMessage: 'Email already exists'
          })
        } else if (email.errCode === 0) {
          let pool = await getconnectData1()
          let result = await pool
            .request()
            .input('id_Account', mssql.VarChar, id)
            .input('emailUser', mssql.VarChar, data.email)
            .input('passwordUser', mssql.VarChar, passwordHash)
            .input('role_Account', mssql.VarChar, roleId)
            .query(
              'INSERT INTO Accounts (id_Account ,emailUser ,passwordUser,role_Account) VALUES (@id_Account,@emailUser,@passwordUser,@role_Account)'
            )
          if (result) {
            resolve({
              email: data.email,
              errCode: 0,
              errMessage: 'Successfully created',
              roleId: data.roleId
            })
          }
        }
        pool.close()
      }
    } catch (e) {
      reject(e)
    }
  })
}

let LoginUsers = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.password) {
        resolve({
          errCode: -1,
          errMessage: 'Missing data required....'
        })
      } else {
        let passwordHash = await hashUserPassword(data.password)
        let pool = await getconnectData1()
        let result = await pool
          .request()
          .input('emailUser', mssql.VarChar, data.email)
          .input('passwordUser', mssql.VarChar, passwordHash)
          .query(
            'SELECT * FROM Accounts WHERE emailUser = @emailUser AND passwordUser = @passwordUser'
          )

        if (result) {
          resolve({
            errCode: 0,
            errMessage: 'Successfully logged in'
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let RegisterUsersService = data => {
  return new Promise(async (resolve, reject) => {
    let roleId = ''
    try {
      if (!data) {
        resolve({
          errCode: -1,
          errMessage: 'Missing data required....'
        })
      } else {
        if (data.email) {
          let emailcheck = await checkEmail(data.email)
          if (emailcheck.errCode === -1) {
            resolve({
              errCode: -2,
              errMessage: 'Email already exists'
            })
          }
          if (emailcheck.errCode === 0) {
            if (!data.roleId) {
              roleId = 'R1'
            } else {
              roleId = data.roleId
            }
            let datacreat_new_Account = {
              email: data.email,
              password: data.password,
              roleId: roleId
            }
            let datasend = await createNewAccounts(datacreat_new_Account)
            if (datasend.errCode === 0 && datasend.roleId === 'R1') {
              let getid = await checkid_User()
              let id_Patient = ''
              if (getid) {
                id_Patient = getid.id_Patient
              }
              let emailUser = data.email
              let idServer = data.idServer
              let pool = await getConnectServer(idServer)
              let result = await pool
                .request()
                .input('id_Patient', mssql.VarChar, id_Patient)
                .input('emailUser', mssql.VarChar, emailUser)
                .input('name_Patient', mssql.VarChar, data.fullname)
                .input('birthDay', mssql.Date, data.birthday)
                .input('Address_Patient', mssql.NVarChar, data.address)
                .input('PhoneNumber', mssql.Int, data.phoneNumber)
                .input('gender_Patient', mssql.VarChar, data.gender)
                .input('image_Pat', mssql.VarChar, data.image)
                .input('Note_Patient', mssql.NText, data.note)
                .query(
                  'INSERT INTO Patients(id_Patient, emailUser, name_Patient, birthDay, Address_Patient, PhoneNumber, gender_Patient, image_Pat, Note_Patient) VALUES (@id_Patient , @emailUser ,@name_Patient,@birthDay,@Address_Patient,@PhoneNumber,@gender_Patient,@image_Pat,@Note_Patient) '
                )

              resolve({
                errCode: 0,
                errMessage: 'Successfully created new user'
              })
            }
          }
        } else if (!data.email) {
          let id_Patient = 'error'
          let get_id_Patient = await checkid_User()
          if (get_id_Patient) {
            id_Patient = get_id_Patient.id_Patient
          }

          let idServer = data.idServer
          console.log(idServer)
          let pool = await getConnectServer(idServer)
          let result = await pool
            .request()
            .input('id_Patient', mssql.VarChar, id_Patient)
            .input('name_Patient', mssql.VarChar, data.fullname)
            .input('birthDay', mssql.Date, data.birthday)
            .input('Address_Patient', mssql.NVarChar, data.address)
            .input('PhoneNumber', mssql.Int, data.phoneNumber)
            .input('gender_Patient', mssql.VarChar, data.gender)
            .input('image_Pat', mssql.VarChar, data.image)
            .input('Note_Patient', mssql.NText, data.note)
            .query(
              'INSERT INTO Patients(id_Patient, name_Patient, birthDay, Address_Patient, PhoneNumber, gender_Patient, image_Pat, Note_Patient) VALUES (@id_Patient  ,@name_Patient,@birthDay,@Address_Patient,@PhoneNumber,@gender_Patient,@image_Pat,@Note_Patient) '
            )
          if (result) {
            resolve({
              errCode: 0,
              errMessage: 'Create patient successfully'
            })
          } else {
            resolve({
              errCode: -2,
              errMessage: 'Create patient failed'
            })
          }
        }
      }
    } catch (e) {
      return reject(e)
    }
  })
}

//  =============================SYSTEM===================================
let GetListUsers_Service = page => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!page) {
        page = 1
      }

      let pageNumber = page

      let pageSize = 5
      let pool = await getConnectServer('ALL')

      let query = `
      SELECT *
      FROM (
          SELECT ROW_NUMBER() OVER (ORDER BY id_Patient) AS row_num, *
          FROM Patients
      ) AS page_result
      JOIN Allcode ON Allcode.keymap_Code = page_result.gender_Patient
      WHERE row_num > ${(pageNumber - 1) * pageSize} AND row_num <= ${
        pageNumber * pageSize
      }
  `
      let result = await pool.query(query)

      let total = await pool.query('SELECT COUNT(*) AS totalRow From Patients')
      resolve({
        errCode: 0,
        errMessage: 'Get all database',
        data: result.recordset,
        total: total.recordset[0].totalRow
      })
    } catch (e) {
      reject(e)
    }
  })
}

export default {
  getallAccounts,
  createNewAccounts,
  LoginUsers,
  RegisterUsersService,
  hashUserPassword,
  GetListUsers_Service
}
