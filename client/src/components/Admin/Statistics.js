// client/src/components/Admin/Statistics.js
import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaDog, FaHandHoldingHeart, FaBuilding, FaPaw } from 'react-icons/fa';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Loader from '../Common/Loader';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Title, Tooltip, Legend);

const Statistics = ({ statistics, loading, error }) => {
  if (loading) {
    return <Loader />;
  }
  
  if (error) {
    return (
      <div className="alert alert-danger">
        Error: {error}
      </div>
    );
  }
  
  if (!statistics) {
    return null;
  }
  
  // Format data for monthly adoption chart
  const getMonthlyData = (data) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const months = Array(12).fill(0);
    
    if (data && data.length > 0) {
      data.forEach(item => {
        const monthIndex = item._id.month - 1;
        months[monthIndex] = item.count;
      });
    }
    
    return {
      labels: monthNames,
      datasets: [
        {
          label: 'Count',
          data: months,
          fill: false,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.4
        }
      ]
    };
  };
  
  // Prepare pet types data for pie chart
  const getPetTypesData = () => {
    const petTypes = statistics.pets.byType || [];
    
    return {
      labels: petTypes.map(type => type._id),
      datasets: [
        {
          data: petTypes.map(type => type.count),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#C9CBCF',
            '#7CFC00',
            '#FF7F50'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#C9CBCF',
            '#7CFC00',
            '#FF7F50'
          ]
        }
      ]
    };
  };
  
  // Prepare adoption status data for bar chart
  const getAdoptionStatusData = () => {
    return {
      labels: ['Pending', 'Approved', 'Rejected', 'Completed'],
      datasets: [
        {
          label: 'Adoption Applications',
          data: [
            statistics.adoptions.pending,
            statistics.adoptions.approved,
            statistics.adoptions.rejected,
            statistics.adoptions.completed
          ],
          backgroundColor: [
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)'
          ],
          borderColor: [
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };
  
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right'
      }
    }
  };
  
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Monthly Activity'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  
  return (
    <div>
      <h3 className="mb-4">Dashboard Statistics</h3>
      
      <Row className="mb-4">
        <Col sm={6} lg={3} className="mb-3">
          <Card className="shadow-sm h-100 stat-card">
            <Card.Body className="d-flex align-items-center">
              <div className="stat-icon bg-primary">
                <FaUsers size={24} />
              </div>
              <div className="ms-3">
                <h6 className="text-muted mb-0">Total Users</h6>
                <h3 className="mb-0">{statistics.users.total || 0}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col sm={6} lg={3} className="mb-3">
          <Card className="shadow-sm h-100 stat-card">
            <Card.Body className="d-flex align-items-center">
              <div className="stat-icon bg-success">
                <FaBuilding size={24} />
              </div>
              <div className="ms-3">
                <h6 className="text-muted mb-0">Shelters</h6>
                <h3 className="mb-0">{statistics.users.shelters || 0}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col sm={6} lg={3} className="mb-3">
          <Card className="shadow-sm h-100 stat-card">
            <Card.Body className="d-flex align-items-center">
              <div className="stat-icon bg-warning">
                <FaDog size={24} />
              </div>
              <div className="ms-3">
                <h6 className="text-muted mb-0">Pets</h6>
                <h3 className="mb-0">{statistics.pets.total || 0}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col sm={6} lg={3} className="mb-3">
          <Card className="shadow-sm h-100 stat-card">
            <Card.Body className="d-flex align-items-center">
              <div className="stat-icon bg-info">
                <FaHandHoldingHeart size={24} />
              </div>
              <div className="ms-3">
                <h6 className="text-muted mb-0">Adoptions</h6>
                <h3 className="mb-0">{statistics.adoptions.total || 0}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Monthly Adoptions</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Line 
                  data={getMonthlyData(statistics.adoptions.monthly)} 
                  options={lineOptions} 
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">New Pets Added</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Line 
                  data={getMonthlyData(statistics.newPets.monthly)} 
                  options={lineOptions} 
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Pet Types</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Pie 
                  data={getPetTypesData()} 
                  options={pieOptions} 
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Adoption Status</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={getAdoptionStatusData()} 
                  options={barOptions} 
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Pet Status</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-around">
                <div className="text-center">
                  <div className="d-flex align-items-center justify-content-center stat-circle bg-success">
                    <FaPaw size={24} />
                  </div>
                  <h4 className="mt-2">{statistics.pets.available || 0}</h4>
                  <p className="text-muted mb-0">Available</p>
                </div>
                
                <div className="text-center">
                  <div className="d-flex align-items-center justify-content-center stat-circle bg-warning">
                    <FaPaw size={24} />
                  </div>
                  <h4 className="mt-2">{statistics.pets.pending || 0}</h4>
                  <p className="text-muted mb-0">Pending</p>
                </div>
                
                <div className="text-center">
                  <div className="d-flex align-items-center justify-content-center stat-circle bg-secondary">
                    <FaPaw size={24} />
                  </div>
                  <h4 className="mt-2">{statistics.pets.adopted || 0}</h4>
                  <p className="text-muted mb-0">Adopted</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">User Distribution</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-around">
                <div className="text-center">
                  <div className="d-flex align-items-center justify-content-center stat-circle bg-primary">
                    <FaUsers size={24} />
                  </div>
                  <h4 className="mt-2">{statistics.users.regularUsers || 0}</h4>
                  <p className="text-muted mb-0">Regular Users</p>
                </div>
                
                <div className="text-center">
                  <div className="d-flex align-items-center justify-content-center stat-circle bg-success">
                    <FaBuilding size={24} />
                  </div>
                  <h4 className="mt-2">{statistics.users.shelters || 0}</h4>
                  <p className="text-muted mb-0">Shelters</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;
