import express from 'express'
import * as dotenv from 'dotenv'
// import './database/dataServerTong.js'
import bodyParser from 'body-parser'
import UserRouter from './routes/userRouter.js'
import Systemrouter from './routes/systemRouter.js'
const app = express()

app.use(function (req, res, next) {
  // process.env.URL_APP
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT)
  // res.setHeader('Access-Control-Allow-Origin', process.env.URL_APP);

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  )

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)

  // Pass to next layer of middleware
  next()
})

dotenv.config()
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use(UserRouter)
app.use(Systemrouter)

let PORT = process.env.PORT || 9999
app.listen(PORT, () => {
  console.log('PORT running on locahost:' + PORT)
})
