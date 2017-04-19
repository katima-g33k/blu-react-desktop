import React, { PropTypes } from 'react';
import { Button, Modal } from 'react-bootstrap';

const InformationModal = (props) => {
  return (
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.message}
      </Modal.Body>
      <Modal.Footer>
        <Button
          bsStyle={props.labelStyle}
          onClick={props.onClick}
        >
          {props.label || 'Ok'}
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  );
};

InformationModal.propTypes = {
  label: PropTypes.string,
  labelStyle: PropTypes.string,
  message: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default InformationModal;
