// client/src/pages/PetsPage.js
import React, { useState, useEffect } from 'react';
import { Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import Loader from '../components/Common/Loader';
import PetGallery from '../components/Pets/PetGallery';
import PetFilter from '../components/Pets/PetFilter';

const PetsPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    gender: '',
    size: '',
    age: ''
  });

  // Загрузка данных при монтировании и изменении фильтров
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        console.log('Fetching pets with filters:', filters);
        
        // Создаем строку запроса из фильтров
        const queryParams = new URLSearchParams();
        
        if (filters.type) queryParams.append('type', filters.type);
        if (filters.gender) queryParams.append('gender', filters.gender);
        if (filters.size) queryParams.append('size', filters.size);
        if (filters.age) {
          const [minAge, maxAge] = filters.age.split('-');
          if (minAge) queryParams.append('minAge', minAge);
          if (maxAge) queryParams.append('maxAge', maxAge);
        }
        
        const queryString = queryParams.toString();
        const url = queryString ? `/api/pets?${queryString}` : '/api/pets';
        
        console.log('API request URL:', url);
        const response = await axios.get(url);
        setPets(response.data.data || []);
      } catch (err) {
        console.error('Error fetching pets:', err);
        setError(err.response?.data?.error || 'Error fetching pets');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPets();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    console.log('Applying filters:', newFilters);
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    console.log('Clearing filters');
    setFilters({
      type: '',
      gender: '',
      size: '',
      age: ''
    });
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Available Pets</h1>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      <PetFilter 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onClearFilters={handleClearFilters} 
      />
      
      {loading && pets.length === 0 ? (
        <Loader />
      ) : (
        <PetGallery 
          pets={pets}
          loading={loading}
          error={error}
        />
      )}
    </Container>
  );
};

export default PetsPage;