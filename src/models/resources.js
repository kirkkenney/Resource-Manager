//! mongoose is a library that simplifies working with MongoDB
const mongoose = require('mongoose')
//! validator package makes data validation easy: npm i validator@10.9.0
const validator = require('validator')


const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    link: {
        type: String,
        required: true,
        trim: true
    },
    votes: {
        type: Number
    },
    resourceType: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    resourceGroup: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    // mongoose schema automatically inserts "created" and "updated" timestamps into model
    timestamps: true
})

const Resources = mongoose.model('Resources', resourceSchema)


module.exports = Resources