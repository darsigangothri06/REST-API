const express = require('express')
const postController = require('../controllers/postController')
const authController = require('../controllers/authController')

const router = express.Router()

router
    .route('/')
    .get(authController.protect, postController.getAllPosts)
    .post(authController.protect, postController.createPost)

router
    .route('/:id')
    .put(authController.protect, authController.postProtect, postController.updatePost)
    .delete(authController.protect, authController.postProtect, postController.deletePost)

module.exports = router