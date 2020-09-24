class Middleware {
  static register(req, res, next) {
    if (!req.session.UserId) {
      res.render('loginPage', { errMsg: "You need to log in first." })
    } else {
      next()
    }
  }

  static auth(req, res, next) {
    if (req.session.UserId) {
      res.redirect('/products')
    } else {
      next()
    }
  }
}

module.exports = Middleware
