const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  //get the token from req header
  const token = req.header("x-auth-token");
  //if token doesnt exist
  if (!token) res.status(401).json("no token, authorization failed");
  try {
    //verify token and get the payload
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    //console.log(decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json("token is not valid");
  }
};
