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
    // get all resources
    const resources = await Resource.find({})
    // render HTML page, passing the resources for display
    res.render('index', {
        resources: resources
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

router.post('/resources/:resourceGroup', checkLoginStatus, async (req, res) => {
    const resourceGroup = req.body.resourceGroup
    console.log(req.body.resourceGroup)
    const resources = await Resource.find({ resourceGroup: resourceGroup })
    console.log(resources)
    res.render('main-resources', {
        resources: resources
    })
})

router.get('/resources/:resourceGroup', checkLoginStatus, async (req, res) => {
    const resourceGroup = req.params.resourceGroup
    console.log(req.params.resourceGroup)
    const resources = await Resource.find({ resourceGroup: req.params.resourceGroup })
    console.log(resources)
    res.render('main-resources', {
        resources: resources
    })
})




module.exports = router