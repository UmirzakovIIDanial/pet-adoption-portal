// client/src/services/pet.service.js
import api from './api';

export const petService = {
  // Get all pets
  getAllPets: async (params) => {
    const response = await api.get('/pets', { params });
    return response.data;
  },

  // Get single pet
  getPet: async (id) => {
    const response = await api.get(`/pets/${id}`);
    return response.data;
  },

  // Create new pet
  createPet: async (petData) => {
    const formData = new FormData();
    
    // Append pet data to FormData
    Object.keys(petData).forEach(key => {
      if (key === 'photos') {
        if (petData.photos instanceof FileList) {
          for (let i = 0; i < petData.photos.length; i++) {
            formData.append('photo', petData.photos[i]);
          }
        } else if (petData.photos instanceof File) {
          formData.append('photo', petData.photos);
        }
      } else if (typeof petData[key] === 'object' && petData[key] !== null && !(petData[key] instanceof File)) {
        formData.append(key, JSON.stringify(petData[key]));
      } else {
        formData.append(key, petData[key]);
      }
    });
    
    const response = await api.post('/pets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  },

  // Update pet
  updatePet: async (id, petData) => {
    const response = await api.put(`/pets/${id}`, petData);
    return response.data;
  },

  // Delete pet
  deletePet: async (id) => {
    const response = await api.delete(`/pets/${id}`);
    return response.data;
  },

  // Upload pet photo
  uploadPetPhoto: async (id, photoFile) => {
    const formData = new FormData();
    formData.append('photo', photoFile);
    
    const response = await api.put(`/pets/${id}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  }
};
