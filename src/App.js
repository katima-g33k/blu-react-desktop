import React, { Component } from 'react';
import { Col } from 'react-bootstrap';

import Header from './components/general/Header';
import HTTP from './lib/HTTP';
import Routes from './routes/Routes';
import scanner from './lib/Scanner';
import settings from './settings.json';
import Sidebar from './components/general/Sidebar';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    scanner.addListener('onMemberScan', (no) => {
      const canChangeLocation = !window.location.pathname.match(/add|edit|copies/);

      if (canChangeLocation) {
        HTTP.post(`${settings.apiUrl}/member/exists`, { no }, (err, res) => {
          if (err) {
            // TODO: Display message
            return;
          }

          if (res.code === 200) {
            window.location.href = `http://localhost:3000/member/view/${no}`;
          } else {
            window.location.href = `http://localhost:3000/member/add?no=${no}`;
          }
        });
      }
    });

    scanner.addListener('onItemScan', (ean13) => {
      const canChangeLocation = !window.location.pathname.match(/add|edit|copies/);

      if (canChangeLocation) {
        HTTP.post(`${settings.apiUrl}/item/exists`, { ean13 }, (err, res) => {
          if (err) {
            // TODO: Display message
            return;
          }


          if (res.id) {
            window.location.href = `http://localhost:3000/item/view/${res.id}`;
          } else {
            window.location.href = `http://localhost:3000/item/add?ean13=${ean13}`;
          }
        });
      }
    });

    // eslint-disable-next-line no-unused-vars
    scanner.addListener('onInvalidScan', (code) => {
      // TODO: Display message
    });
  }

  render() {
    return (
      <div>
        <Header />
        <main>
          <Col md={2}>
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
