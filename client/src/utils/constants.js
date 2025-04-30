// client/src/utils/constants.js
export const PET_TYPES = [
    'Dog',
    'Cat',
    'Bird',
    'Rabbit',
    'Hamster',
    'Guinea Pig',
    'Fish',
    'Turtle',
    'Other'
  ];
  
  export const PET_SIZES = [
    'Small',
    'Medium',
    'Large',
    'Extra Large'
  ];
  
  export const PET_GENDERS = [
    'Male',
    'Female',
    'Unknown'
  ];
  
  export const ADOPTION_STATUSES = [
    'Pending',
    'Approved',
    'Rejected',
    'Completed'
  ];
  
  export const USER_ROLES = [
    'user',
    'shelter',
    'admin'
  ];
  
  export const AGE_RANGES = [
    { label: 'Under 1 year', value: '0-1' },
    { label: '1-3 years', value: '1-3' },
    { label: '3-7 years', value: '3-7' },
    { label: '7+ years', value: '7-100' }
  ];
  
  export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  
  export const UPLOAD_PATH = process.env.REACT_APP_UPLOAD_PATH || '/uploads';
  