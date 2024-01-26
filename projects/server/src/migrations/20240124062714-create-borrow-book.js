'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Borrow_Books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      book_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      book_title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      book_main_author: {
        type: Sequelize.STRING,
        allowNull: false
      },
      book_ISBN: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isBorrow: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      borrow_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      return_date: {
        type: Sequelize.DATE,
        defaultValue: null
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Borrow_Books');
  }
};