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
        type: Number,
        default: 0
    },
    voters: [{
        vote: {
            type: String
        }
    }],
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
    },
    resourceTypeIcon: {
        type: String
    },
}, {
    // mongoose schema automatically inserts "created" and "updated" timestamps into model
    timestamps: true
})

resourceSchema.pre('save', async function (next) {
    const resource = this
    const icons = {
        "article&blog": "fas fa-newspaper",
        "audio&podcast": "fas fa-volume-up",
        "book": "fas fa-book-open",
        "video": "fas fa-video",
        "website": "fas fa-globe"
    }
    if (icons.hasOwnProperty(resource.resourceType)) {
        resource.resourceTypeIcon = icons[resource.resourceType]
        console.log(resource)
    } else {
        console.log(`${resource.resourceType} not found in icons object`, icons)
    }
})


const Resources = mongoose.model('Resources', resourceSchema)


module.exports = Resources