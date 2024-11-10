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
import { ACCESS_TOKEN } from "./Constants/accessTokens";
import { API_BASE_URL } from "./Constants/ apiConstants";
import AllRecipes from "./pages/AllRecipes";
 
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
  const token = localStorage.getItem(ACCESS_TOKEN);

  console.log("Token from localStorage:", token);  

  if (token) {
    axios
      .get(`${API_BASE_URL}/auth/auth`, {
        headers: { accessToken: token },
      })
      .then((response) => {
        console.log("Auth response:", response.data);
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
          localStorage.removeItem(ACCESS_TOKEN);
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      })
      .catch((error) => {
        console.error("Error during token validation:", error);
        setAuthState({ ...authState, status: false });
        localStorage.removeItem(ACCESS_TOKEN);
      });
  } else {
    setAuthState({ ...authState, status: false });
  }
}, []);


  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    setAuthState({ username: "", id: 0, status: false });
    window.location.href = "/login";
  };

  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
       }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div>
            <Navbar expand="lg" className="bg-body-tertiary p-3">
              <Navbar.Brand href="#/">DishSwap</Navbar.Brand>
              <Navbar.Toggle
                aria-controls="basic-navbar-nav"
                className="w-25"
              />
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

                <div className="d-flex align-items-center">
                  {authState.status && authState.id ? (
                    <div className="loggedInContainer d-flex align-items-center gap-3">
                      <h5>
                        {authState.status && authState.id ? (
                          <Link
                            to={`/profile/${authState.id}`}
                            className="remove-style"
                          >
                            {authState.username}
                          </Link>
                        ) : (
                          <span>{authState.username}</span>
                        )}
                      </h5>
                      <button onClick={logout} className="logout-btn">
                        Logout
                      </button>
                    </div>
                  ) : null}
                </div>
              </Navbar.Collapse>
            </Navbar>
          </div>

          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/offline-recipes" exact element={<AllRecipes />} />

            <Route path="/your-recipes/:id" exact element={<YourRecipes />} />

            <Route path="/recipe/:id" exact element={<Recipe />} />
            <Route path="/steps/:id" element={<CreateSteps />} />
            <Route path="/createrecipe" exact element={<CreateRecipe />} />
            <Route
              path="/createcategories"
              exact
              element={<CreateCategories />}
            />

            <Route path="/edit/:id" exact element={<EditRecipe />} />
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
