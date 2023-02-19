const express = require('express')
const app = express()

const User =  require('./models/User')

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

app.post('/signin', async(req, res) => {

})

app.get('/date', async(req, res) => {
    try {
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