/* eslint react/no-multi-comp: 0 */
import React, { Component, PropTypes } from 'react';
import { Button, Panel, Row } from 'react-bootstrap';
import { browserHistory } from 'react-router';

import AutoForm from './AutoForm';
import I18n from '../../lib/i18n/i18n';
import { ScannerCalibrationModal } from './modals';
import Settings from '../../lib/Settings';

const schema = {
  titleClass: 'h3',
  options: {
    horizontal: true,
  },
  sections: [
    {
      fields: [],
    },
  ],
};

const adminFields = [
  {
    key: 'apiUrl',
    type: 'texte',
    label: 'URL de l\'API',
    inputWidth: {
      md: 8,
      sm: 10,
    },
  },
  {
    key: 'apiKey',
    type: 'texte',
    label: 'Clé d\'API',
    inputWidth: {
      md: 8,
      sm: 10,
    },
  },
  {
    key: 'secretKey',
    type: 'texte',
    label: 'Clé d\'encryption',
    inputWidth: {
      md: 8,
      sm: 10,
    },
  },
];

class CustomButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: null,
    };

    this.renderModal = this.renderModal.bind(this);
  }

  renderModal() {
    switch (this.state.showModal) {
      case 'calibrate':
        return (
          <ScannerCalibrationModal
            onCancel={() => this.setState({ showModal: null })}
            onSave={() => this.setState({ showModal: null })}
          />
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <Row style={{ textAlign: 'center' }}>
        <Button
          onClick={() => this.setState({ showModal: 'calibrate' })}
        >
          {'Calibrer le scanneur'}
        </Button>
        {this.renderModal()}
      </Row>
    );
  }
}

export default class SettingsView extends Component {
  constructor(props) {
    super(props);

    this.onSave = this.onSave.bind(this);
    this.getSchema = this.getSchema.bind(this);

    this.schema = this.getSchema();
  }

  onSave(settings) {
    Settings.set(settings);
    return this.props.onSave ? this.props.onSave() : browserHistory.goBack();
  }

  getSchema() {
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (this.props.firstSetup || user.isAdmin) {
      schema.sections[0].fields.push(...adminFields);
    }

    schema.sections[0].fields.push({
      label: 'Calibrer le scanneur',
      key: 'calibrate',
      type: 'custom',
      component: CustomButton,
    });

    return schema;
  }

  render() {
    return (
      <Panel header={I18n.t('SettingsView.title')}>
        <AutoForm
          data={Settings.get()}
          schema={this.schema}
          onCancel={!this.props.firstSetup ? browserHistory.goBack : null}
          onSave={this.onSave}
        />
      </Panel>
    );
  }
}

SettingsView.propTypes = {
  firstSetup: PropTypes.bool,
  onSave: PropTypes.func,
};
