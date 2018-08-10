import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, FormControl, Modal } from 'react-bootstrap';

export default class InputModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
    };

    this.onCancel = this.onCancel.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  componentDidMount() {
    document.getElementById('inputModalField').focus();
  }

  onCancel(event) {
    event.preventDefault();
    this.props.onCancel(event, this.state.value);
  }

  onChange(event) {
    event.preventDefault();
    this.setState({ value: event.target.value });
  }

  onSave(event) {
    event.preventDefault();
    this.props.onSave(event, this.state.value);
  }

  render() {
    const { message, textarea, saveStyle, title, type } = this.props;
    const { value } = this.state;

    return (
      <Modal.Dialog>
        <form>
          <Modal.Header>
            <Modal.Title>
              {title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{message}</p>
            <FormControl
              componentClass={textarea ? 'textarea' : 'input'}
              id="inputModalField"
              onChange={this.onChange}
              type={type || 'text'}
              value={value}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={this.onCancel}
            >
              {'Annuler'}
            </Button>
            <Button
              bsStyle={saveStyle || 'primary'}
              onClick={this.onSave}
              type="submit"
            >
              {'Sauvegarder'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Dialog>
    );
  }
}

InputModal.propTypes = {
  message: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saveStyle: PropTypes.string,
  textarea: PropTypes.bool,
  title: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string,
};
