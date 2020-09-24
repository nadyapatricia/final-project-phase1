const router = require('express').Router()

const Controller = require('../controllers/Controller')

const Middleware = require('../middlewares/middleware')

router.get('/', Middleware.auth, Controller.getLogin)
router.post('/', Controller.postLogin)

module.exports = router