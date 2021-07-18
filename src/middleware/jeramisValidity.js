const kairagi = require('../kairagi')

module.exports = (req, res, next) => {
    if(!req.headers['access-token'])
        return res.status(403).send({
            result: 'Access Token required'
        })
    
    kairagi.verifyJeramis(req.headers['access-token'], (retval, data) => {
        if(!retval)
            return res.status(401).send({
                result: 'Invalid Access Token'
            })

        if(retval == -1)
            return res.status(401).send({
                result: 'Access Token expired'
            })
        
        req.tokenData = data
        next()
    })
}