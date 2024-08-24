const express = require("express");
const router = express.Router();
const { Posts, Likes,Categories,Steps } = require("../models");
const { validateToken } = require("../middlewares/Authmiddlewares");
const { where } = require("sequelize");
 
router.get("/", validateToken, async (req, res) => {
  const listOfPosts = await Posts.findAll({
    include: [
      {
        model: Categories,
        required: false,
      },
      {
        model: Steps,
        required: false,
      },
      Likes,
    ],
    logging: console.log, // Logs the SQL query
  });
 
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  res.json({
    listOfPosts: listOfPosts,
    likedPosts: likedPosts});

 });



router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
});

router.get("/byuserId/:id", async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({
    where: { UserId: id },
    include: [Likes],
  });
  res.json(listOfPosts);
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  post.username = req.user.username;
  post.UserId = req.user.id;
  await Posts.create(post);
  res.json(post);
  console.log(post)
});


router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  await Posts.destroy({
    where: {
      id: postId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

 
module.exports = router;
