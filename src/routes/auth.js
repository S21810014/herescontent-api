const express = require('express')
const { models } = require('../sequelize')
const kairagi = require('../kairagi')
const bcrypt = require('bcrypt')
const { checkFields } = require('../utils')
let router = express.Router()

router.post('/api/auth/login', (req, res, next) => {
    let err = checkFields(req.body, ['name', 'password'])
    
    if (err) {
        res.status(400).send(err)
        return
    }
    
    models.User.findOne({where: {name: req.body.name}})
        .then(value => {
            if(value) {
                if(bcrypt.compareSync(req.body.password, value.password))
                    res.send({
                        result: 'success',
                        accessToken: kairagi.signJeramis({
                            id: value.id,
                            name: value.name
                        }, process.env.SECRETKEY)
                    })
                else
                    res.status(403).send({
                        result: 'Incorrect password'
                    })
            } else {
                res.status(404).send({
                    result: 'User doesn\'t exist'
                })
            }
        })
})


module.exports = router