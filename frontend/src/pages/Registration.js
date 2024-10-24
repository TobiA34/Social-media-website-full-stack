import React, { useState,  } from "react";
import axios from "axios";
import { storage } from "../firebase";  
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";

function Registration() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrl, setImageUrl] = useState("");  
  const [imagePath, setImagePath] = useState(""); 

 const navigate = useNavigate();
  const uploadFile = () => {
    return new Promise((resolve, reject) => {
      if (imageUpload == null) {
        reject("No image selected");
        return;
      }

      const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
      uploadBytes(imageRef, imageUpload)
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
        .then((url) => {
          setImageUrl(url); 
          setImagePath(imageRef.fullPath); 
          resolve(url);  
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          reject(error);  
        });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const avatarUrl = await uploadFile(); 

      if (!avatarUrl) {
        console.error("No image uploaded or upload failed");
        return;
      }
      const formData = {
        name,
        username,
        password,
        avatar: avatarUrl, 
        avatarPath: imagePath, 
      };

      console.log("Sending registration data:", formData);
      navigate('/login')
      const response = await axios.post(
        "http://localhost:3001/auth/register",
        formData
      );
      console.log("Registration response:", response.data); 
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
        className="form-control"
        required
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default Registration;
