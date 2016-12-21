import React, { Component } from 'react';
import { Col } from 'react-bootstrap';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
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
        const code = 2 + this.state.barcode.replace(/\D/g, '').slice(1, 9);
        this.setState({ barcode: '' });
        location.href = `/member/${code}`;
      }

      if (this.state.barcode.length > 25) {
        this.setState({ barcode: '' });
      }
    };
  }

  render() {
    return (
      <div>
        <header>
          <Header />
        </header>
        <main>
          <Col md={2}>
            <Sidebar />
          </Col>
          <Col sm={12} md={8}>
            <Routes />
          </Col>
        </main>
      </div>
    );
  }
}
