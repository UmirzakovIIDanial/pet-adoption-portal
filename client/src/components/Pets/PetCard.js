// client/src/components/Pets/PetCard.js
import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPaw, FaVenusMars, FaRuler } from 'react-icons/fa';

const PetCard = ({ pet }) => {
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

  return (
    <Card className="h-100 shadow-sm pet-card hover-effect">
      <div className="card-img-container">
        <Card.Img 
          variant="top" 
          src={pet.photos && pet.photos.length > 0 
            ? `/uploads/pets/${pet.photos[0]}` 
            : '/images/pet-placeholder.jpg'
          } 
          alt={pet.name}
          className="pet-card-img"
        />
        <Badge 
          bg={getStatusBadgeVariant(pet.adoptionStatus)} 
          className="position-absolute top-0 end-0 m-2"
        >
          {pet.adoptionStatus}
        </Badge>
      </div>
      <Card.Body>
        <Card.Title className="mb-1 fw-bold">{pet.name}</Card.Title>
        <div className="text-muted small mb-2">{pet.breed}</div>
        
        <div className="pet-details mb-3">
          <div className="pet-detail-item">
            <FaPaw className="me-1" />
            <span>{pet.type}</span>
          </div>
          <div className="pet-detail-item">
            <FaVenusMars className="me-1" />
            <span>{pet.gender}</span>
          </div>
          <div className="pet-detail-item">
            <FaRuler className="me-1" />
            <span>{pet.size}</span>
          </div>
        </div>
        
        <div className="pet-age mb-3">
          <span className="fw-bold">Age: </span>
          {pet.age.years > 0 ? `${pet.age.years} year${pet.age.years !== 1 ? 's' : ''}` : ''}
          {pet.age.years > 0 && pet.age.months > 0 ? ' and ' : ''}
          {pet.age.months > 0 ? `${pet.age.months} month${pet.age.months !== 1 ? 's' : ''}` : ''}
          {pet.age.years === 0 && pet.age.months === 0 ? 'Less than 1 month' : ''}
        </div>
        
        <div className="d-grid">
          <Button 
            as={Link} 
            to={`/pets/${pet._id}`} 
            variant="primary"
          >
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PetCard;
