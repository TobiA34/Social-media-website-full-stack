const express = require("express");
const router = express.Router();
const { Categories, Recipes } = require("../models");
 const { validateToken } = require("../middlewares/Authmiddlewares");
const { where } = require("sequelize");
const { BAD_REQUEST } = require("../../frontend/src/Constants/statusCodes");

router.get("/", async (req, res) => {
  const listOfCategories = await Categories.findAll();
  res.json(listOfCategories);
});

router.post("/", validateToken, async (req, res) => {
   const category = req.body
    category.UserId = req.user.id;

   if (!category) {
     res.status(BAD_REQUEST).send({
       error:
         "This category is in use by someone els, please try something else, thanks.",
     });
   } else {
   await Categories.create(category);
   res.json(category);
   }
});
 


module.exports = router;

 