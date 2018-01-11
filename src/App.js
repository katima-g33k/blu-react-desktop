import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
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
import store from './reducers/store';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.api = new API(Settings.apiUrl, Settings.apiKey);
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

  onItemScan = async (ean13) => {
    if (this.canChangeLocation()) {
      try {
        const { id } = await this.api.item.exists(ean13);
        const path = id ? `view/${id}` : `add?ean13=${ean13}`;
        browserHistory.push(`/item/${path}`);
      } catch (error) {
        this.setState({ error });
      }
    }
  }

  onMemberScan = async (no) => {
    if (this.canChangeLocation()) {
      try {
        const res = await this.api.member.exists(no);
        const path = res.no ? `view/${res.no}` : `add?no=${no}`;
        browserHistory.push(`/member/${path}`);
      } catch (error) {
        this.setState({ error });
      }
    }
  }

  onLogin = (user) => {
    this.setState({ user });
  }

  onLogout = () => {
    this.api.employee.logout();
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
    const { apiKey, apiUrl, secretKey } = Settings;

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
          <Login onConnected={this.onLogin} api={this.api} />
        </Row>
      );
    }

    return (
      <Row componentClass="main">
        <Col componentClass="aside" sm={0} md={2}>
          <Sidebar onLogout={this.onLogout} />
        </Col>
        <Col sm={12} md={10}>
          <Routes api={this.api} />
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
      <Provider store={store}>
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
      </Provider>
    );
  }
}
