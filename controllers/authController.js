const User = require('../models/userModel')
const Post = require('../models/postModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const jwt = require('jsonwebtoken')
const {promisify} = require('util')

const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const sendToken = (user, statusCode, res) => {
    const token = signToken(user._id)

    res.status(statusCode).json({
        status: 'success',
        token,
        data: user
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    sendToken(newUser, 201, res)
})

exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body
    if(!email || !password){
        return next(new AppError('Please provide emailid and password', 400))
    }

    const user = await User.findOne({email})

    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect email or password', 400))
    }

    sendToken(user, 200, res)
})

exports.protect = catchAsync(async (req, res, next) => {
    
    // Get token
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
        );
    }

    // Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401
            )
        );
    }

    // Send user into request
    req.user = currentUser;

    // Grant access
    next()
})

exports.postProtect = catchAsync(async (req, res, next) => {
    // Get user id and post id and find the user
    const newUser = await Post.findOne({$and: [{user: req.user._id}, {_id: req.params.id}]})
    
    // Check if user exist
    if(!newUser){
        return next(new AppError('You have no access to modify this post'))
    }
    
    // Grant Access
    next()
})