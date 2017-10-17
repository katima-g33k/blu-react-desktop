import React, { Component, PropTypes } from 'react';
import { Col, Panel, Row } from 'react-bootstrap';

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
  }

  static propTypes = {
    api: PropTypes.shape(),
    onConnected: PropTypes.func.isRequired,
  }

  connect = async ({ username, password }) => {
    try {
      const res = await this.props.api.employee.login(username, encrypt(password));
      sessionStorage.setItem('user', JSON.stringify(res));
      this.props.onConnected(res);
    } catch (error) {
      this.setState({ error });
    }
  }

  closeModal = () => {
    this.setState({ error: null });
  }

  renderModal = () => {
    const { error } = this.state;
    const messages = {
      UNAUTHORIZED: 'Pseudonym ou mot de passe invalide.',
    };

    return error && (
      <InformationModal
        message={messages[error.message] || error.message}
        onClick={this.closeModal}
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
                  onSave={this.connect}
                  schema={schema}
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
