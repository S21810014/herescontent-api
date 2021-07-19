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
require('./models/Content')(sequelize)
require('./models/Comment')(sequelize)

const {User, Content, Comment} = sequelize.models;

User.hasMany(Content)
Content.belongsTo(User)
User.hasMany(Comment)
Content.hasMany(Comment)
Comment.belongsTo(User)
Comment.belongsTo(Content)

module.exports = sequelize