const router = require("express").Router();
const { auth: authController } = require("../controllers");
const validator = require("../middleware/validationMiddleware")

router.post("/login", validator.validateLogin, authController.login);
router.post("/register", validator.validateRegister, authController.register);

module.exports = router;