'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn('transactions', 'id')
   await queryInterface.addColumn({
    tableName: 'transactions',
    schema: 'public'
  },
  'id',
  {allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER}
)
  await queryInterface.addColumn({
    tableName: 'transactions',
    schema: 'public'
  },
  'for_sell_id',
  Sequelize.STRING
)
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  
    await queryInterface.removeColumn('transactions', 'for_sell_id')
    await queryInterface.removeColumn('transactions', 'id')
    await queryInterface.addColumn({
      tableName: 'transactions',
      schema: 'public'
    },
    'id',
    {allowNull: false,
       primaryKey: true,
      type: Sequelize.STRING}
  )
  }
};
