// src/Components/Navbar.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { AuthContext } from "../helpers/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "../Navbar.css";  

const NavigationBar = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { authState, setAuthState } = useContext(AuthContext);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
    window.location.href = "/login";
  };

  return (
    <Navbar
      expand="lg"
      className={`navbar ${
        darkMode
          ? "navbar-dark bg-dark navbar-dark-mode"
          : "navbar-light bg-light navbar-light-mode"
      }`}
    >
      <Navbar.Brand href="#/">DishSwap</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" className="w-25" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto w-100 justify-content-center align-items-center">
          {!authState.status ? (
            <>
              <Nav.Link
                as={Link}
                to="/offline-recipes"
                className="remove-style mx-3 fs-5"
              >
                Offline Recipes
              </Nav.Link>
              <Link to="/registration" className="remove-style fs-5 mx-3">
                Registration
              </Link>
              <Link to="/login" className="remove-style fs-5 mx-3">
                Login
              </Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/" className="remove-style mx-3">
                All Recipes
              </Nav.Link>
              <Nav.Link
                as={Link}
                to={`/your-recipes/${authState.id}`}
                className="remove-style mx-3"
              >
                Your Recipes
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/createcategories"
                className="remove-style mx-3"
              >
                Create Categories
              </Nav.Link>
            </>
          )}
        </Nav>

        <div className="d-flex align-items-center">
          {authState.status && authState.id ? (
            <div className="loggedInContainer d-flex align-items-center gap-3">
              <h5>
                {authState.username && (
                  <Link
                    to={`/profile/${authState.id}`}
                    className="remove-style"
                  >
                    {authState.username}
                  </Link>
                )}
              </h5>
              <button onClick={logout} className="logout-btn btn btn-danger">
                Logout
              </button>
            </div>
          ) : null}
          <button
            className="btn btn-outline-primary ms-3"
            onClick={toggleTheme}
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
