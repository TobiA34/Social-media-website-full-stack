import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';

function CreateRecipe({ onHide }) {
  const { authState } = useContext(AuthContext);
  const [listOfCategories, setListOfCategories] = useState([]);
  const [error, setError] = useState("");
  const [duration, setDuration] = useState(["10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "60"]);
  const initialValues = {
    title: "",
    recipe: "",
    calories: 0,
    servings: "",
    duration: 0,
    CategoryId: "",
  };

  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
    axios.get("http://localhost:3001/categories").then((response) => {
      setListOfCategories(response.data);
    }).catch((error) => {
      console.error("Error fetching categories:", error);
    });
  }, [navigate]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You must input a Title!"),
    recipe: Yup.string().required("You must input a Recipe!"),
    CategoryId: Yup.string().required("You must select a Category!"),
    calories: Yup.number().min(1, "Calories must be at least 1").max(1000, "Calories must be at most 1000").required("You must input Calories!"),
    servings: Yup.number().min(1, "Servings must be at least 1").max(10, "Servings must be at most 10").required("You must input Servings!"),
    duration: Yup.number().min(1, "Duration must be at least 1").max(120, "Duration must be at most 120").required("You must input Duration!"),
  });

  const onSubmit = (data) => {
    axios
      .post("http://localhost:3001/recipe", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        console.log("Recipe created:", response.data);
        onHide(); // Close the modal upon successful creation
        window.location.reload(); // Refresh the page after recipe creation
      })
      .catch((error) => {
        console.error("Error creating recipe:", error);
        setError("Failed to create recipe. Please try again.");
      });
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <h1 className="text-center mb-4" style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
            Create A Recipe
          </h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            {({ setFieldValue }) => (
              <Form className="w-100">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <ErrorMessage name="title" component="span" className="text-danger" />
                  <Field className="form-control" autoComplete="off" name="title" placeholder="(Ex. Title...)" />
                </div>
                <div className="mb-3">
                  <label htmlFor="calories" className="form-label">Calories</label>
                  <ErrorMessage name="calories" component="span" className="text-danger" />
                  <Field className="form-control" autoComplete="off" name="calories" placeholder="(Ex. Calories...)" type="number" min="1" max="1000" />
                </div>
                <div className="mb-3">
                  <label htmlFor="servings" className="form-label">Servings</label>
                  <ErrorMessage name="servings" component="span" className="text-danger" />
                  <Field className="form-control" autoComplete="off" name="servings" placeholder="(Ex. Servings...)" type="number" min="1" max="10" />
                </div>
                <div className="mb-3">
                  <label htmlFor="duration" className="form-label">Duration</label>
                  <ErrorMessage name="duration" component="span" className="text-danger" />
                  <Field as="select" className="form-control" name="duration" onChange={(e) => setFieldValue("duration", e.target.value)}>
                    <option value="">None</option>
                    {Array.isArray(duration) && duration.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </Field>
                </div>
                <div className="mb-3">
                  <label htmlFor="recipe" className="form-label">Recipe</label>
                  <ErrorMessage name="recipe" component="span" className="text-danger" />
                  <Field className="form-control" autoComplete="off" name="recipe" placeholder="(Ex. Recipe...)" />
                </div>
                <div className="mb-3">
                  <label htmlFor="CategoryId" className="form-label">Category</label>
                  <ErrorMessage name="CategoryId" component="span" className="text-danger" />
                  <Field as="select" className="form-control" name="CategoryId" onChange={(e) => setFieldValue("CategoryId", e.target.value)}>
                    <option value="">None</option>
                    {listOfCategories.map((item) => (
                      <option key={item.id} value={item.id}>{item.category_name}</option>
                    ))}
                  </Field>
                </div>
                <Button type="submit" className="btn btn-primary w-100 mt-3">Create Recipe</Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateRecipe;
