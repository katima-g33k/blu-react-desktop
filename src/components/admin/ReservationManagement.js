import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Glyphicon,
  Label,
  Panel,
  Row,
} from 'react-bootstrap';
import moment from 'moment';

import i18n from '../../lib/i18n';
import { link } from '../../lib/link';
import Reservation from '../../lib/models/Reservation';
import TableLayout from '../general/TableLayout';


export default class ReservationManagement extends Component {
  static propTypes = {
    fetch: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    reservations: PropTypes.arrayOf(PropTypes.instanceOf(Reservation)),
  }

  static defaultProps = {
    reservations: [],
  }

  componentDidMount() {
    this.props.fetch();
  }

  get actions() {
    return [
      {
        bsStyle: 'danger',
        icon: 'trash',
        label: i18n('Admin.reservation.actions.clear'),
        name: 'remove-reservations',
        onClick: this.props.onClear,
      },
    ];
  }

  get columns() {
    return [
      {
        dataField: 'id',
        isKey: true,
        hidden: true,
      },
      {
        dataField: 'parent',
        label: i18n('Admin.reservation.table.columns.parent'),
        dataFormat: (field, { parent }) => link(`/member/view/${parent.no}`, parent.name),
      },
      {
        dataField: 'item',
        label: i18n('Admin.reservation.table.columns.item'),
        dataFormat: field => link(`/item/view/${field.id}`, field.name),
      },
      {
        dataField: 'date',
        label: i18n('Admin.reservation.table.columns.date'),
        width: '150px',
        dataFormat: date => moment(date).format('LL'),
      },
      {
        dataField: 'received',
        label: 'Reçu',
        width: '70px',
        dataAlign: 'center',
        dataFormat: this.renderReceived,
      },
    ];
  }

  renderReceived = (field, { copy }) => (copy ? (
    <Label bsStyle="success">
      <Glyphicon glyph="ok-sign" />
    </Label>
  ) : '')

  render() {
    return (
      <Panel header={i18n('Admin.reservation.title')}>
        <Row>
          <Col sm={12} md={6}>
            <TableLayout
              actions={this.actions}
              columns={this.columns}
              data={this.props.reservations}
              placeholder={i18n('Admin.reservation.table.placeholder')}
              title={i18n('Admin.reservation.table.title')}
            />
          </Col>
        </Row>
      </Panel>
    );
  }
}
