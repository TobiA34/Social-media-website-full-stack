const express = require("express");
const router = express.Router();
const { Posts, Likes,Categories,Steps, Users } = require("../models");
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

router.get("/your-recipes/:id", validateToken, async (req, res) => {
  const id = req.params.id;  

  try {
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
        {
          model: Users,  
          required: false,  
        },
        Likes, 
      ],
      logging: console.log,  
      where: {
        UserId: id,
      },
    });

    // Return the filtered list of posts
    res.json({ listOfPosts: listOfPosts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the posts." });
  }
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
