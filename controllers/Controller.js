const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(3)
const { Product, User, UserProduct } = require('../models')
const { Op } = require("sequelize")
const { toRupiah } = require('../helpers/toRupiah')

class Controller {
  static homepage(req, res) {
    res.redirect('/login')
  }

  static getLogin(req, res) {
    res.render('loginPage', { errMsg: null })
  }

  static postLogin(req, res) {
    User.findOne({ where: { email_address: req.body.email } })
      .then(data => {
        if (data) {
          req.session.UserId = data.id
          return bcrypt.compare(req.body.password, data.password)
        } else {
          console.error(new Error)
        }
      })
      .then(data => {
        if (data) {
          res.redirect('/products')
        } else {
          req.session.destroy(err => {
            console.log(err)
          })
        }
      })
      .catch(() => {
        res.render('loginPage', { errMsg: "Wrong username or password." })
      })
  }

  static logout(req, res) {
    req.session.destroy(err => {
      res.send(err)
    })
    res.redirect('/login')
  }

  static getRegister(req, res) {
    let errMsg = req.query.err
    if (req.session.isLogged) {
      res.redirect('/products')
    } else {
      res.render('registerPage', { errMsg })
    }
  }

  static postRegister(req, res) {
    let obj = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email_address: req.body.email,
      password: bcrypt.hashSync(req.body.password, salt),
      credit: req.body.credit,
      delivery_address: req.body.delivery
    }
    User.create(obj)
      .then(() => {
        res.redirect('/login')
      })
      .catch(err => {
        let errors = err.errors.map(el => {
          return el.message
        })
        res.redirect(`/register?err=${errors}`)
      })
  }

  static getProducts(req, res) {
    let query = req.query.category
    let fail = req.query.fail
    let stock
    let cart
    if (query) {
      UserProduct.findAll({
        where: { UserId: req.session.UserId },
        order: [['id', 'ASC']]
      })
        .then(data => {
          cart = data
          return Product.findAll({
            where: {
              category: query,
              stock: { [Op.gt]: 0 }
            }
          })
        })
        .then(data => {
          stock = data
          return User.findOne({ where: { id: req.session.UserId } })
        })
        .then(data => {
          res.render('product', { data: stock, user: data, cart, fail })
        })
        .catch(err => {
          res.send(err)
        })
    } else {
      UserProduct.findAll({
        where: { UserId: req.session.UserId },
        order: [['id', 'ASC']]
      })
        .then(data => {
          cart = data
          return Product.findAll({
            where: {
              stock: { [Op.gte]: 1 }
            }
          })
        })
        .then(data => {
          stock = data
          return User.findOne({ where: { id: req.session.UserId } })
        })
        .then(data => {
          res.render('product', { data: stock, user: data, cart, fail })
        })
        .catch(err => {
          res.send(err)
        })
    }
  }

  static postAddProducts(req, res) {
    let status
    let plus
    req.body.qty ? plus = req.body.qty : plus = 1
    UserProduct.findOne({
      where: {
        UserId: req.session.UserId,
        ProductId: +req.params.ProductId
      }
    })
      .then(data => {
        data ? status : !status
        if (status) {
          UserProduct.increment('quantity', {
            by: plus, where: {
              UserId: req.session.UserId,
              ProductId: +req.params.ProductId
            }
          })
            .then(() => {
              return Product.decrement('stock', {
                by: plus, where: {
                  id: +req.params.ProductId
                }
              })
            })
            .catch(err => {
              res.send(err)
            })
        } else {
          let obj = {
            UserId: req.session.UserId,
            ProductId: +req.params.ProductId,
            quantity: plus
          }
          UserProduct.create(obj)
            .then(() => {
              return Product.decrement('stock', {
                by: plus, where: {
                  id: +req.params.ProductId
                }
              })
            })
            .then(() => {
              res.redirect(`/cart/${req.session.UserId}`)
            })
            .catch(err => {
              res.send(err)
            })
        }
      })
  }

  static postReduceProducts(req, res) {
    let minus
    req.body.qty ? minus = req.body.qty : minus = 1
    UserProduct.decrement('quantity', {
      by: minus, where: {
        UserId: req.session.UserId,
        ProductId: +req.params.ProductId
      }
    })
      .then(() => {
        return Product.increment('stock', {
          by: minus, where: {
            id: +req.params.ProductId
          }
        })
      })
      .then(() => {
        return UserProduct.destroy({ where: { quantity: 0 } })
      })
      .then(() => {
        res.redirect(`/cart/${req.session.UserId}`)
      })
      .catch(err => {
        res.send(err)
      })
  }

  static showCart(req, res) {
    UserProduct.findAll({
      where: { UserId: req.session.UserId },
      include: [User, Product],
      order: [['id', 'ASC']]
    })
      .then(data => {
        let count = 0
        data.forEach(el => {
          count += el.quantity * el.Product.price
        })
        res.render('cart', { data, count, toRupiah })
      })
      .catch(err => {
        res.send(err)
      })
  }

  static purchase(req, res) {
    let total = +req.query.total
    User.findOne({ where: { id: req.session.UserId } })
      .then(data => {
        if (data.credit - total < 0) {
          res.redirect(`/products?fail=not enough credit to complete payment!`)
        } else {
          User.decrement('credit', {
            by: total, where: {
              id: req.session.UserId
            }
          })
            .then(() => {
              return UserProduct.destroy({
                where: {
                  UserId: req.session.UserId
                }
              })
            })
            .then(() => {
              res.redirect('/products')
            })
        }
      })
      .catch(err => {
        res.send(err)
      })
  }
}

module.exports = Controller