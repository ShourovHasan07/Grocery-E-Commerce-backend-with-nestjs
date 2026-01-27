import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn('products', 'soldCount', {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  });

  await queryInterface.addColumn('products', 'views', {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.removeColumn('products', 'soldCount');
  await queryInterface.removeColumn('products', 'views');
}
