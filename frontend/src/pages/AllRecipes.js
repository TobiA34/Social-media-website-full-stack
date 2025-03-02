import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import PaginationComponent from "../Components/Pagination";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../context/ThemeContext"; // Import dark mode context

import "../App.css";
import HeroSection from "../Components/Hero";
import { API_BASE_URL } from "../Constants/ apiConstants";
import "../Navbar.css";

library.add(fas);

function AllRecipes() {
  const { authState } = useContext(AuthContext);
  const { darkMode } = useTheme(); // Get darkMode from ThemeContext
  let navigate = useNavigate();
  
  const [listOfRecipes, setListOfRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortState, setSortState] = useState("none");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}recipe/v2/offline?limit=${limit}&page=${page}`
        );

        const { listOfRecipes, totalRecipes, totalPages } = response.data;
        setListOfRecipes(listOfRecipes || []);
        setTotalRecipes(totalRecipes || 0);
        setTotalPages(totalPages || 0);
      } catch (error) {
        console.error("Error fetching recipes:", error.response || error.message);
      }
    };

    fetchRecipes();
  }, [page, limit]);

  const handlePageChange = (pageNumber) => setPage(pageNumber);
  const handleItemsPerPageChange = (event) => {
    setLimit(Number(event.target.value));
    setPage(1);
  };
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };

  // Filter and sort recipes
  let filteredRecipes = listOfRecipes
    .filter((recipe) => recipe.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((recipe) =>
      selectedCategory === "All Categories"
        ? true
        : recipe.Category?.category_name === selectedCategory
    );

  if (sortState === "ascending") {
    filteredRecipes.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortState === "descending") {
    filteredRecipes.sort((a, b) => b.title.localeCompare(a.title));
  }

  return (
    <div className={`container-fluid vh-auto vw-100 mt-4 p-4 ${darkMode ? "dark-mode" : "light-mode"}`}>
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <h1 className={`fs-3 ${darkMode ? "text-light" : "text-dark"}`}>
        <strong>All Recipes</strong>
      </h1>

      <div className="d-flex justify-content-between mb-3 gap-2">
        <select
          className={`form-select ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`}
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="All Categories">All Categories</option>
          {[
            ...new Set(listOfRecipes.map((recipe) => recipe.Category?.category_name).filter(Boolean)),
          ].map((category, key) => (
            <option key={key} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          className={`form-select ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`}
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
          className={`form-select ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`}
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
            <div className={`rounded-card ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`}>
              <img src={value.avatar} className="w-100 rounded-card-img" alt={value.title} />
              <div className="recipe-card-content">
                <div className={`d-flex justify-content-between p-3 rounded-card ${darkMode ? "bg-secondary" : "bg-light"}`}>
                  <p className="recipe-title fs-5">
                    <strong>{value.title}</strong>
                  </p>
                  <div className="d-flex align-items-center">
                    <button
                      className={`rounded-btn ${darkMode ? "btn-outline-light" : "btn-outline-dark"}`}
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

      <PaginationComponent totalPages={totalPages} currentPage={page} onPageChange={handlePageChange} />

      <button className={`btn mt-4 ${darkMode ? "btn-light" : "btn-secondary"}`} onClick={() => setLimit(limit + 5)}>
        Load More
      </button>
      <h1 className={`mt-2 ${darkMode ? "text-light" : "text-dark"}`}>
        Showing recipes {filteredRecipes.length} of {totalRecipes}
      </h1>
    </div>
  );
}

export default AllRecipes;