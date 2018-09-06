import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import {
  Button,
  ButtonToolbar,
  Col,
  Form,
  Panel,
  Row,
} from 'react-bootstrap';

import './settingsView.css';

import I18n from '../../lib/i18n/index';
import { Input } from '../general/formInputs/index';
import ScannerCalibrator from '../../containers/ScannerCalibratorContainer';

const {
  Body,
  Heading,
} = Panel;

const adminFields = ['apiUrl', 'apiKey', 'secretKey'];

export default class SettingsView extends Component {
  static propTypes = {
    apiKey: PropTypes.string,
    apiUrl: PropTypes.string,
    isInitialSetup: PropTypes.bool,
    onSave: PropTypes.func.isRequired,
    secretKey: PropTypes.string,
    userIsAdmin: PropTypes.bool,
  };

  static defaultProps = {
    apiKey: '',
    apiUrl: '',
    isInitialSetup: true,
    secretKey: '',
    userIsAdmin: false,
  }

  state = {
    apiKey: this.props.apiKey,
    apiUrl: this.props.apiUrl,
    calibrateScanner: false,
    secretKey: this.props.secretKey,
  }

  handleOnChange = (event, value) => this.setState({ [event.target.id]: value })

  handleOnCancel = () => browserHistory.goBack()

  handleOnSave = () => this.props.onSave({
    apiKey: this.state.apiKey,
    apiUrl: this.state.apiUrl,
    secretKey: this.state.secretKey,
  })

  calibrateScanner = () => this.setState({ calibrateScanner: true })

  calibrateScannerDone = () => this.setState({ calibrateScanner: false })

  renderField = field => (
    <Row key={field}>
      <Col md={12}>
        <Input
          id={field}
          label={I18n(`SettingsView.fields.${field}`)}
          onChange={this.handleOnChange}
          placeholder={I18n(`SettingsView.fields.${field}`)}
          value={this.state[field]}
        />
      </Col>
    </Row>
  )

  renderAdminFields = () => {
    if (!this.props.userIsAdmin && !this.props.isInitialSetup) {
      return null;
    }

    return adminFields.map(this.renderField);
  }

  render() {
    return (
      <Row id={this.constructor.name}>
        <Col md={10}>
          <Panel>
            <Heading>
              {I18n('SettingsView.title')}
            </Heading>
            <Body>
              <Form>
                {this.renderAdminFields()}
                <Row id="calibrationButton">
                  <Col md={12}>
                    <Button onClick={this.calibrateScanner}>
                      {I18n('SettingsView.fields.calibrate')}
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <ButtonToolbar id="formButtons">
                      {!this.props.isInitialSetup && (
                        <Button onClick={this.handleOnCancel}>
                          {I18n('actions.cancel')}
                        </Button>
                      )}
                      <Button
                        bsStyle="primary"
                        onClick={this.handleOnSave}
                      >
                        {I18n('actions.save')}
                      </Button>
                    </ButtonToolbar>
                  </Col>
                </Row>
                <ScannerCalibrator
                  onHide={this.calibrateScannerDone}
                  show={this.state.calibrateScanner}
                />
              </Form>
            </Body>
          </Panel>
        </Col>
      </Row>
    );
  }
}
