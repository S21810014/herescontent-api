const express = require('express')
const sequelize = require('sequelize')
let router = express.Router()

router.get('/api/content', (req, res, next) => {
    res.send("content api")
})

module.exports = router