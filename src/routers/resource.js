const express = require('express')
const Resource = require('../models/resources')
const User = require('../models/users')
const auth = require('../middleware/auth')


const router = new express.Router()

const resourceOptions = ['c', 'c#', 'c++', 'clojure', 'cobol', 'css & design', 'databases', 'general', 'haskell', 'java', 'javascript', 'kotlin', 'pascal', 'php', 'python']


router.get('/create-resource', auth, (req, res) => {
    res.render('create-resource', {
        resourceOptions: resourceOptions
    })
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

// below route is access via an AJAX post request on the front-end to add resources
// to the user's savedResources (ie a resource created by another user)
// this will return a success or error message depending on whether the requested resource
// is already stored in their savedResources
router.post('/add-to-my-resources', auth, async (req, res) => {
    if (!req.user) {
        return res.send({ 'message': 'You need to login to do that' })
    }
        // first, the ".some" helper iterates over the user's savedResources
        // and ".equals" evaluates whether the current iteration matches resource
        // in the request body. It finishes by returning a boolean
        const storedResource = req.user.savedResources.some(function(resource) {
            return resource.equals(req.body.resourceId)
        })
        // if the above returns true, a message is sent back to the AJAX call, informing
        // user that this resource is already in their list
        if (storedResource) {
            return res.send({ 'message': 'Resource already saved' })
        }
        // if above return false, the requested resource ID is added to the user's
        // savedResources array, and a success message sent back to the AJAX call
        req.user.savedResources.push(req.body.resourceId)
        await req.user.save()
        return res.send({ 'message': 'Resource added to your list' })
})

router.post('/add-vote', auth, async (req, res) => {
    if (!req.user) {
        return res.send({ 'message': 'You need to login to do that' })
    }
    // find the resource for id passed to route
    const resource = await Resource.findById(req.body.resourceId)
    // check if the "voters" stored in the resource document match the user
    // making the request
    const alreadyVoted = resource.voters.some(function(user) {
        return user.equals(req.user.id)
    })
    if (alreadyVoted) {
        // if the user has already voted, reutrn the function
        return res.send({ "message": "You've already voted" })
    } else {
        // if the user has not already voted, increase vote count by 1 and add the user's
        // details to resource "voters" array
        resource.votes += 1
        resource.voters.push(req.user.id)
        await resource.save()
        return res.send({ "message": "Thanks for voting!",
        "resource": resource })
    }
})

router.get('/resource/:id', async (req, res) => {
    const resource = await Resource.findOneAndDelete({ _id: req.params.id })
    await resource.remove()
    return res.redirect('/')
})



module.exports = router