const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/Authmiddlewares");
const { sign } = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { name,username, password } = req.body;

  // Check if the user already exists
  const existingUser = await Users.findOne({ where: { username: username } });
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists." });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Create a new user
    const newUser = await Users.create({
      name: name,
      username: username,
      password: hashedPassword,
    });

    // Create an access token for the newly created user
    const accessToken = sign(
      { name: newUser.name, username: newUser.username, id: newUser.id },
      "importantsecret"
    );

    // Respond with the token and user info
    res.json({
      token: accessToken,
      username: newUser.username,
      id: newUser.id,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user." });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) res.json({ error: "User Doesn't Exist" });

  bcrypt.compare(password, user.password).then(async (match) => {
    if (!match) res.json({ error: "Wrong Username And Password Combination" });

    const accessToken = sign(
      { username: user.username, id: user.id },
      "importantsecret"
    );
    res.json({ token: accessToken, username: username, id: user.id });
  });
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;

  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  res.json(basicInfo);
});

module.exports = router;
