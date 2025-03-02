import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../Navbar.css";

function RecipeCards({ filteredRecipes }) {
  const navigate = useNavigate();
  const { darkMode } = useTheme(); // No need for toggleTheme here

  return (
    <div className={`row my-4 ${darkMode ? "dark-mode" : "light-mode"}`}>
      {filteredRecipes.map((value, key) => (
        <div key={key} className="col-12 col-md-6 col-lg-4 mb-4 my-3">
          <div
            className={`recipe-card ${
              darkMode ? "card-dark" : "card-light"
            } rounded-card`}
          >
            <img
              src={value.avatar}
              className="w-100 rounded-card-img"
              alt={value.title}
            />
            <div className="recipe-card-content">
              <div className="d-flex justify-content-between p-3">
                <p
                  className="recipe-title fs-5"
                  style={{ color: darkMode ? "white" : "black" }} // Inline fallback
                >
                  <h1 style={{ color: darkMode ? "white" : "black" }}>
                    {value.title}
                  </h1>
                </p>
                <div className="d-flex align-items-center">
                  <button
                    className={`rounded-btn ${
                      darkMode ? "btn-dark-mode" : "btn-light-mode"
                    }`}
                    onClick={() => navigate(`/recipe/${value.id}`)}
                  >
                    View recipe <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecipeCards;
