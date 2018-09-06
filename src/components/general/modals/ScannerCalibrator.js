import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';

import I18n from '../../../lib/i18n';
import Scanner from '../../../lib/Scanner';

export default class ScannerCalibrator extends Component {
  static propTypes = {
    onHide: PropTypes.func,
    onSave: PropTypes.func.isRequired,
    show: PropTypes.bool,
  };

  static defaultProps = {
    onHide() {},
    show: false,
  }

  state = {
    code: '',
    show: this.props.show,
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.show !== nextProps.show) {
      this.setState({ show: nextProps.show });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.scanner && !nextState.show) {
      this.scanner.removeListener('onInput', this.onInput);
      this.scanner = null;
    }
  }

  componentDidUpdate() {
    if (!this.scanner && this.state.show) {
      this.scanner = new Scanner('', '', this.constructor.name);
      this.scanner.addListener('onInput', this.onInput);
    }
  }

  onInput = (key) => {
    if (key.length === 1) {
      this.setState({ code: `${this.state.code}${key}` });
    }
  }

  hide = () => {
    this.setState({ show: false });
    this.props.onHide();
  }

  handleOnSave = () => {
    this.props.onSave({
      barcodeFirstChar: this.state.code.charAt(0),
      barcodeLastChar: this.state.code.charAt(this.state.code.length - 1),
    });
    this.hide();
  }

  render() {
    const isScanned = this.state.code.length > 2;

    return (
      <Modal
        id={this.constructor.name}
        onHide={this.props.onHide}
        show={this.state.show}
      >
        <Modal.Header>
          <Modal.Title>
            {I18n('SettingsView.calibrator.title')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {I18n(`SettingsView.calibrator.message.${isScanned ? 'scanned' : 'waiting'}`)}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.hide}>
            {I18n('actions.cancel')}
          </Button>
          <Button onClick={this.handleOnSave} bsStyle="primary">
            {I18n('actions.save')}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
