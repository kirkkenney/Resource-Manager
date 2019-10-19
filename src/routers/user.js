const express = require('express')
const nodemailer = require('nodemailer')

const User = require('../models/users')
const Resource = require('../models/resources')
const auth = require('../middleware/auth')
const checkLoginStatus = require('../middleware/check-login-status.js')
const welcomeEmail = require('../emails/welcome-email.js')


const router = new express.Router()


router.get('/login', checkLoginStatus, (req, res) => {
    // if user is already logged in, redirect them to homepage
    if (res.locals.isLoggedIn) {
        return res.redirect('/')
    }
    res.render('login')
})

router.post('/login', checkLoginStatus, async (req, res) => {
    try {
        //! "findByCredentials" method is a custom-build method in /models/user
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if (!user.auth.isVerified) {
            res.render('login', {
                message: 'Unable to login. Please verify your account with the email that was sent to you when you created your account.'
            })
        } else {
            //! generate auth token for specific user instance (as opposed to User object)
            const token = await user.generateAuthToken()
            // generate and set a client-side cookie with the generated token
            res.cookie('auth_token', token)
            return res.redirect('/')            
        }
    } catch (e) {
        res.render('login', {
            message: `Unable to login. Please double-check the details you entered.`,
            isLoggedIn: req.isLoggedIn
        })
    }
})

router.get('/verify/:verificationToken', async (req, res) => {
    // find the user with the verificationToken that is passed into the url query 
    // previously sent to user via email
    const user = await User.findOne({ 'auth.token': req.params.verificationToken })
    let message
    if (!user) {
        // if user cannot be found with the verificationToken
        message = "Unable to verify your credentials. Please check your emails for your verification link."
    // if the time on their verificationToken is less than the current time
    } else if (user.auth.expires < Date.now()) {
        return res.render('expired-token', {
            // inform user that their verificationToken has expired. Link provided in page
            // to resend
            message: `Your verification link expired at ${user.auth.expires.toString()}`,
            id: user._id
        })
    } else {
        // if user record found, and their verificationToken has not expired, set the 
        // auth.token property to an empty string, and verify their account
        user.auth.token = ''
        user.auth.isVerified = true 
        user.save()
        message = "Verification successful. You can now login."
    }
    res.render('login', {
        message: message
    })
})

router.post('/resend-verification/:id', async (req, res) => {
    // find user with their id passed as url query
    const user = await User.findOne({ _id: req.params.id })
    // generate a new verificationToken
    const token = await user.generateVerificationToken()
    // send user a new email with their verificationToken
    welcomeEmail(user.email, token)
    res.render('login', {
        message: `A new verification link has been sent to ${user.email}`
    })
})

router.get('/logout', checkLoginStatus, (req, res) => {
    // if user is not logged in, redirect them to home page
    if (!res.locals.isLoggedIn) {
        return res.redirect('/')
    }
    res.render('logout')
})

router.post('/logout', auth, async (req, res) => {
    try {
        // set the tokens array to a filtered version of itself
        req.user.tokens = req.user.tokens.filter((token) => {
            // return true when the token currently being assessed is NOT the
            // token that was used for authentication. Token used for authentication
            // will therefore be removed from user.tokens array
            return token.token !== req.token
        })
        // save user with modified tokens and redirect to home page
        await req.user.save()
        return res.redirect('/')
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/logout-all', auth, async (req, res) => {
    try {
        // if user wants to logout of ALL devices, then their tokens array stored
        // in db should be emptied
        req.user.tokens = []
        // save modified user and redirect to home page
        await req.user.save()
        return res.redirect('/')    
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/users/:username', checkLoginStatus, async (req, res) => {
    // get the user's details from request parameters
    const user = await User.findOne({ username: req.params.username }).lean()
    // get all resources that have been created by the queried user
    const createdResources = await Resource.find({ owner: user._id })
    // count number of votes given to the queried user's created resources
    // start at 0 by default
    let createdResourceVotes = 0
    createdResources.forEach((resource) => {
        createdResourceVotes += resource.votes
    })
    // created new properties on the user object, and assign values returned from previous
    // calculations: number of resources user has created; how many votes those resources 
    // have received; how mnay resources the user has saved to their own collection
    user.createdResources = createdResources.length
    user.createdResourceVotes = createdResourceVotes
    user.savedResources = user.savedResources.length
    // if the user being queried is the user passing the query, render appropriate page
    if (user.username === req.user.username) {
        res.render('my-profile', {
            user: user
        })
    } else {
        res.render('user-profile', {
            user: user,
            resources: createdResources
        })
    }
})


module.exports = router