// client/src/components/Admin/AdminDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Nav, Tab } from 'react-bootstrap';
import { FaChartLine, FaUsers, FaDog, FaClipboardList, FaBuilding } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import Statistics from './Statistics';
import ApplicationReview from './ApplicationReview';
import ManagePets from './ManagePets';
import ManageUsers from './ManageUsers';
import ManageShelters from './ManageShelters';
import Loader from '../Common/Loader';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('statistics');
  const [statistics, setStatistics] = useState(null);
  const [users, setUsers] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [pets, setPets] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/admin/statistics');
        setStatistics(res.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching statistics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatistics();
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Only fetch data for the active tab
        if (activeTab === 'users' || activeTab === 'statistics') {
          const usersRes = await axios.get('/api/admin/users');
          setUsers(usersRes.data.data);
        }
        
        if (activeTab === 'shelters' || activeTab === 'statistics') {
          const sheltersRes = await axios.get('/api/admin/shelters');
          setShelters(sheltersRes.data.data);
        }
        
        if (activeTab === 'pets' || activeTab === 'statistics') {
          const petsRes = await axios.get('/api/pets');
          setPets(petsRes.data.data);
        }
        
        if (activeTab === 'applications' || activeTab === 'statistics') {
          const adoptionsRes = await axios.get('/api/admin/adoptions');
          setAdoptions(adoptionsRes.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab]);
  
  const handleVerifyShelter = async (shelterId, verified) => {
    try {
      setLoading(true);
      const endpoint = verified 
        ? `/api/admin/shelters/${shelterId}/verify` 
        : `/api/admin/shelters/${shelterId}/reject`;
      
      await axios.put(endpoint);
      
      // Update shelters list
      setShelters(shelters.map(shelter => 
        shelter._id === shelterId 
          ? { ...shelter, verified } 
          : shelter
      ));
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating shelter verification');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={3} xl={2} className="mb-4">
          <Card className="admin-sidebar shadow-sm">
            <Card.Body className="p-0">
              <div className="admin-user p-3 border-bottom">
                <h5 className="mb-1">Admin Panel</h5>
                <p className="mb-0 text-muted small">{user?.name}</p>
              </div>
              
              <Nav className="flex-column admin-nav" variant="pills" activeKey={activeTab} onSelect={setActiveTab}>
                <Nav.Item>
                  <Nav.Link eventKey="statistics" className="d-flex align-items-center">
                    <FaChartLine className="me-2" />
                    <span>Statistics</span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="applications" className="d-flex align-items-center">
                    <FaClipboardList className="me-2" />
                    <span>Applications</span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="pets" className="d-flex align-items-center">
                    <FaDog className="me-2" />
                    <span>Manage Pets</span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="shelters" className="d-flex align-items-center">
                    <FaBuilding className="me-2" />
                    <span>Manage Shelters</span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="users" className="d-flex align-items-center">
                    <FaUsers className="me-2" />
                    <span>Manage Users</span>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={9} xl={10}>
          {loading ? (
            <Loader />
          ) : (
            <Tab.Content>
              <Tab.Pane active={activeTab === 'statistics'}>
                <Statistics 
                  statistics={statistics} 
                  loading={loading} 
                  error={error} 
                />
              </Tab.Pane>
              
              <Tab.Pane active={activeTab === 'applications'}>
                <ApplicationReview 
                  adoptions={adoptions} 
                  loading={loading} 
                  error={error} 
                />
              </Tab.Pane>
              
              <Tab.Pane active={activeTab === 'pets'}>
                <ManagePets 
                  pets={pets} 
                  loading={loading} 
                  error={error} 
                />
              </Tab.Pane>
              
              <Tab.Pane active={activeTab === 'shelters'}>
                <ManageShelters 
                  shelters={shelters} 
                  loading={loading} 
                  error={error} 
                  onVerify={handleVerifyShelter}
                />
              </Tab.Pane>
              
              <Tab.Pane active={activeTab === 'users'}>
                <ManageUsers 
                  users={users} 
                  loading={loading} 
                  error={error} 
                />
              </Tab.Pane>
            </Tab.Content>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
