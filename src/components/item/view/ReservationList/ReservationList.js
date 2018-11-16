import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon } from 'react-bootstrap';

import { formatShortDate } from '../../../../lib/dateHelper';
import i18n from '../../../../lib/i18n';
import { link } from '../../../../lib/link';
import { Reservation } from '../../../../lib/models';
import { TableLayout } from '../../../general';

import './reservationList.css';

// TODO: Fix copy reservations
export default class ReservationList extends Component {
  static propTypes = {
    onDelete: PropTypes.func.isRequired,
    reservations: PropTypes.arrayOf(PropTypes.instanceOf(Reservation)),
  };

  static defaultProps = {
    reservations: [],
  };

  columns = [
    {
      dataField: 'id',
      isKey: true,
      hidden: true,
    },
    {
      dataField: 'parent',
      label: i18n('ReservationList.table.parent'),
      dataFormat(parent, { copy }) {
        const member = copy ? copy.reservee : parent;
        return link(`/member/view/${member.no}`, member.name);
      },
    },
    {
      dataField: 'date',
      label: i18n('ReservationList.table.date'),
      width: '150px',
      dataFormat: date => formatShortDate(date),
    },
    {
      dataField: 'received',
      label: i18n('ReservationList.table.received'),
      width: '70px',
      dataAlign: 'center',
      dataFormat: (cell, { copy }) => copy && (
        <Button id="labelButton" bsStyle="success" disabled>
          <Glyphicon glyph="ok-sign" />
        </Button>
      ),
    },
  ];

  rowActions = [{
    bsStyle: 'danger',
    glyph: 'trash',
    help: 'Supprimer',
    onClick: this.props.onDelete,
  }];

  render() {
    return (
      <TableLayout
        columns={this.columns}
        data={this.props.reservations}
        rowActions={this.rowActions}
        title={i18n('ReservationList.title')}
      />
    );
  }
}
