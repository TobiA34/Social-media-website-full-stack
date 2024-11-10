const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db = require("./models");

 const recipeRouter = require("./routes/Recipes");
app.use("/recipe", recipeRouter); 

  
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

// Test database connection
db.sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Error connecting to database:', err));


db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});
