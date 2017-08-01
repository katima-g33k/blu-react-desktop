import React, { Component, PropTypes } from 'react';
import { Button, Modal } from 'react-bootstrap';

import scanner from '../../../lib/Scanner';

export default class ScannerCalibrationModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
    };

    this.onInput = this.onInput.bind(this);
    this.onSave = this.onSave.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
  }

  componentWillMount() {
    scanner.addListener('onInput', this.onInput);
  }

  componentWillUnmount() {
    scanner.removeListener('onInput', this.onInput);
  }

  onInput(key) {
    if (key.length === 1) {
      const { code } = this.state;
      this.setState({ code: `${code}${event.key}` });
    }
  }

  onSave() {
    scanner.calibrate(this.state.code);
    this.props.onSave();
  }

  renderMessage() {
    const { code } = this.state;

    if (code.length > 2) {
      return 'Code scanné avec succès';
    }

    return 'Veuillez scanner un code à barres afin de calibrer le scanneur';
  }

  render() {
    return (
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>
            {'Calibration du scanneur'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderMessage()}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onCancel}>
            {'Annuler'}
          </Button>
          <Button onClick={this.onSave} bsStyle="primary">
            {'Sauvegarder'}
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}

ScannerCalibrationModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
