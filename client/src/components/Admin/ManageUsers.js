// client/src/components/Admin/ManageUsers.js
import React, { useState } from 'react';
import { Card, Table, Badge, Button, Form, Modal, Row, Col } from 'react-bootstrap';
import { FaEye, FaSearch, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import Pagination from '../Common/Pagination';

const ManageUsers = ({ users, loading, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState(''); // Добавляем состояние для фильтра ролей
  const [showUserDetails, setShowUserDetails] = useState(false); // Для модального окна
  const [selectedUser, setSelectedUser] = useState(null); // Выбранный пользователь для просмотра
  
  // Фильтрация пользователей с учетом фильтра ролей
  const filteredUsers = users.filter(user => {
    const userName = user.name?.toLowerCase() || '';
    const userEmail = user.email?.toLowerCase() || '';
    const userRole = user.role?.toLowerCase() || '';
    
    const term = searchTerm.toLowerCase();
    
    // Проверяем соответствие поисковому запросу
    const matchesSearch = userName.includes(term) || 
           userEmail.includes(term) || 
           userRole.includes(term);
    
    // Проверяем соответствие фильтру ролей
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
  
  // Пагинация
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Обработчик изменения фильтра ролей
  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1); // Сбрасываем на первую страницу при смене фильтра
  };
  
  // Обработчик для просмотра деталей пользователя
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };
  
  // Определяем цвет бейджа по роли
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'shelter':
        return 'success';
      case 'user':
        return 'primary';
      default:
        return 'secondary';
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
      <h3 className="mb-4">Manage Users</h3>
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex mb-3">
            <div className="search-box position-relative w-100 me-2">
              <FaSearch className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search by name, email or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ps-4"
              />
            </div>
            <Form.Select 
              className="w-auto"
              value={roleFilter}
              onChange={handleRoleFilterChange}
            >
              <option value="">All Roles</option>
              <option value="user">Regular Users</option>
              <option value="shelter">Shelters</option>
              <option value="admin">Admins</option>
            </Form.Select>
          </div>
          
          {currentItems.length === 0 ? (
            <div className="text-center py-5">
              <p className="mb-0">No users found</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>Registered On</th>
                      <th>Location</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="user-avatar me-2">
                              {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div>{user.name || 'Unknown'}</div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <Badge bg={getRoleBadgeVariant(user.role || 'unknown')}>
                            {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Unknown'}
                          </Badge>
                        </td>
                        <td>{user.phone || 'N/A'}</td>
                        <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          {user.address?.city && user.address?.country 
                            ? `${user.address.city}, ${user.address.country}`
                            : 'N/A'
                          }
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleViewUser(user)}
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
                totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </Card.Body>
      </Card>
      
      {/* Модальное окно с деталями пользователя */}
      {selectedUser && (
        <Modal 
          show={showUserDetails} 
          onHide={() => setShowUserDetails(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>User Details: {selectedUser.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-4">
              <Col md={6} className="mb-3">
                <h5><FaUser className="me-2" /> User Information</h5>
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
                <p>
                  <strong>Registration Date:</strong> {selectedUser.createdAt ? 
                    new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                </p>
                <p>
                  <strong>Role:</strong> 
                  <Badge 
                    bg={getRoleBadgeVariant(selectedUser.role)} 
                    className="ms-2"
                  >
                    {selectedUser.role ? 
                      selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1) : 'Unknown'}
                  </Badge>
                </p>
              </Col>
              <Col md={6} className="mb-3">
                <h5><FaMapMarkerAlt className="me-2" /> Address</h5>
                {selectedUser.address ? (
                  <>
                    <p><strong>Street:</strong> {selectedUser.address.street || 'N/A'}</p>
                    <p><strong>City:</strong> {selectedUser.address.city || 'N/A'}</p>
                    <p><strong>State:</strong> {selectedUser.address.state || 'N/A'}</p>
                    <p><strong>Zip:</strong> {selectedUser.address.zipCode || 'N/A'}</p>
                    <p><strong>Country:</strong> {selectedUser.address.country || 'N/A'}</p>
                  </>
                ) : (
                  <p>No address information available.</p>
                )}
              </Col>
            </Row>
            
            {selectedUser.adoptionHistory && selectedUser.adoptionHistory.length > 0 && (
              <div className="mb-4">
                <h5>Adoption Applications</h5>
                <p>This user has {selectedUser.adoptionHistory.length} adoption applications.</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUserDetails(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ManageUsers;