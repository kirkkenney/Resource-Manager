const jwt = require('jsonwebtoken')
const User = require('../models/users')

// BELOW MIDDLEWARE CHECKS IF USER IS AUTHORIZED TO VIEW RESTRICTED PAGES
// FOR PAGES THAT REQUIRE RESTRICTION "auth" MUST BE CALLED AS 2nd ARGUMENT
// TO THE ROUTE FUNCTION
const auth = async (req, res, next) => {
    try {
        // get the token from user's cookies
        const token = req.cookies['auth_token']
        // verify that token is valid
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // user id is embedded in token, so "decoded" has id property
        // we can therefore find user by this id, and then search that users stored tokens
        // for the token passed in the query
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        // if all goes well, execute below code
        // add "token" property to req so that it can be used in route handlers
        req.token = token
        // add "user" property onto req, so that user does not have to be queried
        // a second time in the route handlers. This ensures that "user" property
        // can simply be accessed from req, inside of the route handlers instead
        req.user = user
        // "res.locals" object sets global variable for use during the user's session
        res.locals = {
            username: user.username,
            isLoggedIn: true
        }
        next()
    } catch (e) {
        res.status(401)
        res.render('401')
    }
}


module.exports = auth