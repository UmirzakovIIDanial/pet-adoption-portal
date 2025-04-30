// client/src/components/Pets/PetGallery.js
import React, { useState, useEffect } from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import PetCard from './PetCard';
import Loader from '../Common/Loader';
import Pagination from '../Common/Pagination';

const PetGallery = ({ pets, loading, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [petsPerPage] = useState(9);
  
  // Сбрасываем страницу при изменении списка питомцев
  useEffect(() => {
    setCurrentPage(1);
  }, [pets]);
  
  // Get current pets for pagination
  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = pets.slice(indexOfFirstPet, indexOfLastPet);
  
  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of gallery
    window.scrollTo({
      top: document.querySelector('.pet-gallery-section')?.offsetTop - 100 || 0,
      behavior: 'smooth'
    });
  };
  
  if (loading) {
    return <Loader />;
  }
  
  return (
    <section className="pet-gallery-section py-3">
      {error && (
        <Alert 
          variant="danger" 
          className="mb-4"
        >
          {error}
        </Alert>
      )}
      
      {pets.length === 0 ? (
        <div className="text-center my-5">
          <h4>No pets found matching your criteria</h4>
          <p>Try adjusting your filters or check back later for new additions.</p>
        </div>
      ) : (
        <>
          <p className="text-muted mb-4">
            Showing {indexOfFirstPet + 1}-{Math.min(indexOfLastPet, pets.length)} of {pets.length} pets
          </p>
          
          <Row xs={1} sm={2} md={3} className="g-4">
            {currentPets.map(pet => (
              <Col key={pet._id}>
                <PetCard pet={pet} />
              </Col>
            ))}
          </Row>
          
          <Pagination 
            currentPage={currentPage}
            totalPages={Math.ceil(pets.length / petsPerPage)}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
};

export default PetGallery;