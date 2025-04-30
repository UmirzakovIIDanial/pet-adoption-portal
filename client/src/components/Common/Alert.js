// client/src/components/Common/Alert.js
import React from 'react';
import { Alert as BootstrapAlert } from 'react-bootstrap';

const Alert = ({ variant = 'info', message, dismissible = true, onClose }) => {
  if (!message) return null;

  return (
    <BootstrapAlert variant={variant} dismissible={dismissible} onClose={onClose}>
      {message}
    </BootstrapAlert>
  );
};

export default Alert;