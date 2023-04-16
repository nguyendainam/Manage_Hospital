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
  console.log(data)
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
          let id_SChedule = uuidv4().substring(20).slice(0, 20)
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
  console.log(data)
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
        let Maxlength = 6
        let date_Exam = data.date
        let id_Doctor = data.id_Doctor
        let pool = await getConnectServer(idServer)
        let result = await pool
          .request()
          .input('id_Doctor', mssql.VarChar, id_Doctor)
          .input('date_Exam', mssql.Date, date_Exam)
          .query(`SELECT sc.*   FROM (SELECT ROW_NUMBER() OVER (ORDER BY  id_Schedule) AS row_num , * FROM Schedule_Dr)  AS sc
                  WHERE  row_num > ${(page - 1) * Maxlength} AND row_num < ${
          page * Maxlength
        }  AND sc.id_Doctor = @id_Doctor AND sc.date_Exam = @date_Exam
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
  getScheduleDoctor_Service
}
