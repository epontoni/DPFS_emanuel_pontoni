module.exports = (sequelize, dataTypes) => {
  const alias = 'Product';
  const cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: dataTypes.STRING(255),
      allowNull: false
    },
    price: {
      type: dataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    description: {
      type: dataTypes.TEXT
    },
    image: {
      type: dataTypes.STRING(255)
    },
    categoryId: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    colors: {
      type: dataTypes.STRING(255)
    }
  };
  const config = {
    tableName: 'products',
    timestamps: true
  };

  const Product = sequelize.define(alias, cols, config);

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      as: 'category',
      foreignKey: 'categoryId'
    });
  };

  return Product;
};
