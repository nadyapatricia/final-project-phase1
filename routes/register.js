const router = require('express').Router()

const Controller = require('../controllers/Controller')

const Middleware = require('../middlewares/middleware')

router.get('/', Middleware.auth, Controller.getRegister)
router.post('/', Controller.postRegister)

module.exports = router