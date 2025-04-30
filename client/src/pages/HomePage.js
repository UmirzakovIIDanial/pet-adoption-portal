// client/src/pages/HomePage.js (продолжение)
import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaPaw, FaClipboardList, FaHome, FaQuoteRight } from 'react-icons/fa';
import { PetContext } from '../contexts/PetContext';

const HomePage = () => {
  const { pets, loading } = useContext(PetContext);
  const [featuredPets, setFeaturedPets] = useState([]);
  
  useEffect(() => {
    // Get random featured pets
    if (pets.length > 0 && pets.filter(pet => pet.adoptionStatus === 'Available').length > 0) {
      const availablePets = pets.filter(pet => pet.adoptionStatus === 'Available');
      const shuffled = availablePets.sort(() => 0.5 - Math.random());
      setFeaturedPets(shuffled.slice(0, 3));
    }
  }, [pets]);
  
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'New York, NY',
      message: 'Thanks to this wonderful platform, we found our adorable cat Luna. The adoption process was smooth and the shelter was incredibly helpful. We couldn\'t be happier with our new family member!',
      image: '/images/testimonial-1.svg'
    },
    {
      id: 2,
      name: 'Michael Thompson',
      location: 'San Francisco, CA',
      message: 'After searching for months, I finally found my perfect companion here. The detailed pet profiles and responsive shelters made the whole adoption process a joy. Thank you for connecting us!',
      image: '/images/testimonial-2.svg'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      location: 'Chicago, IL',
      message: 'I was hesitant about adopting at first, but the amount of information provided on each pet helped me make the right decision. Our dog Max has been the best addition to our family.',
      image: '/images/testimonial-3.svg'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <h1>Find Your Forever Friend</h1>
          <p>
            Thousands of loving pets are looking for their forever homes. 
            Browse our available pets and start your adoption journey today.
          </p>
          <div className="hero-buttons">
            <Button as={Link} to="/pets" variant="primary" size="lg" className="me-2">
              <FaSearch className="me-2" />
              Browse Pets
            </Button>
            <Button as={Link} to="/about" variant="outline-light" size="lg">
              Learn More
            </Button>
          </div>
        </Container>
      </section>

      {/* Featured Pets Section */}
      <section className="featured-pets py-5">
        <Container>
          <div className="featured-title">
            <h2>Featured Pets</h2>
            <p className="text-muted">
              Meet some of our adorable pets waiting for their forever homes
            </p>
          </div>
          
          {loading ? (
            <p className="text-center">Loading featured pets...</p>
          ) : featuredPets.length > 0 ? (
            <Row>
              {featuredPets.map(pet => (
                <Col key={pet._id} md={4} className="mb-4">
                  <Card className="h-100 shadow-sm hover-effect">
                    <Card.Img 
                      variant="top" 
                      src={pet.photos && pet.photos.length > 0 
                        ? `/uploads/pets/${pet.photos[0]}` 
                        : '/images/pet-placeholder.jpg'
                      } 
                      alt={pet.name}
                      className="featured-pet-img"
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                    <Card.Body className="text-center">
                      <Card.Title>{pet.name}</Card.Title>
                      <Card.Text className="text-muted">{pet.breed}</Card.Text>
                      <div className="mb-3">
                        <span className="badge bg-primary me-2">{pet.type}</span>
                        <span className="badge bg-secondary me-2">{pet.gender}</span>
                        <span className="badge bg-info">
                          {pet.age.years > 0 ? `${pet.age.years} yr${pet.age.years !== 1 ? 's' : ''}` : ''}
                          {pet.age.years > 0 && pet.age.months > 0 ? ', ' : ''}
                          {pet.age.months > 0 ? `${pet.age.months} mo${pet.age.months !== 1 ? 's' : ''}` : ''}
                          {pet.age.years === 0 && pet.age.months === 0 ? 'Under 1 month' : ''}
                        </span>
                      </div>
                      <Button 
                        as={Link} 
                        to={`/pets/${pet._id}`} 
                        variant="outline-primary"
                      >
                        Meet {pet.name}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <p className="text-center">No featured pets available at the moment.</p>
          )}
          
          <div className="text-center mt-4">
            <Button 
              as={Link} 
              to="/pets" 
              variant="primary"
              size="lg"
            >
              View All Pets
            </Button>
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works py-5">
        <Container>
          <div className="text-center mb-5">
            <h2>How It Works</h2>
            <p className="text-muted">
              Our adoption process is simple and rewarding
            </p>
          </div>
          
          <Row className="g-4">
            <Col md={4}>
              <div className="step-card">
                <div className="step-icon">
                  <FaSearch />
                </div>
                <h4>Find Your Perfect Match</h4>
                <p className="text-muted">
                  Browse our extensive catalog of available pets. Use filters to find the perfect companion that matches your lifestyle.
                </p>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="step-card">
                <div className="step-icon">
                  <FaClipboardList />
                </div>
                <h4>Submit an Application</h4>
                <p className="text-muted">
                  Found your match? Submit an adoption application directly through our platform and wait for shelter approval.
                </p>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="step-card">
                <div className="step-icon">
                  <FaHome />
                </div>
                <h4>Welcome Your New Friend</h4>
                <p className="text-muted">
                  Once approved, coordinate with the shelter to welcome your new furry friend to their forever home.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials py-5">
        <Container>
          <div className="text-center mb-5">
            <h2>Success Stories</h2>
            <p className="text-muted">
              Hear from happy adopters who found their perfect companions
            </p>
          </div>
          
          <Row className="g-4">
            {testimonials.map(testimonial => (
              <Col key={testimonial.id} md={4}>
                <Card className="h-100 shadow-sm testimonial-card position-relative">
                  <FaQuoteRight className="quotes-icon" />
                  <Card.Body>
                    <p className="mb-4">{testimonial.message}</p>
                    <div className="d-flex align-items-center">
                      <div className="testimonial-avatar">
                        <img 
                          src={testimonial.image}
                          alt={testimonial.name}
                        />
                      </div>
                      <div>
                        <h5 className="mb-0">{testimonial.name}</h5>
                        <p className="text-muted mb-0">{testimonial.location}</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <h2>Ready to Change a Life?</h2>
          <p>
            Thousands of animals are waiting for their forever homes. 
            Your new best friend could be just a click away.
          </p>
          <Button 
            as={Link} 
            to="/pets" 
            variant="primary" 
            size="lg"
            className="px-5 py-3"
          >
            <FaPaw className="me-2" />
            Find Your Pet Today
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;