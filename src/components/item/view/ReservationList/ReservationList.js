import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon } from 'react-bootstrap';

import { formatShortDate } from '../../../../lib/dateHelper';
import I18n from '../../../../lib/i18n';
import { link } from '../../../../lib/link';
import TableLayout from '../../../general/TableLayout';
import { Reservation } from '../../../../lib/models';

import './reservationList.css';

export default class ReservationList extends Component {
  static propTypes = {
    onDelete: PropTypes.func.isRequired,
    reservations: PropTypes.arrayOf(PropTypes.instanceOf(Reservation)),
  }

  static defaultProps = {
    reservations: [],
  }

  columns = [
    {
      dataField: 'id',
      isKey: true,
      hidden: true,
    },
    {
      dataField: 'parent',
      label: I18n('ReservationList.table.parent'),
      dataFormat(parent, { copy }) {
        const member = copy ? copy.reservee : parent;
        return link(`/member/view/${member.no}`, member.name);
      },
    },
    {
      dataField: 'date',
      label: I18n('ReservationList.table.date'),
      width: '150px',
      dataFormat: (date, reservation) => formatShortDate(date || reservation.copy.dateReserved),
    },
    {
      dataField: 'received',
      label: I18n('ReservationList.table.received'),
      width: '70px',
      dataAlign: 'center',
      dataFormat: (cell, { copy }) => copy && (
        <Button id="labelButton" bsStyle="success" disabled>
          <Glyphicon glyph="ok-sign" />
        </Button>
      ),
    },
  ]

  rowActions = () => [{
    bsStyle: 'danger',
    glyph: 'trash',
    help: 'Supprimer',
    onClick: this.props.onDelete,
  }]

  render() {
    return (
      <TableLayout
        columns={this.columns}
        data={this.props.reservations}
        rowActions={this.rowActions()}
        title={I18n('ReservationList.title')}
      />
    );
  }
}
