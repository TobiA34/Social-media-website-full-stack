import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
 
function CreateSteps() {
  const { id } = useParams(); // Use useParams to get the ID from the route
  const [steps, setSteps] = useState([]);
  const [newSteps, setNewSteps] = useState("");

  const { authState } = useContext(AuthContext);
  const [postObject, setPostObject] = useState({});
  let navigate = useNavigate();

  useEffect(() => {
 
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

  
  }, []);

  const addStep = () => {
    
  axios.post(`http://localhost:3001/steps/${id}`, {
  step_name: newSteps,
}, {
  headers: { accessToken: localStorage.getItem("accessToken") }
})
.then(response => {
  console.log('Step created:', response.data);
})
      .then((response) => {
        console.log("Steps added!");

        const stepsToAdd = { step_name: newSteps };
        setSteps([...steps, stepsToAdd]);
        console.log("Captured ID:", id);
        const url = `/post/${id}`;
        navigate(url) // Debugging line
        console.log(url)
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
        <button className="btn btn-primary" onClick={addStep}> Add Steps</button>
       </div>
    </div>
  );
}

export default CreateSteps;
