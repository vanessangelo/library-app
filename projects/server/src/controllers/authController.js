const bcrypt = require("bcryptjs");
const db = require("../models");
const jwt = require("jsonwebtoken");

module.exports = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await db.User.findOne({
        where: {
           email,
        },
      });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const isPassMatch = await bcrypt.compare(password, user.password);

      if (isPassMatch) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "10d",
        });
        return res
          .status(200)
          .send({
            message: "Successful login",
            user: { name: user.name, email: user.email },
            accessToken: token,
          });
      } else {
        return res.status(400).send({ message: "Invalid credential" });
      }
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .send({ message: "Fatal error on server.", error: error.message });
    }
  },

  async register(req, res) {
    const { name, email, password } = req.body;

    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newUser = await db.User.create({
        name,
        email,
        password: hashPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return res.status(201).send({
        message: "Registration success!",
        data: {
          name: newUser.name,
          email: newUser.email,
        },
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "Fatal error on server.", error: error.message });
    }
  },
};
