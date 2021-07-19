const express = require('express')
const { models } = require('../sequelize')
const { checkFields, errorFormatter } = require('../utils')
const bcrypt = require('bcrypt')
const jeramisValidity = require('../middleware/jeramisValidity')
const permissionValidity = require('../middleware/permissionValidity')
let router = express.Router()

router.post('/api/user/create', (req, res) => {
    let err = checkFields(req.body, ['name', 'password'])

    if (err) {
        res.status(400).send(err)
    } else {
        req.body.name.trim()
        
        if(req.body.name.length < 3)
            res.status(400).send({
                result: 'Username length must be at least 3 characters'
            })

        req.body.accessLevel = "NORMAL"
        req.body.password = bcrypt.hashSync(req.body.password, 10)
        
        models.User.create(req.body)
            .then(val => {
                res.send(val)
            })
            .catch(reason => {
                res.status(400).send(errorFormatter(reason))
            })
        
    }
})

router.post('/api/user/changePassword', jeramisValidity, (req, res) => {
    let err = checkFields(req.body, ['id', 'password'])

    if (err) {
        res.status(400).send(err)
    } else {
        if(req.body.password.length < 7)
            return res.status(400).send({
                result: 'Password must be atleast 7 character'
            })
        
        models.User.findOne({where: {id: req.tokenData.id}}).then(model => {
            model.update({
                password: bcrypt.hashSync(req.body.password, 10)
            })
        })
    }
})

router.post(
    '/api/user/promote', 
    [
        jeramisValidity,
        (req, res, next) => permissionValidity(2, req, res, next)
    ], 
    (req, res) => {
    let err = checkFields(req.body, ['id', 'accessLevel'])

    if (err)
        res.status(400).send(err)
    else
        models.User.findOne({where: {id: req.body.id}})
        .then(model => {
            model.update({accessLevel: req.body.accessLevel})
            .then(value => {
                res.send(req.body)
            })
            .catch(reason => {
                res.status(400).send(errorFormatter(reason))
            })
        })
        .catch(reason => {
            res.status(400).send(errorFormatter(reason))
        })
    }
)

module.exports = router