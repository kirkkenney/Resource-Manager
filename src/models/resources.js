//! mongoose is a library that simplifies working with MongoDB
const mongoose = require('mongoose')
//! validator package makes data validation easy: npm i validator@10.9.0
const validator = require('validator')
const User = require('./users')


const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 60
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 250
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

// middleware function: get the resourceType property of the resource being added and
// and assign Font Awesome icon values - these are later passed to the HTML tempates for
// styling purposes
resourceSchema.pre('save', async function (next) {
    const resource = this
    const icons = {
        "article&blog": "fas fa-newspaper",
        "audio&podcast": "fas fa-volume-up",
        "book": "fas fa-book-open",
        "video": "fas fa-video",
        "website": "fas fa-globe"
    }
    // if the resourceType value matches an icon property name, add the icon
    // value to the resource's "resourceTypeIcon" property
    if (icons.hasOwnProperty(resource.resourceType)) {
        resource.resourceTypeIcon = icons[resource.resourceType]
    } else {
        console.log(`${resource.resourceType} not found in icons object`, icons)
    }
})

// middleware fnction: when a resource is deleted, ensure that the resource is also
// removed from users' "savedResources" arrays
resourceSchema.pre('remove', async function (next) {
    const resource = this
    // find users that have queried resources stored in their savedResources array
    const users = await User.find({ savedResources: { $in: [this._id] } })
    users.forEach((user) => {
        // loop user the users returned by previous query modify their savedResources
        // array by filtering it and returning it in place
        user.savedResources = user.savedResources.filter((resourceItem) => {
            // return the resource back to the array if it does NOT match the resource
            // being deleted
            return resourceItem._id.toString() !== resource._id.toString()
        })
        // save the changes to the user
        user.save()
    })
    next()
})


const Resources = mongoose.model('Resources', resourceSchema)


module.exports = Resources