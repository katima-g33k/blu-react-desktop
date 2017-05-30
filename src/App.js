import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import { browserHistory } from 'react-router';

import Header from './components/general/Header';
import HTTP from './lib/HTTP';
import Routes from './routes/Routes';
import scanner from './lib/Scanner';
import settings from './settings.json';
import Sidebar from './components/general/Sidebar';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.canChangeLocation = this.canChangeLocation.bind(this);
    this.onInvalidScan = this.onInvalidScan.bind(this);
    this.onItemScan = this.onItemScan.bind(this);
    this.onMemberScan = this.onMemberScan.bind(this);
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
      HTTP.post(`${settings.apiUrl}/member/exists`, { no }, (err, res) => {
        if (err) {
          // TODO: Display message
          return;
        }

        const path = res.code === 200 ? `view/${no}` : `add?no=${no}`;
        browserHistory.push(`/member/${path}`);
      });
    }
  }

  onItemScan(ean13) {
    if (this.canChangeLocation()) {
      HTTP.post(`${settings.apiUrl}/item/exists`, { ean13 }, (err, res) => {
        if (err) {
          // TODO: Display message
          return;
        }

        const path = res.id ? `view/${res.id}` : `add?ean13=${ean13}`;
        browserHistory.push(`/item/${path}`);
      });
    }
  }

  // eslint-disable-next-line no-unused-vars
  onInvalidScan(code) {
    // TODO: Display message
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
        </main>
      </div>
    );
  }
}
