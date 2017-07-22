import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import { browserHistory } from 'react-router';

import API from './lib/API';
import Header from './components/general/Header';
import { InformationModal } from './components/general/modals';
import Routes from './routes/Routes';
import scanner from './lib/Scanner';
import Sidebar from './components/general/Sidebar';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      showModal: null,
    };

    this.canChangeLocation = this.canChangeLocation.bind(this);
    this.onInvalidScan = this.onInvalidScan.bind(this);
    this.onItemScan = this.onItemScan.bind(this);
    this.onMemberScan = this.onMemberScan.bind(this);
    this.renderModal = this.renderModal.bind(this);
  }

  componentWillMount() {
    scanner.addListener('onInvalidScan', this.onInvalidScan);
    scanner.addListener('onItemScan', this.onItemScan);
    scanner.addListener('onMemberScan', this.onMemberScan);
  }

  canChangeLocation() {
    return !browserHistory.getCurrentLocation().pathname.match(/add|edit|copies/);
  }

  onMemberScan(no) {
    if (this.canChangeLocation()) {
      API.member.exists(no, (error, res) => {
        if (error) {
          this.setState({ error });
          return;
        }

        const path = res.code === 200 ? `view/${no}` : `add?no=${no}`;
        browserHistory.push(`/member/${path}`);
      });
    }
  }

  onItemScan(ean13) {
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

  onInvalidScan() {
    this.setState({ showModal: 'invalidCode' });
  }

  renderModal() {
    const { error, showModal } = this.state;

    if (error) {
      return (
        <InformationModal
          message={error.message}
          onClick={() => this.setState({ error: null })}
          title={`Error ${error.code}`}
        />
      );
    }

    switch (showModal) {
      case 'invalidCode':
        return (
          <InformationModal
            message={'Le code que vous venez de scanner n\'est pas supporté par le système de la BLU'}
            onClick={() => this.setState({ showModal: null })}
            title={'Code invalide'}
          />
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <div>
        <Header />
        <main>
          <Col componentClass="aside" md={2}>
            <Sidebar />
          </Col>
          <Col sm={12} md={10}>
            <Routes />
          </Col>
          {this.renderModal()}
        </main>
      </div>
    );
  }
}
