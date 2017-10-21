import React, { Component } from 'react';
import { Col, Panel, Row } from 'react-bootstrap';

import I18n from '../../lib/i18n/i18n';
import ReservationTableContainer from './ReservationTableContainer';

export default class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Panel header={I18n.t('Admin.reservation.title')}>
        <Row>
          <Col sm={12} md={6}>
            <ReservationTableContainer {...this.props} />
          </Col>
        </Row>
      </Panel>
    );
  }
}
