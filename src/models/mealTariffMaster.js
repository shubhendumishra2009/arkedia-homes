const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class MealTariffMaster extends Model {}
  MealTariffMaster.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    breakfast_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    lunch_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    dinner_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
    },
  }, {
    sequelize,
    modelName: 'MealTariffMaster',
    tableName: 'meal_tariff_master',
    timestamps: true,
    underscored: true,
  });
  return MealTariffMaster;
};
