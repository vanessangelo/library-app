const { body, validationResult } = require("express-validator");
const db = require("../../models");

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res
      .status(400)
      .send({ message: "An error occurs", errors: errors.array() });
  };
};

const checkEmailUnique = async (value, { req }) => {
  try {
    const user = await db.User.findOne({ where: { email: value } });
    if (user) {
      throw new Error("Email already taken");
    }
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  validateLogin: validate([
    body("email").trim().notEmpty().withMessage("Email is required"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Minimum password length is 8 characters"),
  ]),

  validateRegister: validate([
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email format is required")
      .custom(checkEmailUnique),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)
      .withMessage(
        "Password must be at least 8 char, 1 uppercase, 1 number and no symbols"
      )
      .custom((value, { req }) => {
        if (value !== req.body.confirm_password) {
          throw new Error("Confirm password does not match with password");
        }
        return true;
      }),
    body("confirm_password")
      .notEmpty()
      .withMessage("Confirm password is required")
      .isLength({ min: 8 })
      .withMessage("Minimum confirm password length is 8 characters"),
  ]),
};
