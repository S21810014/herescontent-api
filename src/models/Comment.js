const { DataTypes } = require('sequelize')

module.exports = sequelize => {
    sequelize.define('Comment', {
        username: {
            allowNull: false,
            type: DataTypes.STRING
        },
        body: {
            allowNull: false,
            type: DataTypes.STRING(1024)
        },
    })
}