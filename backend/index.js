const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models"); // Ensure this path is correct
const app = express();

app.use(cors());
app.use(express.json()); // Ensure this is included to parse JSON request bodies

// Routers
const recipeRouter = require("./routes/Recipes");
app.use("/recipe", recipeRouter); 

// Routers
 
const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);

const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

const categoryRouter = require("./routes/Categories");
app.use("/categories", categoryRouter);


const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);

 
const stepsRouter = require("./routes/Steps");
app.use("/steps",stepsRouter);

const ingredientsRouter = require("./routes/Ingredients");
app.use("/ingredients", ingredientsRouter);

// Sync database and start server
sequelize.sync()
  .then(() => {
    app.listen(3001, () => {
      console.log("Server is running on port 3001");
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
