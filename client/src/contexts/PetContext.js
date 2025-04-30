// client/src/contexts/PetContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContext';

export const PetContext = createContext();

export const PetProvider = ({ children }) => {
  const [pets, setPets] = useState([]);
  const [pet, setPet] = useState(null);
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredPets, setFilteredPets] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    breed: '',
    age: '',
    gender: '',
    size: ''
  });
  
  const { isAuthenticated } = useContext(AuthContext);

  // Get all pets
  const getPets = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/pets');
      setPets(res.data.data);
      setFilteredPets(res.data.data);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching pets');
      toast.error(err.response?.data?.error || 'Error fetching pets');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get single pet
  const getPet = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/pets/${id}`);
      setPet(res.data.data);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching pet details');
      toast.error(err.response?.data?.error || 'Error fetching pet details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add pet
  const addPet = async (petData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Append form fields to FormData
      Object.keys(petData).forEach(key => {
        if (key === 'photos') {
          // Handle file upload
          if (petData.photos instanceof FileList) {
            for (let i = 0; i < petData.photos.length; i++) {
              formData.append('photo', petData.photos[i]);
            }
          } else if (petData.photos instanceof File) {
            formData.append('photo', petData.photos);
          }
        } else if (key === 'healthStatus' || key === 'age') {
          // Handle nested objects
          formData.append(key, JSON.stringify(petData[key]));
        } else {
          formData.append(key, petData[key]);
        }
      });
      
      const res = await axios.post('/api/pets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setPets([...pets, res.data.data]);
      toast.success('Pet added successfully');
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error adding pet');
      toast.error(err.response?.data?.error || 'Error adding pet');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update pet
  const updatePet = async (id, petData) => {
    try {
      setLoading(true);
      const res = await axios.put(`/api/pets/${id}`, petData);
      
      // Update pets state
      setPets(pets.map(pet => pet._id === id ? res.data.data : pet));
      
      // Update pet state if currently viewed
      if (pet && pet._id === id) {
        setPet(res.data.data);
      }
      
      toast.success('Pet updated successfully');
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating pet');
      toast.error(err.response?.data?.error || 'Error updating pet');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete pet
  const deletePet = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/pets/${id}`);
      
      // Update pets state
      setPets(pets.filter(pet => pet._id !== id));
      
      // Clear pet state if currently viewed
      if (pet && pet._id === id) {
        setPet(null);
      }
      
      toast.success('Pet removed successfully');
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Error deleting pet');
      toast.error(err.response?.data?.error || 'Error deleting pet');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Upload pet photo
  const uploadPetPhoto = async (id, photoFile) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('photo', photoFile);
      
      const res = await axios.put(`/api/pets/${id}/photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update pet state if currently viewed
      if (pet && pet._id === id) {
        const updatedPet = { ...pet };
        updatedPet.photos.push(res.data.data);
        setPet(updatedPet);
      }
      
      toast.success('Photo uploaded successfully');
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error uploading photo');
      toast.error(err.response?.data?.error || 'Error uploading photo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get user's adoption applications
  const getUserAdoptions = async () => {
    if (!isAuthenticated) return [];
    
    try {
      setLoading(true);
      const res = await axios.get('/api/users/adoptions');
      setAdoptions(res.data.data);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching adoption applications');
      toast.error(err.response?.data?.error || 'Error fetching adoption applications');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Submit adoption application
  const submitAdoption = async (petId, applicationData) => {
    try {
      setLoading(true);
      const data = {
        pet: petId,
        applicationDetails: applicationData
      };
      
      const res = await axios.post('/api/users/adoptions', data);
      setAdoptions([...adoptions, res.data.data]);
      toast.success('Adoption application submitted successfully');
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error submitting adoption application');
      toast.error(err.response?.data?.error || 'Error submitting adoption application');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update adoption application (for shelters)
  const updateAdoption = async (id, statusData) => {
    try {
      setLoading(true);
      const res = await axios.put(`/api/users/adoptions/${id}`, statusData);
      
      // Update adoptions state
      setAdoptions(adoptions.map(adoption => 
        adoption._id === id ? res.data.data : adoption
      ));
      
      toast.success('Adoption application updated successfully');
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating adoption application');
      toast.error(err.response?.data?.error || 'Error updating adoption application');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Filter pets
  const filterPets = (filterParams) => {
    setFilters(filterParams);
    
    let results = [...pets];
    
    if (filterParams.type) {
      results = results.filter(pet => pet.type === filterParams.type);
    }
    
    if (filterParams.breed) {
      results = results.filter(pet => 
        pet.breed.toLowerCase().includes(filterParams.breed.toLowerCase())
      );
    }
    
    if (filterParams.age) {
      // Age filter logic based on your requirements
      const [minAge, maxAge] = filterParams.age.split('-').map(Number);
      results = results.filter(pet => {
        const petAgeYears = pet.age.years + (pet.age.months / 12);
        return petAgeYears >= minAge && petAgeYears <= maxAge;
      });
    }
    
    if (filterParams.gender) {
      results = results.filter(pet => pet.gender === filterParams.gender);
    }
    
    if (filterParams.size) {
      results = results.filter(pet => pet.size === filterParams.size);
    }
    
    setFilteredPets(results);
    return results;
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      type: '',
      breed: '',
      age: '',
      gender: '',
      size: ''
    });
    setFilteredPets(pets);
    return pets;
  };

  // Load pets initially
  useEffect(() => {
    getPets();
    // eslint-disable-next-line
  }, []);

  // Load user's adoptions when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getUserAdoptions();
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  return (
    <PetContext.Provider
      value={{
        pets,
        pet,
        adoptions,
        loading,
        error,
        filteredPets,
        filters,
        getPets,
        getPet,
        addPet,
        updatePet,
        deletePet,
        uploadPetPhoto,
        getUserAdoptions,
        submitAdoption,
        updateAdoption,
        filterPets,
        clearFilters,
        setError
      }}
    >
      {children}
    </PetContext.Provider>
  );
};