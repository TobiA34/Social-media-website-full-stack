module.exports = (sequelize, DataTypes) => {
  const Categories = sequelize.define("Categories", {
    category_name: {
      type: DataTypes.STRING,
      allowNull: true,
      distinct:true // add this distinct here
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
  
  Categories.associate = (models) => {

 

     Categories.belongsTo(models.Users, { foreignKey: "UserId" });
     
      Categories.belongsTo(models.Recipes, { foreignKey: "CategoryId" });

  };
   
  return Categories;
};
