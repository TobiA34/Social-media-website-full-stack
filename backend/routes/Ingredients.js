// routes/ingredients.js

const express = require("express");
const router = express.Router();
const { Ingredients } = require("../models");  
 const { validateToken } = require("../middlewares/Authmiddlewares");



 router.post("/:recipeId", async (req, res) => {
  const { name, unit, quantity, userId } = req.body;  
  const recipeId = req.params.recipeId;  

   if (!name || !unit || !quantity || !userId) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newIngredient = await Ingredients.create({
      name,
      unit,
      quantity,
      RecipeId: recipeId,  
      UserId: userId,  
    });
    res.status(201).json(newIngredient);  
  } catch (error) {
    console.error("Error creating ingredient:", error);
    res.status(500).json({ error: "An error occurred while creating the ingredient." });
  }
});
 
router.get("/:recipeId", async (req, res) => {
  const recipeId = req.params.recipeId;  

  try {
    const ingredients = await Ingredients.findAll({
      where: { RecipeId: recipeId },  
    });
    res.status(200).json(ingredients);  s
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
      return res.status(404).json({ error: "Ingredient not found." });  
    }

    res.json("DELETED SUCCESSFULLY");
  } catch (error) {
    console.error("Error deleting ingredient:", error);
    res.status(500).json({ error: "An error occurred while deleting the ingredient." });
  }
});

module.exports = router;
