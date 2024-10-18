import React, { useState, useContext, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { AuthContext } from "../helpers/AuthContext"; // Import AuthContext


function CreateIngridents({ closeIngridentModal = () => {}, setRefresh, refresh }) {
  const [newIngrident, setNewIngrident] = useState({
    name: "",
    unit: "",
    quantity: "",
  });
  const [message, setMessage] = useState(""); // For displaying success or error messages
  const [show, setShow] = useState(false); // State to control modal visibility
  let { id } = useParams(); // Get the recipe ID from the URL parameters
  const { authState } = useContext(AuthContext); // Access authState from context
  const navigate = useNavigate(); // Define navigate using useNavigate
  const [ingredients, setIngredients] = useState([]); // State to hold fetched ingredients

  // Fetch all ingredients when the component mounts
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/ingredients/${id}/ingredients`); // Fetch ingredients by recipeId
        setIngredients(response.data); // Set the fetched ingredients to state
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };

    fetchIngredients(); // Call the fetch function
  }, [id]); // Dependency array includes id to refetch if it changes

  const handleClose = () => {
    setShow(false);
    setNewIngrident({ name: "", unit: "", quantity: "" }); // Reset form when closing
    setMessage(""); // Clear message when closing
    closeIngridentModal(); // Call hideModal prop to hide the modal
    setRefresh(!refresh);

  };

  const handleShow = () => setShow(true);

  const addIngrident = () => {
    // Validate input fields
    if (!newIngrident.name || !newIngrident.unit || !newIngrident.quantity) {
      setMessage("Please fill in all fields.");
      return;
    }

    // Use authState.id as userId
    const userId = authState.id; // Get userId from authState

    // Send POST request to create a new ingredient
    axios
      .post(
        `http://localhost:3001/ingredients/${id}`,
        {
          name: newIngrident.name,
          unit: newIngrident.unit,
          quantity: newIngrident.quantity,
          userId: userId, // Include userId in the request body
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          setMessage(response.data.error); // Display error message from the server
        } else {
          console.log("New Ingredient Object:", response.data); // Print the result as an object
          setMessage("Ingredient added successfully!"); // Success message
          handleClose(); // Close the modal after successful addition
          refreshIngredients(); // Call refreshIngredients to refresh the ingredient list
          navigate(`/recipe`); // Navigate to a specific route if needed
        }
      })
      .catch((error) => {
        console.error("Error adding ingredient:", error);
        if (error.response) {
          setMessage(
            `Error: ${error.response.data.error || "An error occurred."}`
          );
        } else {
          setMessage("An error occurred while adding the ingredient."); // General error message
        }
      });
  };

  // Define the units
  const units = [
    "kg",
    "g",
    "L",
    "mL",
    "cup",
    "tbsp",
    "tsp",
    "oz",
    "lb",
    "piece",
    "pinch",
    "dash",
  ];

  return (
    <div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Ingredient Name"
          value={newIngrident.name}
          onChange={(e) =>
            setNewIngrident({ ...newIngrident, name: e.target.value })
          }
        />
      </div>
      <div className="mb-3">
        <select
          className="form-control"
          value={newIngrident.unit}
          onChange={(e) =>
            setNewIngrident({ ...newIngrident, unit: e.target.value })
          }
        >
          <option value="">Select Unit</option> {/* Default option */}
          {units.map((unit, index) => (
            <option key={index} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Quantity"
          value={newIngrident.quantity}
          onChange={(e) =>
            setNewIngrident({ ...newIngrident, quantity: e.target.value })
          }
        />
      </div>
      <button onClick={addIngrident}>save</button>
      {/* Render the fetched ingredients */}
      <ul>
        {ingredients.map((ingredient) => (
          <li key={ingredient.id}>
            {/* Render the trash can icon next to the ingredient name */}
            <FontAwesomeIcon 
              icon={faTrashCan} 
              className="text-danger me-2" // Add classes for styling (optional)
              onClick={() => {
                // Handle delete action here
                console.log(`Delete ingredient with id: ${ingredient.id}`);
              }}
            />
            {ingredient.name} &nbsp; - &nbsp; {ingredient.quantity} {ingredient.unit}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreateIngridents;
