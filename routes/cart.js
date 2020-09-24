const router = require('express').Router()

const Controller = require('../controllers/Controller')

const Middleware = require('../middlewares/middleware')

router.get('/:UserId', Middleware.register, Controller.showCart)

router.get('/purchase/:UserId', Middleware.register, Controller.purchase)

module.exports = router