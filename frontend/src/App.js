import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
import CreateRecipe from "./pages/CreateRecipe";
import Recipe from "./pages/Recipe";
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
import CreateSteps from "./pages/CreateSteps";
import YourRecipes from "./pages/YourRecipes";
import EditRecipe from "./pages/EditRecipe";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import UpdateImage from "./pages/UpdateImage";
import FooterComp from "./Components/FooterComp";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



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
    window.location.href = "/login";
  };

  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Any resize-related operations here
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div>
            <Navbar expand="lg" className="bg-body-tertiary">
              <Navbar.Brand href="#/">DishSwap</Navbar.Brand>
              <Navbar.Toggle
                aria-controls="basic-navbar-nav"
                className="w-25"
              />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto w-100 justify-content-center">
                  {" "}
                  {/* Centering Nav items */}
                  {!authState.status ? (
                    <>
                      <Link
                        to="/registration"
                        className="remove-style fs-5 mx-3"
                      >
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

                {/* Aligning loggedInContainer to the right */}
                <div className="d-flex align-items-center">
                  {authState.status && (
                    <div className="loggedInContainer d-flex align-items-center gap-3">
                      <h5 onClick={handleShow}>
                        <Link to={`/profile/${authState.id}`}>{authState.username}</Link>
                      </h5>
                      <button
                        onClick={logout}
                        className="btn btn-outline-danger"
                      >
                        Logout
                      </button>
                    </div>
                  )}

                  {/* Profile Modal */}
                  {/* <Modal show={show} onHide={handleClose} className="w-100">
                    <Modal.Header closeButton>
                      <Modal.Title>Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Profile />
                    </Modal.Body>
                  </Modal> */}
                </div>
              </Navbar.Collapse>
            </Navbar>
          </div>

          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/your-recipes/:id" exact element={<YourRecipes />} />
            <Route path="/recipe/:id" exact element={<Recipe />} />
            <Route path="/steps/:id" element={<CreateSteps />} />
            <Route path="/createrecipe" exact element={<CreateRecipe />} />
            <Route
              path="/createcategories"
              exact
              element={<CreateCategories />}
            />
            <Route path="/update-img/:id" exact element={<UpdateImage />} />

            <Route path="/edit/:id" exact element={<EditRecipe />} />
            <Route path="/home/:id" exact element={<Home />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/registration" exact element={<Registration />} />
            <Route path="/profile/:id" exact element={<Profile />} />
            <Route path="*" exact element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
      <FooterComp/>
    </div>
  );
}

export default App;
