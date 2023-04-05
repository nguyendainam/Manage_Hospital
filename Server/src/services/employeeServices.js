import {
  getconnectData1,
  mssql,
  getConnectServer
} from '../database/dataServerTong.js'
import bcrypt, { hash } from 'bcrypt'
import e, { request } from 'express'
const salt = bcrypt.genSaltSync(10)
import systemServices from './systemServices.js'
import * as fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// =====================================================================
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

let getAllAccountsServices = () => {
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

let logginAccountServices = data => {
  // console.log(data)
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

let logginAccoutByRole_Service = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.password) {
        resolve({
          errCode: 1,
          errMessage: 'Email and Password missing required'
        })
      } else {
        // check email
        let email = data.email
        let pool = await getconnectData1()
        let result = await pool
          .request()
          .input('emailUser', mssql.VarChar, email)
          .query(
            'SELECT emailUser, passwordUser,role_Account FROM Accounts WHERE emailUser = @emailUser'
          )
        if (result.recordset.length > 0) {
          let checkPassword = await bcrypt.compareSync(
            data.password,
            result.recordset[0].passwordUser
          )
          if (checkPassword === true) {
            if (result.recordset[0].role_Account === 'R4') {
              let email = result.recordset[0].emailUser
              let result1 = pool
                .request()
                .input('emailUser', mssql.VarChar, email)
                .query(
                  'SELECT Accounts.emailUser, Accounts.role_Account ,Employees.id_Hospital  , Employees.fullName FROM Accounts INNER JOIN Employees ON Accounts.emailUser = Employees.emailUser  WHERE Accounts.emailUser = @emailUser AND Employees.emailUser = @emailUser'
                )

              resolve({
                errCode: 0,
                errMessage: 'login successful',
                data: (await result1).recordset
              })
            } else if (result.recordset[0].role_Account === 'R1') {
              resolve({
                errCode: 3,
                errMessage: 'login failed'
              })
            } else if (
              result.recordset[0].role_Account === 'R2' ||
              result.recordset[0].role_Account === 'R3'
            ) {
              let email = result.recordset[0].emailUser
              let result1 = pool
                .request()
                .input('emailUser', mssql.VarChar, email)
                .query(
                  'SELECT Accounts.emailUser, Accounts.role_Account ,Employees.id_Hospital  , Employees.fullName FROM Accounts INNER JOIN Employees ON Accounts.emailUser = Employees.emailUser  WHERE Accounts.emailUser = @emailUser AND Employees.emailUser = @emailUser'
                )
              // console.log('aaaaaaaaaaaaa', (await result1).recordset)
              if (result1) {
                await resolve({
                  errCode: 0,
                  errMessage: 'login successful',
                  data: (await result1).recordset
                })
              } else if (!result1) {
                resolve({
                  errCode: 4,
                  errMessage: 'login failed'
                })
              }
            }
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
      reject(e)
    }
  })
}

let getListDoctors_Service = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let pool = await getConnectServer(data.idserver)
        let result = await pool
          .request()
          .query(
            'SELECT  Employees.*  , Allcode.value_Code as genders_value FROM Employees ,Allcode WHERE Employees.gender = Allcode.keymap_Code'
          )

        let result1 = await pool
          .request()
          .query(
            'SELECT  Employees.id_Employee ,Employees.position,Accounts.role_Account as Role_EmailUser  , Allcode.value_Code as position_value , Hospitals.name_Hospital FROM Employees ,Allcode ,Accounts  , Hospitals WHERE Employees.position = Allcode.keymap_Code AND Employees.id_Hospital = Hospitals.id_Hospital  AND Employees.emailUser = Accounts.emailUser'
          )

        let object1 = result.recordset
        let object2 = result1.recordset
        // console.log(object1)
        // console.log(object2)

        function getEmployees () {
          object1.forEach((element, index, Array) => {
            object2.forEach(element2 => {
              if (
                element2.position === element.position &&
                element2.id_Employee === element.id_Employee
              ) {
                const newEmployees = {
                  ...element,
                  ...element2
                }
                Array[index] = newEmployees
              }
            })
          })
          return object1
        }
        let getdata = getEmployees()

        if (result) {
          resolve({
            errCode: 0,
            errMessage: 'Request successful',
            data: getdata
          })
        } else {
          resolve({
            errCode: 2,
            errMessage: 'Request failed'
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let checkEmailEmployees = email => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!email) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let emailUser = email
        let pool = await getConnectServer()
        let result = await pool
          .request()
          .input('emailUser', mssql.VarChar, emailUser)
          .query('SELECT * FROM Accounts WHERE emailUser = @emailUser')

        if (result.recordset.length > 0) {
          resolve({
            errCode: 1,
            data: result.recordset
          })
        } else {
          resolve({
            errCode: 0
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let createnewAccount_Employee = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let emailUser = data.email
        let password = '123456'
        let id_Account = (Math.random() + 1).toString(36).substring(2)
        if (data.password) {
          password = data.password
        }
        let passwordHash = await hashUserPassword(password)
        let role_Account = data.role_Account

        let pool = await getConnectServer(data.idserver)
        let result = await pool
          .request()
          .input('emailUser', mssql.VarChar, emailUser)
          .input('passwordUser', mssql.VarChar, passwordHash)
          .input('id_Account', mssql.VarChar, id_Account)
          .input('role_Account', mssql.VarChar, role_Account)
          .query(
            'INSERT INTO Accounts (id_Account ,emailUser, passwordUser, role_Account ) VALUES (@id_Account, @emailUser, @passwordUser ,@role_Account) '
          )
        if (result) {
          resolve({
            errCode: 0,
            errMessage: 'Create new Accout success full'
          })
        } else {
          resolve({
            errCode: -2,
            errMessage: 'Create account failed'
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let createnewEmployee_Service = data => {
  return new Promise(async (resolve, reject) => {
    console.log(data.body, 'data.........................')
    try {
      if (!data.body) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let getdata = data.body
        let emailUser,
          filename = ''
        if (getdata.email) {
          let checkEmail = await checkEmailEmployees(getdata.email)
          console.log(checkEmail)
          if (checkEmail.errCode === 0) {
            let data_create_Account = {
              email: getdata.email,
              idserver: getdata.idserver,
              role_Account: data.role_Account
            }

            let createAccount = await createnewAccount_Employee(
              data_create_Account
            )
            console.log(createAccount, 'created account')
            if (createAccount.errCode === 0) {
              emailUser = getdata.email
            }
          } else {
            emailUser = null
          }
        }
        if (data.files.filesimage) {
          let saveimage = await systemServices.SaveImage(
            data.files.filesimage,
            'Employees'
          )
          console.log(saveimage)
          if (saveimage.errCode === 0) {
            filename = `Employees/${saveimage.filename}`
          } else {
            filename = ''
          }
        }
        let phone = getdata.phoneNumber
        let phoneNumber = parseInt(phone)
        let id = await systemServices.createnewId(
          'Employees',
          getdata.id_Hospital
        )
        let fullName = getdata.fullname
        let gender = getdata.gender
        let position = getdata.position
        let address = getdata.address
        let id_Hospital = getdata.id_Hospital
        let birthDay = getdata.birthDay

        let pool = await getConnectServer(getdata.idserver)
        let result = await pool
          .request()
          .input('id_Employee', mssql.VarChar, id)
          .input('emailUser', mssql.VarChar, emailUser)
          .input('fullName', mssql.NVarChar, fullName)
          .input('image_Employee', mssql.VarChar, filename)
          .input('gender', mssql.VarChar, gender)
          .input('phoneNumber', mssql.Int, phoneNumber)
          .input('position', mssql.VarChar, position)
          .input('id_Hospital', mssql.VarChar, id_Hospital)
          .input('address_Emp', mssql.NVarChar, address)
          .input('birthDay', mssql.Date, birthDay)
          .query(
            'INSERT INTO Employees ( id_Employee, emailUser ,  fullName ,birthDay,  image_Employee ,phoneNumber,  gender , position, id_Hospital ,  address_Emp)  VALUES  ( @id_Employee, @emailUser ,  @fullName , @birthDay,  @image_Employee ,@phoneNumber,  @gender , @position, @id_Hospital ,  @address_Emp)  '
          )
        console.log(result)
        if (result) {
          resolve({
            errCode: 0,
            errMessage: 'Create employee successfully'
          })
        } else {
          resolve({
            errCode: -1,
            errMessage: 'Create employee failed'
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let updateEmployee_Service = data => {
  // console.log(data.body)

  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          errCode: -1,
          errMessage: 'Missing data required'
        })
      } else {
        let getformdata = data.body
        let oldfileimage = getformdata.oldImage
        let filename = ''
        let sendfile = ''
        // nếu có ảnh
        if (data.files !== null) {
          sendfile = await systemServices.SaveImage(
            data.files.fileimage,
            'Employees'
          )
          if (sendfile.errCode === 0) {
            filename = `Employees/${sendfile.filename}`
          } else {
            resolve({
              errCode: -2,
              errMessage: 'Không lưu được ảnh'
            })
          }
        }
        // nếu không có ảnh nhưng có tên file ảnh cũ
        else if (data.files === null && getformdata.filename !== null) {
          filename = getformdata.filename
        } else {
          filename = 'NULL'
        }
        let email = await checkEmailEmployees(getformdata.email)
        let emailUser = ''
        if (email.errCode === 1) {
          console.log('kiểm tra email thành công')
          emailUser = email.data[0].emailUser
          if (email.data[0].role_Account !== getformdata.Role_EmailUser) {
            console.log(email.data[0].role_Account)
            console.log('khácccccccc')
            try {
              let pool = await getConnectServer(getformdata.idServer)

              let update = await pool
                .request()
                .input(
                  'role_Account',
                  mssql.VarChar,
                  getformdata.Role_EmailUser
                )
                .input('emailUser', mssql.VarChar, emailUser)
                .query(
                  'UPDATE Accounts SET role_Account = @role_Account WHERE emailUser = @emailUser'
                )
              console.log(update)
            } catch (e) {
              console.log(e)
            }
          }
        } else if (email.errCode === 0) {
          let data_create_Account = {
            email: getformdata.email,
            role_Account: getformdata.Role_EmailUser,
            idserver: getformdata.idServer
          }
          emailUser = await createnewAccount_Employee(data_create_Account)
          if (emailUser.errCode === 0) {
            emailUser = getformdata.email
          } else {
            emailUser = 'NULL'
            resolve({
              errMessage: 'Không tạo đc email'
            })
          }
        }
        let fullname = getformdata.fullname
        let gender = getformdata.gender
        let address = getformdata.address
        let id_Employee = getformdata.id_Employee
        let position = getformdata.position
        let birthDay = getformdata.birthday
        let phoneNumber = getformdata.phoneNumber

        let pool = await getConnectServer(getformdata.idServer)
        try {
          let result = await pool
            .request()
            .input('id_Employee', mssql.VarChar, id_Employee)
            .input('emailUser', mssql.VarChar, emailUser)
            .input('fullName', mssql.NVarChar, fullname)
            .input('birthDay', mssql.Date, birthDay)
            .input('image_Employee', mssql.VarChar, filename)
            .input('phoneNumber', mssql.Int, phoneNumber)
            .input('gender', mssql.VarChar, gender)
            .input('position', mssql.VarChar, position)
            .input('address_Emp', mssql.NVarChar, address)
            .query(
              'UPDATE  Employees SET emailUser = @emailUser , fullName = @fullName, birthDay = @birthDay, image_Employee = @image_Employee ,phoneNumber = @phoneNumber , gender = @gender  , position = @position , address_Emp = @address_Emp WHERE id_Employee = @id_Employee '
            )
          if (result) {
            if (
              sendfile.errCode === 0 &&
              oldfileimage !== null &&
              oldfileimage !== filename
            ) {
              let newpath = __dirname + '../../../files/' + oldfileimage
              fs.unlink(newpath, err => {
                if (err) {
                  console.log(err)
                  return
                }
                console.log('Delete old file image successfully')
              })
            }

            resolve({
              errCode: 0,
              errMessage: 'Update thông tin thành công'
            })
          }
        } catch (e) {
          reject(e)
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

export default {
  getAllAccountsServices,
  logginAccountServices,
  logginAccoutByRole_Service,
  getListDoctors_Service,
  createnewEmployee_Service,
  updateEmployee_Service
}
