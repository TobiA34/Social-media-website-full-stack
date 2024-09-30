import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { AuthContext } from "../helpers/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import PaginationComponent from "../Components/Pagination";

function Home() {
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortState, setSortState] = useState("none");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

useEffect(() => {
  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/posts/v2?limit=${limit}&page=${page}`,  
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      );

      const {
        listOfPosts,
        totalPosts,
        likedPosts,
        totalPages,
      } = response.data;

      setListOfPosts(listOfPosts);
      setTotalPosts(totalPosts);
      setLikedPosts(likedPosts.map((like) => like.PostId));
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  fetchPosts();
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

  
  let filteredPosts = listOfPosts
    .filter((post) =>
      post.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((post) =>
      selectedCategory === "All Categories"
        ? true
        : post.Category && post.Category.category_name === selectedCategory
    );

   if (sortState === "ascending") {
    filteredPosts = filteredPosts.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  } else if (sortState === "descending") {
    filteredPosts = filteredPosts.sort((a, b) =>
      b.title.localeCompare(a.title)
    );
  }

  const startIndex = (page - 1) * limit;  
  const endIndex = Math.min(startIndex + limit, totalPosts);  
  
  return (
    <div className="container mt-4">
      {localStorage.getItem("accessToken") && (
        <>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search for a recipe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="d-flex justify-content-between mb-3">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="All Categories">All Categories</option>
              {filteredPosts.map((item, key) => (
                <option key={key} value={item.category_name}>
                  {item.category_name}
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

          <div className="row">
            {filteredPosts.map((value, key) => (
              <div key={key} className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="card">
                  <div className="card-header d-flex justify-content-between">
                    <h5 className="card-title">{value.title}</h5>
                    <span className="d-flex badge bg-danger rounded-4 align-items-center">
                      {value.Category.category_name}
                    </span>
                  </div>
                  <div className="card-body">
                    <p className="card-text">{value.post}</p>
                  </div>
                  <div className="card-footer d-flex justify-content-between align-items-center">
                    <Link
                      to={`/profile/${value.UserId}`}
                      className="link-primary"
                    >
                      {value.username}
                    </Link>
                    <div className="d-flex align-items-center">
                      <ThumbUpAltIcon
                        onClick={() => likeAPost(value.id)}
                        className={`like-icon ${
                          likedPosts.includes(value.id) ? "liked" : ""
                        }`}
                      />
                      <span>{value.Likes.length}</span>
                    </div>
                  </div>
                  <div className="card-footer text-center">
                    <button
                      onClick={() => navigate(`/post/${value.id}`)}
                      className="btn btn-info w-50"
                    >
                      View Recipe
                    </button>
                    <button
                      onClick={() => navigate(`/steps/${value.id}`)}
                      className="btn btn-success w-50"
                    >
                      Add Steps
                    </button>
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
        Showing posts {endIndex} of {totalPosts}
      </h1>
    </div>
  );
}

export default Home;
