const express = require('express')
const { models } = require('../sequelize')
const { checkKeys, checkFields, errorFormatter } = require('../utils')
const bcrypt = require('bcrypt')
let router = express.Router()

router.post('/api/user/create', (req, res, next) => {
    let err = checkFields(req.body, ['name', 'password'])

    if (err) {
        res.status(400).send(err)
    } else {
        req.body.accessLevel = "NORMAL"
        req.body.password = bcrypt.hashSync(req.body.password, 10)
        
        models.User.sync().then(model => {
            model.create(req.body)
                .then(val => {
                    res.send(val)
                })
                .catch(reason => {
                    res.status(400).send(errorFormatter(reason))
                })
        })
        
    }
})

router.post('/api/user/changePassword', (req, res, next) => {
    let err = checkFields(req.body, ['id', 'password'])

    if (err) {
        res.status(400).send(err)
    } else {
        models.User.sync().then(model => {
            model.update({
                password: bcrypt.hashSync(req.body.password, 10)
            }).then(val => {
                res.send(val)
            })
            .catch(reason => {
                res.status(400).send(errorFormatter(reason))
            })
        })
    }
})

module.exports = router