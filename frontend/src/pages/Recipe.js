import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import Card from "react-bootstrap/Card";
import { faXmark, faPencil, faTrashCan,faDotCircle } from "@fortawesome/free-solid-svg-icons"; // For the 'x' icon
import ReactStars from "react-stars";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CreateSteps from "./CreateSteps";
 
function Recipe() {
  let { id } = useParams();
  const [recipeObject, setRecipeObject] = useState({});
  const [comments, setComments] = useState([]);
  const [listOfCategories, setListOfCategories] = useState([]);
  const [steps, setSteps] = useState([]);
  const [newSteps, setNewSteps] = useState("");
  const [lgShow, setLgShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [refresh, setRefresh] = useState(false); // State to trigger refresh
  

  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  const [ingridents, setIngridents] = useState(["test1","test2","test3","test4","test5","test6","test7","test8","test9","test10"])

  let navigate = useNavigate();

  useEffect(() => {
    fetchRecipeData();
    fetchComments();
    fetchSteps();
  }, [id, refresh]); // Add refresh to the dependency array

  const fetchRecipeData = () => {
    axios
      .get(`http://localhost:3001/recipe/byId/${id}`)
      .then((response) => {
        console.log("Recipe data fetched:", response.data);
        setRecipeObject(response.data);
      })
      .catch((error) => {
        console.error("Error fetching recipe:", error.response || error);
      });
  };

  const fetchComments = () => {
    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  };

  const fetchSteps = () => {
    axios.get(`http://localhost:3001/steps/${id}`).then((response) => {
      setSteps(response.data);
    });
  };

  const addComment = () => {
    axios
      .post(
        "http://localhost:3001/comments",
        {
          commentBody: newComment,
          RecipeId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
          };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id != id;
          })
        );
      });
  };

  const deleteSteps = (id) => {
    axios
      .delete(`http://localhost:3001/steps/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setSteps(
          steps.filter((val) => {
            return val.id != id;
          })
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/recipe/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate("/");
      });
  };
 

  function formatTime(isoString) {
    const date = new Date(isoString);

    // Get hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine AM or PM suffix
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert 24-hour time to 12-hour time
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Format minutes to always be two digits
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    // Return formatted time
    return `${hours}:${formattedMinutes} ${ampm}`;
  }

  const isoString = "2024-10-03T15:07:11.000Z";
  console.log(formatTime(isoString)); //

  const handleAddSteps = () => {
    axios
      .post(
        "http://localhost:3001/steps",
        {
          step_name: newSteps,
          RecipeId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          setNewSteps(""); // Clear the input
          setLgShow(false); // Close the modal
          setRefresh(!refresh); // Toggle refresh to re-fetch data
        }
      });
  };

  const closeModal = () => {
    setLgShow(false);
    setRefresh(!refresh); // Toggle refresh to re-fetch data
  };
 
  return (
    <div className="container-fluid bg-light">
      <h1 className="text-center">{recipeObject.title}</h1>
      <div class="container mt-36">
        <div class="row ">
          <div class="col-md-5 col-lg- col-12 mb-3">
            <div class="p-3   bg-light">
              <h2>{recipeObject.title}</h2>

              <p>
                <strong>{authState.username}</strong>: {recipeObject.recipe}
              </p>
              <ReactStars
                className="my-4"
                count={5}
                size={24}
                color={"#ffd700"}
                half={false}
                value={recipeObject.rating}
              />

              <div className="row">
                <div className="col-md-6 col-lg-4 col-12 mt-16">
                   <h2>
                    <strong>{ingridents.length}</strong>
                  </h2>
                  <p>Ingridents</p>
                </div>
                <div className="col-md-6 col-lg-4  col-12 mt-16">
                  <h2>
                    <strong>{recipeObject.duration}</strong>
                  </h2>
                  <p>Minutes</p>
                </div>
                <div className="col-md-6 col-lg-4  col-12 mt-16">
                  <h2>
                    <strong>{recipeObject.calories}</strong>
                  </h2>
                  <p>Calories</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-5 col-lg-7  col-12 mb-3 mt-16">
            <div className=" ">
              <Card.Img
                variant="bottom"
                src="https://www.foodandwine.com/thmb/Wd4lBRZz3X_8qBr69UOu2m7I2iw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg"
                className="img-fluid rounded-2  "
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-32">
        <div className="card" id="individual">
          <div className="card-body">
            <div className="d-flex">
              <h2 className="">Ingridents</h2>
            </div>

            <hr />
            <ListGroup as="ol" numbered>
              {ingridents.map((item, key) => (
                <ListGroup.Item key={key} as="li">
                  {item}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>

        <div className="footer">
          {recipeObject.username}
          {authState.username === recipeObject.username && (
            <button
              onClick={() => {
                deletePost(recipeObject.id);
              }}
            >
              Delete Post
            </button>
          )}
        </div>
      </div>

      <div className="card mt-24 p-3">
        <div className="d-flex">
          <h2 className>Steps</h2>

          <Button
            className="btn btn-primary ms-5 nav-btn"
            onClick={() => setLgShow(true)}
          >
            +
          </Button>
        </div>
        <hr />
        {steps.length <= 0 && (
          <>
            <h1>No Steps</h1>
            <p>You might want to add some steps</p>
          </>
        )}{" "}
        <ol className="d-flex flex-column gap-5">
          {steps.map((item, key) => (
            <div className="d-flex ">
              <div>
                <li key={key}>{item.step_name}</li>
              </div>
              <div>
                {comments.map((comment, key) => {
                  return (
                    <div key={key} className="comment">
                      {authState.username === comment.username && (
                        <button
                          className=" ms-2 w-75"
                          onClick={() => {
                            deleteSteps(item.id);
                          }}
                        >
                          <FontAwesomeIcon icon={faXmark} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <div>
                {/*  onClick={() => setLgShow(true) */}
                <button className=" ms-2 w-75" o>
                  <FontAwesomeIcon icon={faPencil} />
                </button>
              </div>
            </div>
          ))}
        </ol>
        <Modal
          size="lg"
          show={lgShow}
          onHide={closeModal}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Large Modal
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CreateSteps
              setNewSteps={setNewSteps}
              newSteps={newSteps}
              closeModal={closeModal}
              setRefresh={setRefresh} // Pass setRefresh as a prop
            />
          </Modal.Body>
        </Modal>
      </div>

      {/* Comments   */}
      <div className="container-fluid w-100 border border-light shadow-sm rounded-3 p-4 bg-white mt-24">
        <strong className="fs-1">Comments</strong>
        <div className="comments-list">
          {comments.map((comment, key) => (
            <div key={key} className="comment py-3">
              {/* Conditionally render <hr /> for all comments except the first */}
              {key !== 0 && <hr />}
              <div className="d-flex gap-3 my-3 align-items-start">
                <Card.Img
                  variant="bottom"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyzTWQoCUbRNdiyorem5Qp1zYYhpliR9q0Bw&s"
                  className="comment-img rounded-circle border border-light"
                  style={{ width: "50px", height: "50px" }}
                />
                <div className="comment-body w-100">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong className="fs-5">{comment.username}</strong>
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <FontAwesomeIcon
                        icon={faDotCircle}
                        className="dot-icon"
                      />
                      <span>{formatTime(comment.createdAt)}</span>
                    </div>
                    {authState.username === comment.username && (
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        className="delete-icon text-danger cursor-pointer"
                        onClick={() => deleteComment(comment.id)}
                        style={{ fontSize: "1.2rem" }}
                      />
                    )}
                  </div>
                  <p className="mb-0 text-secondary">{comment.commentBody}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr />

        {/* Add comment section */}
        <div className="addCommentContainer d-flex flex-column mt-4">
          <textarea
            type="text"
            className="form-control border-2 rounded-2 p-3"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
          />
          <button
            onClick={addComment}
            className="btn btn-primary align-self-end mt-8 px-4 py-2"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
}

export default Recipe;