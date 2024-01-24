const router = require("express").Router();
const {googleBook: bookController} = require("../controllers");

router.get("/", bookController.allBooks);
router.get("/:id", bookController.oneBook);

module.exports = router;