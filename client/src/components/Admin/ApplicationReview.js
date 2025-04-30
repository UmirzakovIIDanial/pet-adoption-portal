import React, { useState } from 'react';
import { Card, Table, Badge, Button, Form, Modal } from 'react-bootstrap';
import { FaEye, FaSearch } from 'react-icons/fa';
import Pagination from '../Common/Pagination';

const ApplicationReview = ({ adoptions, loading, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAdoption, setSelectedAdoption] = useState(null);
  
  // Filter adoptions based on search term
  const filteredAdoptions = adoptions.filter(adoption => {
    const petName = adoption.pet?.name?.toLowerCase() || '';
    const applicantName = adoption.applicant?.name?.toLowerCase() || '';
    const shelterName = adoption.shelter?.name?.toLowerCase() || '';
    const status = adoption.status?.toLowerCase() || '';
    
    const term = searchTerm.toLowerCase();
    
    // Проверяем соответствие поисковому запросу
    const matchesSearch = petName.includes(term) || 
           applicantName.includes(term) || 
           shelterName.includes(term) || 
           status.includes(term);
    
    // Проверяем соответствие фильтру статуса
    const matchesStatus = statusFilter === '' || adoption.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAdoptions.slice(indexOfFirstItem, indexOfLastItem);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'danger';
      case 'Completed':
        return 'primary';
      default:
        return 'secondary';
    }
  };
  
  const handleViewDetails = (adoption) => {
    setSelectedAdoption(adoption);
    setShowDetails(true);
  };
  
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedAdoption(null);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Сбрасываем страницу при смене фильтра
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
      <h3 className="mb-4">Adoption Applications</h3>
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex mb-3">
            <div className="search-box position-relative w-100 me-2">
              <FaSearch className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search by pet, applicant, shelter or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ps-4"
              />
            </div>
            <Form.Select 
              className="w-auto"
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
            </Form.Select>
          </div>
          
          {currentItems.length === 0 ? (
            <div className="text-center py-5">
              <p className="mb-0">No adoption applications found</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Pet</th>
                      <th>Applicant</th>
                      <th>Shelter</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((adoption) => (
                      <tr key={adoption._id}>
                        <td>{adoption._id.substring(0, 8)}...</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="pet-thumbnail me-2">
                              <img
                                src={adoption.pet?.photos?.[0] 
                                  ? `/uploads/pets/${adoption.pet.photos[0]}` 
                                  : '/images/pet-placeholder-small.jpg'
                                }
                                alt={adoption.pet?.name}
                                className="img-fluid rounded"
                              />
                            </div>
                            <div>{adoption.pet?.name}</div>
                          </div>
                        </td>
                        <td>{adoption.applicant?.name}</td>
                        <td>{adoption.shelter?.name}</td>
                        <td>{new Date(adoption.submittedAt).toLocaleDateString()}</td>
                        <td>
                          <Badge bg={getStatusBadgeVariant(adoption.status)}>
                            {adoption.status}
                          </Badge>
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleViewDetails(adoption)}
                          >
                            <FaEye />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredAdoptions.length / itemsPerPage)}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </Card.Body>
      </Card>
      
      {selectedAdoption && (
        <Modal show={showDetails} onHide={handleCloseDetails} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Adoption Application Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-4">
              <h5>Application Summary</h5>
              <div className="d-flex align-items-center mb-3">
                <div className="pet-thumbnail-lg me-3">
                  <img
                    src={selectedAdoption.pet?.photos?.[0] 
                      ? `/uploads/pets/${selectedAdoption.pet.photos[0]}` 
                      : '/images/pet-placeholder.jpg'
                    }
                    alt={selectedAdoption.pet?.name}
                    className="img-fluid rounded"
                  />
                </div>
                <div>
                  <h5 className="mb-1">{selectedAdoption.pet?.name}</h5>
                  <p className="mb-0">{selectedAdoption.pet?.breed}</p>
                  <Badge bg={getStatusBadgeVariant(selectedAdoption.status)} className="mt-2">
                    {selectedAdoption.status}
                  </Badge>
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>Applicant:</strong> {selectedAdoption.applicant?.name}
                </div>
                <div className="col-md-6">
                  <strong>Shelter:</strong> {selectedAdoption.shelter?.name}
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>Submitted On:</strong> {new Date(selectedAdoption.submittedAt).toLocaleString()}
                </div>
                <div className="col-md-6">
                  <strong>Last Updated:</strong> {new Date(selectedAdoption.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h5>Application Details</h5>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>Living Arrangement:</strong> {selectedAdoption.applicationDetails.livingArrangement}
                </div>
                <div className="col-md-6">
                  <strong>Has Children:</strong> {selectedAdoption.applicationDetails.hasChildren ? 'Yes' : 'No'}
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>Has Other Pets:</strong> {selectedAdoption.applicationDetails.hasOtherPets ? 'Yes' : 'No'}
                </div>
                <div className="col-md-6">
                  {selectedAdoption.applicationDetails.hasOtherPets && (
                    <>
                      <strong>Other Pets Details:</strong>
                      <p>{selectedAdoption.applicationDetails.otherPetsDetails}</p>
                    </>
                  )}
                </div>
              </div>
              
              <div className="mb-3">
                <strong>Work Schedule:</strong>
                <p>{selectedAdoption.applicationDetails.workSchedule}</p>
              </div>
              
              <div className="mb-3">
                <strong>Pet Care Experience:</strong>
                <p>{selectedAdoption.applicationDetails.petCareExperience}</p>
              </div>
              
              <div className="mb-3">
                <strong>Reason for Adoption:</strong>
                <p>{selectedAdoption.applicationDetails.reasonForAdoption}</p>
              </div>
            </div>
            
            {selectedAdoption.applicationDetails.vetDetails && 
             selectedAdoption.applicationDetails.vetDetails.name && (
              <div className="mb-4">
                <h5>Veterinarian Information</h5>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Name:</strong> {selectedAdoption.applicationDetails.vetDetails.name}
                  </div>
                  <div className="col-md-6">
                    <strong>Phone:</strong> {selectedAdoption.applicationDetails.vetDetails.phone}
                  </div>
                </div>
                <div className="mb-3">
                  <strong>Address:</strong> {selectedAdoption.applicationDetails.vetDetails.address}
                </div>
              </div>
            )}
            
            {selectedAdoption.applicationDetails.references && 
             selectedAdoption.applicationDetails.references.length > 0 && (
              <div className="mb-4">
                <h5>References</h5>
                {selectedAdoption.applicationDetails.references.map((reference, index) => (
                  <div key={index} className="mb-3 p-3 border rounded">
                    <h6>Reference #{index + 1}</h6>
                    <div className="row mb-2">
                      <div className="col-md-6">
                        <strong>Name:</strong> {reference.name}
                      </div>
                      <div className="col-md-6">
                        <strong>Relationship:</strong> {reference.relationship}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <strong>Phone:</strong> {reference.phone}
                      </div>
                      <div className="col-md-6">
                        <strong>Email:</strong> {reference.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {selectedAdoption.approvalDetails && (
              <div className="mb-4">
                <h5>Approval Details</h5>
                {selectedAdoption.approvalDetails.approvedBy ? (
                  <>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>Approved By:</strong> {selectedAdoption.approvalDetails.approvedBy}
                      </div>
                      <div className="col-md-6">
                        <strong>Approval Date:</strong> {new Date(selectedAdoption.approvalDetails.approvalDate).toLocaleString()}
                      </div>
                    </div>
                    <div className="mb-3">
                      <strong>Comments:</strong>
                      <p>{selectedAdoption.approvalDetails.comments || 'No comments provided.'}</p>
                    </div>
                  </>
                ) : (
                  <p>No approval details available.</p>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDetails}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ApplicationReview;
