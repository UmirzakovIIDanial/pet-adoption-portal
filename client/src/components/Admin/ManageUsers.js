import React, { useState } from 'react';
import { Card, Table, Badge, Button, Form } from 'react-bootstrap';
import { FaEye, FaSearch } from 'react-icons/fa';
import Pagination from '../Common/Pagination';

const ManageUsers = ({ users, loading, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const userName = user.name?.toLowerCase() || '';
    const userEmail = user.email?.toLowerCase() || '';
    const userRole = user.role?.toLowerCase() || '';
    
    const term = searchTerm.toLowerCase();
    
    return userName.includes(term) || 
           userEmail.includes(term) || 
           userRole.includes(term);
  });
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
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
            <Form.Select className="w-auto">
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
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
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
                            href={`/admin/users/${user._id}`}
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
    </div>
  );
};

export default ManageUsers;
