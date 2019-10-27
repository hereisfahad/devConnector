const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User").default;
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

router.get("/", auth, async (req, res) => {
  try {
    //get the user from database excluded password
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).json("server error");
  }
});

router.post(
  "/",
  //server side checkpoint to check user inputs
  [
    check("email", "Enter valid email address").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    //check if req is OK
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      //check if user already exists in database
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }
      //compare the password with hashed
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }
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
