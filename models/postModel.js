const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter post title']
    },
    body: {
        type: String,
        required: [true, 'Please enter post description']
    },
    image: {
        type: String,
        required: [true, 'Please upload an image']
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post