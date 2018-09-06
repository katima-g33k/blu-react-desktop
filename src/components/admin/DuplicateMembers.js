import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Panel, Row } from 'react-bootstrap';

import DuplicateMemberCell from './DuplicateMemberCell';
import i18n from '../../lib/i18n';
import TableLayout from '../general/TableLayout';

export default class DuplicateMembers extends Component {
  static propTypes = {
    duplicates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape())),
    fetch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    duplicates: [],
  };

  componentDidMount() {
    this.props.fetch();
  }

  get columns() {
    return [
      {
        isKey: true,
        dataField: '0',
        label: i18n('Admin.duplicates.table.columns.member', { index: 1 }),
        dataFormat: this.renderCell,
      },
      {
        dataField: '1',
        label: i18n('Admin.duplicates.table.columns.member', { index: 2 }),
        dataFormat: this.renderCell,
      },
    ];
  }

  renderCell = member => (member ? (
    <DuplicateMemberCell
      email={member.email}
      lastActivity={member.lastActivity}
      name={member.name}
      no={member.no}
      registration={member.registration}
    />
  ) : null);

  render() {
    return (
      <Panel header={i18n('Admin.duplicates.title')}>
        <Row>
          <Col sm={12} md={6}>
            <TableLayout
              columns={this.columns}
              data={this.props.duplicates}
              placeholder={i18n('Admin.duplicates.table.placeholder')}
              title={i18n('Admin.duplicates.table.title')}
            />
          </Col>
        </Row>
      </Panel>
    );
  }
}
