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
import NavigationBar from "./Components/Navigationbar";
import { useTheme } from "./context/ThemeContext";
import "./Navbar.css";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });
  const { darkMode, toggleTheme } = useTheme();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

useEffect(() => {
const ACCESS_TOKEN = "accessToken";
let token = null;

try {
  token =
    localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
} catch (error) {
  console.log("🚫 localStorage blocked, token retrieval failed:", error);
}

if (token) {
  console.log("🔍 Checking token:", token);

  axios
    .get(`${API_BASE_URL}/auth`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      console.log("✅ Auth success:", response.data);

      if (response.data?.error) {
        console.warn("⚠️ Authentication error:", response.data.error);
        setAuthState({ username: "", id: null, status: false });
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
      console.error("❌ Auth failed:", error);

      if (error.response) {
        const status = error.response.status;

        if (status === 404) {
          console.error("🔎 API endpoint not found! Check API_BASE_URL.");
        } else if (status === 401) {
          console.warn("🚫 Unauthorized! Token may be expired.");
          localStorage.removeItem(ACCESS_TOKEN);
        } else {
          console.warn("⚠️ Server error:", status, error.response.data);
        }
      } else {
        console.error("🌐 No response received. Check network/API server.");
      }

      setAuthState({ username: "", id: null, status: false });
      localStorage.removeItem(ACCESS_TOKEN);
    });
} else {
  console.warn("⚠️ No token found. User not logged in.");
  setAuthState({ username: "", id: null, status: false });
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
    <div
      className={`row my-4 navbar ${
        darkMode
          ? "navbar-dark bg-dark navbar-dark-mode"
          : "navbar-light bg-light navbar-light-mode"
      }`}
    >
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div>
            <NavigationBar />
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
