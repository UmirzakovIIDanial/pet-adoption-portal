// client/src/pages/ShelterDashboardPage.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Table, Badge, Button, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaEdit, FaEye, FaTrash, FaClipboardList, FaPaw, FaChartLine } from 'react-icons/fa';
import { PetContext } from '../contexts/PetContext';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import Loader from '../components/Common/Loader';
import Pagination from '../components/Common/Pagination';
import Modal from '../components/Common/Modal';
import { toast } from 'react-toastify';

const ShelterDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('pets');
  const [shelter, setShelter] = useState(null);
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showApplicationDetail, setShowApplicationDetail] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  
  const { user } = useContext(AuthContext);
  const { pets, getPets, deletePet, loading: petsLoading } = useContext(PetContext);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchShelterData = async () => {
      try {
        setLoading(true);
        
        // Получаем профиль приюта
        try {
          const shelterRes = await axios.get('/api/users/shelter');
          if (isMounted) {
            setShelter(shelterRes.data.data);
          }
        } catch (shelterErr) {
          console.error('Error fetching shelter data:', shelterErr);
        }
        
        // Получаем питомцев
        if (isMounted) {
          await getPets();
        }
        
        // Получаем заявки на усыновление
        try {
          const adoptionsRes = await axios.get('/api/users/shelter/adoptions');
          if (isMounted) {
            setAdoptions(adoptionsRes.data.data || []);
          }
        } catch (adoptionsErr) {
          console.error('Error fetching adoptions:', adoptionsErr);
          if (isMounted) {
            setAdoptions([]);
          }
        }
        
        if (isMounted) {
          setLoading(false);
        }
      } catch (err) {
        console.error('General error:', err);
        if (isMounted) {
          setError(err.response?.data?.error || 'Error fetching shelter data');
          setLoading(false);
        }
      }
    };
    
    fetchShelterData();
    
    // Функция очистки
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleDeleteClick = (pet) => {
    setPetToDelete(pet);
    setShowDeleteModal(true);
  };
  
  const handleConfirmDelete = async () => {
    if (petToDelete) {
      const success = await deletePet(petToDelete._id);
      
      if (success) {
        toast.success(`${petToDelete.name} has been removed`);
      }
      
      setShowDeleteModal(false);
      setPetToDelete(null);
    }
  };
  
  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setApplicationStatus(application.status);
    setStatusComment('');
    setShowApplicationDetail(true);
  };
  
  const handleUpdateStatus = async () => {
    if (!selectedApplication || !applicationStatus) return;
    
    try {
      setStatusLoading(true);
      
      const updateData = {
        status: applicationStatus,
        approvalDetails: {
          comments: statusComment
        }
      };
      
      const res = await axios.put(`/api/users/adoptions/${selectedApplication._id}`, updateData);
      
      // Update adoptions list with new status
      setAdoptions(adoptions.map(adoption => 
        adoption._id === selectedApplication._id ? res.data.data : adoption
      ));
      
      toast.success(`Application status updated to ${applicationStatus}`);
      setShowApplicationDetail(false);
      setSelectedApplication(null);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error updating application status');
    } finally {
      setStatusLoading(false);
    }
  };
  
  // Filter pets based on search term
  const filteredPets = pets
    .filter(pet => pet.shelter === user._id)
    .filter(pet => {
      const term = searchTerm.toLowerCase();
      return (
        pet.name.toLowerCase().includes(term) ||
        pet.breed.toLowerCase().includes(term) ||
        pet.type.toLowerCase().includes(term) ||
        pet.adoptionStatus.toLowerCase().includes(term)
      );
    });
  
  // Filter adoptions based on search term
  const filteredAdoptions = adoptions.filter(adoption => {
    const term = searchTerm.toLowerCase();
    return (
      adoption.pet?.name?.toLowerCase().includes(term) ||
      adoption.applicant?.name?.toLowerCase().includes(term) ||
      adoption.status.toLowerCase().includes(term)
    );
  });
  
  // Pagination for pets
  const indexOfLastPet = currentPage * itemsPerPage;
  const indexOfFirstPet = indexOfLastPet - itemsPerPage;
  const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);
  
  // Pagination for adoptions
  const indexOfLastAdoption = currentPage * itemsPerPage;
  const indexOfFirstAdoption = indexOfLastAdoption - itemsPerPage;
  const currentAdoptions = filteredAdoptions.slice(indexOfFirstAdoption, indexOfFirstAdoption + itemsPerPage);
  
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
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'danger';
      case 'Completed':
        return 'primary';
      default:
        return 'primary';
    }
  };
  
  if (loading || petsLoading) {
    return <Loader />;
  }
  
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }
  
  const shelterPets = pets.filter(pet => pet.shelter === user?._id) || [];
  
  // Count statistics
  const totalPets = shelterPets.length;
  const availablePets = shelterPets.filter(pet => pet.adoptionStatus === 'Available').length;
  const pendingPets = shelterPets.filter(pet => pet.adoptionStatus === 'Pending').length;
  const adoptedPets = shelterPets.filter(pet => pet.adoptionStatus === 'Adopted').length;
  
  const totalApplications = adoptions.length;
  const pendingApplications = adoptions.filter(app => app.status === 'Pending').length;
  const approvedApplications = adoptions.filter(app => app.status === 'Approved').length;
  const rejectedApplications = adoptions.filter(app => app.status === 'Rejected').length;
  
  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={3} xl={2} className="mb-4">
          <Card className="shadow-sm shelter-sidebar">
            <Card.Body className="p-0">
              <div className="shelter-profile p-3 border-bottom">
                <div className="text-center mb-3">
                  <div className="shelter-avatar mb-2">
                    {shelter?.name?.charAt(0).toUpperCase() || 'S'}
                  </div>
                  <h5 className="mb-1">{shelter?.name || user?.name}</h5>
                  <p className="mb-0 text-muted small">
                    {shelter?.verified ? (
                      <Badge bg="success">Verified Shelter</Badge>
                    ) : (
                      <Badge bg="warning">Pending Verification</Badge>
                    )}
                  </p>
                </div>
              </div>
              
              <Nav className="flex-column shelter-nav" variant="pills" activeKey={activeTab} onSelect={setActiveTab}>
                <Nav.Item>
                  <Nav.Link eventKey="pets" className="d-flex align-items-center">
                    <FaPaw className="me-2" />
                    <span>My Pets</span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="applications" className="d-flex align-items-center">
                    <FaClipboardList className="me-2" />
                    <span>Adoption Applications</span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="stats" className="d-flex align-items-center">
                    <FaChartLine className="me-2" />
                    <span>Statistics</span>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              
              <div className="p-3">
                <Button 
                  as={Link} 
                  to="/add-pet" 
                  variant="primary" 
                  className="w-100"
                >
                  <FaPlus className="me-2" />
                  Add New Pet
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={9} xl={10}>
          <Tab.Content>
            <Tab.Pane active={activeTab === 'pets'}>
              <Card className="shadow-sm">
                <Card.Header className="bg-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">My Pets</h4>
                    <Link to="/add-pet" className="btn btn-sm btn-primary">
                      <FaPlus className="me-1" /> Add Pet
                    </Link>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex mb-3">
                    <div className="search-box position-relative w-100">
                      <FaSearch className="search-icon" />
                      <Form.Control
                        type="text"
                        placeholder="Search pets by name, breed, type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="ps-4"
                      />
                    </div>
                  </div>
                  
                  {currentPets.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="mb-3">You haven't added any pets yet.</p>
                      <Button 
                        as={Link} 
                        to="/add-pet" 
                        variant="primary"
                      >
                        <FaPlus className="me-2" />
                        Add Your First Pet
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <Table hover className="shelter-table">
                          <thead>
                            <tr>
                              <th>Pet</th>
                              <th>Type/Breed</th>
                              <th>Age</th>
                              <th>Gender</th>
                              <th>Status</th>
                              <th>Added On</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentPets.map(pet => (
                              <tr key={pet._id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div className="pet-thumbnail me-2">
                                      <img
                                        src={pet.photos && pet.photos.length > 0 
                                          ? `/uploads/pets/${pet.photos[0]}` 
                                          : '/images/pet-placeholder-small.jpg'
                                        }
                                        alt={pet.name}
                                        className="img-fluid rounded"
                                      />
                                    </div>
                                    <div className="fw-bold">{pet.name}</div>
                                  </div>
                                </td>
                                <td>
                                  <div>{pet.type}</div>
                                  <div className="small text-muted">{pet.breed}</div>
                                </td>
                                <td>
                                  {pet.age.years > 0 ? `${pet.age.years} yr${pet.age.years !== 1 ? 's' : ''}` : ''}
                                  {pet.age.years > 0 && pet.age.months > 0 ? ', ' : ''}
                                  {pet.age.months > 0 ? `${pet.age.months} mo${pet.age.months !== 1 ? 's' : ''}` : ''}
                                  {pet.age.years === 0 && pet.age.months === 0 ? 'Under 1 month' : ''}
                                </td>
                                <td>{pet.gender}</td>
                                <td>
                                  <Badge bg={getStatusBadgeVariant(pet.adoptionStatus)}>
                                    {pet.adoptionStatus}
                                  </Badge>
                                </td>
                                <td>{new Date(pet.createdAt).toLocaleDateString()}</td>
                                <td>
                                  <div className="d-flex gap-1">
                                    <Button 
                                      as={Link}
                                      to={`/pets/${pet._id}`}
                                      variant="outline-primary" 
                                      size="sm"
                                      title="View Pet"
                                    >
                                      <FaEye />
                                    </Button>
                                    <Button 
                                      as={Link}
                                      to={`/edit-pet/${pet._id}`}
                                      variant="outline-secondary" 
                                      size="sm"
                                      title="Edit Pet"
                                    >
                                      <FaEdit />
                                    </Button>
                                    <Button 
                                      variant="outline-danger" 
                                      size="sm"
                                      onClick={() => handleDeleteClick(pet)}
                                      title="Delete Pet"
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
            </Tab.Pane>
            
            <Tab.Pane active={activeTab === 'applications'}>
              <Card className="shadow-sm">
                <Card.Header className="bg-white">
                  <h4 className="mb-0">Adoption Applications</h4>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex mb-3">
                    <div className="search-box position-relative w-100 me-2">
                      <FaSearch className="search-icon" />
                      <Form.Control
                        type="text"
                        placeholder="Search applications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="ps-4"
                      />
                    </div>
                    <Form.Select className="w-auto">
                      <option value="">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Completed">Completed</option>
                    </Form.Select>
                  </div>
                  
                  {currentAdoptions.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="mb-0">No adoption applications found.</p>
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <Table hover className="shelter-table">
                          <thead>
                            <tr>
                              <th>Pet</th>
                              <th>Applicant</th>
                              <th>Submitted On</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentAdoptions.map(adoption => (
                              <tr key={adoption._id}>
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
                                    <div className="fw-bold">{adoption.pet?.name}</div>
                                  </div>
                                </td>
                                <td>
                                  <div>{adoption.applicant?.name}</div>
                                  <div className="small text-muted">{adoption.applicant?.email}</div>
                                </td>
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
                                    onClick={() => handleViewApplication(adoption)}
                                  >
                                    <FaEye className="me-1" /> View
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
            </Tab.Pane>
            
            <Tab.Pane active={activeTab === 'stats'}>
              <Row>
                <Col md={6} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Header className="bg-white">
                      <h5 className="mb-0">Pet Statistics</h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex justify-content-around">
                        <div className="text-center">
                          <div className="stat-circle bg-primary">
                            <FaPaw />
                          </div>
                          <h4 className="mt-2">{totalPets}</h4>
                          <p className="text-muted mb-0">Total Pets</p>
                        </div>
                        <div className="text-center">
                          <div className="stat-circle bg-success">
                            <FaPaw />
                          </div>
                          <h4 className="mt-2">{availablePets}</h4>
                          <p className="text-muted mb-0">Available</p>
                        </div>
                        <div className="text-center">
                          <div className="stat-circle bg-warning">
                            <FaPaw />
                          </div>
                          <h4 className="mt-2">{pendingPets}</h4>
                          <p className="text-muted mb-0">Pending</p>
                        </div>
                        <div className="text-center">
                          <div className="stat-circle bg-secondary">
                            <FaPaw />
                          </div>
                          <h4 className="mt-2">{adoptedPets}</h4>
                          <p className="text-muted mb-0">Adopted</p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Header className="bg-white">
                      <h5 className="mb-0">Application Statistics</h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex justify-content-around">
                        <div className="text-center">
                          <div className="stat-circle bg-primary">
                            <FaClipboardList />
                          </div>
                          <h4 className="mt-2">{totalApplications}</h4>
                          <p className="text-muted mb-0">Total</p>
                        </div>
                        <div className="text-center">
                          <div className="stat-circle bg-warning">
                            <FaClipboardList />
                          </div>
                          <h4 className="mt-2">{pendingApplications}</h4>
                          <p className="text-muted mb-0">Pending</p>
                        </div>
                        <div className="text-center">
                          <div className="stat-circle bg-success">
                            <FaClipboardList />
                          </div>
                          <h4 className="mt-2">{approvedApplications}</h4>
                          <p className="text-muted mb-0">Approved</p>
                        </div>
                        <div className="text-center">
                          <div className="stat-circle bg-danger">
                            <FaClipboardList />
                          </div>
                          <h4 className="mt-2">{rejectedApplications}</h4>
                          <p className="text-muted mb-0">Rejected</p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <Row>
                <Col>
                  <Card className="shadow-sm">
                    <Card.Header className="bg-white">
                      <h5 className="mb-0">Recent Activities</h5>
                    </Card.Header>
                    <Card.Body>
                      {/* This would be populated with actual data */}
                      <p className="text-center text-muted py-4">
                        Activity tracking will be available in a future update.
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
      
      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
      >
        <p>
          Are you sure you want to delete <strong>{petToDelete?.name}</strong>? 
          This action cannot be undone.
        </p>
        <div className="d-flex justify-content-end gap-2">
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </div>
      </Modal>
      
      {/* Application Detail Modal */}
      <Modal
        show={showApplicationDetail}
        onClose={() => setShowApplicationDetail(false)}
        title="Adoption Application Details"
        size="lg"
      >
        {selectedApplication && (
          <>
            <div className="mb-4">
              <div className="d-flex align-items-center mb-3">
                <div className="pet-thumbnail-lg me-3">
                  <img
                    src={selectedApplication.pet?.photos?.[0] 
                      ? `/uploads/pets/${selectedApplication.pet.photos[0]}` 
                      : '/images/pet-placeholder.jpg'
                    }
                    alt={selectedApplication.pet?.name}
                    className="img-fluid rounded"
                  />
                </div>
                <div>
                  <h5 className="mb-1">{selectedApplication.pet?.name}</h5>
                  <p className="mb-0 text-muted">{selectedApplication.pet?.breed}, {selectedApplication.pet?.gender}</p>
                  <Badge bg={getStatusBadgeVariant(selectedApplication.status)} className="mt-2">
                    {selectedApplication.status}
                  </Badge>
                </div>
              </div>
              
              <h5>Applicant Information</h5>
              <Row className="mb-3">
                <Col md={6}>
                  <p className="mb-1"><strong>Name:</strong> {selectedApplication.applicant?.name}</p>
                  <p className="mb-1"><strong>Email:</strong> {selectedApplication.applicant?.email}</p>
                  <p className="mb-1"><strong>Phone:</strong> {selectedApplication.applicant?.phone}</p>
                </Col>
                <Col md={6}>
                  <p className="mb-1"><strong>Submitted:</strong> {new Date(selectedApplication.submittedAt).toLocaleString()}</p>
                  <p className="mb-1"><strong>Last Updated:</strong> {new Date(selectedApplication.updatedAt).toLocaleString()}</p>
                </Col>
              </Row>
              
              <h5>Application Details</h5>
              <Row className="mb-3">
                <Col md={6}>
                  <p className="mb-1"><strong>Living Arrangement:</strong> {selectedApplication.applicationDetails.livingArrangement}</p>
                  <p className="mb-1"><strong>Has Children:</strong> {selectedApplication.applicationDetails.hasChildren ? 'Yes' : 'No'}</p>
                </Col>
                <Col md={6}>
                  <p className="mb-1"><strong>Has Other Pets:</strong> {selectedApplication.applicationDetails.hasOtherPets ? 'Yes' : 'No'}</p>
                  {selectedApplication.applicationDetails.hasOtherPets && (
                    <p className="mb-1"><strong>Other Pets:</strong> {selectedApplication.applicationDetails.otherPetsDetails}</p>
                  )}
                </Col>
              </Row>
              
              <div className="mb-3">
                <p className="mb-1"><strong>Work Schedule:</strong></p>
                <p className="mb-3">{selectedApplication.applicationDetails.workSchedule}</p>
                
                <p className="mb-1"><strong>Pet Care Experience:</strong></p>
                <p className="mb-3">{selectedApplication.applicationDetails.petCareExperience}</p>
                
                <p className="mb-1"><strong>Reason for Adoption:</strong></p>
                <p>{selectedApplication.applicationDetails.reasonForAdoption}</p>
              </div>
              
              {selectedApplication.applicationDetails.references && selectedApplication.applicationDetails.references.length > 0 && (
                <div className="mb-4">
                  <h5>References</h5>
                  {selectedApplication.applicationDetails.references.map((reference, index) => (
                    <div key={index} className="p-2 border rounded mb-2">
                      <Row>
                        <Col md={6}>
                          <p className="mb-1"><strong>Name:</strong> {reference.name}</p>
                          <p className="mb-1"><strong>Relationship:</strong> {reference.relationship}</p>
                        </Col>
                        <Col md={6}>
                          <p className="mb-1"><strong>Phone:</strong> {reference.phone}</p>
                          <p className="mb-1"><strong>Email:</strong> {reference.email}</p>
                        </Col>
                      </Row>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mb-4">
                <h5>Update Application Status</h5>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={applicationStatus}
                      onChange={(e) => setApplicationStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Completed">Completed</option>
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Comments</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Add any comments about this application"
                      value={statusComment}
                      onChange={(e) => setStatusComment(e.target.value)}
                    />
                  </Form.Group>
                </Form>
              </div>
            </div>
            
            <div className="d-flex justify-content-between">
              <Button 
                variant="secondary" 
                onClick={() => setShowApplicationDetail(false)}
              >
                Close
              </Button>
              <Button 
                variant="primary" 
                onClick={handleUpdateStatus}
                disabled={statusLoading || applicationStatus === selectedApplication.status}
              >
                {statusLoading ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default ShelterDashboardPage;