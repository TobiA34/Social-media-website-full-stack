import React from 'react'
import axios from "axios";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import {Formik, Form, Field, ErrorMessage} from "formik";
import { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


function Home() {

      const [listOfPosts, setListOfPosts] = useState([]);

      useEffect(() => {
        axios.get("http://localhost:3001/posts").then((response) => {
          console.log(response.data);
          setListOfPosts(response.data);
        });
      }, []);

  return (
    <main>
        <h1 className='text-center'>Posts</h1>
      <Row xs={1} md={2} xl={3} className="g-4 my-5">
        {listOfPosts.map((item, index) => (
          <Col key={index}>
            <div className="brand">
              <Card className="d-flex justify-content-end flex-row p-5 ">

                <Card.Body className="p-0">
                  <div className="p-2">
                    <div className="justify-content-start align-items-start">
                      <Card.Header className='bg-danger'>
                        <Card.Title
                          bg="primary"
                          className="justify-content-start align-items-start mt-4 "
                        >
                          {item.title}
                        </Card.Title>
                      </Card.Header>
                    </div>

                    <Card.Text className='py-5 ms-2'>
                      <div className="d-flex">
                        <h6>{item.postText}</h6>
                      </div>
                    </Card.Text>

                    <Card.Footer className="bg-primary">
                      <Card.Text>
                        <div className="d-flex">
                          <h6>{item.username}</h6>
                        </div>
                      </Card.Text>
                    </Card.Footer>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        ))}
      </Row>
    </main>
  );
}

export default Home
