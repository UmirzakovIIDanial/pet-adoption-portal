// client/src/components/Common/Modal.js
import React from 'react';
import { Modal as BootstrapModal, Button } from 'react-bootstrap';

const Modal = ({ show, onClose, title, children, onSave, saveText = 'Save', size = 'lg' }) => {
  return (
    <BootstrapModal show={show} onHide={onClose} size={size} centered>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>{title}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        {children}
      </BootstrapModal.Body>
      <BootstrapModal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        {onSave && (
          <Button variant="primary" onClick={onSave}>
            {saveText}
          </Button>
        )}
      </BootstrapModal.Footer>
    </BootstrapModal>
  );
};

export default Modal;