import React, { useState, useContext, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";  
import { AuthContext } from "../helpers/AuthContext";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";

function CreateIngridents({ closeIngridentModal = () => {}, setRefresh, refresh }) {
  const [newIngrident, setNewIngrident] = useState({
    name: "",
    unit: "",
    quantity: "",
  });
  const [message, setMessage] = useState("");  
  const [show, setShow] = useState(false);  
  let { id } = useParams();  
  const { authState } = useContext(AuthContext);  
  const navigate = useNavigate();  
  const [ingredients, setIngredients] = useState([]);  

   useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/ingredients/${id}/ingredients`);  
        setIngredients(response.data); 
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };

    fetchIngredients(); 
  }, [id]);

  const handleClose = () => {
    setShow(false);
    setNewIngrident({ name: "", unit: "", quantity: "" }); 
    setMessage(""); 
    closeIngridentModal(); 
    setRefresh(!refresh);

  };

  const handleShow = () => setShow(true);

  const addIngrident = () => {
    // Validate input fields
    if (!newIngrident.name || !newIngrident.unit || !newIngrident.quantity) {
      setMessage("Please fill in all fields.");
      return;
    }


    const userId = authState.id; 
    axios
      .post(
        `http://localhost:3001/ingredients/${id}`,
        {
          name: newIngrident.name,
          unit: newIngrident.unit,
          quantity: newIngrident.quantity,
          userId: userId, 
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          setMessage(response.data.error);
        } else {
          console.log("New Ingredient Object:", response.data); 
          setMessage("Ingredient added successfully!"); 
          handleClose(); 
          // refreshIngredients(); 
          navigate(`/recipe`); 
        }
      })
      .catch((error) => {
        console.error("Error adding ingredient:", error);
        if (error.response) {
          setMessage(
            `Error: ${error.response.data.error || "An error occurred."}`
          );
        } else {
          setMessage("An error occurred while adding the ingredient."); 
        }
      });
  };

 
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
          <option value="">Select Unit</option> 
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
      <ul>
        {ingredients.map((ingredient) => (
          <li key={ingredient.id}>
            <FontAwesomeIcon 
              icon={faTrashCan} 
              className="text-danger me-2"
              onClick={() => {
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
