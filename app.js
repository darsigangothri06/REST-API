const express = require('express')
const postRoutes = require('./routes/postRoutes')
const userRoutes = require('./routes/userRoutes')
const globalErrorHandler = require('./controllers/errorController');

const app = express()

app.use(express.json())

// Routes

app.use('/posts', postRoutes)
app.use('/users', userRoutes)

app.use(globalErrorHandler);

module.exports = app