const express = require('express')
require('./db/mongoose')
const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const userRouter = require('./routers/user')
const resourceRouter = require('./routers/resource')
const mainRouter = require('./routers/main')


const app = express()
const port = process.env.PORT

// DEFINE PATHS FOR EXPRESS CONFIG
// assign 'public' directory as a value to variable
const publicDirectoryPath = path.join(__dirname, '../public')
// express looks for page templates in a 'views' directory by default
// to change this, express needs to be told where to look instead
// assign page templates directory to a variable
const viewsPath = path.join(__dirname, '../templates/views')
// assign partials files/pages directory to a variable
const partialsPath = path.join(__dirname, '../templates/partials')

// SET UP HANDLEBARS ENGINE AND VIEWS LOCATION
// tell express which templating engine is installed
// app.set allows to give a value for a given express setting
app.set('view engine', 'hbs')
// tell express where to look for page templates
app.set('views', viewsPath)
// tell hbs where to find partials directory
hbs.registerPartials(partialsPath)

// SET UP STATIC DIRECTORY TO SERVE
// app.use() allows for application to be further customised
// used here in conjunction with express.static() method to reference
// location of static files
app.use(express.static(publicDirectoryPath))


//! incoming requests will automatically be parsed as json data
app.use(express.json())
// bodyParser to parse POST form requests
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(userRouter)
app.use(resourceRouter)
app.use(mainRouter)


app.listen(port, () => {
    console.log(`Server is up on ${port} \n`)
})