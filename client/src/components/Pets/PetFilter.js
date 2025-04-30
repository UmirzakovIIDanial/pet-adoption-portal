// client/src/components/Pets/PetFilter.js
import React, { useState } from 'react';
import { Form, Row, Col, Card, Button, Collapse } from 'react-bootstrap';
import { FaFilter, FaTimes } from 'react-icons/fa';

const PetFilter = ({ filters, onFilterChange, onClearFilters }) => {
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    type: filters.type || '',
    breed: filters.breed || '',
    gender: filters.gender || '',
    size: filters.size || '',
    age: filters.age || ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(formValues);
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };
  
  const handleClear = () => {
    setFormValues({
      type: '',
      breed: '',
      gender: '',
      size: '',
      age: ''
    });
    onClearFilters();
  };
  
  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaFilter className="me-2" />
          Filter Pets
        </h5>
        <Button
          variant="primary"
          onClick={() => setOpen(!open)}
          aria-controls="filter-collapse"
          aria-expanded={open}
          className="d-md-none"
        >
          {open ? 'Hide' : 'Show'} Filters
        </Button>
      </Card.Header>
      <Collapse in={open || window.innerWidth >= 768}>
        <div id="filter-collapse">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={4} lg={2} className="mb-3">
                  <Form.Group>
                    <Form.Label>Pet Type</Form.Label>
                    <Form.Select
                      name="type"
                      value={formValues.type}
                      onChange={handleChange}
                    >
                      <option value="">All Types</option>
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Rabbit">Rabbit</option>
                      <option value="Hamster">Hamster</option>
                      <option value="Guinea Pig">Guinea Pig</option>
                      <option value="Fish">Fish</option>
                      <option value="Turtle">Turtle</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} lg={2} className="mb-3">
                  <Form.Group>
                    <Form.Label>Breed</Form.Label>
                    <Form.Control
                      type="text"
                      name="breed"
                      value={formValues.breed}
                      onChange={handleChange}
                      placeholder="Any breed"
                    />
                  </Form.Group>
                </Col>
                <Col md={4} lg={2} className="mb-3">
                  <Form.Group>
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      name="gender"
                      value={formValues.gender}
                      onChange={handleChange}
                    >
                      <option value="">Any Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} lg={2} className="mb-3">
                  <Form.Group>
                    <Form.Label>Size</Form.Label>
                    <Form.Select
                      name="size"
                      value={formValues.size}
                      onChange={handleChange}
                    >
                      <option value="">Any Size</option>
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                      <option value="Extra Large">Extra Large</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} lg={2} className="mb-3">
                  <Form.Group>
                    <Form.Label>Age</Form.Label>
                    <Form.Select
                      name="age"
                      value={formValues.age}
                      onChange={handleChange}
                    >
                      <option value="">Any Age</option>
                      <option value="0-1">Under 1 year</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-7">3-7 years</option>
                      <option value="7-100">7+ years</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} lg={2} className="mb-3 d-flex align-items-end">
                  <div className="d-grid gap-2 w-100">
                    <Button variant="primary" type="submit">
                      Apply Filters
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      type="button" 
                      onClick={handleClear}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <FaTimes className="me-1" /> Clear
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </div>
      </Collapse>
    </Card>
  );
};

export default PetFilter;