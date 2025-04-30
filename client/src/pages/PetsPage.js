// client/src/pages/PetsPage.js
import React, { useContext, useState } from 'react';
import { Container } from 'react-bootstrap';
import PetGallery from '../components/Pets/PetGallery';
import Loader from '../components/Common/Loader';
import { PetContext } from '../contexts/PetContext';

const PetsPage = () => {
  const { pets, loading, error, filterPets, filters, clearFilters } = useContext(PetContext);
  const [currentFilters, setCurrentFilters] = useState(filters);
  
  const handleFilterChange = (newFilters) => {
    setCurrentFilters(newFilters);
    filterPets(newFilters);
  };
  
  const handleClearFilters = () => {
    setCurrentFilters({
      type: '',
      breed: '',
      age: '',
      gender: '',
      size: ''
    });
    clearFilters();
  };
  
  if (loading) {
    return <Loader />;
  }
  
  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Available Pets</h1>
      
      <PetGallery 
        pets={pets}
        loading={loading}
        error={error}
        filters={currentFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />
    </Container>
  );
};

export default PetsPage;