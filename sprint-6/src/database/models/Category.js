module.exports = (sequelize, dataTypes) => {
  const alias = 'Category';
  const cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: dataTypes.STRING(100),
      allowNull: false
    }
  };
  const config = {
    tableName: 'categories',
    timestamps: false
  };

  const Category = sequelize.define(alias, cols, config);

  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      as: 'products',
      foreignKey: 'categoryId'
    });
  };

  return Category;
};
