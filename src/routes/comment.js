const express = require('express')
const jeramisValidity = require('../middleware/jeramisValidity')
const permissionValidity = require('../middleware/permissionValidity')
const { models } = require('../sequelize')
const { checkFields, errorFormatter } = require('../utils')
let router = express.Router()

router.post('/api/comment/addComment', jeramisValidity, (req, res) => {
    let err = checkFields(req.body, ['body', 'ContentId'])

    if(err)
        return res.status(400).send(err)
    else {
        if(req.body.body.length < 1 || req.body.body.length > 1024)
            return res.status(400).send({
                result: 'Comment body cannot be less than 1 character or more than 1024 characters'
            })

        models.Content.findOne({where: {id: req.body.ContentId}})
        .then(model => {
            req.body.username = req.tokenData.name
            req.body.UserId = req.tokenData.id

            models.Comment.create(req.body)
                .then(val => {
                    res.send(val)
                })
                .catch(reason => {
                    res.status(400).send(errorFormatter(reason))
                })
        })
        .catch(reason => {
            res.status(400).send(errorFormatter(reason))
        })
    }
})

router.post('/api/comment/deleteComment', jeramisValidity, (req, res) => {
    let err = checkFields(req.body, ['id'])

    if(err)
        return res.status(400).send(err)
    else {
        models.Comment.findOne({where: {id: req.body.id}})
        .then(model => {
            if(model.UserId != req.tokenData.id)
                res.status(403).send({
                    result: 'Unable to delete a comment which aren\'t owned by you'
                })
            else
                models.Comment.destroy({where: {id: model.id}})
                .then(value => res.send(req.body))
                .catch(reason => res.status(400).send(errorFormatter(reason)))
        })
        .catch(reason => res.status(400).send(errorFormatter(reason)))
    }
})

router.post(
    '/api/comment/forceDeleteComment',
    [
        jeramisValidity,
        (req, res, next) => permissionValidity(2, req, res, next)
    ],
    (req, res) => {
        let err = checkFields(req.body, ['id'])

        if(err)
            return res.status(400).send(err)
        else {
            models.Comment.findOne({where: {id: req.body.id}})
            .then(model => {
                models.Comment.destroy({where: {id: model.id}})
                .then(value => res.send(req.body))
                .catch(reason => res.status(400).send(errorFormatter(reason)))
            })
            .catch(reason => res.status(400).send(errorFormatter(reason)))
        }
    }
)

router.post(
    '/api/comment/getCommentFromPost',
    jeramisValidity,
    (req, res) => {
        let err = checkFields(req.body, ['id'])

        if(err)
            return res.status(400).send(err)
        else
            models.Content.findOne({where: {id: req.body.id}, include: [{model: models.Comment}]})
            .then(model => {
                console.log(model)
                const mapping = model.Comments.map(el => ({
                    username: el.username,
                    body: el.body
                }))

                console.log(mapping)
                res.send(mapping)
            })
            .catch(reason => res.status(400).send(errorFormatter(reason)))
    }
)

module.exports = router