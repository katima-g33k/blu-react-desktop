import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Panel, Row } from 'react-bootstrap';
import { Link } from 'react-router';

import i18n from '../../lib/i18n';
import Storage from '../../lib/models/Storage';
import TableLayout from '../general/TableLayout';

export default class StorageManagement extends Component {
  static propTypes = {
    fetch: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    storage: PropTypes.arrayOf(PropTypes.instanceOf(Storage)),
  }

  static defaultProps = {
    storage: [],
  }

  componentDidMount() {
    this.props.fetch();
  }

  get actions() {
    return [
      {
        bsStyle: 'danger',
        icon: 'trash',
        label: i18n('Admin.storage.actions.clear'),
        name: 'remove-storage',
        onClick: this.props.onClear,
      },
    ];
  }

  get columns() {
    return [
      {
        dataField: 'no',
        isKey: true,
        label: i18n('Admin.storage.table.columns.no'),
        width: '150px',
      },
      {
        dataField: 'content',
        dataFormat: this.renderStorageContent,
        label: i18n('Admin.storage.table.columns.content'),
      },
    ];
  }

  renderStorageContent = (_, storage) => (
    <div>
      {storage.item.map(item => (
        <div key={`${storage.no}_${item.id}`}>
          <Link to={{ pathname: `/item/view/${item.id}` }}>
            {item.name}
          </Link>
        </div>
      ))}
    </div>
  )

  render() {
    return (
      <Panel header={i18n('Admin.storage.title')}>
        <Row>
          <Col sm={12} md={6}>
            <TableLayout
              actions={this.actions}
              columns={this.columns}
              data={this.props.storage}
              placeholder={i18n('Admin.storage.table.placeholder')}
              title={i18n('Admin.storage.table.title')}
            />
          </Col>
        </Row>
      </Panel>
    );
  }
}
