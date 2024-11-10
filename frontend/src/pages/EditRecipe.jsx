import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "react-bootstrap";
import { AuthContext } from "../helpers/AuthContext";
import { storage } from "../firebase";  
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { v4 } from "uuid";
import { API_BASE_URL } from "../Constants/ apiConstants";

function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({ title: "", desc: "", avatar: "" });

  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrl, setImageUrl] = useState("");  
   const [imagePreview, setImagePreview] = useState("");  
  const [user, setUser] = useState({
    name: "",
    avatar: "",
  });

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
            resolve(url);  
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
            reject(error);  
          });
      });
    };

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setImageUpload(file);  

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result); 
        };
        reader.readAsDataURL(file); 
      } else {
        alert("No file selected.");
      }
    };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}recipe/byId/${id}`)
      .then((response) => {
        console.log("Recipe data fetched:", response.data);
        setRecipe({ title: response.data.title, desc: response.data.desc });
      })
      .catch((error) => {
        console.error("Error fetching recipe:", error.response || error);
      });
  }, [id]);

  const editRecipe = async (e) => {
    e.preventDefault();

    if (!imageUpload) {
      alert("No image selected for upload.");
      return;  
    }
          const avatarUrl = await uploadFile();  

      console.log(avatarUrl)

      if (!avatarUrl) {
        console.error("No image uploaded or upload failed");
        return;
      }

axios
  .put(`${API_BASE_URL}recipe/byId/${id}`, {
    title: recipe.title,
    desc: recipe.desc, 
    avatar: avatarUrl,
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
      {}
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

          <h3>Description</h3>

          <textarea
            type="text"
            placeholder="desc"
            className="form-control"
            value={recipe.desc || ""}
            onChange={(e) => setRecipe({ ...recipe, desc: e.target.value })}
          />
        </div>

        <Card.Img
          variant="bottom"
          src={
            user.avatar && user.avatar !== ""
              ? `${user.avatar}?t=${new Date().getTime()}`
              : "https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4="
          }  
          className="avatar img-fluid image-container"
          alt="Profile Avatar"
        />
        <div className="border p-4">
          <label htmlFor="">Preview for img</label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Image Preview"
              className="img-preview img-fluid"  
            />
          )}
        </div>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}  
          className="form-control"
          required
        />
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
