// client/src/components/User/AdoptionForm.js
import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  livingArrangement: Yup.string().required('Required'),
  hasChildren: Yup.boolean().required('Required'),
  hasOtherPets: Yup.boolean().required('Required'),
  otherPetsDetails: Yup.string().when('hasOtherPets', {
    is: true,
    then: Yup.string().required('Please provide details about your other pets')
  }),
  workSchedule: Yup.string().required('Required'),
  petCareExperience: Yup.string().required('Required'),
  reasonForAdoption: Yup.string().required('Required').min(20, 'Please provide more detailed reason'),
  vetDetails: Yup.object({
    name: Yup.string(),
    phone: Yup.string(),
    address: Yup.string()
  }),
  references: Yup.array().of(
    Yup.object({
      name: Yup.string().required('Name is required'),
      relationship: Yup.string().required('Relationship is required'),
      phone: Yup.string().required('Phone is required'),
      email: Yup.string().email('Invalid email').required('Email is required')
    })
  ).min(1, 'At least one reference is required')
});

const AdoptionForm = ({ petId, onSubmit, loading }) => {
  const [references, setReferences] = useState([
    { name: '', relationship: '', phone: '', email: '' }
  ]);

  const addReference = () => {
    setReferences([...references, { name: '', relationship: '', phone: '', email: '' }]);
  };

  const removeReference = (index) => {
    const newReferences = [...references];
    newReferences.splice(index, 1);
    setReferences(newReferences);
  };

  const initialValues = {
    livingArrangement: '',
    hasChildren: false,
    hasOtherPets: false,
    otherPetsDetails: '',
    workSchedule: '',
    petCareExperience: '',
    reasonForAdoption: '',
    vetDetails: {
      name: '',
      phone: '',
      address: ''
    },
    references: references
  };

  const handleSubmit = (values) => {
    onSubmit({
      ...values,
      pet: petId
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h5>Living Situation</h5>
            <Form.Group className="mb-3">
              <Form.Label>Living Arrangement*</Form.Label>
              <Form.Select
                name="livingArrangement"
                value={values.livingArrangement}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.livingArrangement && errors.livingArrangement}
              >
                <option value="">Select your living arrangement</option>
                <option value="House with yard">House with yard</option>
                <option value="House without yard">House without yard</option>
                <option value="Apartment">Apartment</option>
                <option value="Condo">Condo</option>
                <option value="Other">Other</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.livingArrangement}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Do you have children?*</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Yes"
                      name="hasChildren"
                      id="hasChildrenYes"
                      checked={values.hasChildren === true}
                      onChange={() => setFieldValue('hasChildren', true)}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="No"
                      name="hasChildren"
                      id="hasChildrenNo"
                      checked={values.hasChildren === false}
                      onChange={() => setFieldValue('hasChildren', false)}
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Do you have other pets?*</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Yes"
                      name="hasOtherPets"
                      id="hasOtherPetsYes"
                      checked={values.hasOtherPets === true}
                      onChange={() => setFieldValue('hasOtherPets', true)}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="No"
                      name="hasOtherPets"
                      id="hasOtherPetsNo"
                      checked={values.hasOtherPets === false}
                      onChange={() => setFieldValue('hasOtherPets', false)}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            {values.hasOtherPets && (
              <Form.Group className="mb-3">
                <Form.Label>Please provide details about your other pets*</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="otherPetsDetails"
                  value={values.otherPetsDetails}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.otherPetsDetails && errors.otherPetsDetails}
                  placeholder="Type, breed, age, temperament, etc."
                />
                <Form.Control.Feedback type="invalid">
                  {errors.otherPetsDetails}
                </Form.Control.Feedback>
              </Form.Group>
            )}
          </div>

          <div className="mb-4">
            <h5>Pet Care</h5>
            <Form.Group className="mb-3">
              <Form.Label>Work Schedule*</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="workSchedule"
                value={values.workSchedule}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.workSchedule && errors.workSchedule}
                placeholder="Describe your typical work schedule and how much time the pet will be alone."
              />
              <Form.Control.Feedback type="invalid">
                {errors.workSchedule}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Pet Care Experience*</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="petCareExperience"
                value={values.petCareExperience}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.petCareExperience && errors.petCareExperience}
                placeholder="Describe your experience with pets and your knowledge of pet care."
              />
              <Form.Control.Feedback type="invalid">
                {errors.petCareExperience}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reason for Adoption*</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="reasonForAdoption"
                value={values.reasonForAdoption}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.reasonForAdoption && errors.reasonForAdoption}
                placeholder="Why do you want to adopt this pet? What attracted you to this specific pet?"
              />
              <Form.Control.Feedback type="invalid">
                {errors.reasonForAdoption}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="mb-4">
            <h5>Veterinarian Information</h5>
            <p className="text-muted small">Optional, but recommended if you have a regular vet</p>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Veterinarian Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="vetDetails.name"
                    value={values.vetDetails.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Veterinarian Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="vetDetails.phone"
                    value={values.vetDetails.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Veterinarian Address</Form.Label>
              <Form.Control
                type="text"
                name="vetDetails.address"
                value={values.vetDetails.address}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Group>
          </div>

          <div className="mb-4">
            <h5>References*</h5>
            <p className="text-muted small">Please provide at least one reference</p>
            {references.map((reference, index) => (
              <div key={index} className="reference-container p-3 mb-3 border rounded">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">Reference #{index + 1}</h6>
                  {index > 0 && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeReference(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name*</Form.Label>
                      <Form.Control
                        type="text"
                        name={`references[${index}].name`}
                        value={values.references[index]?.name || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          touched.references?.[index]?.name && 
                          errors.references?.[index]?.name
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.references?.[index]?.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Relationship*</Form.Label>
                      <Form.Control
                        type="text"
                        name={`references[${index}].relationship`}
                        value={values.references[index]?.relationship || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          touched.references?.[index]?.relationship && 
                          errors.references?.[index]?.relationship
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.references?.[index]?.relationship}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone*</Form.Label>
                      <Form.Control
                        type="text"
                        name={`references[${index}].phone`}
                        value={values.references[index]?.phone || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          touched.references?.[index]?.phone && 
                          errors.references?.[index]?.phone
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.references?.[index]?.phone}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email*</Form.Label>
                      <Form.Control
                        type="email"
                        name={`references[${index}].email`}
                        value={values.references[index]?.email || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          touched.references?.[index]?.email && 
                          errors.references?.[index]?.email
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.references?.[index]?.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            ))}
            <div className="d-grid">
              <Button 
                variant="outline-primary" 
                onClick={addReference}
                className="mt-2"
              >
                Add Another Reference
              </Button>
            </div>
          </div>

          <div className="d-grid mt-4">
            <Button 
              variant="primary" 
              type="submit" 
              size="lg"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Adoption Application'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AdoptionForm;
