'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class owned_repo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  owned_repo.init({
    repo_id: DataTypes.STRING,
    description: DataTypes.STRING,
    name: DataTypes.STRING,
    openGraphImageUrl: DataTypes.STRING,
    url: DataTypes.STRING,
    sell: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    isPrivate: DataTypes.BOOLEAN,
    owner_username: DataTypes.STRING,
    username: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'owned_repo',
  });
  return owned_repo;
};