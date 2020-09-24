const router = require('express').Router()

const products = require('./product')
const register = require('./register')
const login = require('./login')
const cart = require('./cart')

const Controller = require('../controllers/Controller')

router.get('/', Controller.homepage)
router.get('/logout', Controller.logout)

router.use('/products', products)
router.use('/register', register)
router.use('/login', login)
router.use('/cart', cart)

module.exports = router