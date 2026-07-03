module.exports = (sequelize, dataTypes) => {
  const alias = 'User';
  const cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: dataTypes.STRING(100),
      allowNull: false
    },
    lastName: {
      type: dataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: dataTypes.STRING(150),
      allowNull: false,
      unique: true
    },
    password: {
      type: dataTypes.STRING(255),
      allowNull: false
    },
    category: {
      type: dataTypes.STRING(100),
      allowNull: false
    },
    image: {
      type: dataTypes.STRING(255)
    }
  };
  const config = {
    tableName: 'users',
    timestamps: true
  };

  const User = sequelize.define(alias, cols, config);

  return User;
};
