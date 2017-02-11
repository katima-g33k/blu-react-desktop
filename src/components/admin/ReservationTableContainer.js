import React, { Component } from 'react';
import { Glyphicon, Label } from 'react-bootstrap';
import moment from 'moment';

import { ConfirmModal } from '../general/modals';
import HTTP from '../../lib/HTTP';
import Reservation from '../../lib/models/Reservation';
import settings from '../../settings';
import TableLayout from '../general/TableLayout';

const actions = [
  {
    bsStyle: 'danger',
    icon: 'trash',
    label: 'Tout supprimer',
    name: 'delete-reservations',
  },
];

const columns = [
  {
    dataField: 'parent',
    isKey: true,
    label: 'Parent',
    dataFormat(field, reservation) {
      return reservation.parent.name;
    },
  },
  {
    dataField: 'date',
    label: 'Date',
    dataFormat(date) {
      return moment(date).format('LL');
    },
  },
  {
    dataField: 'received',
    label: 'Reçu',
    dataFormat(field, reservation) {
      return reservation.copy ? <Label bsStyle="success"><Glyphicon glyph="ok-sign" /></Label> : '';
    },
  },
];
export default class ReservationTableContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reservations: [],
      showModal: false,
    };

    this.deleteReservations = this.deleteReservations.bind(this);
    this.getModal = this.getModal.bind(this);

    this.actions = actions;
    actions.find(action => action.name === 'delete-reservations').onClick = () => {
      this.setState({ showModal: true });
    };
  }

  componentWillMount() {
    HTTP.post(`${settings.apiUrl}/reservation/select`, {}, (err, res) => {
      if (err) {
        // TODO: Display erorr message
        return;
      }

      const reservations = res.map(reservation => new Reservation(reservation));
      this.setState({ reservations });
    });
  }

  deleteReservations() {
    HTTP.post(`${settings.apiUrl}/reservation/deleteAll`, {}, (err) => {
      if (err) {
        // TODO: Display erorr message
        return;
      }

      this.setState({ reservations: [], showModal: false });
    });
  }

  getModal() {
    return this.state.showModal ? (
      <ConfirmModal
        message={'Êtes-vous certains de vouloir supprimer toutes les réservations ?'}
        onCancel={() => this.setState({ showModal: false })}
        onConfirm={this.deleteReservations}
        title={'Suppression des réservations'}
      />
    ) : null;
  }

  render() {
    return (
      <TableLayout
        actions={actions}
        columns={columns}
        data={this.state.reservations}
        modal={this.getModal()}
        placeholder={'Aucune réservation dans le système'}
        title={'Liste des réservations'}
      />
    );
  }
}