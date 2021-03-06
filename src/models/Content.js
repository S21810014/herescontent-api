const { DataTypes } = require('sequelize')

module.exports = sequelize => {
    sequelize.define('Content', {
        title: {
            allowNull: false,
            type: DataTypes.STRING
        },
        body: {
            allowNull: false,
            type: DataTypes.STRING(1024)
        },
        postType: {
            allowNull: false,
            type: DataTypes.STRING
        }
    })
}