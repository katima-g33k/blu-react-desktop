import React, { Component, PropTypes } from 'react';
import { Col, Panel, Row } from 'react-bootstrap';

import API from '../../lib/API';
import AutoForm from '../general/AutoForm';
import { encrypt } from '../../lib/cipher';
import I18n from '../../lib/i18n/i18n';
import { InformationModal } from '../general/modals';

const schema = {
  titleClass: 'h3',
  options: {
    horizontal: true,
  },
  sections: [
    {
      fields: [
        {
          key: 'username',
          type: 'texte',
          label: 'Pseudonym',
          required: true,
        },
        {
          key: 'password',
          type: 'password',
          label: 'Mot de passe',
          required: true,
        },
      ],
    },
  ],
};

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
    };

    this.connect = this.connect.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.schema = schema;
  }

  connect({ username, password }) {
    API.employee.login(username, encrypt(password), (error, res) => {
      if (error) {
        this.setState({ error });
        return;
      }

      sessionStorage.setItem('user', JSON.stringify(res));
      this.props.onConnected(res);
    });
  }

  renderModal() {
    const { error } = this.state;
    const messages = {
      UNAUTHORIZED: 'Pseudonym ou mot de passe invalide.',
    };

    return error && (
      <InformationModal
        message={messages[error.message] || error.message}
        onClick={() => this.setState({ error: null })}
        title={`Error ${error.code}`}
      />
    );
  }

  render() {
    return (
      <Row>
        <Col md={6} mdOffset={3}>
          <Panel header={I18n.t('Login.title')}>
            <Row>
              <Col md={10} mdOffset={1}>
                <AutoForm
                  confirmButtonText={'Se connecter'}
                  data={{}}
                  onSave={this.connect}
                  schema={this.schema}
                />
              </Col>
            </Row>
          </Panel>
        </Col>
        {this.renderModal()}
      </Row>
    );
  }
}

Login.propTypes = {
  onConnected: PropTypes.func.isRequired,
};
