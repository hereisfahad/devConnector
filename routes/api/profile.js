const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Profile = require("../../models/Profle");
const User = require("../../models/User");

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(404).json({ msg: "No profile for this user" });
    }
    return res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).json("server error");
  }
  //   res.send("profile route");
});
module.exports = router;
