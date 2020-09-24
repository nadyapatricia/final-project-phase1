const router = require('express').Router()

const Controller = require('../controllers/Controller')

const Middleware = require('../middlewares/middleware')

router.get('/', Middleware.register, Controller.getProducts)
router.post('/add/:ProductId', Middleware.register, Controller.postAddProducts)
router.post('/reduce/:ProductId', Middleware.register, Controller.postReduceProducts)

module.exports = router