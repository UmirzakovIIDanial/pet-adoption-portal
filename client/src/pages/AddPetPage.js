// client/src/pages/AddPetPage.js
import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaPaw, FaDog, FaVenusMars, FaRuler, FaPalette, FaInfoCircle, FaFileMedical, FaSmile, FaImage } from 'react-icons/fa';
import { PetContext } from '../contexts/PetContext';
import axios from 'axios';
import Loader from '../components/Common/Loader';

const AddPetPage = () => {
  const navigate = useNavigate();
  const { loading, error } = useContext(PetContext);
  
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    gender: '',
    size: '',
    color: '',
    age: {
      years: 0,
      months: 0
    },
    description: '',
    behavior: '',
    healthStatus: {
      vaccinated: false,
      neutered: false,
      medicalConditions: ''
    }
  });
  
  const [photo, setPhoto] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [validated, setValidated] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Create preview URL
      const fileURL = URL.createObjectURL(file);
      setPreviewURL(fileURL);
      
      // Set file in state
      setPhoto(file);
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
    
    // Additional validation
    if (!photo) {
      setFormError('Please upload at least one photo');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create FormData object for multipart/form-data submission
      const petFormData = new FormData();
      
      // Append basic fields
      Object.keys(formData).forEach(key => {
        if (key === 'age' || key === 'healthStatus') {
          // For nested objects, stringify them
          petFormData.append(key, JSON.stringify(formData[key]));
        } else {
          petFormData.append(key, formData[key]);
        }
      });
      
      // Append photo file
      petFormData.append('photo', photo);
      
      // Send request
      const response = await axios.post('/api/pets', petFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        // Navigate to the created pet's page
        navigate(`/pets/${response.data.data._id}`);
      } else {
        throw new Error('Failed to add pet');
      }
    } catch (err) {
      setFormError(err.response?.data?.error || 'Error adding pet. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  if (loading && !isSubmitting) {
    return <Loader />;
  }
  
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <FaPaw size={50} className="text-primary mb-3" />
                <h2>Add a New Pet</h2>
                <p className="text-muted">
                  Please provide details about the pet you're adding for adoption.
                </p>
              </div>
              
              {(error || formError) && (
                <Alert variant="danger" className="mb-4">
                  {error || formError}
                </Alert>
              )}
              
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <div className="mb-4">
                  <h5>Basic Information</h5>
                  
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Pet Name*</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <FaPaw />
                          </span>
                          <Form.Control
                            type="text"
                            placeholder="Enter pet name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide a name for the pet.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Pet Type*</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <FaDog />
                          </span>
                          <Form.Select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select pet type</option>
                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>
                            <option value="Bird">Bird</option>
                            <option value="Rabbit">Rabbit</option>
                            <option value="Hamster">Hamster</option>
                            <option value="Guinea Pig">Guinea Pig</option>
                            <option value="Fish">Fish</option>
                            <option value="Turtle">Turtle</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Please select a pet type.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Breed*</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter breed"
                          name="breed"
                          value={formData.breed}
                          onChange={handleChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide the breed.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Color*</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <FaPalette />
                          </span>
                          <Form.Control
                            type="text"
                            placeholder="Enter color"
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide the color.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={4} className="mb-3">
                      <Form.Group>
                        <Form.Label>Gender*</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <FaVenusMars />
                          </span>
                          <Form.Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Unknown">Unknown</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Please select a gender.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={4} className="mb-3">
                      <Form.Group>
                        <Form.Label>Size*</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <FaRuler />
                          </span>
                          <Form.Select
                            name="size"
                            value={formData.size}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select size</option>
                            <option value="Small">Small</option>
                            <option value="Medium">Medium</option>
                            <option value="Large">Large</option>
                            <option value="Extra Large">Extra Large</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Please select a size.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={4} className="mb-3">
                      <Form.Group>
                        <Form.Label>Age*</Form.Label>
                        <Row>
                          <Col xs={6}>
                            <Form.Control
                              type="number"
                              placeholder="Years"
                              name="age.years"
                              value={formData.age.years}
                              onChange={handleChange}
                              min="0"
                              max="30"
                              required
                            />
                          </Col>
                          <Col xs={6}>
                            <Form.Control
                              type="number"
                              placeholder="Months"
                              name="age.months"
                              value={formData.age.months}
                              onChange={handleChange}
                              min="0"
                              max="11"
                              required
                            />
                          </Col>
                        </Row>
                        <Form.Control.Feedback type="invalid">
                          Please provide the age.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
                
                <div className="mb-4">
                  <h5>Health & Behavior</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Description*</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaInfoCircle />
                      </span>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Provide a detailed description of the pet"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a description.
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Behavior & Temperament*</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaSmile />
                      </span>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Describe the pet's behavior and temperament"
                        name="behavior"
                        value={formData.behavior}
                        onChange={handleChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide behavior information.
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                  
                  <div className="mb-3 p-3 border rounded bg-light">
                    <h6 className="mb-3">Health Status</h6>
                    
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Check
                          type="checkbox"
                          id="vaccinated"
                          label="Vaccinated"
                          name="healthStatus.vaccinated"
                          checked={formData.healthStatus.vaccinated}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Check
                          type="checkbox"
                          id="neutered"
                          label="Neutered/Spayed"
                          name="healthStatus.neutered"
                          checked={formData.healthStatus.neutered}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>
                    
                    <Form.Group>
                      <Form.Label>Medical Conditions</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaFileMedical />
                        </span>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Any medical conditions or special needs (optional)"
                          name="healthStatus.medicalConditions"
                          value={formData.healthStatus.medicalConditions}
                          onChange={handleChange}
                        />
                      </div>
                    </Form.Group>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h5>Photos</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Upload Primary Photo*</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaImage />
                      </span>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please upload at least one photo.
                      </Form.Control.Feedback>
                    </div>
                    <Form.Text className="text-muted">
                      This will be the main photo displayed in the pet gallery.
                    </Form.Text>
                  </Form.Group>
                  
                  {previewURL && (
                    <div className="text-center mb-3">
                      <p>Preview:</p>
                      <Image 
                        src={previewURL} 
                        alt="Preview" 
                        className="img-thumbnail" 
                        style={{ maxHeight: '200px' }} 
                      />
                    </div>
                  )}
                </div>
                
                <div className="d-flex justify-content-between mt-5">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate(-1)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Adding Pet...' : 'Add Pet'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddPetPage;