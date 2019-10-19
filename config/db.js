const mongoose = require("mongoose"); //using mongoose to make life easier
const config = require("config");

const monogURI = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(monogURI, {
      useNewUrlParser: true,
      useCreateIndex: true
    });

    console.log("db connected");
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = connectDB;
