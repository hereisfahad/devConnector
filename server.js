const express = require("express");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;
const app = express();

//connecting to mongodb atlas
connectDB();
//middleware for parsing body request
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API is running"));

//defining routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

//handle 404 req
// app.use(function(req, res, next) {
//   res.status(404).send("Sorry can't find that!");
// });
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
