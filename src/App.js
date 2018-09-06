import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';

import Header from './components/general/Header';
import Login from './containers/LoginContainer';
import Modal from './containers/ModalContainer';
import Routes from './containers/RoutesContainer';
import Scanner from './containers/ScannerContainer';
import SettingsView from './containers/SettingsViewContainer';
import Sidebar from './components/general/Sidebar';

export default class App extends Component {
  static propTypes = {
    isConnected: PropTypes.bool,
    isInitialSetup: PropTypes.bool,
  }

  static defaultProps = {
    isConnected: false,
    isInitialSetup: true,
  }

  renderSetup = () => (
    <Col md={6} mdOffset={3}>
      <SettingsView />
    </Col>
  )

  renderRoutes = () => (
    <div>
      <Col componentClass="aside" sm={0} md={2}>
        <Sidebar />
      </Col>
      <Col sm={12} md={10}>
        <Routes />
      </Col>
    </div>
  )

  renderMain = () => {
    if (this.props.isInitialSetup) {
      return this.renderSetup();
    }

    if (!this.props.isConnected) {
      return (<Login />);
    }

    return this.renderRoutes();
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
              <Row componentClass="main">
                {this.renderMain()}
              </Row>
            </Col>
          </Row>
        </Col>
        <Modal />
        <Scanner />
      </Row>
    );
  }
}
