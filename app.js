const express = require('express')
const app = express()

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/nodeauth', {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.on('open', () => console.log("Connected to the database successfully!"))

app.use(express.json())

app.listen(3001, () => {
    console.log('Backend-server started...')
})