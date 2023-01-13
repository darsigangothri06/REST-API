const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app')

dotenv.config({ path: './config.env' })

// DB Connection
const DB = process.env.MONGO_URL.replace('<PASSWORD>', process.env.MONGO_PASSWORD)

mongoose
    .connect(DB, {
        useNewUrlParser: true,
    })
    .then(() => console.log('DB Connection Successful'))

const port = process.env.PORT

// Start server
const server = app.listen(port, () => {
    console.log('Server is running')
})