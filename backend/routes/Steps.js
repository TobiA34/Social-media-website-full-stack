 const express = require("express");
 const router = express.Router();
 const { Steps } = require("../models");
 const { validateToken } = require("../middlewares/Authmiddlewares");

router.get("/:postId", async (req, res) => {
  const { postId, userId } = req.params;

  try {
    // Find all steps associated with the given postId
    const steps = await Steps.findAll({
      where: { PostId: postId  }, // Assuming PostId is the foreign key in Steps
    });

    // Send the steps as the response
    res.json(steps);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the steps." });
  }
});


router.get("/:postId", async (req, res) => {
const postId = req.params.postId;
const step = await Steps.findAll({ where: { PostId: postId } });
res.json(step);
});


router.post("/:postId", async (req, res) => {
  const { postId } = req.params; // Extract the postId from the route parameter
  const step = req.body; // Get the step data from the request body

  // Make sure the step includes the postId to establish the relationship
  step.PostId = postId;

  try {
    const newStep = await Steps.create(step); // Save the step to the database
    res.json(newStep); // Send back the created step as a response
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

// UPDATE STEPS set step_name = "cut onion" where id = StepId
// Update step by ID
// Route to update a step
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
