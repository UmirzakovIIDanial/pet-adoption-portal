// client/src/services/adoption.service.js
import api from './api';

export const adoptionService = {
  // Get user's adoption applications
  getUserAdoptions: async () => {
    const response = await api.get('/users/adoptions');
    return response.data;
  },

  // Submit adoption application
  submitAdoption: async (petId, applicationData) => {
    const data = {
      pet: petId,
      applicationDetails: applicationData
    };
    
    const response = await api.post('/users/adoptions', data);
    return response.data;
  },

  // Get specific adoption application
  getAdoption: async (id) => {
    const response = await api.get(`/users/adoptions/${id}`);
    return response.data;
  },

  // Update adoption application (for shelters)
  updateAdoption: async (id, statusData) => {
    const response = await api.put(`/users/adoptions/${id}`, statusData);
    return response.data;
  },

  // For shelters: Get all applications for their pets
  getShelterAdoptions: async () => {
    const response = await api.get('/users/shelter/adoptions');
    return response.data;
  }
};

// client/src/services/admin.service.js
import api from './api';

export const adminService = {
  // Get all users
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Get all shelters
  getAllShelters: async () => {
    const response = await api.get('/admin/shelters');
    return response.data;
  },

  // Get all adoptions
  getAllAdoptions: async () => {
    const response = await api.get('/admin/adoptions');
    return response.data;
  },

  // Get statistics
  getStatistics: async () => {
    const response = await api.get('/admin/statistics');
    return response.data;
  },

  // Verify shelter
  verifyShelter: async (id) => {
    const response = await api.put(`/admin/shelters/${id}/verify`);
    return response.data;
  },

  // Reject shelter verification
  rejectShelter: async (id) => {
    const response = await api.put(`/admin/shelters/${id}/reject`);
    return response.data;
  }
};