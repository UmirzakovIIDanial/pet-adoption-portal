// client/src/pages/ForgotPasswordPage.js
import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaKey, FaEnvelope } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const { forgotPassword, loading, error, setError } = useContext(AuthContext);
  
  // Clear any previous errors when component mounts
  useEffect(() => {
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setValidated(true);
    
    const success = await forgotPassword(email);
    
    if (success) {
      setSubmitted(true);
    }
  };
  
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={5}>
          <Card className="shadow-sm">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <FaKey size={50} className="text-primary mb-3" />
                <h2>Forgot Password</h2>
                <p className="text-muted">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>
              
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}
              
              {submitted ? (
                <Alert variant="success" className="mb-4">
                  <p className="mb-0">
                    If an account with this email exists, we've sent password reset instructions to your email address.
                  </p>
                </Alert>
              ) : (
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>Email Address</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaEnvelope />
                      </span>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid email address.
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                  
                  <div className="d-grid mb-4">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : 'Reset Password'}
                    </Button>
                  </div>
                </Form>
              )}
              
              <div className="text-center">
                <p className="mb-0">
                  Remember your password? {' '}
                  <Link to="/login" className="text-primary">
                    Back to Login
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPasswordPage;
