// src/pages/Login.js
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import {
  Form,
  Button,
  Alert,
  InputGroup,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { ACCESS_TOKEN } from "../Constants/accessTokens";
import { API_BASE_URL } from "../Constants/ apiConstants";
  
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();

  const login = async () => {
    setError("");
    if (!username || !password) {
      setError("Both username and password are required");
      return;
    }

    const data = { username, password };

    try {
      const response = await axios.post(`${API_BASE_URL}auth/login`, data);

      if (response.data.error) {
        setError(response.data.error);
      } else {
        localStorage.setItem(ACCESS_TOKEN, response.data.token);
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
        navigate("/");
      }
    } catch (error) {
      setError("An error occurred during login");
      console.error(error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center vh-100 bg-light"
    >
      <Row className="d-flex align-items-center justify-content-center w-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="shadow-lg">
            <Card.Body className="p-5">
              <h1
                className="text-center mb-4"
                style={{ fontSize: "2.5rem", fontWeight: "bold" }}
              >
                Login
              </h1>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form className="w-100">
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={togglePasswordVisibility}
                      className="w-25"
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </Button>
                  </InputGroup>
                </Form.Group>
                <Button
                  type="button"
                  className="btn btn-primary w-100 mt-3"
                  onClick={login}
                >
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
