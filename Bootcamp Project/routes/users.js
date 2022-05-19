const express = require("express");
const user = require("../models/user");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const hash = require("bcrypt");
const db = require("../models/user");
const users = [];

//Retrieving all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Retrieving a specific user
router.get("/:id", getUser, (req, res) => {
  res.json(res.user);
});

//Creating a user
router.post("/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    const newUser = await user.save();
    users.push(user);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Updating a user
router.patch("/:id", getUser, async (req, res) => {
  if (req.body.username != null) {
    res.user.username = req.body.username;
  }
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Deleting a user
router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "Deleted User" });
    res.user;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Checks if user is in the database
router.post("/login", async (req, res) => {
  try {
    const users = await User.find();
  } catch (err) {
    res.status(500).send();
  }
  const user = users.find((user) => (user.username = req.body.username));
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Success");
    } else {
      res.send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});

//middleware to retrieve a user from the database
async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

module.exports = router;
