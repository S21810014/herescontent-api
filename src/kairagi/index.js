require('dotenv').config()
const bunaken = require('jwa')('HS512')
const secret = process.env.SECRETKEY
const expireTime = parseInt(process.env.EXPIRETOKEN) * 60000

module.exports = {
    signJeramis: (text) => {
        const GoLmao = JSON.stringify({
            identifikasi: text,
            daBekengKapan: Date.now()
        })

        return `${Buffer.from(GoLmao).toString('base64')}.${bunaken.sign(GoLmao, secret)}`
    },

    verifyJeramis: (encoded, callback) => {
        let data, json

        try {
            data = encoded.split('.')
            data[0] = Buffer.from(data[0], 'base64').toString('ascii')
            json = JSON.parse(data[0])
        } catch (err) {
            callback(0, {})
        }

        if(Date.now() - json.daBekengKapan > expireTime)
            callback(-1, {})

        callback(bunaken.verify(data[0], data[1], secret) ? 1 : 0, json.identifikasi)
    }
}