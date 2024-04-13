const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/model");
const router = express.Router();

const secretKey = process.env.JWT_SECRET;

// Create a new user
router.post("/", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    verified: req.body.verified,
    password: hashedPassword,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message, status: res.statusCode });
  }
});

// Get all users
router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message, status: res.statusCode });
  }
});

// Get a single user
router.get("/:id", getUser, verifyToken, async (req, res) => {
  res.json(res.user);
});

// Update a user
router.put("/:id", getUser, verifyToken, async (req, res) => {
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }

  if (req.body.email != null) {
    res.user.email = req.body.email;
  }

  if (req.body.verified != null) {
    res.user.verified = req.body.verified;
  }

  if (req.body.password != null) {
    res.user.password = hashedPassword;
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message, status: res.statusCode });
  }
});

// Delete a user
router.delete("/:id", getUser, verifyToken, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message, status: res.statusCode });
  }
});

// Auth JWT
router.post("/auth", getUserbyEmail, async (req, res) => {
  if (await bcrypt.compare(req.body.password, res.userAuth.password)) {
    const accessToken = jwt.sign({ name: res.userAuth.name }, secretKey, { expiresIn: 120 });
    //60 (numeric value is interpreted as seconds), "2 days", "10h", "7d"
    //const refreshToken = generateRefreshToken({ user: res.userAuth.name });
    res
      .status(200)
      .json({
        accessToken: accessToken,
        //refreshToken: refreshToken,
        status: res.statusCode,
      });
  } else {
    res
      .status(401)
      .json({ message: "Password Incorrect.", status: res.statusCode });
  }
});

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res
        .status(404)
        .json({ message: "Cannot find user.", status: res.statusCode });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message, status: res.statusCode });
  }
  res.user = user;
  next();
}

async function getUserbyEmail(req, res, next) {
  let userAuth;
  try {
    userAuth = await User.findOne({ email: req.body.email });
    if (userAuth == null) {
      return res
        .status(404)
        .json({ message: "Cannot find user.", status: res.statusCode });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message, status: res.statusCode });
  }
  res.userAuth = userAuth;
  next();
}

function verifyToken(req, res, next) {
  let token;
  try {
    token = req.headers['authorization'];
    jwt.verify(token, secretKey, function (err, decoded) {
      if(err) {
        res
        .status(403)
        .json({ message: err.message, status: res.statusCode });
        return;
      }
      console.log(decoded); // bar
      next();
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message, status: res.statusCode });
  }
}

module.exports = router;