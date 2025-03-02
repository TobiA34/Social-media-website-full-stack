import React from "react";
import { useTheme } from "../context/ThemeContext";
import "../Navbar.css";

const RecipeGrid = ({ recipes }) => {
  const { darkMode, toggleTheme } = useTheme();
  console.log("Dark mode in RecipeGrid:", darkMode);

  return (
    <div
      className={`recipe-grid row my-4 ${
        darkMode ? "navbar-dark-mode" : "navbar-light-mode"
      }`}
    >
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
