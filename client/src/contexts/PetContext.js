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
  
  const { isAuthenticated, user } = useContext(AuthContext);

  // Get all pets
  const getPets = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/pets');
      
      console.log('Fetched pets:', res.data.data);
      
      // Store the fetched pets
      setPets(res.data.data);
      setFilteredPets(res.data.data);
      
      return res.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error fetching pets';
      setError(errorMsg);
      toast.error(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get single pet
  const getPet = async (id) => {
    // If already loaded this pet, don't re-fetch
    if (pet && pet._id === id) {
      return pet;
    }
    
    try {
      setLoading(true);
      const res = await axios.get(`/api/pets/${id}`);
      setPet(res.data.data);
      return res.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error fetching pet details';
      setError(errorMsg);
      toast.error(errorMsg);
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
      
      // Append basic string fields
      Object.keys(petData).forEach(key => {
        if (key === 'photos' || key === 'photo') {
          // Skip - we'll handle files separately
        } else if (key === 'healthStatus' || key === 'age') {
          // Handle nested objects by stringifying them
          formData.append(key, JSON.stringify(petData[key]));
        } else {
          formData.append(key, petData[key]);
        }
      });
      
      // Handle file upload
      if (petData.photo) {
        formData.append('photo', petData.photo);
      } else if (petData.photos) {
        if (petData.photos instanceof FileList) {
          for (let i = 0; i < petData.photos.length; i++) {
            formData.append('photo', petData.photos[i]);
          }
        } else if (petData.photos instanceof File) {
          formData.append('photo', petData.photos);
        }
      }
      
      const res = await axios.post('/api/pets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Add the new pet to our state
      setPets(prevPets => [...prevPets, res.data.data]);
      toast.success('Pet added successfully');
      return res.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error adding pet';
      setError(errorMsg);
      toast.error(errorMsg);
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
      const errorMsg = err.response?.data?.error || 'Error updating pet';
      setError(errorMsg);
      toast.error(errorMsg);
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
      const errorMsg = err.response?.data?.error || 'Error deleting pet';
      setError(errorMsg);
      toast.error(errorMsg);
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
      const errorMsg = err.response?.data?.error || 'Error uploading photo';
      setError(errorMsg);
      toast.error(errorMsg);
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
      
      console.log('Fetched user adoptions:', res.data.data);
      setAdoptions(res.data.data);
      return res.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error fetching adoption applications';
      setError(errorMsg);
      toast.error(errorMsg);
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
      setAdoptions(prevAdoptions => [...prevAdoptions, res.data.data]);
      toast.success('Adoption application submitted successfully');
      return res.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error submitting adoption application';
      setError(errorMsg);
      toast.error(errorMsg);
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
      const errorMsg = err.response?.data?.error || 'Error updating adoption application';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Filter pets
  const filterPets = (filterParams) => {
    console.log('Filtering pets with params:', filterParams);
    setFilters(filterParams);
    
    let results = [...pets];
    
    if (filterParams.type) {
      results = results.filter(pet => pet.type === filterParams.type);
    }
    
    if (filterParams.gender) {
      results = results.filter(pet => pet.gender === filterParams.gender);
    }
    
    if (filterParams.size) {
      results = results.filter(pet => pet.size === filterParams.size);
    }
    
    if (filterParams.age) {
      // Age filter logic based on your requirements
      const [minAge, maxAge] = filterParams.age.split('-').map(Number);
      results = results.filter(pet => {
        const petAgeYears = pet.age.years + (pet.age.months / 12);
        return petAgeYears >= minAge && petAgeYears <= maxAge;
      });
    }
    
    console.log('Filtered pets result:', results.length);
    setFilteredPets(results);
    return results;
  };

  // Clear filters
  const clearFilters = () => {
    console.log('Clearing all filters');
    setFilters({
      type: '',
      gender: '',
      size: '',
      age: ''
    });
    setFilteredPets(pets);
    return pets;
  };

  // Get shelter pets - new function to help filter pets by shelter
  const getShelterPets = () => {
    if (!user || !pets.length) return [];
    
    return pets.filter(pet => {
      if (!pet.shelter) return false;
      
      // Handle different shelter ID formats
      if (typeof pet.shelter === 'string' || pet.shelter instanceof String) {
        return String(pet.shelter) === String(user._id);
      }
      
      // Handle case where shelter is an object with _id property (populated by mongoose)
      if (pet.shelter._id) {
        return String(pet.shelter._id) === String(user._id);
      }
      
      // Handle other cases
      return String(pet.shelter) === String(user._id);
    });
  };

  // Load pets initially
  useEffect(() => {
    getPets();
  }, []);

  // Load user's adoptions when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getUserAdoptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        getShelterPets, // New function to help with shelter pets
        setError
      }}
    >
      {children}
    </PetContext.Provider>
  );
};