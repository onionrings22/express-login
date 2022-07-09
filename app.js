const express = require('express')
const cookieSession = require('cookie-session')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const isAuthorized = require('./auth')
const secret = require('./secret')
const app = express()
const port = 8080
const users = []

app.use(cookieSession({
	name: 'simple-session',
	secret: 'SUPER SECRET VALUE',
	httpOnly: true
}))
app.use(express.json())

app.post('/sign-up', (req, res) => {
    if (req.body.name && req.body.email && req.body.password) {
        let encrPw = bcrypt.encodeBase64(req.body.password)
        let user = {
            name: req.body.name,
            email: req.body.email,
            password: encrPw
        }
        users.push(user)
        return res.send({message: 'Signed up successfully!'})
    } else {
        return res.status(401).send({message: 'Missing required parameter. Ensure that name, email, and password are being sent'})
    }
})

app.post('/sign-in', (req, res) => {
    if (req.body.email && req.body.password) {
        let existingUser
        users.every((user) => {
            if (user.email === req.body.email) {
                existingUser = user
                return false
            }
            return true
        })
        if (existingUser) {
            const encrPw = bcrypt.encodeBase64(req.body.password)
            if (existingUser.password === encrPw) {
                let simpleUser = {
                    name: existingUser.name,
                    email: existingUser.email
                }
                const token = jwt.sign(simpleUser, secret.value)
                console.log("jwt: ", token)
                simpleUser.token = token
                return res.send(simpleUser)
            } else {
                return res.status(401).send({message: 'Invalid password'})
            }
        } else {
            return res.status(404).send({message: 'User not found'})
        }
    } else {
        return res.status(401).send({message: 'Missing required parameter. Ensure that email and password are being sent'})
    }
})

app.get('/me', (req, res) => {
    console.log(req.headers.authorization)
    isAuthorized(req, res)
    return res.status(200).send(req.user)
})

app.listen(port, () => {
  console.log(`Login app listening on port ${port}`)
})