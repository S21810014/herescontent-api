const express = require('express')
const jeramisValidity = require('../middleware/jeramisValidity')
const { checkFields, errorFormatter } = require('../utils')
const { models } = require('../sequelize')
let router = express.Router()

router.get('/api/content', (req, res) => {
    res.send('content api')
})

router.post('/api/content/postContent', jeramisValidity, (req, res) => {
    let err = checkFields(req.body, ['title', 'body', 'type'])
    
    if(err)
        return res.status(400).send(err)
    else {
        if(req.body.type == 'PRIVATE')
            req.body.postType = 'PRIVATE'
        else if (req.body.type == 'PUBLIC')
            req.body.postType = 'STAGING'
        else
            res.status(400).send({
                result: 'Invalid post type'
            })
        
        req.body.UserId = req.tokenData.id

        models.Content.create(req.body).then(value => {
            res.send(req.body)
        })
        .catch(reason => {
            res.status(400).send(errorFormatter(reason))
        })
    }
})

router.post('/api/content/deleteContent', jeramisValidity, (req, res) => {
    let err = checkFields(req.body, ['id'])
    
    if(err)
        return res.status(400).send(err)
    else {
        models.Content.findOne({where: {id: req.body.id}})
            .then(value => {
                if(!value) {
                    res.status(404).send({
                        result: 'Post doesn\'t exist'
                    })
                } else if(value && value.UserId != req.tokenData.id) {
                    res.status(403).send({
                        result: 'Unable to delete a post which aren\'t owned by you'
                    })
                } else {
                    models.Content.destroy({where: {id: req.body.id}}).then(value => {
                        res.send(req.body)
                    })
                }
            })
            .catch(reason => {
                res.status(400).send(errorFormatter(reason))
            })
    }
})

router.post('/api/content/approveContent', jeramisValidity, (req, res) => {
    let err = checkFields(req.body, ['id'])

    if(err)
        return res.status(400).send(err)
    else {
        models.User.findOne({where: {id: req.tokenData.id}})
        .then(value => {
            if(value && value.accessLevel == "MODERATOR" || value.accessLevel == "ADMIN") {
                models.Content.findOne({where: {id: req.body.id}}).then(model => {
                    model.update({postType: 'PUBLIC'})
                    .then(value => {
                        res.send(req.body)
                    })
                    .catch(reason => {
                        res.status(400).send(errorFormatter(reason))
                    })
                })
                .catch(reason => 
                    res.status(400).send({
                        result: 'Cannot find post with given id'
                    })
                )
            } else {
                res.status(403).send({
                    result: 'You don\'t have the required permission to perform that'
                })
            }
        })
        .catch(reason => {
            res.status(400).send(errorFormatter(reason))
        })
    }
})

module.exports = router