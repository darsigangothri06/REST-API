const catchAsync = require('../utils/catchAsync')
const Post = require('../models/postModel')
const AppError = require('../utils/appError')

exports.getAllPosts = catchAsync(async (req, res, next) => {
    const posts = await Post.find()

    res.status(200).json({
        status: 'success',
        results: posts.length,
        data: {
            posts
        }
    });
})

exports.createPost = catchAsync(async (req, res, next) => {
    const createPostArr = {...req.body}
    createPostArr.user = req.user._id
    const newPost = await Post.create(createPostArr)

    res.status(201).json({
        status: 'success',
        data: {
            newPost
        }
    });
})

exports.updatePost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id, req.body, {
        new: true
    })

    if(!post){
        return next(new AppError('No Post found with that id', 400))
    }

    res.status(200).json({
        status: 'success',
        data: post
    })
})

exports.deletePost = catchAsync(async (req, res, next) => {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return next(new AppError('No post found with that ID', 404));
    }
  
    res.status(204).json({
      status: 'success',
      data: null
    });
})