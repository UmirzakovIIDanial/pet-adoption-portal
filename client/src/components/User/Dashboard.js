// client/src/components/User/Dashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Tab, Nav, Badge, Table } from 'react-bootstrap';
import { FaPaw, FaClipboardList, FaUserEdit, FaKey } from 'react-icons/fa';
import { PetContext } from '../../contexts/PetContext';
import { AuthContext } from '../../contexts/AuthContext';
import Loader from '../Common/Loader';
import ProfileForm from './ProfileForm';

const Dashboard = () => {
  const { getUserAdoptions, adoptions, loading: petLoading } = useContext(PetContext);
  const { user, updateProfile, changePassword, loading: authLoading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('applications');

  useEffect(() => {
    getUserAdoptions();
  }, [getUserAdoptions]);

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

  if (petLoading || authLoading) {
    return <Loader />;
  }

  return (
    <Container className="py-5">
      <Row>
        <Col md={3} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body>
              <div className="text-center mb-4">
                <div className="avatar-circle mb-3">
                  <span className="avatar-initials">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <h5 className="mb-0">{user?.name}</h5>
                <p className="text-muted small">{user?.email}</p>
              </div>
              
              <Nav className="flex-column dashboard-nav" variant="pills" activeKey={activeTab} onSelect={setActiveTab}>
                <Nav.Item>
                  <Nav.Link eventKey="applications" className="d-flex align-items-center">
                    <FaClipboardList className="me-2" />
                    <span>My Applications</span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="profile" className="d-flex align-items-center">
                    <FaUserEdit className="me-2" />
                    <span>Edit Profile</span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="password" className="d-flex align-items-center">
                    <FaKey className="me-2" />
                    <span>Change Password</span>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={9}>
          <Card className="shadow-sm">
            <Card.Body>
              <Tab.Content>
                <Tab.Pane active={activeTab === 'applications'}>
                  <h4 className="mb-4">
                    <FaClipboardList className="me-2" />
                    My Adoption Applications
                  </h4>
                  
                  {adoptions.length === 0 ? (
                    <div className="text-center py-5">
                      <div className="mb-3">
                        <FaPaw size={48} className="text-muted" />
                      </div>
                      <h5>No adoption applications yet</h5>
                      <p className="text-muted">
                        Browse our available pets and submit an application when you find your perfect match!
                      </p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table hover>
                        <thead>
                          <tr>
                            <th>Pet</th>
                            <th>Submitted On</th>
                            <th>Status</th>
                            <th>Shelter</th>
                            <th>Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adoptions.map(adoption => (
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
                                  <div>
                                    <div className="fw-bold">{adoption.pet?.name}</div>
                                    <div className="small text-muted">
                                      {adoption.pet?.breed}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                {new Date(adoption.submittedAt).toLocaleDateString()}
                              </td>
                              <td>
                                <Badge bg={getStatusBadgeVariant(adoption.status)}>
                                  {adoption.status}
                                </Badge>
                              </td>
                              <td>
                                {adoption.shelter?.name || 'Unknown Shelter'}
                              </td>
                              <td>
                                <button className="btn btn-sm btn-outline-primary">
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Tab.Pane>
                
                <Tab.Pane active={activeTab === 'profile'}>
                  <h4 className="mb-4">
                    <FaUserEdit className="me-2" />
                    Edit Profile
                  </h4>
                  
                  <ProfileForm
                    user={user}
                    onSubmit={updateProfile}
                    loading={authLoading}
                  />
                </Tab.Pane>
                
                <Tab.Pane active={activeTab === 'password'}>
                  <h4 className="mb-4">
                    <FaKey className="me-2" />
                    Change Password
                  </h4>
                  
                  <ProfileForm
                    isPasswordForm={true}
                    onSubmit={changePassword}
                    loading={authLoading}
                  />
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
