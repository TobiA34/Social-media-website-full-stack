const express = require("express");
const router = express.Router();
const { Posts, Likes,Categories,Steps, Users } = require("../models");
const { validateToken } = require("../middlewares/Authmiddlewares");
const { where } = require("sequelize");
const { faker } = require("@faker-js/faker");

// router.get("/", validateToken, async (req, res) => {
//   const listOfPosts = await Posts.findAll({
//     include: [
//       {
//         model: Categories,
//         required: false,
//       },
//       {
//         model: Steps,
//         required: false,
//       },
//       Likes,
//     ],
//     logging: console.log, // Logs the SQL query
//   });
 
//   const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
//   res.json({
//     listOfPosts: listOfPosts,
//     likedPosts: likedPosts});

//  });

// router.get("/", validateToken, async (req, res) => {
//   // Parse the limit and offset as base-10 numbers, not base-5
//   const limit = parseInt(req.query.limit, 10) || 20; // Default to 5 if not provided or invalid
//   const offset = parseInt(req.query.offset, 0) || 0; // Default to 0 if not provided or invalid

//   console.log("Limit:", limit);
//   console.log("Offset:", offset);

//   if (isNaN(limit) || isNaN(offset)) {
//     return res.status(400).json({ error: "Invalid pagination parameters" });
//   }

//   try {
//     const listOfPosts = await Posts.findAll({
//       include: [
//         {
//           model: Categories,
//           required: false,
//         },
//         {
//           model: Steps,
//           required: false,
//         },
//         Likes,
//       ],
//       logging: console.log, // Logs the SQL query
//       limit: limit, // Pagination limit
//       offset: offset, // Pagination offset
//     });

//     const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });

//     res.json({
//       listOfPosts: listOfPosts,
//       likedPosts: likedPosts,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.get("/v2", validateToken, async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const page = parseInt(req.query.page) || 1;   
  const offset = (page - 1) * limit;  page
  if (isNaN(limit) || isNaN(page) || page < 1) {
    return res.status(400).json({ error: "Invalid pagination parameters" });
  }

  try {
    const totalPosts = await Posts.count();

    const totalPages = Math.ceil(totalPosts / limit);
    const nextPage = page < totalPages ? (page + 1 - 1) * limit : null;

    const prevPage = page > 0 ? (page - 1 - 1) * limit : null;

     const listOfPosts = await Posts.findAll({
      include: [
        { model: Categories, required: false },
        { model: Steps, required: false },
        Likes,
      ],
      limit: limit,
      offset: offset,
    });

    const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });

    res.json({
      listOfPosts: listOfPosts,
      likedPosts: likedPosts,
      totalPosts: totalPosts,
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
    const posts = [];

    for (let i = 0; i < 10; i++) {
      posts.push({
        title: faker.lorem.sentence(), // Generates a random sentence for the title
        post: faker.lorem.paragraphs(2), // Generates two random paragraphs for the post
        CategoryId: 1,
        UserId: 1
      });
    }

    // Bulk create posts
    const createdPosts = await Posts.bulkCreate(posts);

    res.status(200).json({
      message: 'Fake data created successfully',
      data: createdPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occurred while creating posts.',
      error: error.message,
    });
  }
});

router.get("/your-recipes/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  // Parse the limit and offset as base-10 numbers, not base-5
  const limit = parseInt(req.query.limit, 10) || 5; // Default to 5 if not provided or invalid
  const offset = parseInt(req.query.offset, 10) || 0; // Default to 0 if not provided or invalid
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
      limit: limit,  
      offset: offset, 
      where: {
        UserId: id,
      },
    });

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
