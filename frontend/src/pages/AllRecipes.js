 import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { AuthContext } from "../helpers/AuthContext";
import Button from "react-bootstrap/Button";
 
function AllRecipes() {
      const [listOfPosts, setListOfPosts] = useState([]);
      const [likedPosts, setLikedPosts] = useState([]);
      const [show, setShow] = useState(false);
      const [newSteps, setNewSteps] = useState("");
      const [steps, setSteps] = useState([]);
      const { authState } = useContext(AuthContext);
      let navigate = useNavigate();

        const likeAPost = (postId) => {
          axios
            .post(
              "http://localhost:3001/likes",
              { PostId: postId },
              { headers: { accessToken: localStorage.getItem("accessToken") } }
            )
            .then((response) => {
              setListOfPosts(
                listOfPosts.map((post) => {
                  if (post.id === postId) {
                    if (response.data.liked) {
                      return { ...post, Likes: [...post.Likes, 0] };
                    } else {
                      const likesArray = post.Likes;
                      likesArray.pop();
                      return { ...post, Likes: likesArray };
                    }
                  } else {
                    return post;
                  }
                })
              );

              if (likedPosts.includes(postId)) {
                setLikedPosts(
                  likedPosts.filter((id) => {
                    return id !== postId;
                  })
                );
              } else {
                setLikedPosts([...likedPosts, postId]);
              }
            });
        };
  return (
    <div>
      <div className="container">
        <div className="row">
          {listOfPosts.map((value, key) => {
            return (
              <div
                key={key}
                className="col-lg-4 col-md-6 col-sm-12 mb-4 mt-4 d-flex"
              >
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{value.title}</h5>
                    <p className="card-text">{value.post}</p>
                    <p className="card-text">
                      Category: {value.Category.category_name}
                    </p>
                    <div className="d-flex justify-content-between">
                      <Link
                        to={`/profile/${value.UserId}`}
                        className="btn btn-link"
                      >
                        {value.username}
                      </Link>
                      <div className="d-flex align-items-center">
                        <ThumbUpAltIcon
                          onClick={() => {
                            likeAPost(value.id);
                          }}
                          className={
                            likedPosts.includes(value.id)
                              ? "unlikeBttn"
                              : "likeBttn"
                          }
                        />
                        <label className="ms-2">{value.Likes.length}</label>
                      </div>
                    </div>
                    <div className="mt-3 d-flex gap-5 justify-content-between align-items-center">
                      <Button
                        variant="dark"
                        onClick={() => {
                          navigate(`/post/${value.id}`);
                        }}
                      >
                        View Recipe
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => {
                          navigate(`/steps/${value.id}`);
                        }}
                      >
                        Add Steps
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AllRecipes
