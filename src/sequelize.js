require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
    process.env.DBNAME, 
    process.env.DBUSR, 
    process.env.DBPASS,
    {
        host: process.env.DBIP,
        port: "3306",
        dialect: "mysql"
    }
)

require('./models/User')(sequelize)

module.exports = sequelize