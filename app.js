const express = require('express')
const app = express()

const User =  require('./models/User')

const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/nodeauth', {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.on('open', () => console.log("Connected to the database successfully!"))

app.use(express.json())

app.post('/signup', async(req, res) => {
    try {
        const body = req.body
        const newUser = new User(body)
        await newUser.save()

        res.json({
            success: true,
            message: "User created Successfully!"
        })

    } catch(e) {
        res.status(400).json({
            success: false,
            message: "Invalid Inputs!"
        })

    }
})

const secretCode = "ijse123nodejsmodule"
const expireAfter = 3 * 24 * 60 * 60

const genToken = (user) => {
    return jwt.sign({id: user._id, email: user.email}, secretCode, {expiresIn: expireAfter})
}

app.post('/signin', async(req, res) => {
    try {
        const body = req.body
        
        const user = await User.loginCheck(body.email, body.password)
        console.log('USER: ', user)

        // generate the token
        const token = genToken(user)

        res.json({
            success: true,
            body: {
                access_token: token
            }
        })

    } catch(e) {
        res.status(400).json({
            success: false,
            message: "Invalid Inputs!"
        })
    }
})

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization']
    console.log('token > ', token)
    if(token) {

        jwt.verify(token, secretCode, (error, decodedToken) => {
            if(error) {
                res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                })
            }
            res.userId = decodedToken.id
            res.userEmail = decodedToken.email
            next()
        })

    } else {
        res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }
}

app.get('/date', verifyToken, async(req, res) => {
    try {
        console.log('userId = ', res.userId)
        console.log('userEmail = ', res.userEmail)
        res.json({
            success: true,
            body: new Date()
        })
    } catch(e) {
        res.status(500).json({
            success: false,
            message: "Something went wrong!"
        })
    }
})

app.listen(3001, () => {
    console.log('Backend-server started...')
})