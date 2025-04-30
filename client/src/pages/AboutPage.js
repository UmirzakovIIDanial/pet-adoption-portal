// client/src/pages/AboutPage.js
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHandHoldingHeart, FaPaw, FaUsers, FaBuilding, FaChartLine } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col lg={6} className="mb-4 mb-lg-0">
          <h1 className="display-5 mb-4">About Pet Adoption Portal</h1>
          <p className="lead mb-4">
            Our mission is to connect loving homes with pets in need, making the adoption process 
            simple, transparent, and rewarding for everyone involved.
          </p>
          <p className="mb-4">
            Founded in 2023, Pet Adoption Portal serves as a bridge between shelters, rescues, 
            and potential adopters. We believe every pet deserves a loving home, and every 
            home is enriched by the love of a pet.
          </p>
          <p className="mb-4">
            Our platform offers a comprehensive, user-friendly experience for both adopters and 
            shelters, streamlining the adoption process and helping more animals find their 
            forever homes.
          </p>
          <div className="d-flex gap-3">
            <Button as={Link} to="/pets" variant="primary" size="lg">
              Find a Pet
            </Button>
            <Button as={Link} to="/register" variant="outline-primary" size="lg">
              Join Us
            </Button>
          </div>
        </Col>
        <Col lg={6}>
          <div className="about-image-container rounded overflow-hidden shadow">
            <img 
              src="/images/about-hero.jpg" 
              alt="Happy adopted pets and their owners" 
              className="img-fluid w-100"
            />
          </div>
        </Col>
      </Row>
      
      <Row className="mb-5">
        <Col className="text-center">
          <h2 className="mb-4">Our Impact</h2>
          <p className="lead text-muted mb-5">
            Together, we're making a difference in the lives of animals and humans alike.
          </p>
          
          <Row className="g-4">
            <Col md={3} sm={6}>
              <Card className="h-100 text-center shadow-sm impact-card">
                <Card.Body>
                  <div className="impact-icon mb-3">
                    <FaPaw size={40} />
                  </div>
                  <h3 className="counter">5,000+</h3>
                  <p className="text-muted">Pets Adopted</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="h-100 text-center shadow-sm impact-card">
                <Card.Body>
                  <div className="impact-icon mb-3">
                    <FaBuilding size={40} />
                  </div>
                  <h3 className="counter">250+</h3>
                  <p className="text-muted">Shelters & Rescues</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="h-100 text-center shadow-sm impact-card">
                <Card.Body>
                  <div className="impact-icon mb-3">
                    <FaUsers size={40} />
                  </div>
                  <h3 className="counter">10,000+</h3>
                  <p className="text-muted">Registered Users</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="h-100 text-center shadow-sm impact-card">
                <Card.Body>
                  <div className="impact-icon mb-3">
                    <FaHandHoldingHeart size={40} />
                  </div>
                  <h3 className="counter">98%</h3>
                  <p className="text-muted">Successful Adoptions</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      
      <Row className="mb-5">
        <Col>
          <h2 className="text-center mb-4">How It Works</h2>
          <p className="lead text-center text-muted mb-5">
            Our platform makes finding your perfect companion simple and intuitive.
          </p>
          
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content shadow-sm">
                <h4>Browse Available Pets</h4>
                <p>
                  Explore our extensive catalog of pets looking for their forever homes. 
                  Use filters to narrow down by species, breed, age, and more.
                </p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content shadow-sm">
                <h4>Find Your Match</h4>
                <p>
                  Read detailed profiles including personality traits, medical history, 
                  and behavioral information to find the pet that's right for your lifestyle.
                </p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content shadow-sm">
                <h4>Submit an Application</h4>
                <p>
                  Once you've found your perfect match, complete our comprehensive adoption
                  application directly through the platform.
                </p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content shadow-sm">
                <h4>Shelter Review</h4>
                <p>
                  The shelter or rescue will review your application and may contact you
                  for additional information or to schedule a meet-and-greet.
                </p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content shadow-sm">
                <h4>Welcome Home</h4>
                <p>
                  Once approved, coordinate with the shelter to finalize the adoption and
                  welcome your new family member home!
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      
      <Row className="mb-5">
        <Col>
          <Card className="bg-light border-0 shadow-sm">
            <Card.Body className="p-5">
              <Row className="align-items-center">
                <Col lg={8}>
                  <h2 className="mb-3">Are You a Shelter or Rescue?</h2>
                  <p className="lead mb-4">
                    Join our network of partner shelters and rescues to expand your reach and 
                    find loving homes for more animals.
                  </p>
                  <ul className="feature-list mb-4">
                    <li>Showcase your animals to thousands of potential adopters</li>
                    <li>Manage applications through our streamlined system</li>
                    <li>Access detailed analytics on your listings and adoption rates</li>
                    <li>Connect with a community of animal lovers and fellow rescuers</li>
                  </ul>
                  <Button 
                    as={Link} 
                    to="/register" 
                    variant="primary" 
                    size="lg"
                    className="px-4"
                  >
                    Register Your Shelter
                  </Button>
                </Col>
                <Col lg={4} className="d-none d-lg-block">
                  <div className="text-center">
                    <FaChartLine size={180} className="text-primary opacity-50" />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body className="p-5 text-center">
              <h2 className="mb-3">Ready to Find Your Forever Friend?</h2>
              <p className="lead mb-4">
                Thousands of loving animals are waiting for their perfect match. 
                Start your adoption journey today!
              </p>
              <Button 
                as={Link} 
                to="/pets" 
                variant="light" 
                size="lg"
                className="px-5"
              >
                Browse Pets Now
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutPage;
