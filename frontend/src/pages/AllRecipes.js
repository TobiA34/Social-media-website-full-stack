import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import PaginationComponent from "../Components/Pagination";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

import "../App.css";
import HeroSection from "../Components/Hero";
import { API_BASE_URL } from "../Constants/ apiConstants";
 
library.add(fas);

function AllRecipes() {
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();
  const [listOfRecipes, setListOfRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortState, setSortState] = useState("none");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);

  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalRecipes);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}recipe/v2/offline?limit=${limit}&page=${page}`
        );

        console.log("API response:", response.data); // Log API response to inspect structure

        const { listOfRecipes, totalRecipes, totalPages } = response.data;

        setListOfRecipes(
          listOfRecipes.map((recipe) => ({
            ...recipe,
          }))
        );
        setTotalRecipes(totalRecipes || 0);
        setTotalPages(totalPages || 0);
      } catch (error) {
        console.error(
          "Error fetching recipes:",
          error.response || error.message
        );
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

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };

  const loadMore = () => {
    setLimit(limit + 5);
  };

  // Get unique categories for filter dropdown
  const uniqueCategories = [
    ...new Set(
      listOfRecipes
        .map((recipe) => recipe.Category?.category_name)
        .filter((category) => category)
    ),
  ];

  // Filter and sort recipes
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

  return (
    <div className=" container  container-fluid vh-auto vw-100  mt-4 p-4 remove-bg">
      
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
      <h1 className="mt-2">
        Showing recipes {endIndex} of {totalRecipes}
      </h1>
    </div>
  );
}

export default AllRecipes;
