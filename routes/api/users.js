const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");

const User = require("../../models/User"); //UserSchema exported as Users = mongoose.model('user', UserSchema);

router.post(
  "/",
  //server side checkpoint to check user inputs
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Enter valid email address").isEmail(),
    check("password", "Password must be of 6 or more characters").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    //check if req is OK
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //if errors
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      //check if user already exists in database
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "user already exists" }] });
      }
      //set avatar
      const avatar = gravatar.url(email, { s: "200", d: "mm", r: "pg" });
      //create new user using user model
      user = new User({
        name,
        email,
        avatar,
        password
      });
      //encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      //save in database
      await user.save();
      //res.send(user);

      //payload with user id
      const payload = {
        user: {
          id: user.id
        }
      };
      //implement jsonwebtoken
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        (error, token) => {
          if (error) throw error;
          //send back jsonwebtoken
          res.json({ token });
        }
      );
    } catch (error) {
      res.status(500).json("server error");
    }
  }
);

module.exports = router;
