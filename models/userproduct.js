'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProduct extends Model {
    multiply(price) {
      return this.quantity * price
    }
    static associate(models) {
      // define association here
      UserProduct.belongsTo(models.User)
      UserProduct.belongsTo(models.Product)
    }
  };
  UserProduct.init({
    UserId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER,
    quantity: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1
      }
    }
  }, {
    sequelize,
    modelName: 'UserProduct',
  });
  return UserProduct;
};