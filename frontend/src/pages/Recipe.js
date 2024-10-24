import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import Card from "react-bootstrap/Card";
import { faXmark, faPencil, faTrashCan,faDotCircle } from "@fortawesome/free-solid-svg-icons";
import ReactStars from "react-stars";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CreateSteps from "./CreateSteps";
import CreateIngridents from "./CreateIngridents";

function Recipe() {
  let { id } = useParams();
  const [recipeObject, setRecipeObject] = useState({});
  const [comments, setComments] = useState([]);
  const [listOfCategories, setListOfCategories] = useState([]);
  const [steps, setSteps] = useState([]);
  const [newSteps, setNewSteps] = useState("");
  const [lgShow, setLgShow] = useState(false);
  const [ingridentShow, setIngridentShow] = useState(false);
 
  const [editShow, setEditShow] = useState(false);
  const [refresh, setRefresh] = useState(false); 

  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  const [ingridents, setIngridents] = useState([])

  let navigate = useNavigate();

  useEffect(() => {
    fetchRecipeData();
    fetchComments();
    fetchSteps();
    fetchIngredients();
  }, [id, refresh]); 

  const fetchRecipeData = () => {
    console.log("Fetching recipe with ID:", id);  
    axios
      .get(`http://localhost:3001/recipe/byId/${id}`)
      .then((response) => {
        console.log("Recipe data fetched:", response.data);
        setRecipeObject(response.data);
      })
      .catch((error) => {
        console.error("Error fetching recipe:", error.response ? error.response.data : error.message);
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

  const fetchIngredients = () => {
    axios.get(`http://localhost:3001/ingredients/${id}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setIngridents(response.data);
        } else {
          setIngridents([]); 
          console.log("No ingredients found for this recipe.");
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error fetching ingredients:", error.response.data);
        } else {
          console.error("Error fetching ingredients:", error.message);
        }
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

    let hours = date.getHours();
    const minutes = date.getMinutes();

    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; 

    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${formattedMinutes} ${ampm}`;
  }

  const isoString = "2024-10-03T15:07:11.000Z";
  console.log(formatTime(isoString)); 

  const deleteIngridents = (id) => {
    axios
      .delete(`http://localhost:3001/ingredients/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setIngridents(
          ingridents.filter((val) => {
            return val.id !== id; 
          })
        );
      })
      .catch((error) => {
        console.error("Error deleting ingredient:", error.response ? error.response.data : error.message);
      });
  };

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
          setNewSteps("");  
          setLgShow(false);  
          setRefresh(!refresh);  
        }
      });
  };

  const closeModal = () => {
    setLgShow(false);
    setRefresh(!refresh); 
  };

    const closeIngridentModal = () => {
      setIngridentShow(false);
      setRefresh(!refresh); 
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
                <strong>{authState.username}</strong>: {recipeObject.desc}
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
                src={
                  recipeObject.avatar
                    ? recipeObject.avatar
                    : "https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4="
                }
                className="img-fluid rounded-2"
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

              <Button
                className="btn btn-primary ms-5 nav-btn"
                onClick={() => setIngridentShow(true)}
              >
                +
              </Button>
            </div>

            <hr />
            {ingridents.length <= 0 && (
              <>
                <h1>No Ingridents</h1>
                <p>You might want to add some Ingridents 🍳</p>
              </>
            )}
            <ListGroup as="ol">
              {ingridents.map((item, key) => (
                <ListGroup.Item key={key} as="li">
                  <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        className="delete-icon text-danger cursor-pointer"
                        onClick={() => deleteIngridents(item.id)}
                        style={{ fontSize: "1.2rem" }}
                      />
                      <h1>{item.name}</h1>
                    </div>
                    <div>
                      <h1>
                        {item.quantity}
                        {item.unit}
                      </h1>
                    </div>
                  </div>
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
              setRefresh={setRefresh} 
            />
          </Modal.Body>
        </Modal>
        <Modal
          size="lg"
          show={ingridentShow}
          onHide={closeIngridentModal}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <CreateIngridents
            setRefresh={setRefresh}
            closeIngridentModal={closeIngridentModal}
          />
        </Modal>
      </div>

      {/* Comments   */}
      <div className="container-fluid w-100 border border-light shadow-sm rounded-3 p-4 bg-white mt-24">
        <strong className="fs-1">Comments</strong>
        <div className="comments-list">
          {comments.map((comment, key) => (
            <div key={key} className="comment py-3">
              
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
