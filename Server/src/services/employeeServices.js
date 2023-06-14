import {
  getconnectData1,
  mssql,
  getConnectServer
} from '../database/dataServerTong.js'
import bcrypt, { hash } from 'bcrypt'
const salt = bcrypt.genSaltSync(10)
import systemServices from './systemServices.js'
import * as fs from 'fs'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment/moment.js'
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

let getListEmployee_Service = data => {
  console.log(data, 'getall Employee')
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let page = data.page
        if (!page) {
          page = 1
        }
        let pageNumber = page
        let pageSize = 5

        let pool = await getConnectServer(data.idserver)
        let query = `SELECT * FROM 
        (SELECT ROW_NUMBER() OVER (ORDER BY id_Employee)AS row_num, *FROM Employees) AS page_result 
        JOIN Allcode ON Allcode.keymap_Code = page_result.gender
        WHERE row_num > ${(pageNumber - 1) * pageSize} AND row_num <= ${
          pageNumber * pageSize
        }
        `
        let result = await pool.query(query)
        // console.log(result)
        // let result = await pool
        //   .request()
        //   .query(
        //     'SELECT  Employees.*  , Allcode.value_Code as genders_value FROM Employees ,Allcode WHERE Employees.gender = Allcode.keymap_Code'
        //   )

        let result1 = await pool
          .request()
          .query(
            'SELECT Employees.id_Employee ,Employees.position,Accounts.role_Account as Role_EmailUser  , Allcode.value_Code as position_value , Hospitals.name_Hospital FROM Employees ,Allcode ,Accounts  , Hospitals WHERE Employees.position = Allcode.keymap_Code AND Employees.id_Hospital = Hospitals.id_Hospital  AND Employees.emailUser = Accounts.emailUser'
          )
        // console.log('=======================================')
        // console.log(result1, '==============================')

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
        // console.log(getdata)
        let total = await pool.query(
          'SELECT COUNT(*) AS totalRow FROM Employees'
        )

        if (result) {
          resolve({
            errCode: 0,
            errMessage: 'Request successful',
            data: getdata,
            total: total.recordset[0].totalRow
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
  console.log('data... create Account ...', data)
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
  console.log(data.body)
  return new Promise(async (resolve, reject) => {
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
          if (checkEmail.errCode === 0) {
            let data_create_Account = {
              email: getdata.email,
              idserver: getdata.idserver,
              role_Account: getdata.role_Account
            }

            let createAccount = await createnewAccount_Employee(
              data_create_Account
            )

            console.log(createAccount, 'created account////')

            if (createAccount.errCode === 0) {
              emailUser = getdata.email
            }
          } else {
            emailUser = null
          }
        }
        if (data.files && data.files.filesimage && data.files !== null) {
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
        } else if (!data.files) {
          filename = null
        }

        let id = uuidv4().slice(0, 19)
        let phone = getdata.phoneNumber
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
          .input('phoneNumber', mssql.Int, phone)
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

let getListDoctor_Service = idServer => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!idServer) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let pool = await getConnectServer(idServer)
        let result = await pool
          .request()
          .query(
            `SELECT id_Employee , fullName FROM Employees WHERE Employees.position = 'POEM2'`
          )
        if (result.recordset.length > 0) {
          resolve({
            errCode: 0,
            errMessage: 'Get Data successfully',
            data: result.recordset
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getInformations_Doctors_Service = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data || !data.id_Employee) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let pool = await getConnectServer(data.idServer)
        // let id_Doctor = data.id_Doctor
        let id_Employee = data.id_Employee
        let query = `SELECT  dt.* , Allcode.value_Code ,Specialties.name_Spe, Clinics.name_Clinic  FROM Doctor_Infor  as dt  
          JOIN Allcode ON (Allcode.keymap_Code = dt.position_Dr) 
          JOIN Specialties ON (Specialties.id_Spe = dt.id_Spe)
          JOIN Clinics ON (Clinics.id_Clinic = dt.id_Clinic)
          WHERE dt.id_Employee = '${id_Employee}'
        `
        let query2 = `SELECT * FROM  Employees WHERE id_Employee = '${id_Employee}'`
        let result = await pool.query(query)
        let result2 = await pool.query(query2)
        if (result.recordset.length > 0) {
          resolve({
            errCode: 0,
            errMessage: 'Get information about doctor',
            data: result.recordset[0],
            about_doctor: result2.recordset[0]
          })
        } else if (result.recordset.length === 0) {
          resolve({
            errCode: 2,
            errMessage: 'information  about doctor is empty',
            data: [],
            about_doctor: result2.recordset[0]
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let updateInforDoctors = data => {
  console.log(data, 'data Updateeeeeeeeeeeeeeedddddddddđ')
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let oldImage = data.fileOldImage
        let id_Employee = data.id_Employee
        let email = data.email
        let gender = data.gender
        let birthDay = data.birthDay
        let phoneNumber = data.phoneNumber
        let idServer = data.idServer
        let address = data.address
        let saveImage,
          filename = ''
        if (data.files !== null) {
          console.log('bbbbbbbb')
          saveImage = await systemServices.SaveImage(
            data.files.fileimage,
            'Employees'
          )
          if (saveImage.errCode === 0) {
            filename = `Employees/${saveImage.filename}`
          } else {
            filename = oldImage
            resolve({
              errCode: -2,
              errMessage: 'Save image failed'
            })
          }
        } else if (data.files === null) {
          console.log('aaaaaa')
          filename = oldImage
        }
        let pool = await getConnectServer(idServer)
        let result = await pool
          .request()
          .input('id_Employee', mssql.VarChar, id_Employee)
          .input('emailUser', mssql.VarChar, email)
          .input('birthDay', mssql.Date, birthDay)
          .input('address_Emp', mssql.NVarChar, address)
          .input('phoneNumber', mssql.Int, phoneNumber)
          .input('gender', mssql.VarChar, gender)
          .input('image_Employee', mssql.VarChar, filename)
          .query(
            'UPDATE  Employees SET birthDay = @birthDay , address_Emp =@address_Emp , phoneNumber =@phoneNumber , gender =@gender , image_Employee= @image_Employee WHERE emailUser = @emailUser AND id_Employee = @id_Employee  '
          )

        if (result) {
          resolve({
            errCode: 0,
            errMessage: 'Update Successful'
          })
          if (saveImage.errCode === 0 && filename !== oldImage) {
            let Path = __dirname + '../../files/' + oldImage
            fs.unlink(Path, err => {
              if (err) {
                console.log(err, 'xóa thất bại')
                return
              } else {
                console.log('Lưu Thành công')
              }
            })
          }
        } else {
          resolve({
            errCode: 2,
            errMessage: 'Update Fail'
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

//  cần truyền vào id_Employee , idServer
let informationDoctors_Service = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.body || !data.body.id_Employee) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let send_dataDr = {
          email: data.body.email,
          id_Employee: data.body.id_Employee,
          idServer: data.body.idServer,
          gender: data.body.gender,
          files: data.files,
          phoneNumber: data.body.phoneNumber,
          address: data.body.address,
          fileOldImage: data.body.fileOldImage,
          birthDay: data.body.birthDay
        }
        let updateDr = await updateInforDoctors(send_dataDr)
        console.log(updateDr, '---------------updateDr-----------------')
        let pool = await getConnectServer(data.body.idServer)
        let databody = data.body
        if (databody.action === 'CREATE') {
          let id = await systemServices.createnewId(
            'Employees',
            databody.idServer
          )
          let id_Spe = databody.id_Spe
          let id_Clinic = databody.id_Clinic
          let description_Dr = databody.description
          let position_Dr = databody.position
          let id_Employee = databody.id_Employee
          let result = await pool
            .request()
            .input('id_Doctor', mssql.VarChar, id)
            .input('id_Employee', mssql.VarChar, id_Employee)
            .input('id_Clinic', mssql.VarChar, id_Clinic)
            .input('id_Spe', mssql.VarChar, id_Spe)
            .input('position_Dr', mssql.VarChar, position_Dr)
            .input('description_Dr', mssql.NText, description_Dr)
            .query(`INSERT INTO  Doctor_Infor (id_Doctor ,  id_Employee , id_Clinic , id_Spe , position_Dr , description_Dr) SELECT * FROM (SELECT @id_Doctor as id_Doctor , @id_Employee as id_Employee , @id_Clinic  as id_Clinic, @id_Spe as id_Spe  , @position_Dr as position_Dr , @description_Dr as description_Dr)  as tmp  WHERE NOT EXISTS (SELECT * FROM  Doctor_Infor WHERE Doctor_Infor.id_Employee = tmp.id_Employee )
              `)

          if (result.rowsAffected[2] === 0) {
            resolve({
              errCode: 2,
              errMessage: 'Informational doctor already exists'
            })
          } else if (result.rowsAffected[2] === 1) {
            resolve({
              errCode: 0,
              errMessage: 'Create informational doctor successfully'
            })
          }
        } else if (databody.action === 'UPDATE') {
          if (!databody.id_Doctor) {
            resolve({
              errCode: 1,
              errMessage: 'Missing data required '
            })
          } else {
            let id_Employee = databody.id_Employee
            let id_Doctor = databody.id_Doctor
            let id_Spe = databody.id_Spe
            let id_Clinic = databody.id_Clinic
            let description_Dr = databody.description
            let position_Dr = databody.position
            let result = await pool
              .request()
              .input('id_Doctor', mssql.VarChar, id_Doctor)
              .input('id_Employee', mssql.VarChar, id_Employee)
              .input('id_Clinic', mssql.VarChar, id_Clinic)
              .input('id_Spe', mssql.VarChar, id_Spe)
              .input('position_Dr', mssql.VarChar, position_Dr)
              .input('description_Dr', mssql.NText, description_Dr)
              .query(
                `UPDATE  Doctor_Infor  SET  id_Clinic = @id_Clinic , id_Spe= @id_Spe , position_Dr = @position_Dr  , description_Dr = @description_Dr  WHERE id_Doctor = @id_Doctor and id_Employee = @id_Employee `
              )
            if (result.rowsAffected[3] === 1) {
              resolve({
                errCode: 0,
                errMessage: 'Update Information successfully '
              })
            } else if (result.rowsAffected[3] === 0) {
              resolve({
                errCode: 2,
                errMessage: 'Update failed '
              })
            }
          }
        } else {
          resolve({
            errCode: -2,
            errMessage: 'Error for action'
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getAllDoctor_Service = data => {
  console.log(data)
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let pool = await getConnectServer(data.idServer)
        let query,
          query2 = ''
        let page = data.page
        if (!page) page = 1
        let currentPage = 10
        if (data.id_Spe === 'ALL') {
          query = `SELECT  dr.* , Employees.fullName , Employees.image_Employee , Specialties.name_Spe , Clinics.name_Clinic , Allcode.value_Code 
          FROM  (SELECT ROW_NUMBER() OVER (ORDER BY id_Doctor) AS row_number, *FROM Doctor_Infor) AS dr 
          
                      JOIN Employees ON (dr.id_Employee = Employees.id_Employee )
                      JOIN Specialties ON (dr.id_Spe = Specialties.id_Spe)
                      JOIN Clinics ON(dr.id_Clinic= Clinics.id_Clinic)
                      JOIN Allcode ON (dr.position_Dr= Allcode.keymap_Code )  
                      
          WHERE row_number > ${(page - 1) * currentPage} AND row_number <=${
            page * currentPage
          }
            `
          query2 = `SELECT COUNT(*)as total FROM Doctor_Infor`
        } else {
          query = `SELECT  dr.* , Employees.fullName , Employees.image_Employee , Specialties.name_Spe , Clinics.name_Clinic , Allcode.value_Code
          FROM  (SELECT ROW_NUMBER() OVER (ORDER BY id_Doctor) AS row_number, *FROM Doctor_Infor) AS dr 
          
                      JOIN Employees ON (dr.id_Employee = Employees.id_Employee )
                      JOIN Specialties ON (dr.id_Spe = Specialties.id_Spe)
                      JOIN Clinics ON(dr.id_Clinic= Clinics.id_Clinic)
                      JOIN Allcode ON (dr.position_Dr= Allcode.keymap_Code )  
                      
          WHERE row_number > ${(page - 1) * currentPage} AND row_number <=${
            page * currentPage
          } AND  dr.id_Spe = '${data.id_Spe}' 
            `
          query2 = `SELECT COUNT(*)as total FROM Doctor_Infor WHERE id_Spe = '${data.id_Spe}'`
        }

        let result = await pool.query(query)
        let result2 = await pool.query(query2)
        resolve({
          errCode: 0,
          errMessage: 'Get data successfull',
          data: result.recordset,
          total: result2.recordset[0].total
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

let createNewSchedule_Service = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id_Doctor || !data.date) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data'
        })
      } else {
        let id_Doctor = data.id_Doctor
        let idServer = data.idServer
        let date_Exam = data.date
        let timeType = data.timeType
        let price = data.price
        let payment = data.payment
        let currentNumber = 0
        let currentMax = data.maxNumber
        let action = data.action

        let pool = await getConnectServer(idServer)

        if (action === 'CREATE') {
          let id_SChedule = uuidv4().substring(20).slice(0, 19)
          let result = await pool
            .request()
            .input('id_SChedule', mssql.VarChar, id_SChedule)
            .input('id_Doctor', mssql.VarChar, id_Doctor)
            .input('timeType', mssql.VarChar, timeType)
            .input('date_Exam', mssql.Date, date_Exam)
            .input('price', mssql.VarChar, price)
            .input('payment', mssql.VarChar, payment)
            .input('currentNumber', mssql.Int, currentNumber)
            .input('currentMax', mssql.Int, currentMax)
            .query(`INSERT INTO Schedule_Dr (id_Schedule , id_Doctor ,timeType ,date_Exam ,price ,payment ,currentNumber ,currentMax) SELECT * FROM (SELECT @id_SChedule as id_SChedule , @id_Doctor as id_Doctor ,  @timeType as timeType , @date_Exam as date_Exam ,@price as price , @payment as payment , @currentNumber as currentNumber ,@currentMax as currentMax )as tmp WHERE NOT EXISTS (SELECT * FROM  Schedule_Dr WHERE   id_Doctor = @id_Doctor AND 
              timeType = @timeType AND date_Exam = @date_Exam
              ) `)

          if (result.rowsAffected[2] === 0) {
            resolve({
              errCode: 2,
              errMessage: 'Phòng khám đã tồn tại'
            })
          } else if (result.rowsAffected[2] === 1) {
            resolve({
              errCode: 0,
              errMessage: 'Tạo thành công '
            })
          }
        } else if (action === 'UPDATE') {
          resolve({
            errCode: 0,
            errMessage: 'Create new schedule successfully'
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getScheduleDoctor_Service = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data || !data.id_Doctor || !data.date) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let idServer = data.idServer
        let page = data.page
        if (!page) page = 1
        let Maxlength = 3
        let date_Exam = data.date
        let id_Doctor = data.id_Doctor
        let pool = await getConnectServer(idServer)
        let result = await pool
          .request()
          .input('id_Doctor', mssql.VarChar, id_Doctor)
          .input('date_Exam', mssql.Date, date_Exam)
          .query(`SELECT sc.* , Allcode.value_Code  FROM (SELECT ROW_NUMBER() OVER (ORDER BY  id_Schedule) AS row_num , * FROM Schedule_Dr WHERE  Schedule_Dr.id_Doctor = @id_Doctor AND Schedule_Dr.date_Exam = @date_Exam
         )  AS sc
                  JOIN Allcode ON (sc.timeType = Allcode.keymap_Code)
                  WHERE  row_num > ${(page - 1) * Maxlength} AND row_num < ${
          page * Maxlength
        }    ORDER BY Allcode.value_Code
        `)
        let result2 = await pool.query(
          `SELECT COUNT(*) as total FROM Schedule_Dr WHERE id_Doctor = '${id_Doctor}' AND date_Exam = '${date_Exam}'`
        )

        if (result.recordset.length > 0) {
          resolve({
            errCode: 0,
            errMessage: 'Get data successfully',
            data: result.recordset,
            total: result2.recordset[0].total
          })
        } else if (result.recordset.length === 0) {
          resolve({
            errCode: 2,
            errMessage: 'Data Empty or invalid',
            data: result.recordset
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getListDoctorBySpe_Service = data => {
  // console.log(data)
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id_Spe || !data.idServer) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let id_Spe = data.id_Spe
        let page = data.page
        if (!page) page = 1
        let maxPage = 2
        let pool = await getConnectServer(data.idServer)
        let query = `SELECT table_dr.* , Clinics.name_Clinic ,Allcode.value_Code, Employees.fullName , Employees.birthDay , Employees.image_Employee  , Specialties.name_Spe FROM  
                      (SELECT ROW_NUMBER() OVER (ORDER BY id_Doctor) AS row_num, * FROM Doctor_Infor WHERE  Doctor_Infor.id_Spe = '${id_Spe}' ) as table_dr
                      JOIN Clinics ON (table_dr.id_Clinic = Clinics.id_Clinic)
                      JOIN Allcode ON (table_dr.position_Dr = Allcode.keymap_Code)
                      JOIN Employees ON (table_dr.id_Employee = Employees.id_Employee)
                      JOIN Specialties ON (table_dr.id_Spe = Specialties.id_Spe)
                    WHERE     (row_num > ${
                      (page - 1) * maxPage
                    } AND row_num <= ${page * maxPage} )   
                      `
        let result = await pool.query(query)

        if (result.recordset.length > 0) {
          let result2 = await pool.query(
            `SELECT COUNT(*) AS total FROM Doctor_Infor WHERE id_Spe ='${id_Spe}'`
          )
          resolve({
            errCode: 0,
            errMessage: 'Get data successfully ',
            data: result.recordset,
            total: result2.recordset[0].total
          })
        } else if (result.recordset.length === 0) {
          resolve({
            errCode: 2,
            errMessage: 'Get data failed',
            data: []
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getAllSchedulebyDate_Server = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id_Doctor || !data.date) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let idServer = data.idServer
        let id_Doctor = data.id_Doctor
        let date_Exam = data.date
        let pool = await getConnectServer(idServer)
        let result = await pool
          .request()
          .input('id_Doctor', mssql.VarChar, id_Doctor)
          .input('date_Exam', mssql.Date, date_Exam)
          .query(`SELECT SC.* , Allcode.value_Code FROM  Schedule_Dr as SC 
                  JOIN Allcode ON (Allcode.keymap_Code = SC.timeType )
                  WHERE SC.id_Doctor = @id_Doctor AND  SC.date_Exam = @date_Exam
                  ORDER BY Allcode.value_Code  
          `)
        // console.log(result)
        if (result.recordset.length > 0) {
          resolve({
            errCode: 0,
            errMessage: 'Get Schedule successfull',
            data: result.recordset
          })
        } else if (result.recordset.length === 0) {
          resolve({
            errCode: 2,
            errMessage: 'Data empty or not found',
            data: []
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let createNewBooking_Service = data => {
  console.log(data)
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.idPatient ||
        !data.idDoctor ||
        !data.idSchedule ||
        !data.timeType ||
        !data.date
      ) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let id_Patient = data.idPatient
        let id_Doctor = data.idDoctor
        let id_Schedule = data.idSchedule
        let date_Exam = data.date
        let timeType = data.timeType
        let status_Booking = 'STB1'
        let getStringRandom = Math.random().toString(32).slice(2)
        let id_Booking = (Date.now() + getStringRandom).slice(0, 19)
        let token = uuidv4()
        let pool = await getConnectServer(data.idServer)

        let result = await pool
          .request()
          .input('id_Booking', mssql.VarChar, id_Booking)
          .input('id_Patient', mssql.VarChar, id_Patient)
          .input('id_Schedule', mssql.VarChar, id_Schedule)
          .input('id_Doctor', mssql.VarChar, id_Doctor)
          .input('date_Exam', mssql.Date, date_Exam)
          .input('timeType', mssql.VarChar, timeType)
          .input('token', mssql.VarChar, token)
          .input('status_Booking', mssql.VarChar, status_Booking)
          .query(
            `INSERT INTO Bookings (id_Booking ,  id_Patient , id_Schedule ,id_Doctor,  date_Exam ,timeType ,status_Booking , token)  SELECT @id_Booking as id_Booking ,@id_Patient as  id_Patient , @id_Schedule as id_Schedule , @id_Doctor as id_Doctor , @date_Exam as date_Exam , @timeType as timeType , @status_Booking as status_Booking ,  @token as token
            WHERE NOT EXISTS (SELECT * FROM Bookings WHERE id_Patient = @id_Patient AND  date_Exam =@date_Exam AND id_Doctor = @id_Doctor)`
          )
        let result1 = await pool.query(
          `UPDATE  Schedule_Dr SET currentNumber = currentNumber + 1 WHERE id_Schedule = '${id_Schedule}' AND currentNumber < Schedule_Dr.currentMax`
        )

        console.log(result1)
        console.log(result)

        if (result.rowsAffected[2] === 0) {
          resolve({
            errMessage: 'Đặt Không Thành Công',
            errCode: 2
          })
          let result2 = await pool.query(
            `UPDATE  Schedule_Dr SET currentNumber = currentNumber - 1 WHERE id_Schedule = '${id_Schedule}' AND currentNumber < Schedule_Dr.currentMax `
          )
        }
        if (result.rowsAffected[2] === 1 && result1.rowsAffected[3] === 1) {
          if (
            data.email &&
            data.address &&
            data.selectedGender &&
            data.birthday
          ) {
            let updateInforPatient = await pool
              .request()
              .input('emailUser', mssql.VarChar, data.email)
              .input('birthDay', mssql.Date, data.birthday)
              .input('gender_Patient', mssql.VarChar, data.selectedGender)
              .input('address', mssql.NVarChar, data.address)
              .input('Note_Patient', mssql.NText, data.note)
              .input('phoneNumber', mssql.Int, data.phoneNumber)
              .input('id_Patient', mssql.VarChar, id_Patient)
              .query(`UPDATE  Patients 
                      SET 
                      birthDay = @birthDay ,
                      Address_Patient = @address,
                      PhoneNumber = @phoneNumber ,
                      gender_Patient= @gender_Patient,
                      Note_Patient = @Note_Patient 
                      WHERE  id_Patient = @id_Patient AND emailUser = @emailUser `)
          }

          resolve({
            errMessage: 'Đặt Thành Công',
            errCode: 0
          })
        } else if (
          result.rowsAffected[2] === 1 &&
          result1.rowsAffected[3] === 0
        ) {
          let result3 = await pool.query(
            `DELETE FROM Bookings WHERE id_Booking = '${id_Booking}' `
          )
          console.log(result3)
          resolve({
            errCode: 3,
            errMessage: 'Số lượng đầy'
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getAllBooking_Services = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.date) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let idServer = data.idServer
        let date = data.date
        let page = data.page
        if (!page) page = 1
        let MaxPage = 10
        let query = `SELECT B.* , Patients.name_Patient  , D.id_Employee ,Allcode.value_Code  ,E.fullName , A.value_Code AS time 
                    FROM (SELECT ROW_NUMBER() OVER (ORDER BY  id_Schedule ) AS row_num , * FROM  Bookings WHERE  Bookings.date_Exam = '${date}')AS B
                    JOIN Patients ON (Patients.id_Patient = B.id_Patient)
                    JOIN Doctor_Infor  as D ON (D.id_Doctor = B.id_Doctor)
                    JOIN Employees AS E ON (E.id_Employee =  D.id_Employee)
                    JOIN Allcode  ON (Allcode.keymap_Code = B.status_Booking)
                    RIGHT JOIN ALLcode as A ON (A.keymap_Code = B.timeType)
                    WHERE row_num > ${(page - 1) * MaxPage} AND  row_num < ${
          page * MaxPage
        }   
        `

        let pool = await getConnectServer(idServer)

        let result = await pool.query(query)
        let result1 = await pool.query(
          `SELECT COUNT(*) as total FROM Bookings WHERE date_Exam = '${date}' `
        )
        if (result) {
          resolve({
            errCode: 0,
            errMessage: 'Get data successfully',
            data: result.recordset,
            total: result1.recordset[0].total
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let comfirmBooking_Services = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let token = data.token
        let idServer = data.idServer

        let pool = await getConnectServer(idServer)
        let result = await pool.query(
          `UPDATE Bookings  SET status_Booking = 'STB2' WHERE token = '${token}' AND status_Booking = 'STB1'`
        )

        if (result.rowsAffected[2] === 1) {
          resolve({
            errCode: 0,
            errMessage: 'Update status_Booking successfully '
          })
        } else if (result.rowsAffected[2] === 0) {
          resolve({
            errCode: 1,
            errMessage: 'Update status_Booking failed '
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getAllPatientBooking_Services = data => {
  console.log(data)
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.idSchedule) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let idServer = data.idServer
        let id_Schedule = data.idSchedule
        let page = data.page
        if (!page) page = 1
        let maxPage = 20
        let pool = await getConnectServer(idServer)
        let query = `SELECT B.*  , P.name_Patient , P.birthDay , P.Address_Patient, P.PhoneNumber ,P.Note_Patient , AP.value_Code as gender,  AB.value_Code as Status FROM (SELECT ROW_NUMBER () OVER (ORDER BY id_Booking) as row_num, * FROM  Bookings  WHERE id_Schedule = '${id_Schedule}' AND status_Booking ='STB2')  as B
              JOIN Patients as P ON (P.id_Patient = B.id_Patient)
              JOIN Allcode as AP ON (AP.keymap_Code = P.gender_Patient)
              JOIN Allcode as AB ON (AB.keymap_Code = B.status_Booking)
            WHERE  row_num > ${(page - 1) * maxPage} AND row_num < ${
          page * maxPage
        }
        `
        let result = await pool.query(query)
        let result2 = await pool.query(
          `SELECT COUNT(*) AS total FROM Bookings WHERE id_Schedule = '${id_Schedule}'`
        )

        if (result) {
          resolve({
            errCode: 0,
            errMessage: 'Get Data successfully',
            data: result.recordset,
            total: result2.recordset[0].total
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let createNewPatientInfor_Services = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.idPatient || !data) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let idServer = data.idServer
        let idDoctor = data.idDoctor
        let idPatient = data.idPatient
        let id_Hospital = data.idHospital
        let reasonPatient = data.reasonPatient
        let treatment_process = data.treatmentProcess
        let patient_history = data.patient_history
        let medical_infor = data.medical_infor
        let treatment_day = data.treatment_day
        let treatment_end = data.treatment_end

        let pool = await getConnectServer(idServer)
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getAllDoctorBySpe_Services = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data || !data.id_Spe) {
        resolve({
          errCode: 1,
          errMessage: 'Missing dataa required'
        })
      } else {
        let idServer = data.idServer
        let idSpe = data.id_Spe
        let pool = await getConnectServer(idServer)
        let result =
          await pool.query(`SELECT   D.id_Doctor , E.fullName  FROM Doctor_Infor AS D 
                          JOIN Employees as E ON (E.id_Employee = D.id_Employee)
                            WHERE D.id_Spe = '${idSpe}'
      `)

        if (result) {
          resolve({
            errCode: 0,
            errMessage: 'Get data successfully',
            data: result.recordset
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let PatientTreatment_Services = data => {
  console.log(data)
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.idPatient || !data.id_Bed) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required '
        })
      } else {
        let id_Bed = data.id_Bed
        let id_Patient = data.idPatient
        let id_Doctor = data.idDoctor
        let idServer = data.idServer
        let id_Hospital = data.idHospital
        let reason_Patient = data.reason_Patient
        let treatment_process = data.treatment_Patient
        let patient_history = data.patient_history
        let medical_infor = ''
        let treatment_day = data.dateStart
        let treatment_end = data.dateEnd
        let id_Pat = data.id_Pat
        let patient_status = 'PST1'
        let pool = await getConnectServer(idServer)
        if (data.action === 'x') {
          if (!id_Pat || id_Pat === undefined || id_Pat === null) {
            let today = Date.now()
            let id_Infor_Pat = (uuidv4() + today).substring(24).slice(0, 19)
            let result = await pool
              .request()
              .input('id_Infor_Pat', mssql.VarChar, id_Infor_Pat)
              .input('id_Patient', mssql.VarChar, id_Patient)
              .input('id_Hospital', mssql.VarChar, id_Hospital)
              .input('id_Doctor', mssql.VarChar, id_Doctor)
              .input('reason_Patient', mssql.NText, reason_Patient)
              .input('treatment_process', mssql.NText, treatment_process)
              .input('patient_history', mssql.NText, patient_history)
              .input('medical_infor', mssql.NText, medical_infor)
              .input('treatment_day', mssql.Date, treatment_day)
              .input('treatment_end', mssql.Date, treatment_end)
              .input('patient_status', mssql.VarChar, patient_status)
              .query(`INSERT INTO Infor_About_Patient (id_Infor_Pat ,  id_Patient , id_Hospital, id_Doctor , reason_Patient , 
                treatment_process , patient_history , medical_infor ,  treatment_day  , treatment_end , patient_status)  
                SELECT * FROM
                (SELECT @id_Infor_Pat as id_Infor_Pat , @id_Patient as id_Patient , @id_Hospital as id_Hospital ,  @id_Doctor as id_Doctor ,@reason_Patient as reason_Patient , @treatment_process as treatment_process , @patient_history as patient_history , @medical_infor as medical_infor ,  @treatment_day as treatment_day , @treatment_end as treatment_end , @patient_status as patient_status
                  ) as tmp WHERE NOT EXISTS (SELECT * FROM Infor_About_Patient WHERE  id_Patient = @id_Patient)
  
              `)
            console.log(result)
            if (result.rowsAffected[2] === 0) {
              resolve({
                errCode: 2,
                errMessage: 'Patient information already exists'
              })
            } else {
              let result2 = await pool.query(
                `UPDATE Hospital_Bed SET id_Infor_Pat = '${id_Infor_Pat}' , status_Bed = 'ST2' WHERE status_Bed = 'ST1' AND id_Bed = '${id_Bed}'`
              )
              resolve({
                errCode: 0,
                errMessage: 'Tạo Thông tin thành công '
              })
            }
          } else if (id_Pat !== null || id_Pat !== '') {
            let patient_status = 'PST1'
            let result1 = await pool
              .request()
              .input('id_Infor_Pat', mssql.VarChar, id_Pat)
              .input('id_Patient', mssql.VarChar, id_Patient)
              .input('id_Hospital', mssql.VarChar, id_Hospital)
              .input('id_Doctor', mssql.VarChar, id_Doctor)
              .input('reason_Patient', mssql.NText, reason_Patient)
              .input('treatment_process', mssql.NText, treatment_process)
              .input('patient_history', mssql.NText, patient_history)
              .input('medical_infor', mssql.NText, medical_infor)
              .input('treatment_day', mssql.Date, treatment_day)
              .input('treatment_end', mssql.Date, treatment_end)
              .input('patient_status', mssql.VarChar, patient_status)
              .query(`UPDATE Infor_About_Patient SET id_Hospital = @id_Hospital, id_Doctor =@id_Doctor, reason_Patient = @reason_Patient, treatment_process =@treatment_process, patient_history = @patient_history, medical_infor = @medical_infor,  treatment_day =@treatment_day  , treatment_end =@treatment_end
            WHERE  id_Infor_Pat =@id_Infor_Pat
          `)
            if (result1) {
              let result3 = await pool.query(
                `UPDATE Hospital_Bed SET id_Infor_Pat = '${id_Pat}' , status_Bed = 'ST2' WHERE status_Bed = 'ST1' AND id_Bed = '${id_Bed}'`
              )
              resolve({
                errCode: 0,
                errMessage: 'Update successful'
              })
            }
          }
        }
        if (data.action === 'UPDATE') {
          console.log(data)

          let result = await pool
            .request()
            .input('id_Infor_Pat', mssql.VarChar, id_Pat)
            .input('reason_Patient', mssql.NText, reason_Patient)
            .input('patient_history', mssql.NText, patient_history)
            .input('treatment_day', mssql.Date, treatment_day)
            .input('treatment_end', mssql.Date, treatment_end).query(`
              UPDATE Infor_About_Patient SET reason_Patient = @reason_Patient , patient_history = @patient_history ,treatment_day =@treatment_day , treatment_end = @treatment_end WHERE id_Infor_Pat = @id_Infor_Pat
            `)

          if (result.rowsAffected[2] === 1) {
            resolve({
              errCode: 0,
              errMessage: 'Update thành công'
            })
          } else if (result.rowsAffected[2] === 0) {
            resolve({
              errCode: 2,
              errMessage: 'Update failed '
            })
          }
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getInformations_Pat_Services = data => {
  console.log(data)
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id_Infor_Pat) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required '
        })
      } else {
        let idServer = data.idServer
        let id_Infor_Pat = data.id_Infor_Pat
        let pool = await getConnectServer(idServer)
        let id_Hospital = data.id_Hospital
        let query = `SELECT * FROM Infor_About_Patient WHERE id_Infor_Pat = '${id_Infor_Pat}' AND 
        (id_Hospital = '${id_Hospital}' OR id_Hospital IS NULL)`
        let result = await pool.query(query)
        console.log(result.rowsAffected[0] === 1)
        if (result) {
          resolve({
            errCode: 0,
            errMessage: 'Get data successfully',
            data: result.recordset
          })
        } else if (result.rowsAffected[0] === 0) {
          resolve({
            errCode: 2,
            errMessage: 'Get data failed or not found',
            data: result.recordset[0]
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getStatusPatient_Services = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.idPatient) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let idServer = data.idServer
        let idPatient = data.idPatient
        let pool = await getConnectServer(idServer)
        // KIỂM TRA ĐÃ CÓ THÔNG TIN BỆNH NHÂN CHƯA
        let result = await pool.query(
          `SELECT * FROM Infor_About_Patient WHERE  id_Patient =  '${idPatient}'`
        )
        if (result.rowsAffected[0] === 0) {
          resolve({
            errCode: 3,
            errMessage: 'Patient  has not  information'
          })
        }
        if (result.rowsAffected[0] === 1) {
          let data = result.recordset[0]
          if (data.patient_status === 'PST1') {
            resolve({
              errCode: 2,
              errMessage: ' Patient is in treatment'
            })
          } else if (data.patient_status === 'PST2') {
            resolve({
              errCode: 0,
              errMessage: 'GET information for patient successfully',
              data: data
            })
          }
        }
        resolve({
          data: result.recordset[0]
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}
let FinishTreatment_Services = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.idBed || !data.id_Infor_Pat) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required for treatment'
        })
      } else {
        let idServer = data.idServer
        let id_Infor_Pat = data.id_Infor_Pat
        let id_Bed = data.idBed
        let id_Hospital = data.idHospital

        let pool = await getConnectServer(idServer)
        let query = `UPDATE Hospital_Bed 
                    SET id_Infor_Pat = NULL  , status_Bed = 'ST1'
                    WHERE id_Bed = '${id_Bed}'AND id_Infor_Pat = '${id_Infor_Pat}'
        `
        let result = await pool.query(query)
        if (result.rowsAffected[2] === 1) {
          console.log(id_Infor_Pat)
          let query1 = `UPDATE Infor_About_Patient 
        SET  
        reason_Patient = NULL ,
        treatment_process = NULL  ,
        treatment_day = NULL ,
        treatment_end =  NULL , 
        patient_status = 'PST2'  ,
        id_Hospital = NULL  
        WHERE  Infor_About_Patient.id_Infor_Pat = '${id_Infor_Pat}'`

          let result2 = await pool.query(query1)
          console.log(result2)
          if (result2.rowsAffected[3] === 1) {
            resolve({
              errCode: 0,
              errMessage: 'Update successful'
            })
          } else if (result2.rowsAffected[3] === 0) {
            resolve({
              errCode: 2,
              errMessage: 'Update failed'
            })
          }
        }
      }
    } catch (e) {
      console.log(e)
    }
  })
}

let getListPATtreatment_Services = data => {
  console.log(data)
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.idHospital) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let idServer = data.idServer
        let id_Hospital = data.idHospital
        let page = data.page || 1
        let MaxPage = 10
        let pool = await getConnectServer(idServer)
        let query = `
    SELECT 
        PAT.reason_Patient as reason,
        PAT.treatment_day as dateStart,
        PAT.treatment_end as dateEnd, 
        P.name_Patient  as name,
        P.birthDay as birthDay,
        A.value_Code as genderPatient,
        SPE.name_Spe as nameSpe ,
        TR.Name_Treat as nameRoom
    FROM  (
        SELECT 
            ROW_NUMBER() OVER (ORDER BY id_Patient) as rownum, 
            *  
        FROM Infor_About_Patient 
        WHERE 
            id_Hospital = '${id_Hospital}'
            AND patient_status ='PST1'
    ) as PAT
    JOIN Patients as P ON (P.id_Patient = PAT.id_Patient)
    JOIN Allcode as A ON (A.keymap_Code = P.gender_Patient)
    JOIN Hospital_Bed AS HB ON (HB.id_Infor_Pat = PAT.id_Infor_Pat)
    JOIN Treatment_rooms as TR ON (TR.id_Room = HB.id_Room)
    JOIN Specialties as SPE ON (SPE.id_Spe = TR.id_Spe)
    WHERE rownum > ${(page - 1) * MaxPage} AND rownum <= ${page * MaxPage}
  `

        let result = await pool.query(query)
        let result2 = await pool.query(
          `SELECT COUNT(*)  as total FROM  Infor_About_Patient WHERE  id_Hospital = '${id_Hospital}' `
        )

        if (result) {
          resolve({
            errCode: 0,
            errMessage: 'Get Data successfully',
            data: result.recordset,
            total: result2.recordset[0].total
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getAllInforDr_Services = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.emailUser) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let idServer = data.idServer
        let emailUser = data.emailUser

        let pool = await getConnectServer(idServer)
        let query = `SELECT E.fullName , E.image_Employee , D.id_Doctor as id_Doctor ,A.value_code as degree ,
        S.name_Spe  as Specialty ,C.name_Clinic  as Clinics
        
        FROM 
                  (SELECT * FROM Employees WHERE emailUser = '${emailUser}') as E
                  JOIN Doctor_Infor AS D ON (D.id_Employee = E.id_Employee)
                  JOIN Allcode AS A ON (A.keymap_Code = D.position_Dr)
                  JOIN Specialties AS S ON ( S.id_Spe = D.id_Spe)
                  JOIN Clinics AS C ON (C.id_Clinic = D.id_Clinic)



        `
        let result = await pool.query(query)
        if (result) {
          resolve({
            errCode: 0,
            data: result.recordset
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let createNewHistories_Service = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.body) {
        resolve('Missing data required')
      } else {
        let id_History = uuidv4().substring(20).slice(0, 19)
        let getData = data.body
        let id_Booking = getData.id_Booking
        let id_Patient = getData.id_Patient
        let id_Doctor = getData.id_Doctor
        let note = getData.textaboutExa
        let idServer = getData.idServer
        let filename = ''
        if (data.files || data.files !== null || data.files.fileImage) {
          let saveImage = await systemServices.SaveImage(
            data.files.fileImage,
            'History'
          )
          if (saveImage.errCode === 0) {
            filename = `History/${saveImage.filename}`
          } else {
            filename = NULL
          }
        } else {
          filename = NULL
        }
        let pool = await getConnectServer(idServer)

        let result = await pool
          .request()
          .input('id_History', mssql.VarChar, id_History)
          .input('id_Booking', mssql.VarChar, id_Booking)
          .input('id_Patient', mssql.VarChar, id_Patient)
          .input('id_Doctor', mssql.VarChar, id_Doctor)
          .input('note', mssql.NText, note)
          .input('file_exam', mssql.NText, filename)
          .query(`INSERT INTO Histories (id_History , id_Booking, id_Patient ,id_Doctor , note , file_exam) 
          VALUES (@id_History , @id_Booking , @id_Patient , @id_Doctor, @note , @file_exam)`)

        if (result) {
          console.log(id_Booking)
          let query = `UPDATE Bookings SET status_Booking = 'STB3' WHERE id_Booking = '${id_Booking}' `
          let result1 = await pool.query(query)
          if (result1) {
            resolve({
              errCode: 0,
              errMessage: 'Create History successfully'
            })
          }
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getAllSheduleByDr_Service = data => {
  console.log(data)
  return new Promise(async (resolve, reject) => {
    try {
      if (!data || !data.idDoctor) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let idServer = data.idServer
        let pool = await getConnectServer(idServer)
        let page = data.page
        if (!page) page = 1
        let maxPage = 10
        let idDoctor = data.idDoctor
        let date = new Date(data.dateExam)
        let result = await pool.request().input('dateExam', mssql.Date, date)
          .query(`SELECT row_number.* , B.date_Exam , P.name_Patient ,  P.birthDay , A.value_Code , C.value_Code as Status , D.value_Code as Time  FROM (SELECT ROW_NUMBER() OVER (ORDER BY  id_History) as row , * FROM Histories WHERE id_Doctor = '${idDoctor}') as row_number 
        JOIN  Bookings as B ON row_number.id_Booking = B.id_Booking
        JOIN  Patients as P ON row_number.id_Patient = P.id_Patient
        JOIN  Allcode as A ON P.gender_Patient = A.keymap_Code 
        JOIN Allcode as C ON B.status_Booking = C.keymap_Code
        JOIN Allcode as D ON B.timeType = D.keymap_Code

        WHERE B.date_Exam = @dateExam AND  row_number.row > ${
          (page - 1) * maxPage
        } AND row_number.row < ${page * maxPage}
       `)

        if (result.rowsAffected[0] === 1) {
          resolve({
            errCode: 0,
            errMessage: 'Get data successfully',
            data: result.recordset
          })
        } else if (result.rowsAffected[0] === 0) {
          resolve({
            errCode: 2,
            errMessage: 'Data empty'
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getIdDoctorByEmail_Service = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let idServer = data.idServer
        let pool = await getConnectServer(idServer)
        let emailDoctor = data.email
        let result = await pool.request().query(
          `SELECT  D.id_Doctor AS id_Doctor FROM  Employees 
            JOIN Doctor_Infor as D ON Employees.id_Employee = D.id_Employee
            WHERE emailUser = '${emailDoctor}'`
        )
        if (result.rowsAffected[0] === 1) {
          resolve({
            errCode: 0,
            errMessage: 'Get Id successfull',
            idDoctor: result.recordset[0].id_Doctor
          })
        } else if (result.rowsAffected[0] === 0) {
          resolve({
            errCode: 2,
            errMessage: 'Email not found'
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getRequestTreat_Service = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          errCode: 1,
          errMessage: 'Mising data required'
        })
      } else {
        let idServer = data.idServer
        let pool = await getConnectServer(idServer)
        let query = ''
        if (data.date === 'ALL') {
          query = `SELECT T.*, P.emailUser, P.name_Patient, P.birthDay, P.Address_Patient, P.PhoneNumber ,P.Note_Patient, P.image_Pat, A.value_Code as gender, A1.value_Code as status
          FROM Request_Treatment AS T
          JOIN Patients AS P ON P.id_Patient = T.id_Patient
          JOIN Allcode as A ON A.keymap_Code = P.gender_Patient
          JOIN Allcode as A1 ON A1.keymap_Code = T.Status_Request`
        } else {
          let date = moment(data.date).format('YYYY-MM-DD')
          query = `SELECT T.*, P.emailUser, P.name_Patient, P.birthDay, P.Address_Patient, P.PhoneNumber, P.image_Pat, P.Note_Patient, A.value_Code as gender, A1.value_Code as status
                   FROM Request_Treatment AS T
                   JOIN Patients AS P ON P.id_Patient = T.id_Patient
                   JOIN Allcode as A ON A.keymap_Code = P.gender_Patient
                   JOIN Allcode as A1 ON A1.keymap_Code = T.Status_Request
                   WHERE T.dateSchedule = '${date}'`
        }

        let result = await pool.query(query)
        if (result) {
          resolve({
            errCode: 0,
            errMessage: 'Get data successfully',
            data: result.recordset
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getConfirmRequest_Service = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.idServer || !data.RequestId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let idServer = data.idServer
        let idRequest = data.RequestId
        let action = data.action
        let pool = await getConnectServer(idServer)
        let query = ''
        if (action === 'CONFIRM') {
          query = `UPDATE Request_Treatment SET  Status_Request = 'STB2' WHERE RequestId = '${idRequest}'`
        } else if (action === 'CANCEL') {
          query = `UPDATE Request_Treatment SET  Status_Request = 'STB4' WHERE RequestId = '${idRequest}'`
        }
        let result = await pool.query(query)
        if (result.rowsAffected[3] === 1) {
          resolve({
            errCode: 0,
            errMessage: 'UPDATE SUCCESSFULL'
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let createTreatmentsPatient_Service = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        console.log(data, 'data')
        let id_Hospital = data.id_Hospital
        let id_Patient = data.id_Patient
        let id_Bed = data.id_Bed
        let treatment_day = moment(data.treatment_day).format('YYYY-MM-DD')
        let reason_Patient = data.reason_Patient
        // KIỂM TRA ID PATIENT

        let pool = await getConnectServer(id_Hospital)

        let queryCheck = `SELECT * FROM  Infor_About_Patient WHERE id_Patient = '${id_Patient}'`
        let checkPatient = await pool.query(queryCheck)

        if (checkPatient.rowsAffected[0] === 0) {
          let id_Infor_Pat = uuidv4().toString().slice(0, 19)
          let status = 'PST1'
          let result = await pool
            .request()
            .input('id_Infor_Pat', mssql.VarChar, id_Infor_Pat)
            .input('id_Patient', mssql.VarChar, id_Patient)
            .input('id_Hospital', mssql.VarChar, id_Hospital)
            .input('reason_Patient', mssql.NText, reason_Patient)
            .input('treatment_day', mssql.NText, treatment_day)
            .input('patient_status', mssql.VarChar, status)
            .query(
              `INSERT INTO Infor_About_Patient (id_Infor_Pat,  id_Patient , id_Hospital , reason_Patient , treatment_day ,patient_status) VALUES (@id_Infor_Pat,  @id_Patient , @id_Hospital , @reason_Patient , @treatment_day ,@patient_status) `
            )
          if (result) {
            let query = `UPDATE Hospital_Bed SET id_Infor_Pat ='${id_Infor_Pat}' ,  status_Bed = 'ST2'
            WHERE id_Bed ='${id_Bed}'
            `
            let result2 = await pool.query(query)
            if (result2) {
              let result3 = await pool.query(
                `UPDATE Request_Treatment SET Status_Request ='STB5' WHERE id_Patient ='${id_Patient}' AND dateSchedule = '${treatment_day}' `
              )
              resolve({
                errCode: 0,
                errMessage: 'Create successful'
              })
            }
          }
        } else if (checkPatient.rowsAffected[0] === 1) {
          console.log('bệnh nhân đã có thông tin')
          // LẤY INFOR CỦA PATIENTS
          let idInforPat = checkPatient.recordset[0].id_Infor_Pat
          let status = checkPatient.recordset[0].patient_status

          if (status === 'PST1') {
            resolve({
              errCode: 2,
              errMessage: 'Bệnh nhân đang điều trị'
            })
          } else if (status === 'PST2') {
            let query = `UPDATE Infor_About_Patient SET id_Hospital = '${id_Hospital}', reason_Patient = '${reason_Patient}',
            treatment_day = '${treatment_day}', patient_status = 'PST1'
            WHERE id_Infor_Pat = '${idInforPat}'
            `

            let query1 = `UPDATE Hospital_Bed SET id_Infor_Pat = '${idInforPat}', status_Bed = 'ST2'
            WHERE id_Bed = '${id_Bed}'
            `

            let result = await pool.query(query)
            if (result) {
              let result1 = await pool.query(query1)
              if (result1) {
                let result3 = await pool.query(
                  `UPDATE Request_Treatment SET Status_Request ='STB5' WHERE id_Patient ='${id_Patient}' AND dateSchedule = '${treatment_day}' `
                )
                resolve({
                  errCode: 0,
                  errMessage: 'Create successful'
                })
              }
            }
          }
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
  getListEmployee_Service,
  createnewEmployee_Service,
  updateEmployee_Service,
  getListDoctor_Service,
  informationDoctors_Service,
  getInformations_Doctors_Service,
  updateInforDoctors,
  getAllDoctor_Service,
  createNewSchedule_Service,
  getScheduleDoctor_Service,
  getListDoctorBySpe_Service,
  getAllSchedulebyDate_Server,
  createNewBooking_Service,
  getAllBooking_Services,
  comfirmBooking_Services,
  getAllPatientBooking_Services,
  createNewPatientInfor_Services,
  getAllDoctorBySpe_Services,
  PatientTreatment_Services,
  getInformations_Pat_Services,
  getStatusPatient_Services,
  FinishTreatment_Services,
  getListPATtreatment_Services,
  getAllInforDr_Services,
  createNewHistories_Service,
  getAllSheduleByDr_Service,
  getIdDoctorByEmail_Service,
  getRequestTreat_Service,
  getConfirmRequest_Service,
  createTreatmentsPatient_Service
}
