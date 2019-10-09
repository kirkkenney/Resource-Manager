const express = require('express')
const Resource = require('../models/resources')
const User = require('../models/users')
const auth = require('../middleware/auth')


const router = new express.Router()


router.get('/create-resource', (req, res) => {
    res.render('create-resource')
})

router.post('/create-resource', auth, async (req, res) => {
    const resource = new Resource({
        ...req.body,
        owner: req.user._id
    })
    try {
        await resource.save()
        console.log(resource)
        res.render('create-resource', {
            message: `Thank you ${req.user.username}. ${req.body.title} has been added to ${req.body.resourceGroup} resources.`
        })
    } catch (e) {
        console.log(e)
        res.render('create-resource', {
            message: `An error has occurred: ${e}`
        })
    }
})



module.exports = router