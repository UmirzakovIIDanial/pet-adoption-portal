// client/src/pages/RegisterPage.js
import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    shelterName: '',
    shelterDescription: ''
  });
  
  const [validated, setValidated] = useState(false);
  const [formError, setFormError] = useState('');
  const [showShelterFields, setShowShelterFields] = useState(false);
  
  const { register, isAuthenticated, loading, error, setError } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Clear any previous errors when component mounts
  useEffect(() => {
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Update shelter fields visibility when role changes
  useEffect(() => {
    setShowShelterFields(formData.role === 'shelter');
  }, [formData.role]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setValidated(true);
    
    // Custom validation
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (formData.role === 'shelter' && (!formData.shelterName || !formData.shelterDescription)) {
      setFormError('Shelter name and description are required');
      return;
    }
    
    // Remove confirmPassword from data sent to API
    const { confirmPassword, ...registerData } = formData;
    
    const success = await register(registerData);
    
    if (success) {
      navigate('/');
    }
  };
  
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <FaUserPlus size={50} className="text-primary mb-3" />
                <h2>Create Your Account</h2>
                <p className="text-muted">
                  Join our community and start your pet adoption journey.
                </p>
              </div>
              
              {(error || formError) && (
                <Alert variant="danger" className="mb-4">
                  {error || formError}
                </Alert>
              )}
              
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Account Type</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Adopter"
                      name="role"
                      id="role-user"
                      value="user"
                      checked={formData.role === 'user'}
                      onChange={handleChange}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Shelter/Rescue"
                      name="role"
                      id="role-shelter"
                      value="shelter"
                      checked={formData.role === 'shelter'}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>
                
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Full Name</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaUser />
                        </span>
                        <Form.Control
                          type="text"
                          placeholder="Enter your full name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter your full name.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Email Address</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaEnvelope />
                        </span>
                        <Form.Control
                          type="email"
                          placeholder="Enter your email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter a valid email address.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaLock />
                        </span>
                        <Form.Control
                          type="password"
                          placeholder="Enter password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          minLength={6}
                        />
                        <Form.Control.Feedback type="invalid">
                          Password must be at least 6 characters.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please confirm your password.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Phone Number</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaPhone />
                        </span>
                        <Form.Control
                          type="tel"
                          placeholder="Enter phone number"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter a valid phone number.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="mb-4">
                  <h5>Address Information</h5>
                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>Street Address</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <FaMapMarkerAlt />
                          </span>
                          <Form.Control
                            type="text"
                            placeholder="Enter street address"
                            name="address.street"
                            value={formData.address.street}
                            onChange={handleChange}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please enter your street address.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter city"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter your city.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>State/Province</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter state/province"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter your state/province.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Zip/Postal Code</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter zip/postal code"
                          name="address.zipCode"
                          value={formData.address.zipCode}
                          onChange={handleChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter your zip/postal code.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter country"
                          name="address.country"
                          value={formData.address.country}
                          onChange={handleChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter your country.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
                
                {showShelterFields && (
                  <div className="mb-4 p-3 border rounded bg-light">
                    <h5>Shelter Information</h5>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Shelter Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter shelter name"
                        name="shelterName"
                        value={formData.shelterName}
                        onChange={handleChange}
                        required={formData.role === 'shelter'}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter your shelter name.
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Shelter Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Provide a brief description of your shelter"
                        name="shelterDescription"
                        value={formData.shelterDescription}
                        onChange={handleChange}
                        required={formData.role === 'shelter'}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a description of your shelter.
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Include information about your shelter's mission, history, and the types of animals you rescue.
                      </Form.Text>
                    </Form.Group>
                  </div>
                )}
                
                <div className="d-grid mb-4">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </div>
                
                <div className="text-center">
                  <p className="mb-0">
                    Already have an account? {' '}
                    <Link to="/login" className="text-primary">
                      Login
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
