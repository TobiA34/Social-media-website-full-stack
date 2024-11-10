import React, { useState } from "react";
import axios from "axios";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../Constants/ apiConstants";

function Registration() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const uploadFile = () => {
    return new Promise((resolve, reject) => {
      if (!imageUpload) {
        reject("No image selected");
        return;
      }

      const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
      uploadBytes(imageRef, imageUpload)
        .then((snapshot) => getDownloadURL(snapshot.ref))
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
    setError("");  

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

      const response = await axios.post(
        `${API_BASE_URL}auth/register`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Registration response:", response.data);

       if (response.data.message) {
        navigate("/login");
      }
    } catch (error) {
      console.error(
        "Error during registration:",
        error.response?.data || error.message
      );
      setError(
        error.response?.data?.error || "Registration failed. Please try again."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="d-flex align-items-center justify-content-center vh-100 flex-column"
    >
      <div className="card w-50">
        <h1 className="text-center mt-10">
          <strong>Register</strong>
        </h1>

        <div className="card-body d-flex flex-column gap-3 p-5 align-items-center ">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-control border border-2"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-control border border-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control border border-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setImageUpload(event.target.files[0])}
            className="form-control"
            required
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </div>
      </div>
    </form>
  );
}

export default Registration;
