import React from 'react'
import { useNavigate, Link } from "react-router-dom";

function RecipeCards({ filteredRecipes }) {
  const navigate = useNavigate();
  return (
    <div className="row my-4">
      {filteredRecipes.map((value, key) => (
        <div key={key} className="col-12 col-md-6 col-lg-4 mb-4 my-3">
         
          <div className="recipe-card bg-light rounded-card ">
            <img src={value.avatar} className="w-100 rounded-card-img " />
            <div className="recipe-card-content">
              <div className="d-flex justify-content-between p-3 ">
                <p className="recipe-title fs-5 ">
                  <strong>{value.title}</strong>
                </p>
                <div className="d-flex align-items-center ">
                  <button
                    className="rounded-btn "
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

export default RecipeCards
