// client/src/components/Common/Footer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-auto py-4 bg-dark text-white">
      <Container>
        <Row className="mb-4">
          <Col md={4} className="mb-4 mb-md-0">
            <h5>Pet Adoption Portal</h5>
            <p className="text-muted mt-3">
              Connecting loving homes with pets in need. Our mission is to help every pet find their forever family.
            </p>
            <div className="social-icons mt-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="me-3 text-white">
                <FaFacebook size={22} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="me-3 text-white">
                <FaTwitter size={22} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white">
                <FaInstagram size={22} />
              </a>
            </div>
          </Col>
          <Col md={4} className="mb-4 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white text-decoration-none">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-white text-decoration-none">About Us</Link>
              </li>
              <li className="mb-2">
                <Link to="/login" className="text-white text-decoration-none">Login</Link>
              </li>
              <li className="mb-2">
                <Link to="/register" className="text-white text-decoration-none">Register</Link>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <FaMapMarkerAlt className="me-2" />
                123 Adoption Street, City, Country
              </li>
              <li className="mb-2">
                <FaPhone className="me-2" />
                +1 (123) 456-7890
              </li>
              <li className="mb-2">
                <FaEnvelope className="me-2" />
                info@petadoption.com
              </li>
            </ul>
          </Col>
        </Row>
        <hr className="bg-secondary" />
        <div className="text-center">
          <p className="mb-0">
            &copy; {currentYear} Pet Adoption Portal. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;