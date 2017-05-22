import React, { Component } from 'react';
import { Col } from 'react-bootstrap';

import Header from './components/general/Header';
import Sidebar from './components/general/Sidebar';
import Routes from './routes/Routes';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      barcode: '',
    };
  }

  componentWillMount() {
    // Will be used to handle scanner events
    document.onkeydown = (event) => {
      if (event.key === 'à') {
        this.setState({ barcode: event.key });
      } else if (this.state.barcode.slice(0, 1) === 'à') {
        this.setState({ barcode: `${this.state.barcode}${event.key}` });
      }

      if (event.key === 'À') {
        const code = this.state.barcode.replace(/\D/g, '');

        switch (code.length) {
          case 10:
            const no = 2 + code.slice(1, 9);
            // TODO: call member/exists
            location.href = `/member/view/${no}`;
            break;
          case 13:
            // TODO call  item/exists
            const id = 0;
            location.href = `/item/view/${id}`;
            break;
          default:
            // TODO: Alert code not supported
        }

        this.setState({ barcode: '' });
      }

      if (this.state.barcode.length > 25) {
        this.setState({ barcode: '' });
      }
    };
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
