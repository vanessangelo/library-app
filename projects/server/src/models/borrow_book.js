'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Borrow_Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Borrow_Book.belongsTo(models.User, {foreignKey: "user_id"});
    }
  }
  Borrow_Book.init({
    user_id: DataTypes.INTEGER,
    book_id: DataTypes.STRING,
    isBorrow: DataTypes.BOOLEAN,
    borrow_date: DataTypes.DATE,
    return_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Borrow_Book',
  });
  return Borrow_Book;
};