import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditRecipe() {
  const { id } = useParams(); 
  const navigate = useNavigate();  
  const [recipe, setRecipe] = useState({ title: "", recipe: "" });  
 
useEffect(() => {
  axios
    .get(`http://localhost:3001/recipe/byId/${id}`) 
    .then((response) => {
      console.log("Recipe data fetched:", response.data);
      setRecipe({ title: response.data.title, recipe: response.data.recipe });
    })
    .catch((error) => {
      console.error("Error fetching recipe:", error.response || error);
    });
}, [id]);

const editRecipe = () => {
  axios
    .put(`http://localhost:3001/recipe/byId/${id}`, {
      title: recipe.title,
      recipe: recipe.recipe,
    })
    .then((response) => {
      console.log("Update response:", response.data);
      alert("Recipe updated successfully");
      navigate(`/`);
    })
    .catch((error) => {
      console.error("Error updating recipe:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      alert("Failed to update recipe. Please try again.");
    });
};

  return (
    <div>
      <h1 className="text-center">Edit Recipe</h1>
      <p className="text-center">Recipe id: {id}</p>
      <div className="container border border-dark rounded-4 p-3 d-flex flex-column gap-3">
        <div className="d-flex gap-3 flex-column">
          <h3>Title</h3>
          <input
            type="text"
            placeholder="Title"
            className="form-control"
            value={recipe.title || ""}  
            onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}  
          />
          
          <h3>Recipe</h3>
          
          <input
            type="text"
            placeholder="Recipe"
            className="form-control"
            value={recipe.recipe || ""} 
            onChange={(e) => setRecipe({ ...recipe, recipe: e.target.value })}  
          />
        </div>

        <button
          className="btn btn-primary mt-5 align-self-center"
          onClick={editRecipe}  
        >
          Edit
        </button>
      </div>
    </div>
  );
}

export default EditRecipe;
