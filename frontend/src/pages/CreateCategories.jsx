import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
 import { ACCESS_TOKEN } from "../Constants/accessTokens";
import { API_BASE_URL } from "../Constants/ apiConstants";

function CreateCategories() {

   const { authState } = useContext(AuthContext);
 
   let navigate = useNavigate();
   const initialValues = {
     category_name: "",
   };

   useEffect(() => {
     if (!localStorage.getItem(ACCESS_TOKEN)) {
       navigate("/login");
     }
   }, []);
   const validationSchema = Yup.object().shape({
     category_name: Yup.string().required("You must input a Title!"),
   });

   const onSubmit = (data) => {
     axios
       .post(`${API_BASE_URL}categories`, data, {
         headers: { accessToken: localStorage.getItem(ACCESS_TOKEN) },
       })
       .then((response) => {
         navigate("/");
       })
       .catch((error) => {
         if (error.response) {
           alert("400 error can't input same value");
         }
       });
   };

  return (
    <div>
      <div className="createPostPage d-flex flex-column align-items-center">
        <h1 className="text-center my-5">Create a category</h1>

        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form className="card card-body d-flex gap-3 p-5 w-75">
            <label>Category Name: </label>
            <ErrorMessage name="category_name" component="span" />
            <Field
              autocomplete="off"
              id="inputCreatePost"
              name="category_name"
              placeholder="(Ex. Title...)"
              className="form-control border border-2"
            />

            <button type="submit" className="btn btn-primary rounded rounded-3 w-100"> Create Categories</button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default CreateCategories
