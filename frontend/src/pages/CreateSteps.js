import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { ACCESS_TOKEN } from "../Constants/accessTokens";
import { API_BASE_URL } from "../Constants/ apiConstants";
 
function CreateSteps({ closeModal = () => {}, setRefresh, refresh }) {
  const { id } = useParams(); 
  const [steps, setSteps] = useState([]);
  const [newSteps, setNewSteps] = useState("");
  const [error, setError] = useState("");

  const { authState } = useContext(AuthContext);
  const [postObject, setPostObject] = useState({});
  let navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE_URL}recipe/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });
  }, []);

  const addStep = () => {
    if (!newSteps.trim()) {
      setError("Step cannot be empty.");
      return;
    }

    setError("");  

    axios
      .post(
        `${API_BASE_URL}steps/${id}`,
        {
          step_name: newSteps,
        },
        {
          headers: { accessToken: localStorage.getItem(ACCESS_TOKEN) },
        }
      )
      .then((response) => {
        console.log("Step created:", response.data);
      })
      .then((response) => {
        console.log("Steps added!");

        const stepsToAdd = { step_name: newSteps };
        setSteps([...steps, stepsToAdd]);
        console.log("Captured ID:", id);
        const url = `/recipe/${id}`;
        navigate(url);  
        console.log(url);
         
        setRefresh(!refresh);
        closeModal();
         
        setNewSteps("");
       });
  };

  return (
    <div>
      <h1 className="text-center">Create A step</h1>
      <div className="card p-5 m-5">
        <h1>{postObject.title}</h1>
        <textarea
          type="text"
          placeholder="steps..."
          className="w-100 textarea my-2 "
          autoComplete="off"
          value={newSteps}
          onChange={(event) => {
            setNewSteps(event.target.value);
          }}
        />
        {error && <div className="text-danger">{error}</div>}
        <button className="btn btn-primary" onClick={addStep}>
          {" "}
          Add Steps
        </button>
      </div>
    </div>
  );
}

export default CreateSteps;
