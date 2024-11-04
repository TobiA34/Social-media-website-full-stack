import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";
import { AuthContext } from "../helpers/AuthContext";
import { storage } from "../firebase"; // Import your Firebase storage configuration
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link } from "react-router-dom";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";

function Profile() {
  let navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const userId = authState.id;
  const [user, setUser] = useState({
    name: "",
    avatar: "",
  });

  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);

  const deleteRecipe = (id) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("User not logged in!");
      return;
    }

    console.log("Deleting recipe with ID:", id);
    axios
      .delete(`http://localhost:3001/recipe/${id}`, {
        headers: { accessToken: accessToken },
      })
      .then((response) => {
        console.log("Recipe deleted:", response.data);
        setSavedRecipes((prevRecipes) =>
          prevRecipes.filter((recipe) => recipe.id !== id)
        );
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error deleting recipe:", error.response.data);
        } else {
          console.error("Network Error:", error.message);
        }
      });
  };

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
          setImageUrl(url); // Store the image URL in state
          resolve(url); // Resolve the promise with the URL
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          reject(error); // Reject the promise if something goes wrong
        });
    });
  };

  const getSavedRecipes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/auth/saved-recipes/${userId}`,
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      );
      console.log("Saved Recipes Response:", response.data); // Log the entire response

      // Ensure the response is in the expected format
      if (response.data && Array.isArray(response.data.listOfRecipes)) {
        setSavedRecipes(response.data.listOfRecipes); // Set state if it's an array
      } else {
        console.error("Expected an array but received:", response.data);
        setSavedRecipes([]); // Reset to empty array if not
      }
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
      setSavedRecipes([]); // Reset to empty array on error
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageUpload(file); // Set the selected file to state

      // Create a preview of the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the preview URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    } else {
      alert("No file selected.");
    }
  };

  const deleteAvatar = async () => {
    console.log("Deleting avatar for userId:", userId);
    try {
      const response = await axios.delete(
        `http://localhost:3001/auth/avatar/${userId}`
      );
      console.log(response.data.message);
      setUser((prevUser) => ({ ...prevUser, avatar: null }));
    } catch (error) {
      console.error("Error deleting avatar:", error);
      alert("An error occurred while deleting the avatar.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageUpload) {
      alert("No image selected for upload.");
      return;
    }

    try {
      const avatarUrl = await uploadFile();

      console.log(avatarUrl);

      if (!avatarUrl) {
        console.error("No image uploaded or upload failed");
        return;
      }

      const updatedUser = { ...user, avatar: avatarUrl };
      console.log("Sending registration data:", updatedUser);
      const response = await axios.put(
        `http://localhost:3001/auth/user/${userId}`,
        updatedUser
      );
      navigate(`/profile/${userId}`);
      console.log("Registration response:", response.data);
    } catch (error) {
      console.error("Error during registration:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  };

  useEffect(() => {
    if (!userId) {
      console.error("UserId is undefined, redirecting to home.");
      navigate("/");
    } else {
      console.log("Fetching user data and saved recipes...");
      fetchUserData(userId);
      getSavedRecipes();
      const savedBookmarks =
        JSON.parse(localStorage.getItem("bookmarkedRecipes")) || [];
      setBookmarkedRecipes(savedBookmarks);
    }
  }, [userId, navigate]);

  const bookmarkRecipe = async (recipeId) => {
    console.log("Clicked on recipe ID:", recipeId);

    // Check if the recipe is already bookmarked
    const alreadyBookmarked = bookmarkedRecipes.includes(recipeId);

    // Toggle bookmark state
    const updatedBookmarks = alreadyBookmarked
      ? bookmarkedRecipes.filter((id) => id !== recipeId) // Remove from bookmarks
      : [...bookmarkedRecipes, recipeId]; // Add to bookmarks

    setBookmarkedRecipes(updatedBookmarks); // Update local state

    // Save updated bookmarks to local storage
    localStorage.setItem("bookmarkedRecipes", JSON.stringify(updatedBookmarks));

    // API call to update bookmark status in the database
    try {
      await axios.put(`http://localhost:3001/recipe/${recipeId}/bookmark`, {
        isBookedMarked: !alreadyBookmarked, // Send the opposite of current state
      });
      refreshPage()
      console.log("Bookmark status updated successfully");
    } catch (error) {
      console.error("Error updating bookmark status:", error);
      // Optionally revert state change if API call fails
      setBookmarkedRecipes(bookmarkedRecipes); // Reset to previous state on failure
    }
  };

   function refreshPage() {
     window.location.reload(false);
   }

  const fetchUserData = async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user not logged in.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3001/auth/basicinfo/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("User data fetched:", response.data);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div className="">
      <div className="mt-4">
        <div className="row d-flex justify-content-center w-100">
          <div className="col-md-11">
            <div className="p-3 position-relative">
              <h5 className="my-3">Profile picture</h5>
              <div className="d-flex align-items-center gap-5 flex-column">
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

                <div className="d-flex gap-3 align-items-center">
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
                  <label htmlFor="file-upload" className="file-input border h-25">
                    <input
                      id="file-upload"
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*" // Allow only image files
                    />
                   </label>
                  <button className="btn btn-danger" onClick={deleteAvatar}>
                    Delete Avatar
                  </button>
                </div>
 
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Save Image
                </button>
              </div>
            </div>
            {/* Saved Recipes */}
            <div className="mt-4">
              <h4>Saved Recipes</h4>
              <div className="row mt-4">
                {savedRecipes.length > 0 ? (
                  savedRecipes.map((value, key) => (
                    <div
                      key={key}
                      className="col-12 col-md-6 col-lg-4 mb-4 my-3"
                    >
                      <div className="card h-100">
                        <div className="card-header d-flex justify-content-between">
                          <h5 className="card-title">{value.title}</h5>
                          <span className="d-flex badge bg-danger rounded-4 align-items-center">
                            {value.Category.category_name}
                          </span>
                        </div>
                        <i
                          onClick={() => bookmarkRecipe(value.id)}
                          className={`heart ${
                            bookmarkedRecipes.includes(value.id)
                              ? "bookmarked"
                              : ""
                          }`}
                          style={{
                            color: bookmarkedRecipes.includes(value.id)
                              ? "red"
                              : "grey",
                          }} // Change color based on bookmark status
                        >
                          <FontAwesomeIcon icon="heart" />
                        </i>
                        <div>
                          <img
                            src={
                              value.avatar
                                ? value.avatar
                                : "https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4="
                            }
                            className="img-fluid"
                            alt=""
                            onClick={() => navigate(`/recipe/${value.id}`)}
                          />
                        </div>

                        <div className="card-footer d-flex justify-content-between align-items-center">
                          <Link
                            to={`/profile/${value.UserId}`}
                            className="link-primary"
                          >
                            {value.username}
                          </Link>
                        </div>
                        <div className="card-footer text-center d-flex gap-3">
                          <div className="card-body d-flex justify-content-between">
                            <FontAwesomeIcon
                              icon="pencil-alt"
                              onClick={() => navigate(`/edit/${value.id}`)}
                            />
                            <p className="card-text">{value.dec}</p>
                            <FontAwesomeIcon
                              icon="trash"
                              onClick={() => deleteRecipe(value.id)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No saved recipes found.</p> // Provide feedback if no recipes are saved
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
