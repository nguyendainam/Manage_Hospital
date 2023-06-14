import { resolve } from 'path'
import {
  getConnectServer,
  getconnectData1,
  mssql
} from '../database/dataServerTong.js'
import bcrypt from 'bcrypt'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import * as fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import systemServices from './systemServices.js'
import { randomUUID } from 'crypto'

const salt = bcrypt.genSaltSync(10)

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

let checkEmailUser = (email, idServer) => {
  console.log(email, idServer, '============================')
  return new Promise(async (resolve, reject) => {
    try {
      let pool = await getConnectServer(idServer)
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

let checkid_User = idServer => {
  return new Promise(async (resolve, reject) => {
    try {
      let id = (Math.random() + 1).toString(36).substring(2)
      let pool = await getConnectServer(idServer)
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
        let email = await checkEmailUser(data.email, data.idServer)
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
          let pool = await getConnectServer(data.idServer)
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
        let pool = await getConnectServer()
        let email = data.email
        let result = await pool
          .request()
          .input('emailUser', mssql.VarChar, email)
          .query(
            `SELECT A.id_Account ,  A.emailUser , A.role_Account  ,A.passwordUser FROM (SELECT * FROM Accounts WHERE Accounts.emailUser = @emailUser AND Accounts.role_Account = 'R1')  as A`
          )

        if (result.recordset.length > 0) {
          let checkPassword = await bcrypt.compareSync(
            data.password,
            result.recordset[0].passwordUser
          )

          if (checkPassword === true) {
            resolve({
              errCode: 0,
              errMessage: 'login successful',
              data: result.recordset[0]
            })
          } else {
            resolve({
              errCode: 2,
              errMessage: 'Mật khẩu sai hoặc gì đó'
            })
          }
        } else if (result.recordset.length === 0) {
          resolve({
            errCode: 3,
            errMessage: 'Kiểm tra lại thông tin đăng nhập'
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
          let emailcheck = await checkEmailUser(data.email)
          if (emailcheck.errCode === -1) {
            resolve({
              errCode: -2,
              errMessage: 'Email đã tồn tại'
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
              if (result) {
                resolve({
                  errCode: 0,
                  errMessage: 'Successfully created new user'
                })
              }
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
let GetListUsers_Service = data => {
  console.log(data)
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let page = data.page
        if (!page) page = 1
        let pageNumber = page

        let pageSize = 5
        let pool = await getConnectServer(data.idServer)

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

        let total = await pool.query(
          'SELECT COUNT(*) AS totalRow From Patients'
        )
        resolve({
          errCode: 0,
          errMessage: 'Get all database',
          data: result.recordset,
          total: total.recordset[0].totalRow
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

let CreateAndUpdateUsers_Service = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.body) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let getfromdata = data.body
        if (getfromdata.Action === 'CREATE') {
          let getId_Patient = await checkid_User(getfromdata.idServer)
          let id_Patient = getId_Patient.id_Patient
          let filenameImage = ''

          // kiểm tra có file ảnh hay không
          if (data.files && data.files !== null) {
            let saveImage = await systemServices.SaveImage(
              data.files.fileimage,
              'Patients'
            )
            if (saveImage.errCode === 0) {
              filenameImage = `Patients/${saveImage.filename}`
            } else {
              filenameImage = null
              console.log('Save Image Failed')
            }
          } else if (!data.files) {
            filenameImage = null
          }
          // kiểm tra có gửi email
          let emailUser = ''

          let idServer = getfromdata.idServer
          if (getfromdata.email) {
            let SendData = {
              email: getfromdata.email,
              password: '123456',
              idServer: idServer,
              roleId: 'R1'
            }

            let createEmail = await createNewAccounts(SendData)
            if (createEmail.errCode === -2) {
              resolve(createEmail)
            } else if (createEmail.errCode === 0) {
              emailUser = createEmail.email
            }
            //
          } else if (!getfromdata.email) {
            emailUser = null
          }

          let fullname = getfromdata.fullname
          let birthDay = getfromdata.birthday
          let phoneNumber = getfromdata.phoneNumber
          let note = getfromdata.note
          let gender = getfromdata.selectedgender
          let address = getfromdata.address

          let pool = await getConnectServer(getfromdata.idServer)
          let result = await pool
            .request()
            .input('id_Patient', mssql.VarChar, id_Patient)
            .input('emailUser', mssql.VarChar, emailUser)
            .input('name_Patient', mssql.NVarChar, fullname)
            .input('birthDay', mssql.Date, birthDay)
            .input('Address_Patient', mssql.NVarChar, address)
            .input('PhoneNumber', mssql.Int, phoneNumber)
            .input('gender_Patient', mssql.VarChar, gender)
            .input('image_Pat', mssql.VarChar, filenameImage)
            .input('Note_Patient', mssql.NText, note)
            .query(
              'INSERT INTO Patients( id_Patient, emailUser ,  name_Patient, birthDay,Address_Patient  ,PhoneNumber ,gender_Patient , image_Pat , Note_Patient) VALUES (@id_Patient , @emailUser , @name_Patient ,@birthDay  , @Address_Patient , @PhoneNumber , @gender_Patient , @image_Pat , @Note_Patient)'
            )

          if (result) {
            resolve({
              errCode: 0,
              errMessage: 'Create new patient successfully'
            })
          }
        } else if (getfromdata.Action === 'UPDATE') {
          if (!getfromdata.idPatien) {
            resolve({
              errCode: 1,
              errMessage: 'missing data required '
            })
          } else {
            let oldImage = getfromdata.fileOldImage
            let filenameImage,
              saveImage = ''

            // Check have a new fileImage
            if (data.files && data.files !== null) {
              saveImage = await systemServices.SaveImage(
                data.files.fileimage,
                'Patients'
              )
              if (saveImage.errCode === 0) {
                filenameImage = `Patients/${saveImage.filename}`
              } else {
                filenameImage = 'NULL'
                console.log('Save Image Failed')
              }
            } else {
              filenameImage = getfromdata.nameimage
            }

            let date = getfromdata.birthday
            let phone = ''
            if (getfromdata.birthday === '') {
              date = null
            }
            if (getfromdata.phoneNumber === '') {
              phone = null
            }

            // ckeck email
            let idServer = getfromdata.idServer
            let fullname = getfromdata.fullname
            let selectedgender = getfromdata.selectedgender
            let birthDay = date
            let address = getfromdata.address
            let note = getfromdata.note
            let phoneNumber = phone
            let idPatien = getfromdata.idPatien
            let emailUser = getfromdata.email
            let pool = await getConnectServer()

            //  BẮT ĐẦU UPDATED
            if (emailUser) {
              //  Update nếu idUser và email khớp nhau

              let resultcheck = await pool
                .request()
                .input('id_Patient', mssql.VarChar, idPatien)
                .input('emailUser', mssql.VarChar, emailUser)
                .input('name_Patient', mssql.NVarChar, fullname)
                .input('birthDay', mssql.Date, birthDay)
                .input('PhoneNumber', mssql.Int, phoneNumber)
                .input('Address_Patient', mssql.NVarChar, address)
                .input('Note_Patient', mssql.NText, note)
                .input('gender_Patient', mssql.VarChar, selectedgender)
                .input('image_Pat', mssql.VarChar, filenameImage)
                .query(
                  'UPDATE Patients SET  name_Patient = @name_Patient  , birthDay = @birthDay ,  Address_Patient = @Address_Patient ,PhoneNumber = @PhoneNumber , gender_Patient =@gender_Patient , image_Pat =@image_Pat ,Note_Patient = @Note_Patient WHERE id_Patient =@id_Patient AND  emailUser = @emailUser  '
                )

              // trường hợp update không thành công
              if (resultcheck.rowsAffected[10] === 0) {
                // kiểm tra email đã tồn tại hay chưa
                let resultemail = await pool
                  .request()
                  .input('emailUser', mssql.VarChar, emailUser)
                  .query(
                    `SELECT  P.*  , A.* FROM (SELECT * FROM Patients WHERE Patients.emailUser  = @emailUser ) as P
                      JOIN Accounts AS A ON A.emailUser = P.emailUser
                    `
                  )
                // TRƯỜNG HỢP EMAIL ĐÃ TỒN TẠI (có thông tin email trong bảng patient và account)
                if (resultemail.rowsAffected[0] === 1) {
                  resolve({
                    errCode: 2,
                    errMessage: 'Email đã tồn tại '
                  })
                } else {
                  //  EMAIL TỒN TẠI NHƯNG KHÔNG PHẢI CỦA ADMIN HAY DOCTORS
                  let checkemail = await pool
                    .request()
                    .input('emailUser', mssql.VarChar, emailUser)
                    .query(
                      `SELECT * FROM  Accounts WHERE emailUser = @emailUser AND role_Account ='R1'
                      `
                    )
                  if (checkemail.rowsAffected[0] === 1) {
                    let resultcheck = await pool
                      .request()
                      .input('id_Patient', mssql.VarChar, idPatien)
                      .input('emailUser', mssql.VarChar, emailUser)
                      .input('name_Patient', mssql.NVarChar, fullname)
                      .input('birthDay', mssql.Date, birthDay)
                      .input('PhoneNumber', mssql.Int, phoneNumber)
                      .input('Address_Patient', mssql.NVarChar, address)
                      .input('Note_Patient', mssql.NText, note)
                      .input('gender_Patient', mssql.VarChar, selectedgender)
                      .input('image_Pat', mssql.VarChar, filenameImage)
                      .query(
                        'UPDATE Patients SET  emailUser =@emailUser, name_Patient = @name_Patient  , birthDay = @birthDay ,  Address_Patient = @Address_Patient ,PhoneNumber = @PhoneNumber , gender_Patient =@gender_Patient , image_Pat =@image_Pat ,Note_Patient = @Note_Patient WHERE id_Patient =@id_Patient'
                      )

                    if (resultcheck) {
                      resolve({
                        errCode: 0,
                        errMessage: 'Cập nhật thành công'
                      })
                    }
                  } else {
                    //  kiểm tra email có phải của bác sĩ hay doctor hay không
                    let checkemailDoctor = await pool
                      .request()
                      .input('emailUser', mssql.VarChar, emailUser)
                      .query(
                        `SELECT * FROM  Accounts WHERE emailUser = @emailUser 
                      `
                      )

                    if (checkemailDoctor.rowsAffected[0] === 1) {
                      resolve({
                        errCode: 2,
                        errMessage: 'Email đã tồn tại '
                      })
                    } else if (checkemailDoctor.rowsAffected[0] === 0) {
                      let SendData = {
                        email: emailUser,
                        password: '123456',
                        idServer: idServer,
                        roleId: 'R1'
                      }
                      let newEmail = ''
                      let createEmail = await createNewAccounts(SendData)
                      let success = false
                      if (createEmail.errCode === 0) {
                        newEmail = createEmail.email
                        success = true
                      }

                      if (success === true && newEmail !== null) {
                        console.log(newEmail, 'email........')
                        let checkEmailExist = await pool
                          .request()
                          .input('emailUser', mssql.VarChar, newEmail)
                          .query(
                            ` SELECT * FROM Accounts WHERE emailUser = @emailUser`
                          )

                        console.log(checkEmailExist, 'checkEmailExist')
                        if (checkEmailExist.rowsAffected[0] === 1) {
                          let updatePatient = await pool
                            .request()
                            .input('id_Patient', mssql.VarChar, idPatien)
                            .input('emailUser', mssql.VarChar, newEmail)
                            .input('name_Patient', mssql.VarChar, fullname)
                            .input('birthDay', mssql.Date, birthDay)
                            .input('PhoneNumber', mssql.Int, phoneNumber)
                            .input('Address_Patient', mssql.NVarChar, address)
                            .input('Note_Patient', mssql.NText, note)
                            .input(
                              'gender_Patient',
                              mssql.VarChar,
                              selectedgender
                            )
                            .input('image_Pat', mssql.VarChar, filenameImage)
                            .query(
                              ` UPDATE Patients 
                                SET  
                              emailUser = @emailUser ,
                              name_Patient = @name_Patient  , 
                              birthDay = @birthDay ,  
                              Address_Patient = @Address_Patient ,
                              PhoneNumber = @PhoneNumber , 
                              gender_Patient =@gender_Patient ,
                              image_Pat =@image_Pat ,
                              Note_Patient = @Note_Patient
                                WHERE id_Patient =@id_Patient `
                            )
                          if (updatePatient) {
                            resolve({
                              errCode: 0,
                              errMessage: 'Update successfull'
                            })
                          } else {
                            console.log('Lỗi .......')
                          }
                        }
                      } else {
                        console.log('Lỗi continue.....')
                      }
                    }
                  }
                }
              } else {
                // Update thành công
                if (saveImage.errCode === 0 && oldImage !== filenameImage) {
                  let newpath = __dirname + '../../../files/' + oldImage
                  fs.unlink(newpath, err => {
                    if (err) {
                      console.log(err)
                      return
                    }
                    console.log('Xóa ảnh thành công')
                  })
                }
                resolve({
                  errCode: 0,
                  errMessage: 'Update Successfull ...'
                })
              }
            } else if (emailUser === 'null' || emailUser === null) {
              let resultcheck2 = await pool
                .request()
                .input('id_Patient', mssql.VarChar, idPatien)
                .input('name_Patient', mssql.NVarChar, fullname)
                .input('birthDay', mssql.Date, birthDay)
                .input('PhoneNumber', mssql.Int, phoneNumber)
                .input('Address_Patient', mssql.NVarChar, address)
                .input('Note_Patient', mssql.NText, note)
                .input('gender_Patient', mssql.VarChar, selectedgender)
                .input('image_Pat', mssql.VarChar, filenameImage)
                .query(
                  'UPDATE Patients SET  name_Patient = @name_Patient  , birthDay = @birthDay ,  Address_Patient = @Address_Patient ,PhoneNumber = @PhoneNumber , gender_Patient =@gender_Patient , image_Pat =@image_Pat ,Note_Patient = @Note_Patient WHERE id_Patient =@id_Patient '
                )
              if (resultcheck2) {
                resolve({
                  errCode: 0,
                  errMessage: 'Update successful'
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

let getPatientsById_Service = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.idPatient) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let id_Patient = data.idPatient
        let pool = await getConnectServer(data.idServer)
        let result = await pool
          .request()
          .input('id_Patient', mssql.VarChar, id_Patient)
          .query(
            `SELECT  id_Patient,emailUser ,  name_Patient ,birthDay ,Address_Patient , PhoneNumber , gender_Patient , image_Pat ,Note_Patient , Allcode.value_Code FROM  Patients as P 
            JOIN Allcode On (Allcode.keymap_Code = P.gender_Patient)
            WHERE  P.id_Patient = @id_Patient`
          )
        if (result.recordset.length > 0) {
          resolve({
            errCode: 0,
            errMessage: 'Get data patient successfully',
            data: result.recordset
          })
        } else {
          resolve({
            errCode: 2,
            errMessage: 'request failed'
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getSpecialtyInfor_Service = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.idSpe || !data.idServer) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let pool = await getConnectServer(data.idServer)
        let result = await pool
          .request()
          .query(`SELECT * FROM  Specialties WHERE id_Spe = '${data.idSpe}'`)

        if (result) {
          let arrDoctors = await pool.query(
            `SELECT Doctor_Infor.id_Doctor FROM Doctor_Infor WHERE  Doctor_Infor.id_Spe =   '${data.idSpe}'
            `
          )

          resolve({
            errCode: 0,
            errMessage: 'request successful',
            data: result.recordset[0],
            arrDoctors: arrDoctors.recordset
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getInforDoctorbyId_Service = data => {
  console.log(data)
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.idDoctor) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let idServer = data.idServer
        let pool = await getConnectServer(idServer)
        let idDoctor = data.idDoctor

        let query = `SELECT D.description_Dr , E.fullName , E.image_Employee ,  A.value_Code
        
                    FROM  (SELECT * FROM  Doctor_Infor WHERE Doctor_Infor.id_Doctor = '${idDoctor}') AS D
                    JOIN  Employees AS E ON D.id_Employee = E.id_Employee
                    JOIN  AllCode AS A ON D.position_Dr = A.keymap_Code
        `

        let result = await pool.query(query)
        // console.log(result)
        if (result) {
          resolve({
            errCode: 0,
            errMessage: 'Get data successfull',
            data: result.recordset
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

// truyen vao ngay , idDoctor ,idServer
let getScheduleById_Service = data => {
  console.log(data)

  return new Promise(async (resolve, reject) => {
    try {
      if (!data.date || !data.idDoctor) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let idServer = data.idServer
        let pool = await getConnectServer(idServer)

        let idDoctor = data.idDoctor
        let date = data.date
        let query = `SELECT S.id_Schedule , A1.value_Code  as Time 
        FROM  
        (SELECT *  FROM Schedule_Dr
        WHERE  Schedule_Dr.id_Doctor ='${idDoctor}' AND Schedule_Dr.date_Exam = '${date}'
        ) as S 
        JOIN Allcode AS A1 ON S.timeType = A1.keymap_Code
        
        `
        // ORDER BY A1.value_Code
        let result = await pool.query(query)
        if (result) {
          resolve({
            errCode: 0,
            errMessage: 'get data successfull',
            data: result.recordset
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getAboutScheduleById_Service = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.idSchedule) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let idServer = data.idServer
        let pool = await getConnectServer(idServer)

        let idSchedule = data.idSchedule
        let query = `SELECT A1.value_Code as PriceSchedule , S.*  , A2.value_Code as PaymentSchedule  , E.fullName ,
                      A3.value_Code as Time , C.name_Clinic

                      FROM 
                      (SELECT * FROM  Schedule_Dr WHERE  id_Schedule = '${idSchedule}') as S
                      JOIN AllCode as A1 ON S.price = A1.keymap_Code
                      JOIN AllCode as A2 ON S.payment = A2.keymap_Code
                      JOIN Doctor_Infor AS D ON D.id_Doctor = S.id_Doctor
                      JOIN Employees AS E ON E.id_Employee = D.id_Employee
                      JOIN AllCode as A3 ON A3.keymap_Code =  S.timeType
                      JOIN Clinics as C ON C.id_Clinic = D.id_Clinic
                      `

        let result = await pool.query(query)
        if (result) {
          resolve({
            errCode: 0,
            errMessage: 'Get Data Successfull',
            data: result.recordset[0]
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getInforUserByAccount_Service = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let pool = await getConnectServer()
        let emailUser = data.email
        let query = `SELECT P.* , A1.value_Code as gender FROM 
                    (SELECT * FROM Accounts WHERE Accounts.emailUser = '${emailUser}') as  A
                    JOIN Patients AS P ON A.emailUser = P.emailUser
                    JOIN Allcode as A1 ON P.gender_Patient = A1.keymap_Code
        `
        let getInforPat = await pool.query(query)
        if (getInforPat) {
          let query2 = `SELECT I.patient_history FROM 
          (SELECT * FROM Accounts WHERE Accounts.emailUser = '${emailUser}') as  A
          JOIN Patients AS P ON A.emailUser = P.emailUser
          JOIN Infor_About_Patient AS I ON I.id_Patient = P.id_Patient
`
          let getAboutPatient = await pool.query(query2)

          let query3 = `SELECT B.* , E.fullName  , H.name_Hospital , S.name_Spe , AL.value_Code as status    , AL1.value_Code as TimeSchedle   
          FROM 
          (SELECT * FROM Accounts WHERE Accounts.emailUser = '${emailUser}') as  A
          JOIN Patients AS P ON A.emailUser = P.emailUser
          JOIN Bookings AS B ON B.id_Patient = p.id_Patient
          JOIN Doctor_Infor as D ON D.id_Doctor = B.id_Doctor
          JOIN Employees  as E ON E.id_Employee = D.id_Employee
          JOIN Hospitals  as H ON H.id_Hospital = E.id_Hospital
          JOIN Specialties as S ON S.id_Spe = D.id_Spe
          JOIN AllCode as AL ON AL.keymap_Code = B.status_Booking  
          JOIN AllCode as AL1 ON AL1.keymap_Code = B.timeType
          `

          let getBooking = await pool.query(query3)

          resolve({
            errCode: 0,
            errMessage: 'get data successfully',
            inforUser: getInforPat.recordset,
            Patients: getAboutPatient.recordset[0],
            Booking: getBooking.recordset
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getListTreatments_Service = data => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.idHos) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let idHospital = data.idHos
        let pool = await getConnectServer(idHospital)
        let query = `SELECT DISTINCT S.name_Spe FROM  (SELECT * FROM Treatment_rooms) AS T
                JOIN Specialties as S ON T.id_Spe = S.id_Spe
        `

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

let createNewRequestTreatment_Service = data => {
  console.log(data)
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let pool = await getConnectServer()

        let idPatient = data.idPatient
        let emailUser = data.email
        let fullname = data.fullname
        let birthday = data.birthday
        let gender = data.selectedGender
        let idHos = data.idHos
        let phoneNumber = data.phoneNumber
        let address = data.address
        let note = data.note
        let dateTreatment = data.dateTreatment
        let reason = data.reason

        if (!idPatient && !emailUser) {
          // tạo idPatient
          let create_idPatien = uuidv4().slice(0, 20)
          let result = await pool
            .request()
            .input('id_Patient', mssql.VarChar, create_idPatien)
            .input('name_Patient', mssql.NVarChar, fullname)
            .input('birthDay', mssql.Date, birthday)
            .input('Address_Patient', mssql.NVarChar, address)
            .input('PhoneNumber', mssql.Int, phoneNumber)
            .input('gender_Patient', mssql.VarChar, gender)
            .input('Note_Patient', mssql.NText, note).query(`
                    INSERT INTO Patients (id_Patient, name_Patient, birthDay, Address_Patient, PhoneNumber, gender_Patient, Note_Patient)
                    SELECT @id_Patient, @name_Patient, @birthDay, @Address_Patient, @PhoneNumber, @gender_Patient, @Note_Patient
                  WHERE NOT EXISTS (
                    SELECT 1
                    FROM Patients
                    WHERE
                      name_Patient = @name_Patient
                      AND birthDay = @birthDay
                      AND Address_Patient = @Address_Patient
                      AND PhoneNumber = @PhoneNumber
                      AND gender_Patient = @gender_Patient
                                                                )
                                                                     `)
          if (result.rowsAffected[10] === 0) {
            console.log('Người dùng đã tồn tại ')

            const querygetId = `SELECT Patients.id_Patient FROM Patients 
            WHERE 
               Patients.name_Patient = @fullname
               AND Patients.birthDay = @birthday
               AND Patients.Address_Patient = @address
               AND Patients.PhoneNumber = @phoneNumber
               AND Patients.gender_Patient = @gender`

            const result = await pool
              .request()
              .input('fullname', mssql.NVarChar, fullname)
              .input('birthday', mssql.Date, birthday)
              .input('address', mssql.NVarChar, address)
              .input('phoneNumber', mssql.Int, phoneNumber)
              .input('gender', mssql.VarChar, gender)
              .query(querygetId)

            let idPatien = result.recordset[0].id_Patient
            let RequestId = uuidv4().slice(0, 20)
            let status = 'STB1'
            let result2 = await pool
              .request()
              .input('RequestId', mssql.VarChar, RequestId)
              .input('id_Hospital', mssql.VarChar, idHos)
              .input('id_Patient', mssql.VarChar, idPatien)
              .input('dateSchedule', mssql.Date, dateTreatment)
              .input('reason_Treat', mssql.NText, reason)
              .input('Status_Request', mssql.VarChar, status)
              .query(
                `INSERT INTO  Request_Treatment (RequestId , id_Hospital ,id_Patient ,dateSchedule ,reason_Treat ,Status_Request )
                SELECT @RequestId , @id_Hospital ,@id_Patient ,@dateSchedule ,@reason_Treat ,@Status_Request
                WHERE NOT EXISTS (
                  SELECT *
                  FROM Request_Treatment
                  WHERE
                    id_Hospital = @id_Hospital
                    AND id_Patient = @id_Patient
                    AND dateSchedule = @dateSchedule )`
              )

            console.log(result2, 'trường hợp 1 ')
            if (result2.rowsAffected[10] === 1) {
              resolve({
                errCode: 0,
                errMessage: 'Create request successfully'
              })
            } else if (result2.rowsAffected[10] === 0) {
              resolve({
                errCode: 2,
                errMessage: 'Lịch đã được tạo'
              })
            }
          } else if (result.rowsAffected[10] === 1) {
            let RequestId = uuidv4().slice(0, 20)
            let status = 'STB1'
            let result2 = await pool
              .request()
              .input('RequestId', mssql.VarChar, RequestId)
              .input('id_Hospital', mssql.VarChar, idHos)
              .input('id_Patient', mssql.VarChar, create_idPatien)
              .input('dateSchedule', mssql.Date, dateTreatment)
              .input('reason_Treat', mssql.NText, reason)
              .input('Status_Request', mssql.VarChar, status)
              .query(
                `INSERT INTO  Request_Treatment (RequestId , id_Hospital ,id_Patient ,dateSchedule ,reason_Treat ,Status_Request )
                SELECT @RequestId , @id_Hospital ,@id_Patient ,@dateSchedule ,@reason_Treat ,@Status_Request
                WHERE NOT EXISTS (
                  SELECT *
                  FROM Request_Treatment
                  WHERE
                    id_Hospital = @id_Hospital
                    AND id_Patient = @id_Patient
                    AND dateSchedule = @dateSchedule )`
              )

            console.log(result2)
            if (result2) {
              resolve({
                errCode: 0,
                errMessage: 'Create successful'
              })
            }
          }
        } else if (!idPatient && emailUser) {
          console.log('có email và không có id')
          let query = `SELECT * FROM Accounts WHERE emailUser = '${emailUser}'`
          let result = await pool.query(query)
          if (result.rowsAffected[0] === 1) {
            resolve({
              errCode: 2,
              errMessage: 'Email đã tồn tại, vui lòng đăng nhập'
            })
          } else if (result.rowsAffected[0] === 0) {
            // email chưa tồn tại tạo email mới

            let datasend = {
              email: emailUser,
              password: '123456'
            }

            let createAccout = await createNewAccounts(datasend)
            if (createAccout.errCode === 0) {
              // tạo email thành công

              let idPatien = uuidv4().slice(0, 20)
              let result = await pool
                .request()
                .input('id_Patient', mssql.VarChar, idPatien)
                .input('emailUser', mssql.VarChar, emailUser)
                .input('name_Patient', mssql.NVarChar, fullname)
                .input('birthDay', mssql.Date, birthday)
                .input('Address_Patient', mssql.NVarChar, address)
                .input('PhoneNumber', mssql.Int, phoneNumber)
                .input('gender_Patient', mssql.VarChar, gender)
                .input('Note_Patient', mssql.NText, note).query(`
                      INSERT INTO Patients (id_Patient,emailUser , name_Patient, birthDay, Address_Patient, PhoneNumber, gender_Patient, Note_Patient)
                      SELECT @id_Patient, @emailUser ,@name_Patient, @birthDay, @Address_Patient, @PhoneNumber, @gender_Patient, @Note_Patient
                    WHERE NOT EXISTS (
                      SELECT 1
                      FROM Patients
                      WHERE
                        emailUser = @emailUser 
                        AND name_Patient = @name_Patient
                        AND birthDay = @birthDay
                        AND Address_Patient = @Address_Patient
                        AND PhoneNumber = @PhoneNumber
                        AND gender_Patient = @gender_Patient
                                                                  )
                                                                       `)

              if (result.rowsAffected[10] === 1) {
                // tạo thành công
                let RequestId = uuidv4().slice(0, 20)
                let status = 'STB1'
                let result2 = await pool
                  .request()
                  .input('RequestId', mssql.VarChar, RequestId)
                  .input('id_Hospital', mssql.VarChar, idHos)
                  .input('id_Patient', mssql.VarChar, idPatien)
                  .input('dateSchedule', mssql.Date, dateTreatment)
                  .input('reason_Treat', mssql.NText, reason)
                  .input('Status_Request', mssql.VarChar, status)
                  .query(
                    `INSERT INTO  Request_Treatment (RequestId , id_Hospital ,id_Patient ,dateSchedule ,reason_Treat ,Status_Request )
                SELECT @RequestId , @id_Hospital ,@id_Patient ,@dateSchedule ,@reason_Treat ,@Status_Request
                WHERE NOT EXISTS (
                  SELECT *
                  FROM Request_Treatment
                  WHERE
                    id_Hospital = @id_Hospital
                    AND id_Patient = @id_Patient
                    AND dateSchedule = @dateSchedule )`
                  )

                console.log(result2)
                if (result2.rowsAffected[10] === 0) {
                  resolve({
                    errCode: 2,
                    errMessage: 'Lịch đã được tạo'
                  })
                } else if (result2.rowsAffected[10] === 1) {
                  resolve({
                    errCode: 0,
                    errMessage: 'Tạo lịch thành công'
                  })
                }
              } else if (result.rowsAffected[10] === 0) {
                resolve({
                  errCode: 2,
                  errMessage: 'Tạo Người dùng thất bại'
                })
              }
            } else {
              console.log('tạo email thất bại')
            }
          }
        } else {
          console.log(idHos, idPatient)
          let RequestId = uuidv4().slice(0, 20)
          let status = 'STB1'
          let result2 = await pool
            .request()
            .input('RequestId', mssql.VarChar, RequestId)
            .input('id_Hospital', mssql.VarChar, idHos)
            .input('id_Patient', mssql.VarChar, idPatient)
            .input('dateSchedule', mssql.Date, dateTreatment)
            .input('reason_Treat', mssql.NText, reason)
            .input('Status_Request', mssql.VarChar, status)
            .query(
              `INSERT INTO  Request_Treatment (RequestId , id_Hospital ,id_Patient ,dateSchedule ,reason_Treat ,Status_Request )
              SELECT @RequestId , @id_Hospital ,@id_Patient ,@dateSchedule ,@reason_Treat ,@Status_Request
              WHERE NOT EXISTS (
              SELECT *
              FROM Request_Treatment
              WHERE
            id_Hospital = @id_Hospital
            AND id_Patient = @id_Patient
            AND dateSchedule = @dateSchedule )`
            )

          if (result2.rowsAffected[10] === 0) {
            resolve({
              errCode: 2,
              errMessage: 'Lịch đã được tạo'
            })
          } else if (result2.rowsAffected[10] === 1) {
            resolve({
              errCode: 0,
              errMessage: 'Tạo lịch thành công'
            })
          }
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

let updateInforUser_Service = data => {
  return new Promise(async (resolve, reject) => {
    console.log(data.files, 'files image ')
    console.log(data.body, 'body image ')

    let files = data.files
    let databody = data.body

    try {
      if (!databody) {
        resolve({
          errCode: 1,
          errMessage: 'Missing data required'
        })
      } else {
        let idPatient = databody.id_Patient
        let fullname = databody.fullname,
          birthDay = databody.birthday,
          gender = databody.selectedGender,
          Address_Patient = databody.Address_Patient,
          numberPhone = databody.numberPhone,
          note = databody.note,
          filenameImage = '',
          oldImage = databody.oldImage,
          idServer = 'ALL'
        let pool = await getConnectServer(idServer)
        if (files) {
          let sendImage = await systemServices.SaveImage(
            files.fileImage,
            'Patients'
          )
          if (sendImage.errCode === 0) {
            filenameImage = `Patients/${sendImage.filename}`
            if (filenameImage && oldImage && oldImage !== filenameImage) {
              let newpath = __dirname + '../../../files/' + oldImage
              fs.unlink(newpath, err => {
                if (err) {
                  console.log(err)
                  return
                }
              })
            } else filenameImage = oldImage
          } else {
            console.log('xóa ảnh thất bại')
            filenameImage = oldImage
          }

          let result = await pool
            .request()
            .input('id_Patient', mssql.VarChar, idPatient)
            .input('name_Patient', mssql.NVarChar, fullname)
            .input('birthDay', mssql.Date, birthDay)
            .input('Address_Patient', mssql.NVarChar, Address_Patient)
            .input('PhoneNumber', mssql.Int, numberPhone)
            .input('gender_Patient', mssql.VarChar, gender)
            .input('image_Pat', mssql.VarChar, filenameImage)
            .input('Note_Patient', mssql.NText, note).query(` UPDATE Patients 
            SET 
            name_Patient =@name_Patient , 
            birthDay =@birthDay , 
            Address_Patient=@Address_Patient , 
            PhoneNumber=@PhoneNumber , 
            gender_Patient =@gender_Patient ,
            image_Pat =@image_Pat  ,
            Note_Patient= @Note_Patient 
            WHERE id_Patient = @id_Patient
            `)
          if (result) {
            resolve({
              errCode: 0,
              errMessage: 'Update data successfully'
            })
          }
        } else if (!files) {
          filenameImage = oldImage
          if (filenameImage) {
            let result = await pool
              .request()
              .input('id_Patient', mssql.VarChar, idPatient)
              .input('name_Patient', mssql.NVarChar, fullname)
              .input('birthDay', mssql.Date, birthDay)
              .input('Address_Patient', mssql.NVarChar, Address_Patient)
              .input('PhoneNumber', mssql.Int, numberPhone)
              .input('gender_Patient', mssql.VarChar, gender)
              .input('image_Pat', mssql.VarChar, filenameImage)
              .input('Note_Patient', mssql.NText, note).query(` UPDATE Patients 
          SET 
          name_Patient =@name_Patient , 
          birthDay =@birthDay , 
          Address_Patient=@Address_Patient , 
          PhoneNumber=@PhoneNumber , 
          gender_Patient =@gender_Patient ,
          image_Pat =@image_Pat  ,
          Note_Patient= @Note_Patient 
          WHERE id_Patient = @id_Patient
          `)
            if (result) {
              resolve({
                errCode: 0,
                errMessage: 'Update data successfully'
              })
            }
          } else if (filenameImage === 'null' && filenameImage === null) {
            let result = await pool
              .request()
              .input('id_Patient', mssql.VarChar, idPatient)
              .input('name_Patient', mssql.NVarChar, fullname)
              .input('birthDay', mssql.Date, birthDay)
              .input('Address_Patient', mssql.NVarChar, Address_Patient)
              .input('PhoneNumber', mssql.Int, numberPhone)
              .input('gender_Patient', mssql.VarChar, gender)
              .input('Note_Patient', mssql.NText, note).query(` UPDATE Patients 
               SET 
               name_Patient =@name_Patient , 
               birthDay =@birthDay , 
               Address_Patient=@Address_Patient , 
               PhoneNumber=@PhoneNumber , 
               gender_Patient =@gender_Patient ,
               Note_Patient= @Note_Patient 
               WHERE id_Patient = @id_Patient
        `)
            if (result) {
              resolve({
                errCode: 0,
                errMessage: 'Update data successfully'
              })
            }
          }
        }
      }

      resolve({
        errCode: 0
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
  GetListUsers_Service,
  CreateAndUpdateUsers_Service,
  getPatientsById_Service,
  getSpecialtyInfor_Service,
  getInforDoctorbyId_Service,
  getScheduleById_Service,
  getAboutScheduleById_Service,
  getInforUserByAccount_Service,
  getListTreatments_Service,
  createNewRequestTreatment_Service,
  updateInforUser_Service
}
