const express = require('express')
const jwt = require('jsonwebtoken')

const checkLoginStatus = require('../middleware/check-login-status.js')
const Resource = require('../models/resources')
const User = require('../models/users')


const router = new express.Router()


// checkLoginStatus is a middleware fnction that checks whether user is currently logged
// in by checking their cookies against stored tokens. The page they are accessing will
// render dynamically according to their login status
router.get('/', checkLoginStatus, async (req, res) => {
    // get all resources - .lean() method converts the returned query from mongoose
    // data object to raw object data
    let resources = await Resource.find({}).populate('owner').lean()
    if (res.locals.isLoggedIn) {
        // iterate over each resource object in the array
        resources.forEach((resource) => {
            // foundResource returns a boolean evaluation of whether the resource._id is 
            // found in user savedResources._id keys. "toString()" method must be used
            // because of the way that MongoDB handles the data
            const savedResource = req.user.savedResources.some(e => e._id.toString() === resource._id.toString())
            // users that have upvoted a resource have their id stored in the resource's
            // "voters" db field. Below function checks whether current user's id is 
            //stored in that field
            const alreadyVoted = resource.voters.some(e => e._id.toString() === req.user._id.toString())
            // assign the booleans evaluation to a new "savedResourceCheck" key
            // in resources objects array
            resource.savedResourceCheck = savedResource
            // if the user has saved this resource, add below key/value pair, which
            // is used in HTML/CSS to dynamically alter the content accordingly
            if (savedResource) {
                resource.savedClass = "saved-resource"
            }
            // if the user has upvoted this resource, add below key/value pair, which
            // is used in HTML/CSS to dynamically alter the content accordingly
            if (alreadyVoted) {
                resource.votedClass = "voted-resource"
            }
        })
    }
    // create a copy of resources 
    const mostRecentResources = resources.slice(0)
    // sort the copy by "createdAt" so that newest appear first
    mostRecentResources.sort(function(a, b) {
        return b.createdAt - a.createdAt
    }).forEach((resource) => {
        // loop over each resource reformate the date to be more human readable
        resource.createdAt = resource.createdAt.toDateString()
    })
    const mostPopularResources = resources.slice(0)
    mostPopularResources.sort(function(a, b) {
        return b.votes - a.votes
    })
    // render HTML page, passing the resources for display
    res.render('index', {
        mostRecent: mostRecentResources,
        mostPopular: mostPopularResources
    })
})

router.get('/create-account', checkLoginStatus, (req, res) => {
    // if user is logged in, redirect them to the home page
    if (res.locals.isLoggedIn) {
        return res.redirect('/')
    }
    res.render('create-account')
})

router.post('/create-account', checkLoginStatus, async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.render('create-account', {
            message: `Thanks for signing up ${req.body.username}! An email has been sent to ${req.body.email} ...`
        })
    } catch (e) {
        console.log(e)
        res.render('create-account', {
            message: `Oops that didn't work! Username or Email Address already exist ...`
        })
    }
})


router.get('/resources/:resourceGroup', checkLoginStatus, async (req, res) => {
    const resourceGroup = req.params.resourceGroup
    console.log(resourceGroup)
    const resources = await Resource.find({ resourceGroup: resourceGroup })
    console.log(resources)
    res.render('main-resources', {
        resources: resources
    })
})




module.exports = router