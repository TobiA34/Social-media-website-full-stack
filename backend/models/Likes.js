module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define("Likes", {
    // Define other columns here
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    RecipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Likes.associate = (models) => {
    Likes.belongsTo(models.Users, {
      foreignKey: "UserId",
      as: "user",
    });
    Likes.belongsTo(models.Recipes, {
      foreignKey: "RecipeId",
      as: "recipe",
    });
  };

  return Likes;
};
