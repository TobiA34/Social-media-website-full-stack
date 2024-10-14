module.exports = (sequelize, DataTypes) => {
  const Recipes = sequelize.define("Recipes", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recipe: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    calories: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    servings: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Categories",
        key: "id",
      },
    },
  });

  Recipes.associate = (models) => {
    Recipes.hasMany(models.Comments, {
      onDelete: "cascade",
    });

    Recipes.hasMany(models.Likes, {
      onDelete: "cascade",
    });
    Recipes.belongsTo(models.Categories, { foreignKey: "CategoryId" });

    Recipes.hasMany(models.Steps, { foreignKey: "PostId" });
    Recipes.belongsTo(models.Users, { foreignKey: "UserId" });
    // Recipes.hasMany(models.Ingridents, { foreignKey: "RecipeId" });
  };


  
  return Recipes;
};
