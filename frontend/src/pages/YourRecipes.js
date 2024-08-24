import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { AuthContext } from "../helpers/AuthContext";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons";

function YourRecipes() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Add searchQuery state
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios
        .get(`http://localhost:3001/posts/your-recipes/${authState.id}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfPosts(response.data.listOfPosts);
        //   setLikedPosts(
        //     response.data.likedPosts.map((like) => {
        //       return like.PostId;
        //     })
        //   );
        });
    }
  }, [authState.id, navigate]);

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

  // Filter posts based on the search query
  const filteredPosts = listOfPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      {localStorage.getItem("accessToken") && (
        <>
          <h1 className="my-5">Your Recipes: {authState.username}</h1>
          <h1>Your id: {authState.id} </h1>
          <input
            type="text"
            className="form-control input w-100 rounded my-2"
            placeholder="Search for a recipe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state on input change
          />
          <div className="row">
            {filteredPosts.map((value, key) => (
              <div
                key={key}
                className="col-lg-4 col-md-6 col-sm-12 mb-4 mt-4 d-flex"
              >
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h5 className="card-title">{value.title}</h5>
                      <div className="card-text btn btn-danger rounded-5 pill">
                        <h1>{value.Category.category_name}</h1>
                      </div>
                    </div>
                    <p className="card-text">{value.post}</p>

                    <div className="d-flex justify-content-between">
                      <Link
                        to={`/profile/${value.UserId}`}
                        className="btn btn-link"
                      >
                        {value.username}
                      </Link>
                      <div className="d-flex align-items-center">
                        <ThumbUpAltIcon
                          onClick={() => likeAPost(value.id)}
                          className={
                            likedPosts.includes(value.id)
                              ? "unlikeBttn"
                              : "likeBttn"
                          }
                        />
                        <label className="ms-2">{value.Likes.length}</label>
                        <FontAwesomeIcon icon={faStar} className="ms-3" />
                      </div>
                    </div>
                    <div className="mt-3 d-flex gap-5 justify-content-between align-items-center">
                      <Button
                        variant="dark"
                        onClick={() => navigate(`/post/${value.id}`)}
                      >
                        View Recipe
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => navigate(`/steps/${value.id}`)}
                      >
                        Add Steps
                      </Button>
                    </div>
                    <h1>UserID:{value.UserId}</h1>
                    <h1>PostID:{value.id}</h1>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default YourRecipes;
