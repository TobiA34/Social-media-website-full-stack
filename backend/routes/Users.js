const express = require("express");
const router = express.Router();
const {
  Recipes,
  Likes,
  Categories,
  Steps,
  Users,
} = require("../models");

const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/Authmiddlewares");
const { sign } = require("jsonwebtoken");
const { INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST } = require("../../frontend/src/Constants/statusCodes");

 router.post("/register", async (req, res) => {
  const { name, username, password, avatar, avatarPath } = req.body;

  try {
     const existingUser = await Users.findOne({ where: { username } });
    if (existingUser) {
      return res.status(BAD_REQUEST).json({ error: "Username already exists" });
    }

     const hashedPassword = await bcrypt.hash(password, 10);

     const newUser = await Users.create({
      name,
      username,
      password: hashedPassword,
      avatar,
      avatarPath,
    });

    res.json({ message: "User created successfully", userId: newUser.id });
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
});

 
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username } });

  if (!user) {
    return res.json({ error: "User Doesn't Exist" });
  }

  bcrypt.compare(password, user.password).then(async (match) => {
    if (!match) return res.json({ error: "Wrong Username And Password Combination" });

    const accessToken = sign({ username: user.username, id: user.id }, "importantsecret");
    res.json({ token: accessToken, username: user.username, id: user.id });
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
    res.status(INTERNAL_SERVER_ERROR).json({ message: "Error deleting avatar." });
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
      return res.status(NOT_FOUND).json({ message: 'User not found' });
    }

    res.json(updatedUser[1][0]);  
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
});


 router.get("/saved-recipes/:id", validateToken, async (req, res) => {
 
  try {
    const listOfRecipes = await Recipes.findAll({
      include: [
        { model: Categories, required: false },
        { model: Steps, required: false },
      ],
      where: { UserId: req.user.id, isBookedMarked: 1 },
    });

    res.json({
      listOfRecipes: listOfRecipes,
    });
  } catch (error) {
    console.error("Error fetching saved recipes:", error); 
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
});
  

module.exports = router;
