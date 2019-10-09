const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        //! use mongoose built-in 'validate()' function property to set customer validation
        validate(value) {
            //! use validator library to check that value is valid email address
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.includes('password')) {
                throw new Error('Password cannot contain word: password')
            }
        }
    },
    //! store auth tokens against user db record. Allows user to logout, login on other
    //! devices, stay logged in etc
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        // store avatar image as binary data
        type: Buffer
    }
}, {
    // mongoose schema automatically inserts "created" and "updated" timestamps into model
    timestamps: true
})

// "virtual" property on schema is a relationship between two entities (not stored in db)
// is a  way for mongoose to figure out how the two things are related
userSchema.virtual('resources', {
    ref: 'Resources',
    // localField is the name on THIS thing that is going to create the relationship ie on User model
    localField: '_id',
    // foreignField is the name on the OTHER thing that is going to create this relationship ie on Task model
    foreignField: 'owner'
    // the relationship therefore is the _id field on the User, and the owner field on Task
    // both of these should be equal, and mongoose will evaluate this for the purposes of 
    // determining the relationship
})

//! "this" binding cannot be used with arrow functions, so below must be set up as regular function
//! "methods" methods are accessible on INSTANCES (vs "statics" methods on MODELS)
userSchema.methods.generateAuthToken = async function () {
    const user = this
    //! user.id is an object id, so needs to be converted to string
    const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET) 
    //! add generated token to the user's stored tokens
    user.tokens = user.tokens.concat({ token: token })
    await user.save()
    // res.setHeader('Authorization', 'Bearer '+ token)
    return token
}

userSchema.methods.toJSON = function () {
    const user = this
    // get user data as an object
    const userObject = user.toObject()
    // use delete operator to remove password and tokens array
    delete userObject.password
    delete userObject.tokens
    // return modified userObject
    return userObject
}

//! "findByCredentials" is a custom-built method. To do this, define the method
//! logic inside of schema.statics method - "statics" methods are accessible on MODELS
//! (vs "methods methods on INSTANCES")
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email })
    if (!user) {
        throw new Error('Unable to login ...')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login ...')
    }
    return user
}

//! to take advantage of middleware with mongoose, model Object needs to be set up as a Schema (see above)
//! userSchema has two methods to enable middleware as a (non-arrow) function:
//! pre checks before the event, post checks after the event
//! post take event name as 1st argument, 2nd argument is the function to run
userSchema.pre('save', async function (next) {
    const user = this
    //! mongoose has "isModified" method to check if a property value has changed
    //! taking the object property name as the argument. if it has, hash the password
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    //! next is always called at the end of the function
    next()
})

// Delete tasks associated with user when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User