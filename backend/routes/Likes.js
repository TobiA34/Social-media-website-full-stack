const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("../middlewares/Authmiddlewares");

router.post("/", validateToken, async (req, res) => {
  const { RecipeId } = req.body;
  const UserId = req.user.id;

  const found = await Likes.findOne({
    where: { PostId: PostId, UserId: UserId },
  });
  if (!found) {
    await Likes.create({ RecipeId: RecipeId, UserId: UserId });
    res.json({ liked: true });
  } else {
    await Likes.destroy({
      where: { RecipeId: RecipeId, UserId: UserId },
    });
    res.json({ liked: false });
  }
});

module.exports = router;
