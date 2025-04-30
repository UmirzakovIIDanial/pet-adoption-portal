// client/src/components/Admin/ManagePets.js
import React, { useState } from 'react';
import { Card, Table, Badge, Button, Form, Modal } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Pagination from '../Common/Pagination';
import axios from 'axios';
import { toast } from 'react-toastify';

const ManagePets = ({ pets, loading, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  
  // Filter pets based on search term
  const filteredPets = pets.filter(pet => {
    const petName = pet.name?.toLowerCase() || '';
    const petType = pet.type?.toLowerCase() || '';
    const petBreed = pet.breed?.toLowerCase() || '';
    const status = pet.adoptionStatus?.toLowerCase() || '';
    
    const term = searchTerm.toLowerCase();
    
    return petName.includes(term) || 
           petType.includes(term) || 
           petBreed.includes(term) || 
           status.includes(term);
  });
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPets.slice(indexOfFirstItem, indexOfLastItem);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
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
  
  const handleViewDetails = (pet) => {
    setSelectedPet(pet);
    setShowDetails(true);
  };
  
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedPet(null);
  };
  
  const handleDeleteClick = (pet) => {
    setPetToDelete(pet);
    setShowDeleteConfirm(true);
  };
  
  const handleDeletePet = async () => {
    try {
      await axios.delete(`/api/pets/${petToDelete._id}`);
      
      // Remove pet from list (would normally be handled by context re-fetch)
      toast.success('Pet deleted successfully');
      setShowDeleteConfirm(false);
      setPetToDelete(null);
      
      // Refresh page (or ideally use context to update state)
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error deleting pet');
    }
  };
  
  if (error) {
    return (
      <div className="alert alert-danger">
        Error: {error}
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="mb-4">Manage Pets</h3>
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex mb-3">
            <div className="search-box position-relative w-100 me-2">
              <FaSearch className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search by name, type, breed or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ps-4"
              />
            </div>
            <Form.Select className="w-auto">
              <option value="">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Pending">Pending</option>
              <option value="Adopted">Adopted</option>
            </Form.Select>
          </div>
          
          {currentItems.length === 0 ? (
            <div className="text-center py-5">
              <p className="mb-0">No pets found</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className="admin-table">
                  <thead>
                    <tr>
                      <th>Pet</th>
                      <th>Type</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Status</th>
                      <th>Shelter</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((pet) => (
                      <tr key={pet._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="pet-thumbnail me-2">
                              <img
                                src={pet.photos?.[0] 
                                  ? `/uploads/pets/${pet.photos[0]}` 
                                  : '/images/pet-placeholder-small.jpg'
                                }
                                alt={pet.name}
                                className="img-fluid rounded"
                              />
                            </div>
                            <div>
                              <div className="fw-bold">{pet.name}</div>
                              <div className="small text-muted">{pet.breed}</div>
                            </div>
                          </div>
                        </td>
                        <td>{pet.type}</td>
                        <td>
                          {pet.age.years > 0 ? `${pet.age.years} yr${pet.age.years !== 1 ? 's' : ''} ` : ''}
                          {pet.age.months > 0 ? `${pet.age.months} mo${pet.age.months !== 1 ? 's' : ''}` : ''}
                          {pet.age.years === 0 && pet.age.months === 0 ? 'Less than 1 month' : ''}
                        </td>
                        <td>{pet.gender}</td>
                        <td>
                          <Badge bg={getStatusBadgeVariant(pet.adoptionStatus)}>
                            {pet.adoptionStatus}
                          </Badge>
                        </td>
                        <td>{pet.shelter?.name || 'Unknown'}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleViewDetails(pet)}
                            >
                              <FaEye />
                            </Button>
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              href={`/edit-pet/${pet._id}`}
                            >
                              <FaEdit />
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDeleteClick(pet)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredPets.length / itemsPerPage)}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </Card.Body>
      </Card>
      
      {/* Pet Details Modal */}
      {selectedPet && (
        <Modal show={showDetails} onHide={handleCloseDetails} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Pet Details: {selectedPet.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="pet-image-container">
                  <img
                    src={selectedPet.photos?.[0] 
                      ? `/uploads/pets/${selectedPet.photos[0]}` 
                      : '/images/pet-placeholder.jpg'
                    }
                    alt={selectedPet.name}
                    className="img-fluid rounded"
                  />
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <h4>{selectedPet.name}</h4>
                <p className="text-muted">{selectedPet.breed}</p>
                
                <div className="pet-details-list">
                  <div className="detail-item">
                    <span className="label">Type:</span>
                    <span className="value">{selectedPet.type}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Age:</span>
                    <span className="value">
                      {selectedPet.age.years > 0 ? `${selectedPet.age.years} year${selectedPet.age.years !== 1 ? 's' : ''} ` : ''}
                      {selectedPet.age.months > 0 ? `${selectedPet.age.months} month${selectedPet.age.months !== 1 ? 's' : ''}` : ''}
                      {selectedPet.age.years === 0 && selectedPet.age.months === 0 ? 'Less than 1 month' : ''}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Gender:</span>
                    <span className="value">{selectedPet.gender}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Size:</span>
                    <span className="value">{selectedPet.size}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Color:</span>
                    <span className="value">{selectedPet.color}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Status:</span>
                    <span className="value">
                      <Badge bg={getStatusBadgeVariant(selectedPet.adoptionStatus)}>
                        {selectedPet.adoptionStatus}
                      </Badge>
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Shelter:</span>
                    <span className="value">{selectedPet.shelter?.name || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h5>Description</h5>
              <p>{selectedPet.description}</p>
            </div>
            
            <div className="mb-4">
              <h5>Health Status</h5>
              <div className="row">
                <div className="col-md-4">
                  <div className="detail-item">
                    <span className="label">Vaccinated:</span>
                    <span className="value">
                      {selectedPet.healthStatus.vaccinated ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="detail-item">
                    <span className="label">Neutered/Spayed:</span>
                    <span className="value">
                      {selectedPet.healthStatus.neutered ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="detail-item">
                    <span className="label">Medical Conditions:</span>
                    <span className="value">
                      {selectedPet.healthStatus.medicalConditions || 'None'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h5>Behavior</h5>
              <p>{selectedPet.behavior}</p>
            </div>
            
            {selectedPet.photos && selectedPet.photos.length > 1 && (
              <div className="mb-4">
                <h5>Additional Photos</h5>
                <div className="row">
                  {selectedPet.photos.slice(1).map((photo, index) => (
                    <div key={index} className="col-md-3 col-6 mb-3">
                      <img
                        src={`/uploads/pets/${photo}`}
                        alt={`${selectedPet.name} - photo ${index + 2}`}
                        className="img-fluid rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDetails}>
              Close
            </Button>
            <Button 
              variant="primary" 
              href={`/edit-pet/${selectedPet._id}`}
            >
              Edit Pet
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {petToDelete?.name}? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeletePet}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManagePets;
