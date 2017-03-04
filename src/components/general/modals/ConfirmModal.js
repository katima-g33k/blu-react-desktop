import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

export default class ConfirmModal extends Component {
  renderButtons = () => {
    return (
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
    );
  }

  renderCustomActions = () => {
    return (
      <div>
        {this.props.customActions.map((action, index) => {
          return (
            <Button
              bsStyle={action.bsStyle}
              key={`${action.label}-${index}`}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          );
        })}
      </div>
    );
  }

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
  cancelText: React.PropTypes.string,
  confirmText: React.PropTypes.string,
  confirmationStyle: React.PropTypes.string,
  customActions: React.PropTypes.array,
  message: React.PropTypes.string.isRequired,
  onCancel: React.PropTypes.func,
  onConfirm: React.PropTypes.func,
  title: React.PropTypes.string.isRequired,
};
