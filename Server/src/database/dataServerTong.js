import connection from "./connection.js";
import mssql from 'mssql'


let dataserverTong  = connection.config.database1

export async function getconnectData1() {

    try {
    let pool =   new mssql.ConnectionPool(dataserverTong)
    console.log("Dang ket noi den server tong")
    return await pool.connect()
    } catch (e) {
        console.log("Erroo from dataserverTong.............", e)
    }
    
    // const result =  await pool.request().query('select * from  Accounts  ')
    // console.log('data from server tong ')
    // console.log(result)
}


export {mssql}



 



 

