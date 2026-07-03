module.exports = (sequelize, dataTypes) => {
  const alias = "Order";
  const cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    total: {
      type: dataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: dataTypes.STRING(50),
      defaultValue: 'pending'
    },
    shippingAddress: {
      type: dataTypes.STRING(255),
      allowNull: false
    },
    paymentMethod: {
      type: dataTypes.STRING(50),
      allowNull: false
    }
  };
  const config = {
    tableName: "orders",
    timestamps: true
  };
  
  const Order = sequelize.define(alias, cols, config);
  
  Order.associate = function(models) {
    Order.belongsTo(models.User, {
      as: "user",
      foreignKey: "userId"
    });
    Order.hasMany(models.OrderItem, {
      as: "items",
      foreignKey: "orderId"
    });
  };
  
  return Order;
};
