// mongoose is a library that simplifies working with MongoDB
const mongoose = require('mongoose')

// use mongoose to establsh connect to MongoDB database
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
})