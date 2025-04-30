// client/src/pages/ResetPasswordPage.js
import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [formError, setFormError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const { resetToken } = useParams();
  const { resetPassword, loading, error, setError } = useContext(AuthContext);
  const navigate = useNavigate();
  
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
    
    // Custom validation
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    
    const success = await resetPassword(password, resetToken);
    
    if (success) {
      setResetSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };
  
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={5}>
          <Card className="shadow-sm">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <FaLock size={50} className="text-primary mb-3" />
                <h2>Reset Your Password</h2>
                <p className="text-muted">
                  Enter your new password below.
                </p>
              </div>
              
              {(error || formError) && (
                <Alert variant="danger" className="mb-4">
                  {error || formError}
                </Alert>
              )}
              
              {resetSuccess ? (
                <Alert variant="success" className="mb-4">
                  <p className="mb-0">
                    Your password has been reset successfully! You will be redirected to the login page in a few seconds.
                  </p>
                </Alert>
              ) : (
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaLock />
                      </span>
                      <Form.Control
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <Form.Control.Feedback type="invalid">
                        Password must be at least 6 characters.
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please confirm your new password.
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <div className="d-grid mb-4">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                  </div>
                </Form>
              )}
              
              <div className="text-center">
                <p className="mb-0">
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

export default ResetPasswordPage;
