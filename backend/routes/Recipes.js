const express = require("express");
const router = express.Router();
const { Recipes, Likes,Categories,Steps, Users, Ingredients } = require("../models");
const { validateToken } = require("../middlewares/Authmiddlewares");
const { where } = require("sequelize");
const { faker } = require("@faker-js/faker");
 
router.get("/v2", validateToken, async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const page = parseInt(req.query.page) || 1;   
  const offset = (page - 1) * limit;  page
  if (isNaN(limit) || isNaN(page) || page < 1) {
    return res.status(400).json({ error: "Invalid pagination parameters" });
  }

  try {
    const totalRecipes = await Recipes.count();

    const totalPages = Math.ceil(totalRecipes / limit);
    const nextPage = page < totalPages ? (page + 1 - 1) * limit : null;

    const prevPage = page > 0 ? (page - 1 - 1) * limit : null;

     const listOfRecipes = await Recipes.findAll({
      include: [
        { model: Categories, required: false },
        { model: Steps, required: false },
        Likes,
      ],
      limit: limit,
      offset: offset,
    });

    const likedRecipes = await Likes.findAll({ where: { UserId: req.user.id } });

    res.json({
      listOfRecipes: listOfRecipes,
      likedRecipes: likedRecipes,
      totalRecipes: totalRecipes,
      totalPages: totalPages,
      currentPage: page,
      nextPage: nextPage,
      prevPage: prevPage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
  
 router.post('/create-fake-data', async (req, res) => {
  try {
    const recipes = [];

    for (let i = 0; i < 10; i++) {
      recipes.push({
        title: faker.lorem.sentence(), 
        recipe: faker.lorem.paragraphs(2),   
        CategoryId: 1,
        UserId: 1,
      });
    }

     const createdRecipes = await Recipes.bulkCreate(recipes);

    res.status(200).json({
      message: 'Fake data created successfully',
      data: createdRecipes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occurred while creating recipes.',
      error: error.message,
    });
  }
});

router.get("/your-recipes/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  const limit = parseInt(req.query.limit) || 5;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  page;
  if (isNaN(limit) || isNaN(page) || page < 1) {
    return res.status(400).json({ error: "Invalid pagination parameters" });
  }
  try {
     const totalRecipes = await Recipes.count();

     const totalPages = Math.ceil(totalRecipes / limit);
     const nextPage = page < totalPages ? (page + 1 - 1) * limit : null;

     const prevPage = page > 0 ? (page - 1 - 1) * limit : null;


    const listOfRecipes = await Recipes.findAll({
      include: [
        {
          model: Categories,
          required: false,
        },
        {
          model: Steps,
          required: false,
        },
        {
          model: Users,
          required: false,
        },
        Likes,
      ],
      logging: console.log,
      limit: limit,  
      offset: offset, 
      where: {
        UserId: id,
      },
    });

     res.json({
       listOfRecipes: listOfRecipes,
       likedRecipes: likedRecipes,
       totalRecipes: totalRecipes,
       totalPages: totalPages,
       currentPage: page,
       nextPage: nextPage,
       prevPage: prevPage,
     });
  } catch (error) {
    console.error("Error fetching Recipes:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the recipes." });
  }
});


router.get("/v2/your-recipes/:id", validateToken, async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;

  if (isNaN(limit) || isNaN(page) || page < 1) {
    return res.status(400).json({ error: "Invalid pagination parameters" });
  }

  try {
    const totalRecipes = await Recipes.count({
      where: { UserId: req.user.id },
    });

    const totalPages = Math.ceil(totalRecipes / limit); 

    const listOfRecipes = await Recipes.findAll({
      where: { UserId: req.user.id },
      include: [
        { model: Categories, required: false },
        { model: Steps, required: false },
        Likes,
      ],
      limit: limit,
      offset: offset,
    });

    const likedRecipes = await Likes.findAll({
      where: { UserId: req.user.id },
    });

    res.json({
      listOfRecipes,
      likedRecipes,
      totalRecipes,
      totalPages, 
      currentPage: page,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/", validateToken, async (req, res) => {
  const recipe = req.body;
  recipe.username = req.user.username;
  recipe.UserId = req.user.id;
  await Recipes.create(recipe);
  res.json(recipe);
  console.log(recipe);
});


router.delete("/:recipeId", validateToken, async (req, res) => {
  const recipeId = req.params.recipeId;

  try {
    await Ingredients.destroy({
      where: {
        RecipeId: recipeId,
      },
    });

     const deletedCount = await Recipes.destroy({
      where: {
        id: recipeId,
      },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json({ message: "DELETED SUCCESSFULLY" });
  } catch (error) {
    console.error("Error deleting recipe:", error);  
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

 router.get("/byId/:id", async (req, res) => {
   const recipeId = req.params.id;
    const recipe = await Recipes.findByPk(recipeId);
   if (recipe) {
     res.json(recipe);
   } else {
     res.status(404).json({ error: "Recipe not found" });
   }
 });
 
// Route to update bookmark status
 router.put("/:id/bookmark", async (req, res) => {
   const { id } = req.params;
   const { isBookedMarked } = req.body;

   try {
     // Find the recipe by ID and update the isBookedMarked field
     const [updated] = await Recipes.update(
       { isBookedMarked }, // Updated field
       { where: { id } } // Condition to find the correct record
     );

     if (updated) {
       return res.status(200).json({ message: "Recipe updated successfully" });
     }

     return res.status(404).json({ message: "Recipe not found" });
   } catch (error) {
     console.error("Error updating recipe:", error);
     return res.status(500).json({ message: "Error updating recipe", error });
   }
 });

router.put("/byId/:id", async (req, res) => {
  const { id } = req.params;
  const { title, desc, avatar } = req.body;

  try {
    const existingRecipe = await Recipes.findByPk(id);
    if (!existingRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    await existingRecipe.update({ title, desc, avatar });
    res.json({
      message: "Recipe updated successfully",
      recipe: existingRecipe,
    });
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ error: "Failed to update recipe" });
  }
});




 

module.exports = router;
