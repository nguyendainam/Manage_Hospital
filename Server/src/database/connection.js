import mssql from 'mssql'
import * as dotenv from 'dotenv'

dotenv.config()

let {
  PORT,
  HOST,
  SQL_USER,
  SQL_PASSWORD,
  SQL_DATABASE,
  SQL_SERVER,
  SQL_ENCRYPT,
  DATABASE1,
  DATABASE2,
  DATABASE3,
  DATABASE4
} = process.env

let config = {
  database1: {
    driver: 'SQL Server',
    host: 'localhost',
    server: `DESKTOP-KVRCL4D\\DAINAM`,
    user: SQL_USER,
    password: SQL_PASSWORD,
    database: SQL_DATABASE,
    options: {
      encrypt: false,
      enableArithAbort: false
    },
    connectionTimeout: 300000,
    requestTimeout: 300000,
    pool: {
      idleTimeoutMillis: 30000,
      max: 100
    }
  },
  database2: {
    driver: 'SQL Server',
    host: 'localhost',
    server: `DESKTOP-KVRCL4D\\DAINAM01`,
    user: SQL_USER,
    password: SQL_PASSWORD,
    database: SQL_DATABASE,
    options: {
      encrypt: false,
      enableArithAbort: false
    },
    connectionTimeout: 300000,
    requestTimeout: 300000,
    pool: {
      idleTimeoutMillis: 30000,
      max: 100
    }
  },
  database3: {
    driver: 'SQL Server',
    host: 'localhost',
    server: `DESKTOP-KVRCL4D\\DAINAM02`,
    user: SQL_USER,
    password: SQL_PASSWORD,
    database: SQL_DATABASE,
    options: {
      encrypt: false,
      enableArithAbort: false
    },
    connectionTimeout: 300000,
    requestTimeout: 300000,
    pool: {
      idleTimeoutMillis: 30000,
      max: 100
    }
  },
  database4: {
    driver: 'SQL Server',
    host: 'localhost',
    server: `DESKTOP-KVRCL4D\\DAINAM03`,
    user: SQL_USER,
    password: SQL_PASSWORD,
    database: SQL_DATABASE,
    options: {
      encrypt: false,
      enableArithAbort: false
    },
    connectionTimeout: 300000,
    requestTimeout: 300000,
    pool: {
      idleTimeoutMillis: 30000,
      max: 100
    }
  },

  raw: true
}

export default {
  config: config
}
