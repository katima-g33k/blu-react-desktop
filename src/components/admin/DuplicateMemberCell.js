import React, { Component, PropTypes } from 'react';
import { Col, Row } from 'react-bootstrap';
import moment from 'moment';

export default class DuplicateMemberCell extends Component {
  static propTypes = {
    email: PropTypes.string,
    lastActivity: PropTypes.string,
    name: PropTypes.string,
    no: PropTypes.number,
    registration: PropTypes.string,
  }

  render() {
    const {
      email,
      lastActivity,
      name,
      no,
      registration,
    } = this.props;

    return (
      <Row>
        <Col md={12}>
          <Row>
            <Col md={12}>
              {name}
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              {no}
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              {email}
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              {`Inscription: ${moment(registration).format('YYYY-MM-DD')}`}
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              {`Dernière activité: ${moment(lastActivity).format('YYYY-MM-DD')}`}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
