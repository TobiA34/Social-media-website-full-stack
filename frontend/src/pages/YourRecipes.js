import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { AuthContext } from "../helpers/AuthContext";
import PaginationComponent from "../Components/Pagination";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";
import CreateRecipe from "./CreateRecipe";

library.add(fas);

function YourRecipes() {
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();
  const [listOfRecipes, setListOfRecipes] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortState, setSortState] = useState("none");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipe/v2/your-recipes/${authState.id}`,
          {
            params: { limit, page },
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        );

        const {
          listOfRecipes: listOfRecipes,
          totalRecipes: totalRecipes,
          likedRecipes: likedRecipes,
          totalPages,
        } = response.data;

        setListOfRecipes(listOfRecipes);
        setTotalRecipes(totalRecipes);
        setLikedRecipes(likedRecipes.map((like) => like.RecipeId));
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, [page, limit]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleItemsPerPageChange = (event) => {
    setLimit(Number(event.target.value));
    setPage(1);
  };

    function MyVerticallyCenteredModal(props) {
      return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <CreateRecipe onHide={props.onHide} />
          </Modal.Body>
        </Modal>
      );
    }

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };

    // const likeAPost = (postId) => {
    // axios
    //   .post(
    //     "http://localhost:3001/likes",
    //     { PostId: postId },
    //     { headers: { accessToken: localStorage.getItem("accessToken") } }
    //   )
    //   .then((response) => {
    //     setListOfRecipes(
    //       listOfRecipes.map((post) => {
    //         if (post.id === postId) {
    //           if (response.data.liked) {
    //             return { ...post, Likes: [...post.Likes, 0] };
    //           } else {
    //             const likesArray = post.Likes;
    //             likesArray.pop();
    //             return { ...post, Likes: likesArray };
    //           }
    //         } else {
    //           return post;
    //         }
    //       })
    //     );
    //   });
    // };
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
        setListOfRecipes((prevRecipes) =>
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
  const loadMore = () => {
    setLimit(limit + 5);
  };
 
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
      console.log("Bookmark status updated successfully");
    } catch (error) {
      console.error("Error updating bookmark status:", error);
      // Optionally revert state change if API call fails
      setBookmarkedRecipes(bookmarkedRecipes); // Reset to previous state on failure
    }
  };

  const uniqueCategories = [
    ...new Set(
      listOfRecipes
        .map((recipe) => recipe.Category?.category_name)
        .filter((category) => category) 
    ),
  ];
  

  let filteredRecipes = (listOfRecipes || [])
    .filter((recipe) =>
      recipe.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((recipe) =>
      selectedCategory === "All Categories"
        ? true
        : recipe.Category && recipe.Category.category_name === selectedCategory
    );

  // Apply sorting based on sortState
  if (sortState === "ascending") {
    filteredRecipes = filteredRecipes.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  } else if (sortState === "descending") {
    filteredRecipes = filteredRecipes.sort((a, b) =>
      b.title.localeCompare(a.title)
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalRecipes);

  return (
    <div className="container mt-4">
      {localStorage.getItem("accessToken") && (
        <>
          <div className="d-flex justify-content-between align-items-center ">
            <div>
              <h1 className="my-4">Your Recipes</h1>
            </div>
            <div>
              <Button variant="primary" onClick={() => setModalShow(true)}>
                <FontAwesomeIcon icon={faPlus} />
              </Button>
              <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
            </div>
          </div>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search for a recipe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="d-flex justify-content-between mb-3 gap-2">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="All Categories">All Categories</option>
              {uniqueCategories.map((category, key) => (
                <option key={key} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              className="form-select"
              defaultValue="none"
              onChange={(e) => setSortState(e.target.value)}
            >
              <option value="none" disabled>
                Sort
              </option>
              <option value="ascending">Ascending</option>
              <option value="descending">Descending</option>
            </select>

            <select
              className="form-select"
              value={limit}
              onChange={handleItemsPerPageChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>

          {/* List of Recipes */}
          <div className="row my-4">
            {filteredRecipes.map((value, key) => (
              <div key={key} className="col-12 col-md-6 col-lg-4 mb-4 my-3">
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
                      bookmarkedRecipes.includes(value.id) ? "bookmarked" : ""
                    }`}
                    style={{
                      color: bookmarkedRecipes.includes(value.id)
                        ? "red"
                        : "grey",
                    }} // Change color based on bookmark status
                  >
                    <FontAwesomeIcon icon="heart" />
                  </i>
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
            ))}
          </div>

          <PaginationComponent
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />

          <button onClick={loadMore} className="btn btn-secondary mt-4">
            Load More
          </button>
        </>
      )}
      <h1 className="mt-2">
        Showing recipes {endIndex} of {totalRecipes}
      </h1>
    </div>
  );
}

export default YourRecipes;



