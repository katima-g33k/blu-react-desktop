import React, { Component } from 'react';
import { Col, Image, Row } from 'react-bootstrap';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Row>
        <Col md={1}>
          <Image src="logo_blu.svg" thumbnail />
        </Col>
      </Row>
    );
  }
}
