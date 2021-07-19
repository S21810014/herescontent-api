const { models } = require('../sequelize')
const { errorFormatter } = require('../utils')

module.exports = (accessLevel, req, res, next) => {
    console.log(req.tokenData)
    models.User.findOne({where: {id: req.tokenData.id}})
    .then(model => {
        if(model.accessLevel >= accessLevel)
            next()
        else
            return res.status(403).send({
                result: 'You don\'t have the required permission to perform this'
            })
    })
    .catch(reason => {
        res.status(400).send(errorFormatter(reason))
    })
}