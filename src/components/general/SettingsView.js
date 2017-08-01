import React, { Component } from 'react';
import { Button, Panel } from 'react-bootstrap';
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
      fields: [
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
      ],
    },
  ],
};

export default class SettingsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: null,
    };

    this.onSave = this.onSave.bind(this);
    this.schema = schema;
  }

  onSave(settings) {
    Settings.set(settings);
    browserHistory.goBack();
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
      <Panel header={I18n.t('SettingsView.title')}>
        <Button
          onClick={() => this.setState({ showModal: 'calibrate' })}
        >
          {'Calibrer le scanneur'}
        </Button>
        <AutoForm
          data={Settings.get()}
          schema={this.schema}
          onCancel={browserHistory.goBack}
          onSave={this.onSave}
        />
        {this.renderModal()}
      </Panel>
    );
  }
}
