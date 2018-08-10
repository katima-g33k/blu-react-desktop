import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';

export default class ConfirmModal extends Component {
  renderButtons = () => (
    <div>
      <Button
        onClick={this.props.onCancel}
      >
        {this.props.cancelText || 'Annuler'}
      </Button>
      <Button
        bsStyle={this.props.confirmationStyle || 'primary'}
        onClick={this.props.onConfirm}
      >
        {this.props.confirmText || 'Confirmer'}
      </Button>
    </div>
    )

  renderCustomActions = () => (
    <div>
      {this.props.customActions.map((action, index) => (
        <Button
          bsStyle={action.bsStyle}
          key={`${action.label}-${index}`}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
          ))}
    </div>
    )

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
          {this.props.customActions ? this.renderCustomActions() : this.renderButtons()}
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}

ConfirmModal.propTypes = {
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  confirmationStyle: PropTypes.string,
  customActions: PropTypes.array,
  message: PropTypes.string.isRequired,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  title: PropTypes.string.isRequired,
};
