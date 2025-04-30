// client/src/pages/EditPetPage.js - исправленная версия
import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Image } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPaw, FaDog, FaImage } from 'react-icons/fa'; // Оставим только используемые иконки
import { PetContext } from '../contexts/PetContext';
import axios from 'axios';
import Loader from '../components/Common/Loader';
import { toast } from 'react-toastify'; // Добавим импорт toast

const EditPetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPet, updatePet, error } = useContext(PetContext); // Удалим неиспользуемый loading
  
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
    },
    adoptionStatus: 'Available'
  });
  
  const [photo, setPhoto] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [validated, setValidated] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Загрузка данных о питомце
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const pet = await getPet(id);
        if (pet) {
          setFormData({
            name: pet.name || '',
            type: pet.type || '',
            breed: pet.breed || '',
            gender: pet.gender || '',
            size: pet.size || '',
            color: pet.color || '',
            age: pet.age || { years: 0, months: 0 },
            description: pet.description || '',
            behavior: pet.behavior || '',
            healthStatus: pet.healthStatus || {
              vaccinated: false,
              neutered: false,
              medicalConditions: ''
            },
            adoptionStatus: pet.adoptionStatus || 'Available'
          });
          
          if (pet.photos && pet.photos.length > 0) {
            setPreviewURL(`/uploads/pets/${pet.photos[0]}`);
          }
        }
      } catch (err) {
        setFormError('Error loading pet data');
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchPet();
  }, [id, getPet]);
  
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
    setIsSubmitting(true);
    
    try {
      // Если есть новое фото, сначала загрузим его
      if (photo) {
        const formData = new FormData();
        formData.append('photo', photo);
        
        await axios.put(`/api/pets/${id}/photo`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      // Теперь обновляем данные питомца
      const updatedPet = await updatePet(id, formData);
      
      if (updatedPet) {
        toast.success('Pet updated successfully');
        navigate(`/pets/${id}`);
      }
    } catch (err) {
      setFormError(err.response?.data?.error || 'Error updating pet');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (initialLoading) {
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
                <h2>Edit Pet</h2>
                <p className="text-muted">
                  Update the information for {formData.name}
                </p>
              </div>
              
              {(error || formError) && (
                <Alert variant="danger" className="mb-4">
                  {error || formError}
                </Alert>
              )}
              
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                {/* Основная информация */}
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
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={4} className="mb-3">
                      <Form.Group>
                        <Form.Label>Gender*</Form.Label>
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
                      </Form.Group>
                    </Col>
                    <Col md={4} className="mb-3">
                      <Form.Group>
                        <Form.Label>Size*</Form.Label>
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
                  
                  {/* Описание и поведение */}
                  <Form.Group className="mb-3">
                    <Form.Label>Description*</Form.Label>
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
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Behavior & Temperament*</Form.Label>
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
                  </Form.Group>
                  
                  {/* Здоровье */}
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
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Any medical conditions or special needs (optional)"
                        name="healthStatus.medicalConditions"
                        value={formData.healthStatus.medicalConditions}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </div>
                  
                  {/* Статус усыновления */}
                  <Form.Group className="mb-3">
                    <Form.Label>Adoption Status*</Form.Label>
                    <Form.Select
                      name="adoptionStatus"
                      value={formData.adoptionStatus}
                      onChange={handleChange}
                      required
                    >
                      <option value="Available">Available</option>
                      <option value="Pending">Pending</option>
                      <option value="Adopted">Adopted</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                
                {/* Фото */}
                <div className="mb-4">
                  <h5>Photo</h5>
                  
                  {previewURL && (
                    <div className="text-center mb-3">
                      <p>Current Photo:</p>
                      <Image 
                        src={previewURL} 
                        alt="Pet Photo" 
                        className="img-thumbnail" 
                        style={{ maxHeight: '200px' }} 
                      />
                    </div>
                  )}
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Upload New Photo (Optional)</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaImage />
                      </span>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  </Form.Group>
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
                    {isSubmitting ? 'Updating...' : 'Update Pet'}
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

export default EditPetPage;