const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/Authmiddlewares");
const { sign } = require("jsonwebtoken");

// Define the POST route for user registration
router.post("/register", validateToken,async(req, res) => {
  const { name, username, password, avatar } = req.body;

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
      avatar: avatar,
    });

    // Create an access token for the newly created user
    const accessToken = sign(
      { name: newUser.name, username: newUser.username, id: newUser.id, avatar: newUser.avatar },
      "importantsecret"
    );

    // Respond with the token and user info
    res.json({
      token: accessToken,
      username: newUser.username,
      id: newUser.id,
      avatar: newUser.avatar,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user." });
  }
});

 
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) res.json({ error: "User Doesn't Exist" });router.post("/", async (req, res) => {
    const { name, username, password, avatar, avatarPath } = req.body;

    try {
      // Check if required fields are provided
      if (!name || !username || !password || !avatar) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Ensure the user creation logic matches your database schema
      const newUser = await User.create({
        name,
        username,
        password,
        avatar,
        avatarPath,
      });

      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error); // Log the actual error
      res
        .status(500)
        .json({ error: "An error occurred while creating the user" });
    }
  });

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

router.put("/user/:id", async (req, res) => {
  const { id } = req.params;
  const user = req.body;
  await Users.update(user, { where: { id } });
  res.json(user);
  console.log("Person updated successfully");
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  // Removed avatar from the destroy method
  await Users.destroy({ where: { id } });
  res.json({ message: "User deleted successfully" });
});

router.delete("/avatar/:id", async (req, res) => {
  const { id } = req.params;
  const user = req.body;

  try {
 
    await Users.update({ avatar: null }, { where: { id } });
    res.json({ message: "Avatar deleted successfully" });
  } catch (error) {
    console.error("Error deleting avatar:", error);
    res.status(500).json({ message: "Error deleting avatar." });
  }
});

router.post('/auth/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  const userData = req.body; 
  console.log("User data received:", userData);

  try {
    const updatedUser = await Users.update(userData, {
      where: { id: userId },
      returning: true,
    });

    if (updatedUser[0] === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser[1][0]);  
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
