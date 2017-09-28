import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import moment from 'moment';

import API from './lib/API';
import Header from './components/general/Header';
import { InformationModal } from './components/general/modals';
import Login from './components/login/Login';
import Routes from './routes/Routes';
import scanner from './lib/Scanner';
import settings from './lib/Settings';
import SettingsView from './components/general/SettingsView';
import Sidebar from './components/general/Sidebar';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      settingsUpdatedAt: null,
      showModal: null,
      user: null,
    };
  }

  componentWillMount() {
    const user = sessionStorage.getItem('user');

    scanner.addListener('onInvalidScan', this.onInvalidScan);
    scanner.addListener('onItemScan', this.onItemScan);
    scanner.addListener('onMemberScan', this.onMemberScan);

    if (user) {
      this.setState({ user: JSON.parse(user) });
    }
  }

  onInvalidScan = () => {
    this.setState({ showModal: 'invalidCode' });
  }

  onItemScan = (ean13) => {
    if (this.canChangeLocation()) {
      API.item.exists(ean13, (error, res) => {
        if (error) {
          this.setState({ error });
          return;
        }

        const path = res.id ? `view/${res.id}` : `add?ean13=${ean13}`;
        browserHistory.push(`/item/${path}`);
      });
    }
  }

  onMemberScan = (no) => {
    if (this.canChangeLocation()) {
      API.member.exists({ no }, (error, res) => {
        if (error) {
          this.setState({ error });
          return;
        }

        const path = res.no ? `view/${res.no}` : `add?no=${no}`;
        browserHistory.push(`/member/${path}`);
      });
    }
  }

  onLogin = (user) => {
    this.setState({ user });
  }

  onLogout = () => {
    sessionStorage.removeItem('user');
    this.setState({ user: null });
  }

  onSettingsSave = () => {
    this.setState({ settingsUpdatedAt: moment() });
  }

  canChangeLocation = () =>
    !browserHistory.getCurrentLocation().pathname.match(/add|edit|copies/);

  resetState = () => {
    this.setState({ error: null, showModal: null });
  }

  renderMain = () => {
    const { apiKey, apiUrl, secretKey } = settings;

    if (!apiKey || !apiUrl || !secretKey) {
      return (
        <Row componentClass="main">
          <Col md={6} mdOffset={3}>
            <SettingsView
              firstSetup
              onSave={this.onSettingsSave}
            />
          </Col>
        </Row>
      );
    }

    if (!this.state.user) {
      return (
        <Row componentClass="main">
          <Login onConnected={this.onLogin} />
        </Row>
      );
    }

    return (
      <Row componentClass="main">
        <Col componentClass="aside" sm={0} md={2}>
          <Sidebar onLogout={this.onLogout} />
        </Col>
        <Col sm={12} md={10}>
          <Routes />
        </Col>
        {this.renderModal()}
      </Row>
    );
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
      </Row>
    );
  }
}
