// client/src/components/Common/Header.js
import React, { useContext } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
const logoPath = '/images/logo.svg';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4 shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
        <img
            src={logoPath}
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
            alt="Pet Adoption Portal Logo"
        />
        Pet Adoption Portal
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                <NavDropdown title={user?.name || 'Account'} id="basic-nav-dropdown">
                  {user?.role === 'admin' && (
                    <NavDropdown.Item as={Link} to="/admin">Admin Dashboard</NavDropdown.Item>
                  )}
                  {user?.role === 'shelter' && (
                    <>
                      <NavDropdown.Item as={Link} to="/shelter-dashboard">Shelter Dashboard</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/add-pet">Add New Pet</NavDropdown.Item>
                    </>
                  )}
                  {user?.role === 'user' && (
                    <NavDropdown.Item as={Link} to="/dashboard">My Dashboard</NavDropdown.Item>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
