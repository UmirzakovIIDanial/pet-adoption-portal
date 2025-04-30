// client/src/components/Pets/PetFilter.js
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import { FaFilter, FaTimes } from 'react-icons/fa';

const PetFilter = ({ filters, onFilterChange, onClearFilters }) => {
  // Локальное состояние для формы
  const [localFilters, setLocalFilters] = useState({
    type: '',
    gender: '',
    size: '',
    age: ''
  });
  
  // Синхронизируем локальное состояние с пропсами
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with values:', localFilters);
    onFilterChange(localFilters);
  };
  
  // Обработчик очистки фильтров
  const handleClear = () => {
    const emptyFilters = {
      type: '',
      gender: '',
      size: '',
      age: ''
    };
    setLocalFilters(emptyFilters);
    onClearFilters();
  };
  
  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FaFilter className="me-2" />
            Filter Pets
          </h5>
        </div>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={3} className="mb-3">
              <Form.Group>
                <Form.Label>Pet Type</Form.Label>
                <Form.Select
                  name="type"
                  value={localFilters.type}
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
            <Col md={3} className="mb-3">
              <Form.Group>
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={localFilters.gender}
                  onChange={handleChange}
                >
                  <option value="">Any Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className="mb-3">
              <Form.Group>
                <Form.Label>Size</Form.Label>
                <Form.Select
                  name="size"
                  value={localFilters.size}
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
            <Col md={3} className="mb-3">
              <Form.Group>
                <Form.Label>Age</Form.Label>
                <Form.Select
                  name="age"
                  value={localFilters.age}
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
          </Row>
          <div className="d-flex justify-content-end mt-3">
            <Button 
              variant="outline-secondary" 
              onClick={handleClear}
              className="me-2"
              type="button"
            >
              <FaTimes className="me-1" /> Clear
            </Button>
            <Button 
              variant="primary" 
              type="submit"
            >
              Apply Filters
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PetFilter;