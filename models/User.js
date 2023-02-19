const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const {isEmail} = require('validator')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: isEmail
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.statics.loginCheck = async function(email, password) {
    const user = await this.findOne({ email })
    if(user) {
        const match = await bcrypt.compare(password, user.password)
        if(match) {
            return user
        } else {
            throw Error('Incorrect password')
        }
    } else {
        throw Error("User not found")
    }
}

const User = mongoose.model('user', userSchema)
module.exports = User