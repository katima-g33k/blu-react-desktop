import React, { Component } from 'react';
import { Button, FormControl, Modal } from 'react-bootstrap';

export default class InputModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
    };

    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onChange(event) {
    this.setState({ value: event.target.value });
  }

  onCancel(event) {
    this.props.onCancel(event, this.state.value, this.props.name);
  }

  onSave(event) {
    this.props.onSave(event, this.state.value, this.props.name);
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
            onChange={this.onChange}
            value={this.state.value}
            componentClass={this.props.textarea ? 'textarea' : 'input'}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={this.onCancel}
          >
            Annuler
          </Button>
          <Button
            bsStyle="primary"
            onClick={this.onSave}
          >
            Save changes
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}

InputModal.propTypes = {
  message: React.PropTypes.string,
  onCancel: React.PropTypes.func,
  onSave: React.PropTypes.func,
  textarea: React.PropTypes.bool,
  title: React.PropTypes.string,
  value: React.PropTypes.string,
  type: React.PropTypes.string,
  name: React.PropTypes.string,
};
