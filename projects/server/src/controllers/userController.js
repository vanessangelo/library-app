const axios = require("axios");
const db = require("../models");

module.exports = {
  async getProfile(req, res) {
    try {
      const myProfile = await db.User.findOne({
        where: {
          id: req.user.id,
        },
        attributes: {
          exclude: ["password"],
        },
      });

      if (!myProfile) {
        return res.status(404).send({
          message: "Profile not found",
        });
      }

      res
        .status(200)
        .send({ message: "Profile retrieved successfully", data: myProfile });
    } catch (error) {
      return res.status(500).send({
        message: "Internal Server Error",
      });
    }
  },

  async borrowBook(req, res) {
    const transaction = await db.sequelize.transaction();
    try {
      const book_id = req.params.id;
      const book_title = req.params.title;
      const book_main_author = req.params.author || "No Author";
      const book_ISBN = req.params.isbn || "-";
      const user_id = req.user.id;

      const isUserBorrowing = await db.Borrow_Book.findOne({
        where: {
          user_id,
          isBorrow: true,
        },
      });

      if (isUserBorrowing) {
        await transaction.rollback();
        return res.status(404).send({
          message: "Please first return current borrowed book.",
        });
      }

      const isBorrowed = await db.Borrow_Book.findOne({
        where: {
          book_id,
          isBorrow: true,
        },
      });

      if (isBorrowed) {
        await transaction.rollback();
        return res.status(404).send({
          message: "Book unavailable for borrowing.",
        });
      }

      const borrowData = await db.Borrow_Book.create({
        user_id,
        book_id,
        book_title,
        book_main_author,
        book_ISBN,
        isBorrowed: true,
        borrow_date: new Date(),
      });

      await transaction.commit();

      return res.status(201).send({
        message: "Successfully borrow",
        data: borrowData,
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).send({
        message: "fatal error on server",
        error: error.message,
      });
    }
  },

  async returnBook(req, res) {
    const transaction = await db.sequelize.transaction();
    try {
      const book_id = req.params.id;
      const getBorrowHistory = await db.Borrow_Book.findOne({
        where: {
          book_id,
          isBorrow: true,
        },
      });

      if (!getBorrowHistory) {
        await transaction.rollback();
        return res.status(404).send({
          message: "Borrowed book history not found.",
        });
      }

      getBorrowHistory.isBorrow = false;
      getBorrowHistory.return_date = new Date();

      await getBorrowHistory.save({ transaction });

      await transaction.commit();

      return res.status(200).send({
        message: "Successfully returned",
        data: getBorrowHistory,
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).send({
        message: "fatal error on server",
        error: error.message,
      });
    }
  },

  async getBorrowBooks(req, res) {
    const pagination = {
      page: Number(req.query.page) || 1,
      perPage: 8,
    };
    try {
      const results = await db.Borrow_Book.findAndCountAll({
        where: {
          user_id: req.user.id,
        },
        order: [["createdAt", "DESC"]],
        limit: pagination.perPage,
        offset: (pagination.page - 1) * pagination.perPage,
      });

      const totalCount = results.count;
      pagination.totalData = totalCount;

      if (results.rows.length === 0) {
        return res.status(200).send({
          message: "No borrow book(s) found",
        });
      }

      res.status(200).send({
        message: "Successfully retrieved borrowed books",
        pagination,
        data: results,
      });
    } catch (error) {
      return res.status(500).send({
        message: "fatal error on server",
        error: error.message,
      });
    }
  },

  async getOngoingBook(req, res) {
    try {
      const results = await db.Borrow_Book.findOne({
        where: {
          user_id: req.user.id,
          isBorrow: true,
        },
      });

      if (!results) {
        return res.status(200).send({
          message: "No borrow book(s) found",
        });
      }
      res.status(200).send({
        message: "Successfully retrieved borrowed books",
        data: results,
      });
    } catch (error) {
      return res.status(500).send({
        message: "fatal error on server",
        error: error,
      });
    }
  },

  async deleteAccount(req, res) {
    const transaction = await db.sequelize.transaction();
    try {
      const { id } = req.user;

      const user = await db.User.findOne({
        where: {
          id
        }
      }, transaction)

      if(!user) {
        await transaction.rollback()
        return res.status(404).send({
          message: "User not found."
        })
      }

      const isOngoing = await db.Borrow_Book.findOne({
        where: {
          user_id: id,
          isBorrow: true,
        },
      }, transaction);

      if(isOngoing) {
        isOngoing.isBorrow = false
        isOngoing.return_date = new Date()
        await isOngoing.save({ transaction });
      }

      await user.destroy({ transaction });

      await transaction.commit();

      res.status(200).send({
        message: "Successfully delete user",
      });
    } catch (error) {
      return res.status(500).send({
        message: "fatal error on server",
        error: error,
      });
    }
  },
};
