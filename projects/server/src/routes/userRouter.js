const router = require("express").Router();
const {user: userController} = require("../controllers");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware.verifyToken)

router.get("/profile", userController.getProfile);
router.post("/books/:id", userController.borrowBook);
router.patch("/borrow-books/:id", userController.returnBook);
router.get("/borrow-books", userController.getBorrowBooks);
router.get("/ongoing-books", userController.getOngoingBook);

module.exports = router;