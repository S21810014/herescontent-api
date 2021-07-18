require('dotenv').config()
const express = require('express')
const path = require('path')
const sequelize = require('./sequelize')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const app = express()
const port = 8080

const requiredTokens = [
    "SECRETKEY",
    "EXPIRETOKEN",
    "DBIP",
    "DBNAME",
    "DBUSR",
    "DBPASS",
]

requiredTokens.forEach(el => {
    if(!process.env[el])
        throw `${el} not defined in environment variables`
})


sequelize.authenticate().then(
    () => console.log("Database connection established successfully")
    ,
    (reason) => console.error("Database connection failed: ", reason)
)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

app.use(require('./routes/content'))
app.use(require('./routes/user'))
app.use(require('./routes/auth'))

app.get('/', (req, res) => {
    res.send("hello world!")
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})