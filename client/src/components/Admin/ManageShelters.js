// client/src/components/Admin/ManageShelters.js
import React, { useState } from 'react';
import { Card, Table, Badge, Button, Form, Modal } from 'react-bootstrap';
import { FaEye, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';
import Pagination from '../Common/Pagination';
import { Link } from 'react-router-dom';

const ManageShelters = ({ shelters, loading, error, onVerify }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // Добавляем состояние для фильтра
  const [showDetails, setShowDetails] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState(null);
  
  // Фильтрация приютов с учетом статуса верификации
  const filteredShelters = shelters.filter(shelter => {
    const shelterName = shelter.name?.toLowerCase() || '';
    const contactName = shelter.contactPerson?.name?.toLowerCase() || '';
    const email = shelter.contactPerson?.email?.toLowerCase() || '';
    
    const term = searchTerm.toLowerCase();
    
    // Проверяем соответствие поисковому запросу
    const matchesSearch = shelterName.includes(term) || 
           contactName.includes(term) || 
           email.includes(term);
    
    // Проверяем соответствие статусу верификации
    const matchesStatus = statusFilter === '' || 
                          (statusFilter === 'verified' && shelter.verified) ||
                          (statusFilter === 'unverified' && !shelter.verified);
    
    return matchesSearch && matchesStatus;
  });
  
  // Пагинация
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
  
  // Обработчик изменения фильтра статуса
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Сбрасываем на первую страницу при смене фильтра
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
            <Form.Select 
                className="w-auto"
                value={statusFilter}
                onChange={handleStatusFilterChange}
            >
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
                {/* Аватар приюта - заменяем изображение на блок с инициалами */}
                <div className="shelter-avatar me-3" style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'var(--primary-color)',
                    borderRadius: 'var(--border-radius)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: '600'
                }}>
                    {selectedShelter.name?.charAt(0)?.toUpperCase() || 'S'}
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
                    {/* Заменяем карточки с изображениями питомцев на текстовое описание */}
                    <p className="text-muted mb-2">This shelter manages {selectedShelter.pets.length} pet(s).</p>
                    <Button 
                    as={Link} 
                    to="/pets" 
                    variant="outline-primary" 
                    size="sm"
                    >
                    View All Pets
                    </Button>
                </div>
                </div>
            )}
            
            {selectedShelter.verificationDocuments && selectedShelter.verificationDocuments.length > 0 && (
                <div className="mb-4">
                <h5>Verification Documents</h5>
                <p className="text-muted">{selectedShelter.verificationDocuments.length} document(s) submitted for verification.</p>
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
