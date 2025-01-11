import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
 
function HeroSection({searchQuery, setSearchQuery}) {
  return (
    <section className="hero ">
      <Container className="hero-content text-white">
        <Row className="d-flex align-items-center gap-3 border border-3">
          <Col md={5} className="hero-image-col">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
              alt="Delicious food"
              className="img-fluid shadow hero-image"
            />
          </Col>

          <Col md={6} className="text-center text-md-start">
            <h1 className="display-7 fw-bold mb-3 text-dark">
              Discover Delicious Recipes
            </h1>
            <p className="lead mb-4 text-dark">
              Modern recipe websites are visually engaging, with high-quality
              images and videos that make food look appetizing. They are
              typically responsive, allowing users to access recipes on a
              desktop, tablet, or smartphone—making it convenient to follow
              recipes in the kitchen.
            </p>

            <input
              type="text"
              className="form-control mb-3 my-3"
              placeholder="Search for a recipe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default HeroSection;