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
import HeroSection from "../Components/Hero";
import { ACCESS_TOKEN } from "../Constants/accessTokens";
import { API_BASE_URL } from "../Constants/ apiConstants";

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
          `${API_BASE_URL}recipe/v2/your-recipes/${authState.id}`,
          {
            params: { limit, page },
            headers: {
              accessToken: localStorage.getItem(ACCESS_TOKEN),
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
     
  const deleteRecipe = (id) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);

    if (!accessToken) {
      console.error("User not logged in!");
      return;
    }

    console.log("Deleting recipe with ID:", id);
    axios
      .delete(`${API_BASE_URL}recipe/${id}`, {
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

     const updatedBookmarks = alreadyBookmarked
      ? bookmarkedRecipes.filter((id) => id !== recipeId)  
      : [...bookmarkedRecipes, recipeId];  

    setBookmarkedRecipes(updatedBookmarks);  

     localStorage.setItem("bookmarkedRecipes", JSON.stringify(updatedBookmarks));

     try {
      await axios.put(`${API_BASE_URL}recipe/${recipeId}/bookmark`, {
        isBookedMarked: !alreadyBookmarked,
      });
      console.log("Bookmark status updated successfully");
    } catch (error) {
      console.error("Error updating bookmark status:", error);
  
      setBookmarkedRecipes(bookmarkedRecipes); 
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
      {localStorage.getItem(ACCESS_TOKEN) && (
        <>
          <HeroSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <h1 className="  fs-3">
            <strong>All Recipes</strong>
          </h1>
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
                {/* <div className="card h-100">
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
                    className="img-fluid .rounded-card-img"
                    alt=""
                    onClick={() => navigate(`/recipe/${value.id}`)}
                  />

                  <div className="card-footer text-center d-flex gap-3">
                    <div className="card-body d-flex justify-content-between">
                      <FontAwesomeIcon
                        icon="pencil-alt"
                        onClick={() => navigate(`/edit/${value.id}`)}
                      />

                      <div ref={ref}>
                        <Button onClick={handleClick} className="share-btn">
                          {" "}
                          <FontAwesomeIcon
                            icon="share"
                            className="share"
                            onClick={() => shareRecipe()}
                          />
                        </Button>

                        <Overlay
                          show={show}
                          target={target}
                          placement="top"
                          container={ref}
                          containerPadding={20}
                        >
                          <Popover id="popover-contained">
                            <Popover.Header as="h3">Share</Popover.Header>
                            <Popover.Body className="d-flex my-2 gap-1 p-4">
                              <FacebookShareButton
                                url="www.google.com"
                                quote={"hey subscribe"}
                                title="test123"
                                hashtag="#dishswap"
                              >
                                <FacebookIcon
                                  size={70}
                                  round={true}
                                ></FacebookIcon>
                              </FacebookShareButton>
                              <WhatsappShareButton
                                url="www.google.com"
                                quote={"hey subscribe"}
                                title="test123"
                                hashtag="#dishswap"
                              >
                                <WhatsappIcon
                                  size={70}
                                  round={true}
                                ></WhatsappIcon>
                              </WhatsappShareButton>

                              <EmailShareButton
                                url={shareUrl}
                                subject={value.title}
                                body={value.desc}
                                className="Demo__some-network__share-button"
                              >
                                <EmailIcon size={70} round />
                              </EmailShareButton>
                            </Popover.Body>
                          </Popover>
                        </Overlay>
                      </div>

                      <FontAwesomeIcon
                        icon="trash"
                        onClick={() => deleteRecipe(value.id)}
                      />
                    </div>
                  </div>
                </div> */}

                <div className="rounded-card remove-bg ">
                  <img src={value.avatar} className="w-100 rounded-card-img " />
                  <div className="recipe-card-content">
                    <div className="d-flex justify-content-between p-3  bg-light rounded-card">
                      <p className="recipe-title fs-5 ">
                        <strong>{value.title}</strong>
                      </p>
                      <div className="d-flex align-items-center ">
                        <button
                          className="rounded-btn "
                          onClick={() => navigate(`/recipe/${value.id}`)}
                        >
                          View recipe <span>→</span>
                        </button>
                      </div>
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



