import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import moment from 'moment';

import API from './lib/api';

import Header from './components/general/Header';
import { InformationModal } from './components/general/modals';
import Login from './components/login/Login';
import Modal from './containers/ModalContainer';
import Routes from './routes/Routes';
import scanner from './lib/Scanner';
import Settings from './lib/Settings';
import SettingsView from './components/general/SettingsView';
import Sidebar from './components/general/Sidebar';

export default class App extends Component {
  static propTypes = {
    api: PropTypes.instanceOf(API).isRequired,
    onInvalidScan: PropTypes.func.isRequired,
    onItemScan: PropTypes.func.isRequired,
    onMemberScan: PropTypes.func.isRequired,
  }

  state = {
    error: null,
    settingsUpdatedAt: null,
    showModal: null,
    user: null,
  }

  componentWillMount() {
    const user = sessionStorage.getItem('user');

    scanner.addListener('onInvalidScan', this.props.onInvalidScan);
    scanner.addListener('onItemScan', this.props.onItemScan);
    scanner.addListener('onMemberScan', this.props.onMemberScan);

    if (user) {
      this.setState({ user: JSON.parse(user) });
    }
  }

  onLogin = (user) => {
    this.setState({ user });
  }

  onLogout = () => {
    this.props.api.employee.logout();
    sessionStorage.removeItem('user');
    this.setState({ user: null });
  }

  onSettingsSave = () => {
    this.setState({ settingsUpdatedAt: moment() });
  }

  resetState = () => {
    this.setState({ error: null, showModal: null });
  }

  renderSetup = () => (
    <Row componentClass="main">
      <Col md={6} mdOffset={3}>
        <SettingsView
          firstSetup
          onSave={this.onSettingsSave}
        />
      </Col>
    </Row>
  )

  renderLogin = () => (
    <Row componentClass="main">
      <Login onConnected={this.onLogin} api={this.props.api} />
    </Row>
  )

  renderRoutes = () => (
    <Row componentClass="main">
      <Col componentClass="aside" sm={0} md={2}>
        <Sidebar onLogout={this.onLogout} />
      </Col>
      <Col sm={12} md={10}>
        <Routes api={this.props.api} />
      </Col>
      {this.renderModal()}
    </Row>
  )

  renderMain = () => {
    if (!Settings.isServerSet()) {
      return this.renderSetup();
    }

    if (!this.state.user) {
      return this.renderLogin();
    }

    return this.renderRoutes();
  }


  renderModal = () => {
    const { error, showModal } = this.state;

    if (error) {
      return (
        <InformationModal
          message={error.message}
          onClick={this.resetState}
          title={`Error ${error.code}`}
        />
      );
    }

    switch (showModal) {
      case 'invalidCode':
        return (
          <InformationModal
            message={'Le code que vous venez de scanner n\'est pas supporté par le système de la BLU'}
            onClick={this.resetState}
            title={'Code invalide'}
          />
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <Row>
        <Col md={12}>
          <Row>
            <Col md={12}>
              <Header />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              {this.renderMain()}
            </Col>
          </Row>
        </Col>
        <Modal />
      </Row>
    );
  }
}
