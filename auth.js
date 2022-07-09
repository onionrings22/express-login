const jwt = require('jsonwebtoken')
const secret = require('./secret')

const isAuthorized  = function(req, res, next) {
    let token = req.headers.authorization.split(' ')[1]
    if (!token) {
        return res.status(403).send({message: 'Missing auth token!'})
    }
    jwt.verify(token, secret.value, (err, decoded) => {
        if (err) {
            console.log("verify token error", err)
            return res.status(401).send({message: 'Not authorized!'})
        }
        req.user = decoded
        if (next) {
            next()
        }
    })
}

module.exports = isAuthorized