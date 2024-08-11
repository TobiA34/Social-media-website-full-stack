import React from 'react'
 import { Field, Form, Formik, FormikProps } from 'formik';
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";


function Categories() {
  const [listOfCategories, setListOfCategories] = useState([]);

  let { id } = useParams();


  useEffect(() => {
    axios.get(`http://localhost:3001/categories/byuserId/${id}`).then((response) => {
      setListOfCategories(response.data);
      console.log(id)
    });
  }, []);
  return (
    <div>
      <Field as="select" name="categories">
        <option value="none">None</option>
        {listOfCategories.map((item, index) => (
          <option value={item} key={index}>{item.category_name}</option>
        ))}
      </Field>
    </div>
  );
}

export default Categories
