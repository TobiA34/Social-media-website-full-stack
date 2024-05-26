import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import {
  BrowserRouter as BrowserRouter,
  Link,
  Route,
  Routes,
} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Post from './pages/Post';
 
function App() {

  return (
    <div>
      <BrowserRouter>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container fluid>
            <Navbar.Brand href="#">Comments Section</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: "100px" }}
                navbarScroll
              >
                <Link to="/" href="#action1">
                  Home
                </Link>
                <Link to="/createpost" href="#action2">
                  Create Post
                </Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/post/:id" exact element={<Post />} />

          <Route path="/createpost" exact element={<CreatePost />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
