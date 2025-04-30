// client/src/pages/PetDetailPage.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Alert, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import PetDetail from '../components/Pets/PetDetail';
import Loader from '../components/Common/Loader';
import { PetContext } from '../contexts/PetContext';
import { AuthContext } from '../contexts/AuthContext';

const PetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPet, pet, loading, error, submitAdoption } = useContext(PetContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    getPet(id);
  }, [getPet, id]);
  
  const handleAdoptionSubmit = async (formData) => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/pets/${id}`);
      return;
    }
    
    setSubmitting(true);
    
    try {
      await submitAdoption(id, formData);
      toast.success('Your adoption application has been submitted!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('There was an error submitting your application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <Loader />;
  }
  
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          Error: {error}
        </Alert>
        <Button 
          variant="primary" 
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Container>
    );
  }
  
  if (!pet) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Pet not found. It may have been removed or is no longer available.
        </Alert>
        <Button 
          variant="primary" 
          onClick={() => navigate('/pets')}
        >
          Browse Available Pets
        </Button>
      </Container>
    );
  }
  
  return (
    <PetDetail 
      pet={pet} 
      onAdoptionSubmit={handleAdoptionSubmit} 
      loading={submitting}
    />
  );
};

export default PetDetailPage;
