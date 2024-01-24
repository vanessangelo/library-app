const axios = require("axios");

module.exports = {
  async allBooks(req, res) {
    try {
      // const page = req.query.page || 1;
      // const perPage = 12;
      const q = req.query.q;

      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?langRestrict=en&q=${q}&maxResults=40&key=${process.env.GOOGLEBOOK_API_KEY}`
      );

      // const totalItems = response.data.totalItems || 0;
      // const totalPages = Math.ceil(totalItems / perPage);

      return res.status(200).send({
        message: "Books retrieved successfully.",
        // pagination: {
        //   page: Number(page),
        //   perPage: perPage,
        //   totalItems: totalItems,
        //   totalPages: totalPages,
        // },
        data: response.data,
      });
    } catch (error) {
      return res.status(500).send({
        message: "fatal error on server",
        error: error,
      });
    }
  },

  async oneBook(req, res) {
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${req.params.id}?key=${process.env.GOOGLEBOOK_API_KEY}`)

      if (!response.data) {
        return res.status(404).send({
          message: "Book not found",
        });
      }

      res.status(200).send({
        message: "Successfully retrieved book",
        data: response.data,
      });
    } catch (error) {
      return res.status(500).send({
        message: "fatal error on server",
        error: error,
      });
    }
  },
};
