import connection from './connection.js'
import mssql from 'mssql'

let dataserverTong = connection.config.database1
let dataserverTram01 = connection.config.database2
let dataserverTram02 = connection.config.database3
let dataserverTram03 = connection.config.database4

export async function getconnectData1 () {
  try {
    let pool = new mssql.ConnectionPool(dataserverTong)
    console.log('Dang ket noi den server tong')
    return await pool.connect()
  } catch (e) {
    console.log('Erroo from dataserverTong.............', e)
  }
}

export async function getConnectDataTRAM01 () {
  try {
    let pool = new mssql.ConnectionPool(dataserverTram01)
    console.log('Dang ket noi den server tram 01')
    return await pool.connect()
  } catch (e) {}
}

export async function getConnectDataTRAM02 () {
  try {
    let pool = new mssql.ConnectionPool(dataserverTram02)
    console.log('Dang ket noi den  server tram 02')
    return await pool.connect()
  } catch (e) {
    console.log(e)
  }
}

export async function getConnectDataTRAM03 () {
  try {
    let pool = new mssql.ConnectionPool(dataserverTram03)
    console.log('Dang ket noi den  server tram 02')
    return await pool.connect()
  } catch (e) {
    console.log(e)
  }
}

export async function getConnectServer (idserver) {
  try {
    if (!idserver) {
      let pool = new mssql.ConnectionPool(dataserverTong)
      console.log('CONNECT DEN SERVER TONG')
      return await pool.connect()
    } else {
      if (idserver === 'ALL') {
        let pool = new mssql.ConnectionPool(dataserverTong)
        console.log('Dang ket noi den server Tong')
        return await pool.connect()
      } else {
        if (idserver === 'HOSP01') {
          let pool = new mssql.ConnectionPool(dataserverTram01)
          console.log('Dang ket noi den server tram 01')
          return await pool.connect()
        }
        if (idserver === 'HOSP02') {
          let pool = new mssql.ConnectionPool(dataserverTram02)
          console.log('Dang ket noi den server tram 02')
          return await pool.connect()
        } else if (idserver === 'HOSP03') {
          let pool = new mssql.ConnectionPool(dataserverTram03)
          console.log('Dang ket noi den server tram 03')
          return await pool.connect()
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
}

export { mssql }
