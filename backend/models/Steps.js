module.exports = (sequelize, DataTypes) => {
  const Steps = sequelize.define("Steps", {
    step_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    UserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        targetKey: "id",
      },
    },
  });

   Steps.associate = (models) => {
   Steps.belongsTo(models.Users, { foreignKey: "UserId" });

   Steps.belongsTo(models.Recipes, { foreignKey: "RecipeId" });
   };

  return Steps;
};

