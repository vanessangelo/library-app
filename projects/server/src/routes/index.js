const user = require("./userRouter");
const book = require("./bookRouter");
const auth = require("./authRouter");

module.exports = {
  auth,
  user,
  book,
};