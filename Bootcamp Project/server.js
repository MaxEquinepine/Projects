require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./models/user");
const req = require("express/lib/request");
const res = require("express/lib/response");
let refreshTokens = [];
let config = require("./config");
const dbURL = config.DBURL;
const ats = config.ats;
const rts = config.rts;
//
mongoose.connect(dbURL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => logger.info.error(error));
db.once("open", () => logger.info("Connected to database."));

app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

const usersRouter = require("./routes/users");
const logger = require("./logger");
app.use("/users", usersRouter);

app.get("/posts", authenticateToken, async (req, res) => {
  try {
    const users = await User.find();
    users.filter((post) => post.username === req.user.name);
    res.json({ Username: users[0].username, ID: users[0].id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, rts, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, rts);
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {
  return jwt.sign(user, ats, { expiresIn: "15s" });
}

function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, ats, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } catch (error) {}
}

app.listen(3002, () => logger.error("Server started."));
