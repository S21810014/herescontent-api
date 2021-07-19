const { Sequelize, DataTypes, Model } = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('User', {
        accessLevel: {
            allowNull: false,
            type: DataTypes.STRING
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING
        },
    })
}