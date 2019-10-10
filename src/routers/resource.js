const express = require('express')
const Resource = require('../models/resources')
const User = require('../models/users')
const auth = require('../middleware/auth')


const router = new express.Router()


router.get('/create-resource', auth, (req, res) => {
    res.render('create-resource')
})

router.post('/create-resource', auth, async (req, res) => {
    const resource = new Resource({
        // "..." spread operator automatically populated DB fields that match the request body (form fields in this case)
        ...req.body,
        // "owner" field in resource DB is the id of the user that created it
        owner: req.user._id,
    })
    try {
        // save the submitted resource
        await resource.save()
        // render the 'create-resource' page with a thank you message
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

router.get('/my-resources', auth, async (req, res) => {
    // find and return resources where the "owner" field matches the user's id
    const createdResources = await Resource.find({ owner: req.user._id })
    // create empty to array to later populated with resources saved by the user
    let displaySavedResources = []
    // find all stored resources where the resource._id matches the id stored in user 
    // savedResources array
    const foundResources = await Resource.find({ _id: { $in: req.user.savedResources } })
    // iterate over the found resources, and add them to the empty displaySavedResources
    // array
    foundResources.forEach((resource) => {
        displaySavedResources.push(resource)
    })
    res.render('my-resources', {
        savedResources: displaySavedResources,
        createdResources: createdResources
    })
})

router.post('/add-to-my-resources', auth, async (req, res) => {
    try {
        req.user.savedResources.forEach((resource) => {
            if (resource._id == req.body.resourceId) {
                return res.send('Resource already saved')
            }
        })
        req.user.savedResources.push(req.body.resourceId)
        await req.user.save()
        return res.send('Resource added to your list')
    } catch (e) {
        console.log(e)
    }
})



module.exports = router