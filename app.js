const express = require('express')
const app = express()

const routes = require('./routes/index.js')
const session = require('express-session')

const PORT = 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: "rahasia", resave: false, saveUninitialized: true
}))
app.use('/', routes)

app.listen(PORT, () => {
  console.log(`app is running at port ${PORT}`)
})