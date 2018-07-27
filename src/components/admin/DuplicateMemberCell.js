import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import moment from 'moment';

import i18n from '../../lib/i18n';

export default class DuplicateMemberCell extends Component {
  static propTypes = {
    email: PropTypes.string,
    lastActivity: PropTypes.string,
    name: PropTypes.string,
    no: PropTypes.number,
    registration: PropTypes.string,
  }

  static defaultProps = {
    email: '',
    lastActivity: '',
    name: '',
    no: 0,
    registration: '',
  }

  render() {
    return (
      <Row>
        <Col md={12}>
          <Row>
            <Col md={12}>
              {this.props.name}
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              {this.props.no}
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              {this.props.email}
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              {i18n(
                'Admin.duplicates.table.data.registration',
                { date: moment(this.props.registration).format('YYYY-MM-DD') },
              )}
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              {i18n(
                'Admin.duplicates.table.data.lastActivity',
                { date: moment(this.props.lastActivity).format('YYYY-MM-DD') },
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
