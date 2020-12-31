'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class paypal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  paypal.init({
    github_username: DataTypes.STRING,
    email: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    disconnect: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'paypal',
  });
  return paypal;
};