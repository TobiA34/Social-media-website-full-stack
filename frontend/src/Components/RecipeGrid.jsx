import React from "react";
 
const RecipeGrid = ({ recipes }) => {
  return (
    <div className="recipe-grid">
      {recipes.map((recipe, index) => (
        <div key={index} className={`recipe-card item-${index + 1}`}>
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="recipe-image"
          />
        </div>
      ))}
    </div>
  );
};

export default RecipeGrid;
