import React, { Component } from 'react';
import { Glyphicon, Label } from 'react-bootstrap';
import { Link } from 'react-router';
import moment from 'moment';

import API from '../../lib/API';
import { ConfirmModal, InformationModal } from '../general/modals';
import Reservation from '../../lib/models/Reservation';
import TableLayout from '../general/TableLayout';

const link = (href, label) => (<Link to={{ pathname: href }}>{label}</Link>);

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
    dataField: 'item',
    label: 'Ouvrage',
    dataFormat: field => link(`/item/view/${field.id}`, field.name),
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
];
export default class ReservationTableContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
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
    API.reservation.select((error, res) => {
      if (error) {
        this.setState({ error });
        return;
      }

      const reservations = res.map(reservation => new Reservation(reservation));
      this.setState({ reservations });
    });
  }

  deleteReservations() {
    API.reservation.clear((error) => {
      if (error) {
        this.setState({ error, showModal: false });
        return;
      }

      this.setState({ reservations: [], showModal: false });
    });
  }

  getModal() {
    const { error, showModal } = this.state;

    if (error) {
      return (
        <InformationModal
          message={error.message}
          onClick={() => this.setState({ error: null })}
          title={`Erreur ${error.code}`}
        />
      );
    }

    return showModal ? (
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
