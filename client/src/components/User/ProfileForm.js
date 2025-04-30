// client/src/components/User/ProfileForm.js
import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

const ProfileForm = ({ user, onSubmit, loading, isPasswordForm = false }) => {
  // Validation schemas
  const profileValidationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    address: Yup.object({
      street: Yup.string().required('Street address is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      zipCode: Yup.string().required('Zip code is required'),
      country: Yup.string().required('Country is required')
    })
  });

  const passwordValidationSchema = Yup.object({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
      .required('New password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm password is required')
  });

  // Initial values
  const profileInitialValues = {
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || ''
    }
  };

  const passwordInitialValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  return (
    <Formik
      initialValues={isPasswordForm ? passwordInitialValues : profileInitialValues}
      validationSchema={isPasswordForm ? passwordValidationSchema : profileValidationSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          {isPasswordForm ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Current Password*</Form.Label>
                <Form.Control
                  type="password"
                  name="currentPassword"
                  value={values.currentPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.currentPassword && errors.currentPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.currentPassword}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>New Password*</Form.Label>
                <Form.Control
                  type="password"
                  name="newPassword"
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.newPassword && errors.newPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.newPassword}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Password must be at least 6 characters long.
                </Form.Text>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Confirm New Password*</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.confirmPassword && errors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
            </>
          ) : (
            <>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name*</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.name && errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email*</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.email && errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Phone Number*</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.phone && errors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </Form.Group>
              
              <div className="mb-3">
                <h5>Address</h5>
                
                <Form.Group className="mb-3">
                  <Form.Label>Street Address*</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.street"
                    value={values.address.street}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.address?.street && errors.address?.street}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address?.street}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City*</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.city"
                        value={values.address.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.address?.city && errors.address?.city}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.address?.city}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>State/Province*</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.state"
                        value={values.address.state}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.address?.state && errors.address?.state}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.address?.state}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Zip/Postal Code*</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.zipCode"
                        value={values.address.zipCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.address?.zipCode && errors.address?.zipCode}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.address?.zipCode}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Country*</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.country"
                        value={values.address.country}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.address?.country && errors.address?.country}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.address?.country}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </>
          )}
          
          <div className="d-grid mt-4">
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Saving...' : isPasswordForm ? 'Update Password' : 'Save Changes'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ProfileForm;
