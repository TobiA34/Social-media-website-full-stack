import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import Card from "react-bootstrap/Card";
import { faXmark,faPencil } from "@fortawesome/free-solid-svg-icons"; // For the 'x' icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [listOfCategories, setListOfCategories] = useState([]);
  const [steps, setSteps] = useState([]);
  const [newSteps, setNewSteps] = useState("");
  
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  let navigate = useNavigate();

  useEffect(() => {
    // axios.get(`http://localhost:3001/steps/${id}`).then((response) => {
    //   setSteps(response.data);
    // });

    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });

      axios.get(`http://localhost:3001/steps/${id}`).then((response) => {
      setSteps(response.data);
    });
  }, []);

  const addComment = () => {
    axios
      .post(
        "http://localhost:3001/comments",
        {
          commentBody: newComment,
          PostId: id,
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
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
       navigate("/");
      });
  };

    const showStep = () => {
       navigate(`/steps/${
        id}`);
    };

  return (
    <div className=" container row">
      <h1 className="text-center">Details</h1>
      <Card.Img
        variant="bottom"
        src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
        className="w-100 ms-5 "
      />

      <div className="leftSide">
        <div className="card" id="individual">
          <div className="card-header">
            <h1>{postObject.title}</h1>
          </div>
          <div className="card-body">
            <h2 className="">Ingridents</h2>
            <hr />
            <ul>
              <li>Lorem ipsum dolor sit amet.</li>
              <li className="li">Lorem ipsum dolor sit amet.</li>
              <li className="li">Lorem ipsum dolor sit amet.</li>
              <li className="li">Lorem ipsum dolor sit amet.</li>
            </ul>

            <div className="d-flex">
              <h2 className>Steps</h2>
              <button
                onClick={showStep}
                className="btn btn-primary ms-5 nav-btn"
              >
                +
              </button>
            </div>
            <hr />
            {steps.length <= 0 && (
              <>
                <h1>No Steps</h1>
                <p>You might want to add some steps</p>
              </>
            )}
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
                    <button
                      className=" ms-2 w-75"
                      onClick={() => {
                        deleteSteps(item.id);
                      }}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                  <div>
                    <button className=" ms-2 w-75">
                      <FontAwesomeIcon icon={faPencil} />
                    </button>
                  </div>
                </div>
              ))}
            </ol>
          </div>
        </div>

        <div className="footer">
          {postObject.username}
          {authState.username === postObject.username && (
            <button
              onClick={() => {
                deletePost(postObject.id);
              }}
            >
              Delete Post
            </button>
          )}
        </div>
      </div>
      <div className="rightSide card  w-50 m-5 pb-4">
        <div className="addCommentContainer ">
          <input
            type="text"
            className="w-75"
            placeholder="Comment..."
            autoComplete="off"
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment} className="rounded rounded-2">
            {" "}
            Add Comment
          </button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                <label> Username: {comment.username}</label>
                <p>{comment.commentBody}</p>
                {authState.username === comment.username && (
                  <button
                    className="w-50"
                    onClick={() => {
                      deleteComment(comment.id);
                    }}
                  >
                    X
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
