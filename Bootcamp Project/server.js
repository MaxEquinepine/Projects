require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./models/user");

const posts = [
  {
    username: "Wouter",
    title: "Post 1",
  },
  {
    username: "Kyle",
    title: "Post 2",
  },
];

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database."));

app.use(express.json());

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

app.get("/posts", authenticateToken, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users.filter((post) => post.username === req.user.name));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  //res.json(posts.filter((post) => post.username === req.user.name));
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(3000, () => console.log("Server started."));
