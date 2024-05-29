import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 
'react-router-dom'
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";


   function Post() {
    const[post,setPost] = useState({});
  const [comments, setComments] = useState([]);
 const [newComment, setNewComment] = useState("");

    let {id} = useParams()
 useEffect(() => {
   axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
     setPost(response.data);
   });

   axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
     setComments(response.data);
   });
 }, []);

 const addComment = () => {
   axios
     .post("http://localhost:3001/comments", {
       commentBody: newComment,
       PostId: id,
     })
     .then((response) => {
       const commentToAdd = { commentBody: newComment };
       setComments([...comments, commentToAdd]);
       setNewComment("");
     });
 };

  return (
    <div>
      <Container className="">
        <Row className="">
          <Col className=" my-5" xs={12} sm={12} md={8} lg={8} xl={8}>
            <Card className="w-100">
              <Card.Body className="p-0">
                <div>
                  <div className="justify-content-start align-items-start">
                    <Card.Header className="bg-danger">
                      <Card.Title
                        bg="primary"
                        className="justify-content-start align-items-start mt-4 "
                      >
                        {post.title}
                      </Card.Title>
                    </Card.Header>
                  </div>

                  <Card.Text className="py-5 ms-2">
                    <div className="d-flex">
                      <h6>{post.postText}</h6>
                    </div>
                  </Card.Text>

                  <Card.Footer className="bg-primary">
                    <Card.Text>
                      <div className="d-flex">
                        <h6>{post.username}</h6>
                      </div>
                    </Card.Text>
                  </Card.Footer>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <h1 className="my-5">Comment</h1>
            <div className="addCommentContainer">
              <input
                className="form-control"
                type="text"
                name=""
                id=""
                placeholder="comment.."
                value={newComment}
                onChange={(event) => {
                  setNewComment(event.target.value);
                }}
              />
              <button className="btn btn-primary  my-3" onClick={addComment}>
                Add comment
              </button>
              {}
              <div className="listOfComments">
                {comments.map((comment, key) => {
                  return (
                    <div key={key} className="comment">
                      <Card className=" d-flex my-3">
                        <h1>{comment.commentBody}</h1>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Post
