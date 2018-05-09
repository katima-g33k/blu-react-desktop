import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Glyphicon, Label } from 'react-bootstrap';

import { formatShortDate } from '../../../lib/dateHelper';
import { link } from '../../../lib/link';
import TableLayout from '../../general/TableLayout';
import { Reservation } from '../../../lib/models';

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
      label: 'Parent',
      dataFormat(parent, { copy }) {
        const member = copy ? copy.reservee : parent;
        return link(`/member/view/${member.no}`, member.name);
      },
    },
    {
      dataField: 'date',
      label: 'Date',
      width: '150px',
      dataFormat: formatShortDate,
    },
    {
      dataField: 'received',
      label: 'Reçu',
      width: '70px',
      dataAlign: 'center',
      dataFormat: (cell, { copy }) => copy && (
        <Label bsStyle="success">
          <Glyphicon glyph="ok-sign" />
        </Label>
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
        title={'Liste des réservations'}
      />
    );
  }
}
