import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
 
function CreateCategories() {

   const { authState } = useContext(AuthContext);
 
   let navigate = useNavigate();
   const initialValues = {
     category_name: "",
   };

   useEffect(() => {
     if (!localStorage.getItem("accessToken")) {
       navigate("/login");
     }
   }, []);
   const validationSchema = Yup.object().shape({
     category_name: Yup.string().required("You must input a Title!"),
   });

   const onSubmit = (data) => {
     axios
       .post("http://localhost:3001/categories", data, {
         headers: { accessToken: localStorage.getItem("accessToken") },
       })
       .then((response) => {
         navigate("/");
       }).catch((error) => {
                if (error.response){
                    alert("400 error can't input same value");
                } 
       });
   };

  return (
    <div>
      <div className="createPostPage">
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form className="formContainer">
            <label>Category Name: </label>
            <ErrorMessage name="category_name" component="span" />
            <Field
              autocomplete="off"
              id="inputCreatePost"
              name="category_name"
              placeholder="(Ex. Title...)"
            />

            <button type="submit"> Create Categories</button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default CreateCategories
