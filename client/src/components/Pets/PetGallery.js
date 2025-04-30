// client/src/components/Pets/PetGallery.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PetCard from './PetCard';
import PetFilter from './PetFilter';
import Loader from '../Common/Loader';
import Pagination from '../Common/Pagination';
import Alert from '../Common/Alert';

const PetGallery = ({ pets, loading, error, filters, onFilterChange, onClearFilters }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [petsPerPage] = useState(9);
  const [filteredPets, setFilteredPets] = useState([]);
  
  useEffect(() => {
    setFilteredPets(pets);
    setCurrentPage(1); // Reset to first page when pets change
  }, [pets]);
  
  // Get current pets for pagination
  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);
  
  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of gallery
    window.scrollTo({
      top: document.querySelector('.pet-gallery-section').offsetTop - 100,
      behavior: 'smooth'
    });
  };
  
  if (loading) {
    return <Loader />;
  }
  
  return (
    <section className="pet-gallery-section py-5">
      <Container>
        <h2 className="text-center mb-4">Find Your Perfect Companion</h2>
        
        <PetFilter 
          filters={filters} 
          onFilterChange={onFilterChange} 
          onClearFilters={onClearFilters} 
        />
        
        {error && (
          <Alert 
            variant="danger" 
            message={error} 
          />
        )}
        
        {filteredPets.length === 0 ? (
          <div className="text-center my-5">
            <h4>No pets found matching your criteria</h4>
            <p>Try adjusting your filters or check back later for new additions.</p>
          </div>
        ) : (
          <>
            <p className="text-muted mb-4">
              Showing {indexOfFirstPet + 1}-{Math.min(indexOfLastPet, filteredPets.length)} of {filteredPets.length} pets
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
              totalPages={Math.ceil(filteredPets.length / petsPerPage)}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </Container>
    </section>
  );
};

export default PetGallery;