// routes/ingredients.js

const express = require("express");
const router = express.Router();
const { Ingredients } = require("../models"); // Ensure this path is correct
 const { validateToken } = require("../middlewares/Authmiddlewares");



// POST route to create a new ingredient
router.post("/:recipeId", async (req, res) => {
  const { name, unit, quantity, userId } = req.body; // Extract userId from the request body
  const recipeId = req.params.recipeId; // Extracting recipeId from the URL parameters

  // Validate input
  if (!name || !unit || !quantity || !userId) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newIngredient = await Ingredients.create({
      name,
      unit,
      quantity,
      RecipeId: recipeId, // Assuming you have a foreign key relationship
      UserId: userId, // Save userId in the database
    });
    res.status(201).json(newIngredient); // Respond with the created ingredient
  } catch (error) {
    console.error("Error creating ingredient:", error);
    res.status(500).json({ error: "An error occurred while creating the ingredient." });
  }
});

// GET route to retrieve all ingredients for a specific recipe
router.get("/:recipeId", async (req, res) => {
  const recipeId = req.params.recipeId; // Extracting recipeId from the URL parameters

  try {
    const ingredients = await Ingredients.findAll({
      where: { RecipeId: recipeId }, // Querying ingredients by recipeId
    });
    res.status(200).json(ingredients); // Respond with the list of ingredients
  } catch (error) {
    console.error("Error retrieving ingredients:", error);
    res.status(500).json({ error: "An error occurred while retrieving ingredients." });
  }
});


router.delete("/:ingredientId", validateToken, async (req, res) => {
  const ingredientId = req.params.ingredientId;
  try {
    const deletedCount = await Ingredients.destroy({
      where: {
        id: ingredientId,
      },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Ingredient not found." }); // Handle case where ingredient is not found
    }

    res.json("DELETED SUCCESSFULLY");
  } catch (error) {
    console.error("Error deleting ingredient:", error);
    res.status(500).json({ error: "An error occurred while deleting the ingredient." });
  }
});

module.exports = router;
