'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class for_sell extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  for_sell.init({
    repo_id: DataTypes.STRING,
    description: DataTypes.STRING,
    name: DataTypes.STRING,
    openGraphImageUrl: DataTypes.STRING,
    url: DataTypes.STRING,
    isPrivate: DataTypes.BOOLEAN,
    username: DataTypes.STRING,
    sell: DataTypes.STRING,
    amount: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'for_sell',
  });
  return for_sell;
};