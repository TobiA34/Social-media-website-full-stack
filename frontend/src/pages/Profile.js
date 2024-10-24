import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "react-bootstrap";
import { AuthContext } from "../helpers/AuthContext";
import { storage } from "../firebase"; // Import your Firebase storage configuration
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
      const response = await axios.delete(`http://localhost:3001/auth/avatar/${userId}`);
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

      console.log(avatarUrl)

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
      navigate(`/profile/${userId}`)
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
      fetchUserData(userId);  
    }
  }, [userId, navigate]);  

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

                <div className="d-flex gap-2">
                  <label htmlFor="file-upload" className="custom-file-upload">
                    {user.avatar ? "Upload Image" : "Add Image"}
                  </label>

                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}  
                    className="form-control"
                    required
                  />
                  <button
                    onClick={() => deleteAvatar(user.id)} 
                    className="rounded-pill text-danger"
                  >
                    delete picture
                  </button>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button
                  onClick={handleSubmit}
                  className="btn btn-primary mt-20 align-self-end w-50 fs-6"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
