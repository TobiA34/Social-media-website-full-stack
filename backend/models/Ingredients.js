module.exports = (sequelize, DataTypes) => {
  const Ingredients = sequelize.define("Ingredients", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    RecipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Ingredients.associate = (models) => {
    Ingredients.belongsTo(models.Users, { foreignKey: "UserId" });

    Ingredients.belongsTo(models.Recipes, { foreignKey: "RecipeId" });
  };

  return Ingredients;
};
