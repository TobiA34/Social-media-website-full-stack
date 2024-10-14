import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Alert, InputGroup, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

function Registration() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [validated, setValidated] = useState(false);
  let navigate = useNavigate();

  const register = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      const data = { name: name, username: username, password: password };
      console.log("Sending registration data:", data);
      axios.post("http://localhost:3001/auth", data)
        .then((response) => {
          console.log("Registration response:", response.data);
          navigate("/login");
          alert("Registration successful");
        })
        .catch((error) => {
          console.error("Registration error:", error.response ? error.response.data : error.message);
          setError(error.response && error.response.data.message ? error.response.data.message : "Registration failed. Please try again.");
        });
    }
    setValidated(true);
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <Row className="justify-content-center w-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="shadow-lg">
            <Card.Body className="p-5">
              <h1 className="text-center mb-4" style={{fontSize: "2.5rem", fontWeight: "bold"}}>Create your account</h1>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form className="w-100" noValidate validated={validated} onSubmit={register}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                    maxLength={50}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your name (2-50 characters).
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength={8}
                    className="w-100"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please choose a username (minimum 8 characters).
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <InputGroup className="w-100">
                    <Form.Control
                      placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-100"
                    />
                 
                    <Form.Control.Feedback type="invalid">
                      Please enter a password (minimum 8 characters).
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mt-3"
                >
                  Register
                </Button>
                <p className="text-center mt-3">Already have an account? <Link to="/login" className="text-decoration-none"><strong>Sign in</strong></Link></p>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Registration;
