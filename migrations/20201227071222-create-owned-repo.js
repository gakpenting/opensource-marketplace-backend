'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('owned_repos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      repo_id: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      openGraphImageUrl: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      sell: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.INTEGER
      },
      owner_username: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('owned_repos');
  }
};