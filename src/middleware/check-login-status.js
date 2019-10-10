const jwt = require('jsonwebtoken')
const User = require('../models/users')

// BELOW MIDDLEWARE CHECKS USER LOGIN STATUS FOR NON-RESTRICTED PAGES
// FOR PAGES TO WORK AS INTENDED, NON-RESTRICTED PAGES MUST CALL "checkLogInStatus"
// AS SECOND ARGUMENT
const checkLogInStatus = async (req, res, next) => {
    try {
        let isLoggedIn
        // request authorization token from user
        const token = req.cookies['auth_token']
        // if token cannot be found, user is not logged in
        if (!token) {
            res.locals = {
                isLoggedIn: false
            }
        } else {
            // if token is found, verify that it matches a stored user
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
            // if user is found set global variables for user's sessions
            if (user) {
                req.user = user
                res.locals = {
                    username: user.username,
                    isLoggedIn: true
                }
            }  
        }
        next()
    } catch (e) {
        console.log(e)
    }
}

module.exports = checkLogInStatus