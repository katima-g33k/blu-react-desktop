import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import Search from './Search';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Row>
        <Col sm={12} md={6}>
          <Search />
        </Col>
      </Row>
    );
  }
}
