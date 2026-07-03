module.exports = (sequelize, dataTypes) => {
  const alias = "OrderItem";
  const cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    productId: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: dataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    quantity: {
      type: dataTypes.INTEGER,
      allowNull: false
    }
  };
  const config = {
    tableName: "order_items",
    timestamps: true
  };
  
  const OrderItem = sequelize.define(alias, cols, config);
  
  OrderItem.associate = function(models) {
    OrderItem.belongsTo(models.Order, {
      as: "order",
      foreignKey: "orderId"
    });
    OrderItem.belongsTo(models.Product, {
      as: "product",
      foreignKey: "productId"
    });
  };
  
  return OrderItem;
};
