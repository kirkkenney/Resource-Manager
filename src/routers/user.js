const express = require('express')
const User = require('../models/users')
const auth = require('../middleware/auth')
// const cookieParser = require('cookie-parser')


const router = new express.Router()


router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', async (req, res) => {
    try {
        //! "findByCredentials" method is a custom-build method in /models/user
        const user = await User.findByCredentials(req.body.email, req.body.password)
        //! generate auth token for specific user instance (as opposed to User object)
        const token = await user.generateAuthToken()
        // res.setHeader('Authorization', `Bearer ${token}`)
        // console.log(req.header('Authorization'))
        res.cookie('auth_token', token)
        res.render('login', {
            message: `Welcome back ${user.username}`,
        })
    } catch (e) {
        res.render('login', {
            message: `An error occurred: ${e}`
        })
    }
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
        await req.user.save()
        res.redirect('/')
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router