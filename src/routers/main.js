const express = require('express')
const jwt = require('jsonwebtoken')

const Resource = require('../models/resources')
const User = require('../models/users')


const router = new express.Router()


router.get('/', async (req, res) => {
    let loggedIn = false
    const token = req.cookies['auth_token']
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
    if (user) {
        loggedIn = true
    }
    const resources = await Resource.find({})
    res.render('index', {
        loggedIn: loggedIn,
        resources: resources
    })
})

router.get('/create-account', (req, res) => {
    res.render('create-account')
})

router.post('/create-account', async (req, res) => {
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
            message: `Oops that didn't work! ${req.body.username} or ${req.body.email} already exist ...`
        })
    }
})




module.exports = router