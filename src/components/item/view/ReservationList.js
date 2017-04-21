import React, { Component, PropTypes } from 'react';
import { Button, Glyphicon, Label } from 'react-bootstrap';
import { Link } from 'react-router';
import moment from 'moment';

import TableLayout from '../../general/TableLayout';

const link = (href, label) => (<Link to={{ pathname: href }}>{label}</Link>);

const columns = [
  {
    dataField: 'id',
    isKey: true,
    hidden: true,
  },
  {
    dataField: 'parent',
    label: 'Parent',
    dataFormat(field, reservation) {
      return link(`/member/view/${reservation.parent.no}`, reservation.parent.name);
    },
  },
  {
    dataField: 'date',
    label: 'Date',
    width: '150px',
    dataFormat: date => moment(date).format('LL'),
  },
  {
    dataField: 'received',
    label: 'Reçu',
    width: '70px',
    dataAlign: 'center',
    dataFormat(field, reservation) {
      return reservation.copy ? <Label bsStyle="success"><Glyphicon glyph="ok-sign" /></Label> : '';
    },
  },
  {
    dataField: 'actions',
    label: 'Annuler',
    width: '70px',
    dataAlign: 'center',
  },
];

export default class ReservationList extends Component {
  constructor(props) {
    super(props);

    this.getModal = this.getModal.bind(this);
    this.columns = columns;
    this.columns.find(column => column.dataField === 'actions').dataFormat = () => {
      return (
        <Button />
      );
    };
  }

  getModal() {
    return null;
  }

  render() {
    return (
      <TableLayout
        columns={columns}
        data={this.props.reservations}
        modal={this.getModal()}
        title={'Liste des réservations'}
      />
    );
  }
}

ReservationList.propTypes = {
  reservations: PropTypes.arrayOf(PropTypes.shape()),
};
