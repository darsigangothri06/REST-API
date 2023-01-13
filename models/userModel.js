const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

// User Schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell your username']
    },
    email: {
        type: String,
        required: [true, 'Please tell your emailid'],
        unique: true,
        lowercase: true,
        validator: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password']
    }
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password'))
        return next()
    
    // using hashing by bcrypt
    this.password = await bcrypt.hash(this.password, 10)
    this.passwordConfirm = undefined

    next()
})

userSchema.methods.correctPassword = function(candidatePassword, userPassword){
    return bcrypt.compare(candidatePassword, userPassword)
}

const User = mongoose.model('User', userSchema)

module.exports = User