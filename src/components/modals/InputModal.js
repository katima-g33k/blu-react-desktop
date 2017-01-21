import React, { Component } from 'react';
import { Button, FormControl, Modal } from 'react-bootstrap';

export default class InputModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
    };
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
          <p>{this.props.message}</p>
          <FormControl
            type={this.props.type || 'text'}
            onChange={(event) => this.setState({ value: event.target.value })}
            value={this.state.value}
            componentClass={this.props.textarea ? 'textarea' : 'input'}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={(event) => this.props.onCancel(event, this.state.value)}
          >
            {'Annuler'}
          </Button>
          <Button
            bsStyle={this.props.saveStyle || 'primary'}
            onClick={(event) => this.props.onSave(event, this.state.value)}
          >
            {'Sauvegarder'}
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}

InputModal.propTypes = {
  message: React.PropTypes.string,
  onCancel: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
  saveStyle: React.PropTypes.string,
  textarea: React.PropTypes.bool,
  title: React.PropTypes.string.isRequired,
  type: React.PropTypes.string,
  value: React.PropTypes.string,
};
