import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

export default class ConfirmModal extends Component {
  render() {
    return (
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>
            {this.props.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.message}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={(event) => this.props.onCancel(event)}
          >
            {this.props.cancelText || 'Annuler'}
          </Button>
          <Button
            bsStyle={this.props.confirmationStyle || 'primary'}
            onClick={(event) => this.props.onConfirm(event)}
          >
            {this.props.confirmText || 'Confirmer'}
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}

ConfirmModal.propTypes = {
  cancelText: React.PropTypes.string,
  confirmText: React.PropTypes.string,
  confirmationStyle: React.PropTypes.string,
  message: React.PropTypes.string.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  onConfirm: React.PropTypes.func.isRequired,
  title: React.PropTypes.string.isRequired,
};
