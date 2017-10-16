import React, { Component } from 'react';
import { Col, Image, Row } from 'react-bootstrap';

const dir = __dirname;

export default class Header extends Component {
  render() {
    return (
      <Row componentClass="header">
        <Col md={1}>
          <Image
            src={`${dir === '/' ? '' : `${dir}/`}../../assets/images/logo_blu.svg`}
            thumbnail
          />
        </Col>
      </Row>
    );
  }
}
