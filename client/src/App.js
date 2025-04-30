// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PetDetailPage from './pages/PetDetailPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import ShelterDashboardPage from './pages/ShelterDashboardPage';
import AddPetPage from './pages/AddPetPage';
import PetsPage from './pages/PetsPage';
import EditPetPage from './pages/EditPetPage';

// Routes
import PrivateRoute from './components/Common/PrivateRoute';

// Context
import { AuthProvider } from './contexts/AuthContext';
import { PetProvider } from './contexts/PetContext';

// Styles
import './assets/styles/main.css';

function App() {
  return (
    <AuthProvider>
      <PetProvider>
        <Router>
          <div className="app-container">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/pets" element={<PetsPage />} />
                <Route path="/pets/:id" element={<PetDetailPage />} />

                <Route 
                  path="/edit-pet/:id" 
                  element={
                    <PrivateRoute requiredRole="shelter">
                      <EditPetPage />
                    </PrivateRoute>
                  } 
                />
                
                {/* Private Routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <UserDashboardPage />
                    </PrivateRoute>
                  } 
                />
                
                <Route 
                  path="/shelter-dashboard" 
                  element={
                    <PrivateRoute requiredRole="shelter">
                      <ShelterDashboardPage />
                    </PrivateRoute>
                  } 
                />
                
                <Route 
                  path="/add-pet" 
                  element={
                    <PrivateRoute requiredRole="shelter">
                      <AddPetPage />
                    </PrivateRoute>
                  } 
                />
                
                <Route 
                  path="/admin" 
                  element={
                    <PrivateRoute requiredRole="admin">
                      <AdminPage />
                    </PrivateRoute>
                  } 
                />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </Router>
      </PetProvider>
    </AuthProvider>
  );
}

export default App;