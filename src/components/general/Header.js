import React, { Component } from 'react';
import { Col, Image, Row } from 'react-bootstrap';

import logo from '../../../public/logo_blu.svg';

export default class Header extends Component {
  render() {
    return (
      <Row componentClass="header">
        <Col md={1}>
          <Image src={logo} thumbnail />
        </Col>
      </Row>
    );
  }
}
