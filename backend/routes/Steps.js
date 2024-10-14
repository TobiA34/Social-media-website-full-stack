 const express = require("express");
 const router = express.Router();
 const { Steps } = require("../models");
 const { validateToken } = require("../middlewares/Authmiddlewares");

router.get("/:recipeId", async (req, res) => {
  const { recipeId, userId } = req.params;

  try {
   
    const steps = await Steps.findAll({
      where: { RecipeId: recipeId },  
    });

    res.json(steps);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the steps." });
  }
});


router.get("/:recipeId", async (req, res) => {
  const recipeId = req.params.recipeId;
  const step = await Steps.findAll({ where: { PostId: recipeId } });
  res.json(step);
});


router.post("/:recipeId", async (req, res) => {
  const { recipeId } = req.params;  
  const step = req.body;  
  
  step.RecipeId = recipeId;

  try {
    const newStep = await Steps.create(step);  
    res.json(newStep);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the step." });
  }
});

router.delete("/:stepsId", validateToken, async (req, res) => {
  const stepsId = req.params.stepsId;

  await Steps.destroy({
    where: {
      id: stepsId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

 router.get("/steps/:id", async (req, res) => {
   try {
     const stepId = req.params.id;
     const steps = await Steps.findAll({ where: { recipeId: stepId } });

     if (steps) {
       res.json(steps);
     } else {
       res.status(404).json({ error: "Steps not found" });
     }
   } catch (error) {
     console.error("Error fetching steps:", error);
     res.status(500).json({ error: "An error occurred while fetching steps" });
   }
 });
 
router.put("/update/:id", async (req, res) => {
  const stepId = req.params.id;
  const { step_name } = req.body;

  try {
    const updated = await Steps.update(
      { step_name },
      { where: { id: stepId } }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ error: "Step not found" });
    }

    res.json({ message: "Step updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 module.exports = router;
