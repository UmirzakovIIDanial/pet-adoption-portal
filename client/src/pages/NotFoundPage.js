// client/src/pages/NotFoundPage.js
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSadTear, FaHome, FaPaw } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <Container className="py-5 text-center">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="mb-4">
            <FaSadTear size={100} className="text-primary mb-3" />
            <h1 className="display-1 fw-bold">404</h1>
            <h2 className="mb-4">Page Not Found</h2>
            <p className="lead mb-5">
              Oops! The page you're looking for seems to have wandered off.
              Don't worry, even the best pets get lost sometimes.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Button as={Link} to="/" variant="primary" size="lg" className="me-3">
                <FaHome className="me-2" />
                Go Home
              </Button>
              <Button as={Link} to="/pets" variant="outline-primary" size="lg">
                <FaPaw className="me-2" />
                Find Pets
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;
