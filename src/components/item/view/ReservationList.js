import React, { Component, PropTypes } from 'react';
import { Button, Glyphicon, Label } from 'react-bootstrap';
import { Link } from 'react-router';
import moment from 'moment';

import API from '../../../lib/API';
import { ConfirmModal, InformationModal } from '../../general/modals';
import TableLayout from '../../general/TableLayout';
import Transaction from '../../../lib/models/Transaction';

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
    dataFormat(parent, { copy }) {
      const member = copy ? copy.reservee : parent;
      return link(`/member/view/${member.no}`, member.name);
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
    dataFormat: (_, { copy }) => copy && <Label bsStyle="success"><Glyphicon glyph="ok-sign" /></Label>,
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
    this.state = {
      activeReservation: null,
      error: null,
      showModal: null,
    };

    this.closeModal = this.closeModal.bind(this);
    this.deleteReservation = this.deleteReservation.bind(this);
    this.getModal = this.getModal.bind(this);

    this.columns = columns;
    this.columns.find(column => column.dataField === 'actions').dataFormat = (field, reservation) => (
      <Button
        data
        bsStyle="danger"
        onClick={() => this.setState({ activeReservation: reservation, showModal: 'delete' })}
      >
        <Glyphicon glyph="trash" />
      </Button>
    );
  }

  closeModal() {
    this.setState({ activeReservation: null, showModal: null });
  }

  deleteReservation() {
    const reservation = this.state.activeReservation;
    const { copy, item, parent } = reservation;
    const onDelete = (error) => {
      if (error) {
        this.setState({ error, activeReservation: null, showModal: null });
        return;
      }

      this.setState({ activeReservation: null, showModal: null });

      if (this.props.onReservationDeleted) {
        this.props.onReservationDeleted(reservation);
      }
    };

    if (copy) {
      API.transaction.delete(copy.id, Transaction.TYPES.RESERVE, onDelete);
    } else {
      API.reservation.delete(parent.no, item.id, onDelete);
    }
  }

  getModal() {
    const { activeReservation, error, showModal } = this.state;
    const { name } = activeReservation.parent;

    if (error) {
      return (
        <InformationModal
          message={error.message}
          onClick={() => this.setState({ error: null })}
          title={`Erreur ${error.code}`}
        />
      );
    }

    switch (showModal) {
      case 'delete':
        return (
          <ConfirmModal
            message={`Êtes vous certain.e.s de vouloir supprimer la réservation de  ${name} ?`}
            onCancel={this.closeModal}
            onConfirm={this.deleteReservation}
            title={'Supprimer une réservation'}
          />
        );
      default:
        return null;
    }
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
  onReservationDeleted: PropTypes.func,
  reservations: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
