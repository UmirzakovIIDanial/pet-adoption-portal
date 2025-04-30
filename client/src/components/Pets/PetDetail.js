// client/src/components/Pets/PetDetail.js
import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Badge, Button, Carousel, Tab, Tabs, Table } from 'react-bootstrap';
import { FaPaw, FaVenusMars, FaRuler, FaBirthdayCake, FaHeart, FaMedkit, FaDog, FaClipboardCheck } from 'react-icons/fa';
import AdoptionForm from '../User/AdoptionForm';
import { AuthContext } from '../../contexts/AuthContext';
import Modal from '../Common/Modal';
import { Link } from 'react-router-dom';

const PetDetail = ({ pet, onAdoptionSubmit, loading }) => {
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  const { isAuthenticated, user } = useContext(AuthContext);
  
  if (!pet) {
    return null;
  }
  
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Available':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Adopted':
        return 'secondary';
      default:
        return 'primary';
    }
  };
  
  const handleAdoptButtonClick = () => {
    if (isAuthenticated) {
      setShowAdoptionForm(true);
    } else {
      // If not authenticated, redirect to login
      window.location.href = `/login?redirect=/pets/${pet._id}`;
    }
  };
  
  // Determine if the current user is the shelter that posted this pet
  const isOwner = user && pet.shelter && user._id === pet.shelter._id;
  
  return (
    <Container className="py-5">
      <Row>
        <Col lg={6} className="mb-4">
          {pet.photos && pet.photos.length > 0 ? (
            <Carousel className="pet-detail-carousel shadow">
              {pet.photos.map((photo, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100 carousel-img"
                    src={`/uploads/pets/${photo}`}
                    alt={`${pet.name} - photo ${index + 1}`}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <Card className="mb-4 shadow">
              <Card.Img
                variant="top"
                src="/images/pet-placeholder.jpg"
                alt={pet.name}
              />
            </Card>
          )}
        </Col>
        
        <Col lg={6}>
          <Card className="mb-4 shadow">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">{pet.name}</h2>
                <Badge bg={getStatusBadgeVariant(pet.adoptionStatus)} className="fs-6">
                  {pet.adoptionStatus}
                </Badge>
              </div>
              
              <p className="text-muted fs-5 mb-4">{pet.breed}</p>
              
              <Row className="mb-4">
                <Col xs={6} md={3} className="mb-3">
                  <div className="pet-detail-info">
                    <FaPaw className="pet-detail-icon text-primary" />
                    <div>
                      <small className="text-muted d-block">Type</small>
                      <span>{pet.type}</span>
                    </div>
                  </div>
                </Col>
                <Col xs={6} md={3} className="mb-3">
                  <div className="pet-detail-info">
                    <FaVenusMars className="pet-detail-icon text-primary" />
                    <div>
                      <small className="text-muted d-block">Gender</small>
                      <span>{pet.gender}</span>
                    </div>
                  </div>
                </Col>
                <Col xs={6} md={3} className="mb-3">
                  <div className="pet-detail-info">
                    <FaRuler className="pet-detail-icon text-primary" />
                    <div>
                      <small className="text-muted d-block">Size</small>
                      <span>{pet.size}</span>
                    </div>
                  </div>
                </Col>
                <Col xs={6} md={3} className="mb-3">
                  <div className="pet-detail-info">
                    <FaBirthdayCake className="pet-detail-icon text-primary" />
                    <div>
                      <small className="text-muted d-block">Age</small>
                      <span>
                        {pet.age.years > 0 ? `${pet.age.years} yr${pet.age.years !== 1 ? 's' : ''}` : ''}
                        {pet.age.years > 0 && pet.age.months > 0 ? ', ' : ''}
                        {pet.age.months > 0 ? `${pet.age.months} mo${pet.age.months !== 1 ? 's' : ''}` : ''}
                        {pet.age.years === 0 && pet.age.months === 0 ? 'Less than 1 month' : ''}
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>
              
              {pet.adoptionStatus === 'Available' && !isOwner ? (
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="adopt-button"
                    onClick={handleAdoptButtonClick}
                    disabled={loading}
                  >
                    <FaHeart className="me-2" />
                    Apply to Adopt {pet.name}
                  </Button>
                </div>
              ) : pet.adoptionStatus === 'Pending' ? (
                <div className="alert alert-warning">
                  <p className="mb-0">
                    This pet is currently in the adoption process. Please check back later or browse our other available pets.
                  </p>
                </div>
              ) : pet.adoptionStatus === 'Adopted' ? (
                <div className="alert alert-secondary">
                  <p className="mb-0">
                    Good news! This pet has found a forever home. Please browse our other available pets.
                  </p>
                </div>
              ) : isOwner && (
                <div className="d-grid gap-2">
                  <Button 
                    as={Link} 
                    to={`/edit-pet/${pet._id}`} 
                    variant="outline-primary"
                  >
                    Edit Pet Profile
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
          
          <Card className="mb-4 shadow">
            <Card.Body>
              <Tabs
                defaultActiveKey="about"
                className="mb-3"
              >
                <Tab eventKey="about" title="About">
                  <h5 className="mb-3">About {pet.name}</h5>
                  <p>{pet.description}</p>
                </Tab>
                <Tab eventKey="health" title="Health">
                  <h5 className="mb-3">Health Information</h5>
                  <Table responsive borderless>
                    <tbody>
                      <tr>
                        <td className="fw-bold" width="40%">Vaccinated:</td>
                        <td>
                          {pet.healthStatus.vaccinated ? (
                            <Badge bg="success">Yes</Badge>
                          ) : (
                            <Badge bg="danger">No</Badge>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Neutered/Spayed:</td>
                        <td>
                          {pet.healthStatus.neutered ? (
                            <Badge bg="success">Yes</Badge>
                          ) : (
                            <Badge bg="danger">No</Badge>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Medical Conditions:</td>
                        <td>{pet.healthStatus.medicalConditions || 'None reported'}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Tab>
                <Tab eventKey="behavior" title="Behavior">
                  <h5 className="mb-3">Behavior & Temperament</h5>
                  <p>{pet.behavior}</p>
                </Tab>
                <Tab eventKey="shelter" title="Shelter">
                  <h5 className="mb-3">Shelter Information</h5>
                  {pet.shelter ? (
                    <div>
                      <p className="mb-1"><strong>Name:</strong> {pet.shelter.name}</p>
                      {pet.shelter.contactPerson && (
                        <>
                          <p className="mb-1"><strong>Contact:</strong> {pet.shelter.contactPerson.name}</p>
                          <p className="mb-1"><strong>Email:</strong> {pet.shelter.contactPerson.email}</p>
                          <p className="mb-1"><strong>Phone:</strong> {pet.shelter.contactPerson.phone}</p>
                        </>
                      )}
                    </div>
                  ) : (
                    <p>Shelter information not available</p>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Modal
        show={showAdoptionForm}
        onClose={() => setShowAdoptionForm(false)}
        title={`Adoption Application for ${pet.name}`}
        size="lg"
      >
        <AdoptionForm 
          petId={pet._id} 
          onSubmit={(data) => {
            onAdoptionSubmit(data);
            setShowAdoptionForm(false);
          }}
          loading={loading}
        />
      </Modal>
    </Container>
  );
};

export default PetDetail;
