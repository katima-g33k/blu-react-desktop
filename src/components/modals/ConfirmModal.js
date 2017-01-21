import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

export default class ConfirmModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onChange(event) {
    this.setState({ value: event.target.value });
  }

  onCancel(event) {
    this.props.onCancel(event, this.state.value);
  }

  onSave(event) {
    this.props.onSave(event, this.state.value);
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
          <Button
            onClick={this.onCancel}
          >
            Annuler
          </Button>
          <Button
            bsStyle="danger"
            onClick={this.onSave}
          >
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}

ConfirmModal.propTypes = {
  message: React.PropTypes.string,
  onCancel: React.PropTypes.func,
  onSave: React.PropTypes.func,
  title: React.PropTypes.string,
};
