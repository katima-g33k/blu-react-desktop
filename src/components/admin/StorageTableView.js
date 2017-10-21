import React, { Component } from 'react';
import { Col, Panel, Row } from 'react-bootstrap';

import I18n from '../../lib/i18n/i18n';
import StorageTableContainer from './StorageTableContainer';

export default class StorageTableView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Panel header={I18n.t('Admin.storage.title')}>
        <Row>
          <Col sm={12} md={6}>
            <StorageTableContainer {...this.props} />
          </Col>
        </Row>
      </Panel>
    );
  }
}
