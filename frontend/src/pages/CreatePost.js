import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
 
function CreatePost() {
   const { authState } = useContext(AuthContext);
  const [listOfCategories, setListOfCategories] = useState([]);

  const [categoryId, setCategoryId] = useState(null);

   const initialValues = {
     title: "",
     post: "",
      CategoryId: undefined,
   };
 
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
    axios.get("http://localhost:3001/categories").then((response) => {
       setListOfCategories(response.data);
      });
 
    

  }, []);
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You must input a Title!"),
    post: Yup.string().required(),
      
  });
 


  const onSubmit = (data) => {
    axios
      .post("http://localhost:3001/posts", data,  {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        navigate("/");
      });
    console.log(data);   
  }

const updateDropdown = (event) => {
     const selectedCategoryId = event.target.options.selectedIndex;
     console.log(
       event.target.options[selectedCategoryId].getAttribute("data-key")
     );
     setCategoryId(selectedCategoryId);
     console.log(selectedCategoryId)
     console.log(initialValues);
 };

 
  return (
    <div className="createPostPage d-flex flex-column">
      <h1 className="my-5">Create A Post</h1>

      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReintialize={true}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Title: </label>
          <ErrorMessage name="title" component="span" />
          <Field
            autocomplete="off"
            id="inputCreatePost"
            name="title"
            placeholder="(Ex. Title...)"
          />
          <label>Post: </label>
          <ErrorMessage name="post" component="span" />
          <Field
            autocomplete="off"
            id="inputCreatePost"
            name="post"
            placeholder="(Ex. Post...)"
          />

          <Field
            component="select"
            id="CategoryId"
            name="CategoryId"
            multiple={false}
          >
            <option value="">None</option>
            {listOfCategories.map((item, index) => (
              <option value={item.id} onChange={updateDropdown}>
                {item.category_name}
              </option>
            ))}
          </Field>

          {initialValues.categoryId !== null && (
            <p>category id: {initialValues.categoryId}</p>
          )}

          <button type="submit">Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
