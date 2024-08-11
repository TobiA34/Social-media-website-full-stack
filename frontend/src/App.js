import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
 import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import CreateCategories from "./pages/CreateCategories";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

function App() {
 
   const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
   };

  return (
    <div className="">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router> 
          <div>
            <Navbar expand="lg" className="bg-body-tertiary">
              <Navbar.Brand href="#/">DishSwap</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  {!authState.status ? (
                    <>
                      <Link to="/registration" className="remove-style">
                        {" "}
                        Registration
                      </Link>
                      <Link to="/login" className="remove-style">
                        {" "}
                        login
                      </Link>
                    </>
                  ) : (
                    <>
                      <Nav.Link as={Link} to="/" className="remove-style">
                        Home Page
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="/createpost"
                        className="remove-style"
                      >
                        Create Post
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="/createcategories"
                        className="remove-style"
                      >
                        Create categories
                      </Nav.Link>
                    </>
                  )}
                </Nav>
                <div className="loggedInContainer">
                  <h1>{authState.username} </h1>
                  {authState.status && (
                    <button onClick={logout}> Logout</button>
                  )}
                </div>
              </Navbar.Collapse>
            </Navbar>
          </div>

          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/post/:id" exact element={<Post />} />
            <Route path="/createpost" exact element={<CreatePost />} />
            <Route
              path="/createcategories"
              exact
              element={<CreateCategories />}
            />
            <Route path="/home/:id" exact element={<Home />} />

            <Route path="/login" exact element={<Login />} />
            <Route path="/registration" exact element={<Registration />} />
            <Route path="/profile/:id" exact element={<Profile />} />
            <Route path="*" exact element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
