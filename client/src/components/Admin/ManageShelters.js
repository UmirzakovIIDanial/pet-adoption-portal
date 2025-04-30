// client/src/components/Admin/ManageShelters.js
import React, { useState } from 'react';
import { Card, Table, Badge, Button, Form, Modal } from 'react-bootstrap';
import { FaEye, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';
import Pagination from '../Common/Pagination';

const ManageShelters = ({ shelters, loading, error, onVerify }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState(null);
  
  // Filter shelters based on search term
  const filteredShelters = shelters.filter(shelter => {
    const shelterName = shelter.name?.toLowerCase() || '';
    const contactName = shelter.contactPerson?.name?.toLowerCase() || '';
    const email = shelter.contactPerson?.email?.toLowerCase() || '';
    
    const term = searchTerm.toLowerCase();
    
    return shelterName.includes(term) || 
           contactName.includes(term) || 
           email.includes(term);
  });
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredShelters.slice(indexOfFirstItem, indexOfLastItem);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const handleViewDetails = (shelter) => {
    setSelectedShelter(shelter);
    setShowDetails(true);
  };
  
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedShelter(null);
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
      <h3 className="mb-4">Manage Shelters</h3>
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex mb-3">
            <div className="search-box position-relative w-100 me-2">
              <FaSearch className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search by name, contact person or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ps-4"
              />
            </div>
            <Form.Select className="w-auto">
              <option value="">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </Form.Select>
          </div>
          
          {currentItems.length === 0 ? (
            <div className="text-center py-5">
              <p className="mb-0">No shelters found</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Contact Person</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Pets</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((shelter) => (
                      <tr key={shelter._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="shelter-logo me-2">
                              <img
                                src={shelter.logo 
                                  ? `/uploads/shelters/${shelter.logo}` 
                                  : '/images/shelter-placeholder.jpg'
                                }
                                alt={shelter.name}
                                className="img-fluid rounded"
                              />
                            </div>
                            <div>{shelter.name}</div>
                          </div>
                        </td>
                        <td>{shelter.contactPerson?.name || 'N/A'}</td>
                        <td>{shelter.contactPerson?.email || 'N/A'}</td>
                        <td>{shelter.contactPerson?.phone || 'N/A'}</td>
                        <td>{shelter.pets?.length || 0}</td>
                        <td>
                          {shelter.verified ? (
                            <Badge bg="success">Verified</Badge>
                          ) : (
                            <Badge bg="warning">Pending</Badge>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleViewDetails(shelter)}
                            >
                              <FaEye />
                            </Button>
                            {shelter.verified ? (
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => onVerify(shelter._id, false)}
                                title="Revoke verification"
                              >
                                <FaTimes />
                              </Button>
                            ) : (
                              <Button 
                                variant="outline-success" 
                                size="sm"
                                onClick={() => onVerify(shelter._id, true)}
                                title="Verify shelter"
                              >
                                <FaCheck />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredShelters.length / itemsPerPage)}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </Card.Body>
      </Card>
      
      {/* Shelter Details Modal */}
      {selectedShelter && (
        <Modal show={showDetails} onHide={handleCloseDetails} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{selectedShelter.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-4">
              <div className="d-flex align-items-center mb-3">
                <div className="shelter-logo-lg me-3">
                  <img
                    src={selectedShelter.logo 
                      ? `/uploads/shelters/${selectedShelter.logo}` 
                      : '/images/shelter-placeholder.jpg'
                    }
                    alt={selectedShelter.name}
                    className="img-fluid rounded"
                  />
                </div>
                <div>
                  <h4 className="mb-1">{selectedShelter.name}</h4>
                  <p className="mb-0">
                    {selectedShelter.verified ? (
                      <Badge bg="success">Verified</Badge>
                    ) : (
                      <Badge bg="warning">Pending Verification</Badge>
                    )}
                  </p>
                </div>
              </div>
              
              <p>{selectedShelter.description}</p>
            </div>
            
            <div className="mb-4">
              <h5>Contact Information</h5>
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Contact Person:</strong> {selectedShelter.contactPerson?.name || 'N/A'}</p>
                  <p><strong>Position:</strong> {selectedShelter.contactPerson?.position || 'N/A'}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Email:</strong> {selectedShelter.contactPerson?.email || 'N/A'}</p>
                  <p><strong>Phone:</strong> {selectedShelter.contactPerson?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            {selectedShelter.website && (
              <p><strong>Website:</strong> <a href={selectedShelter.website} target="_blank" rel="noopener noreferrer">{selectedShelter.website}</a></p>
            )}
            
            {selectedShelter.socialMedia && (
              <div className="mb-4">
                <h5>Social Media</h5>
                <div className="row">
                  {selectedShelter.socialMedia.facebook && (
                    <div className="col-md-4">
                      <p><strong>Facebook:</strong> {selectedShelter.socialMedia.facebook}</p>
                    </div>
                  )}
                  {selectedShelter.socialMedia.instagram && (
                    <div className="col-md-4">
                      <p><strong>Instagram:</strong> {selectedShelter.socialMedia.instagram}</p>
                    </div>
                  )}
                  {selectedShelter.socialMedia.twitter && (
                    <div className="col-md-4">
                      <p><strong>Twitter:</strong> {selectedShelter.socialMedia.twitter}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {selectedShelter.operatingHours && selectedShelter.operatingHours.length > 0 && (
              <div className="mb-4">
                <h5>Operating Hours</h5>
                <Table striped bordered size="sm">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedShelter.operatingHours.map((hours, index) => (
                      <tr key={index}>
                        <td>{hours.day}</td>
                        <td>
                          {hours.isClosed ? 'Closed' : `${hours.open} - ${hours.close}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            
            {selectedShelter.pets && selectedShelter.pets.length > 0 && (
              <div className="mb-4">
                <h5>Pets ({selectedShelter.pets.length})</h5>
                <div className="shelter-pets-preview">
                  <div className="row">
                    {selectedShelter.pets.slice(0, 8).map((pet, index) => (
                      <div key={index} className="col-md-3 col-6 mb-3">
                        <div className="pet-card-small">
                          <img
                            src={pet.photos?.[0] 
                              ? `/uploads/pets/${pet.photos[0]}` 
                              : '/images/pet-placeholder-small.jpg'
                            }
                            alt={pet.name}
                            className="img-fluid rounded"
                          />
                          <div className="pet-name">{pet.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedShelter.pets.length > 8 && (
                    <div className="text-center">
                      <p className="text-muted">+ {selectedShelter.pets.length - 8} more pets</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {selectedShelter.verificationDocuments && selectedShelter.verificationDocuments.length > 0 && (
              <div className="mb-4">
                <h5>Verification Documents</h5>
                <div className="row">
                  {selectedShelter.verificationDocuments.map((doc, index) => (
                    <div key={index} className="col-md-4 mb-3">
                      <div className="document-card">
                        <a 
                          href={`/uploads/shelters/documents/${doc}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm w-100"
                        >
                          View Document {index + 1}
                        </a>
                      </div>
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
            {selectedShelter.verified ? (
              <Button 
                variant="danger" 
                onClick={() => {
                  onVerify(selectedShelter._id, false);
                  handleCloseDetails();
                }}
              >
                Revoke Verification
              </Button>
            ) : (
              <Button 
                variant="success" 
                onClick={() => {
                  onVerify(selectedShelter._id, true);
                  handleCloseDetails();
                }}
              >
                Verify Shelter
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ManageShelters;
