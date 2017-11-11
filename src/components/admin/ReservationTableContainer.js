import React, { Component, PropTypes } from 'react';
import { Glyphicon, Label } from 'react-bootstrap';
import { Link } from 'react-router';
import moment from 'moment';

import { ConfirmModal, InformationModal } from '../general/modals';
import Reservation from '../../lib/models/Reservation';
import TableLayout from '../general/TableLayout';

const link = (href, label) => (<Link to={{ pathname: href }}>{label}</Link>);

const actions = [
  {
    bsStyle: 'danger',
    icon: 'trash',
    label: 'Tout supprimer',
    name: 'remove-reservations',
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
    dataFormat: (field, { parent }) => link(`/member/view/${parent.no}`, parent.name),
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
    dataFormat: (field, { copy }) => {
      if (copy) {
        return (
          <Label bsStyle="success">
            <Glyphicon glyph="ok-sign" />
          </Label>
        );
      }

      return '';
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
    actions.find(action => action.name === 'remove-reservations').onClick = () => {
      this.setState({ showModal: true });
    };
  }

  static propTypes = {
    api: PropTypes.shape(),
  }

  async componentWillMount() {
    try {
      const res = await this.props.api.reservation.list();
      const reservations = res.map(reservation => new Reservation(reservation));
      this.setState({ reservations });
    } catch (error) {
      this.setState({ error });
    }
  }

  async deleteReservations() {
    try {
      await this.props.api.reservation.clear();
      this.setState({ reservations: [], showModal: false });
    } catch (error) {
      this.setState({ error, showModal: false });
    }
  }

  getModal() {
    const { error, showModal } = this.state;
    // eslint-disable-next-line max-len
    const message = 'Êtes-vous certains de vouloir supprimer TOUTES les réservations ? Ceci est IRRÉVERSIBLE. Ne le faîtes pas à moins d\'être certain de ne pas avoir de réservation pour la session en cours.';

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
        message={message}
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
