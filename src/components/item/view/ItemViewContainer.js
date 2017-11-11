import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import moment from 'moment';

import { ConfirmModal, InformationModal, InputModal, SearchModal } from '../../general/modals';
import Member from '../../../lib/models/Member';
import Item from '../../../lib/models/Item';
import ItemView from './ItemView';
import Spinner from '../../general/Spinner';

const status = {
  VALID: {
    label: 'Valide',
    style: 'success',
  },
  OUTDATED: {
    label: 'Désuet',
    style: 'warning',
  },
  REMOVED: {
    label: 'Retiré',
    style: 'danger',
  },
};

export default class ItemViewContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      item: null,
      showModal: null,
    };

    this.getItem = this.getItem.bind(this);
    this.remove = this.remove.bind(this);
    this.decreaseStatus = this.decreaseStatus.bind(this);
    this.increaseStatus = this.increaseStatus.bind(this);
    this.reserve = this.reserve.bind(this);
    this.removeReservation = this.removeReservation.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.updateStorage = this.updateStorage.bind(this);
    this.getActions = this.getActions.bind(this);
    this.getModal = this.getModal.bind(this);
  }

  static propTypes = {
    api: PropTypes.shape().isRequired,
  }

  async componentWillMount() {
    await this.getItem(this.props.params.id);
  }

  async componentWillReceiveProps(props) {
    await this.getItem(props.params.id);
  }

  async getItem(id) {
    try {
      const res = await this.props.api.item.get(id);
      this.setState({ item: new Item(res) });
    } catch (error) {
      this.setState({ error });
    }
  }

  async remove() {
    try {
      await this.props.api.item.delete(this.state.item.id);
      this.setState({ showModal: 'deleted' });
    } catch (error) {
      this.setState({ error });
    }
  }

  decreaseStatus = async () => {
    const newStatus = this.state.item.isValid ? Item.STATUS.OUTDATED : Item.STATUS.REMOVED;
    await this.updateStatus(newStatus);
  }

  removeReservation(deletedReservation) {
    const { item } = this.state;

    if (deletedReservation.copy) {
      item.copies.find(copy => copy.id === deletedReservation.copy.id).cancelReservation();
    } else {
      item.reservation = item.reservation.filter(reservation => reservation !== deletedReservation);
    }

    this.setState({ item });
  }

  increaseStatus = async () => {
    const newStatus = this.state.item.isRemoved ? Item.STATUS.OUTDATED : Item.STATUS.VALID;
    await this.updateStatus(newStatus);
  }

  async reserve(parent) {
    const { item } = this.state;

    try {
      const res = await this.props.api.reservation.insert(parent.no, item.id);

      item.reservation.push({
        id: res.id,
        date: moment().format(),
        item,
        parent: new Member(parent),
      });

      this.setState({ item, showModal: null });
    } catch (error) {
      this.setState({ error, showModal: null });
    }
  }

  async updateStatus(newStatus) {
    try {
      await this.props.api.item.status.set(this.props.params.id, newStatus);
      const { item } = this.state;
      item.updateStatus(newStatus);
      this.setState({ item });
    } catch (error) {
      this.setState({ error });
    }
  }

  updateStorage = async (event, value) => {
    event.preventDefault();

    const storage = value.replace(/\D+/g, ' ').split(/\D/).sort((a, b) => a - b);

    try {
      await this.props.api.item.storage.set(this.props.params.id, storage);
      const { item } = this.state;
      item.storage = storage;
      this.setState({ item, showModal: null });
    } catch (error) {
      this.setState({ error, showModal: null });
    }
  }

  getActions() {
    const { isAdmin } = JSON.parse(sessionStorage.getItem('user'));

    return [
      {
        label: 'Modifier',
        href: `/item/edit/${this.props.params.id}`,
        style: 'primary',
      },
      {
        custom: true,
        iconLeft: 'minus',
        iconRight: 'plus',
        label: status[this.state.item.getStatus()].label,
        bsStyleCenter: status[this.state.item.getStatus()].style,
        leftButton: {
          onClick: this.decreaseStatus,
          disabled: this.state.item.isRemoved,
        },
        rightButton: {
          onClick: this.increaseStatus,
          disabled: this.state.item.isValid || (!isAdmin && this.state.item.isRemoved),
        },
      },
      {
        label: 'Gérer les caisses',
        style: 'primary',
        onClick: (event) => {
          event.preventDefault();
          this.setState({ showModal: 'storage' });
        },
      },
      {
        label: 'Réserver',
        style: 'primary',
        onClick: (event) => {
          event.preventDefault();
          this.setState({ showModal: this.state.item.isInStock ? 'reserveWarning' : 'reserve' });
        },
      },
    ].concat(isAdmin ? [{
      label: 'Supprimer',
      style: 'danger',
      onClick: (event) => {
        event.preventDefault();
        this.setState({ showModal: 'remove' });
      },
      disabled: this.state.item && this.state.item.copies.length,
    }] : []);
  }

  getModal() {
    const { error, item, showModal } = this.state;

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
      case 'remove':
        return (
          <ConfirmModal
            confirmationStyle={'danger'}
            confirmText={'Supprimer'}
            message={'Êtes-vous certain de vouloir supprimer cet ouvrage? Cette action est IRRÉVERSIBLE'}
            onCancel={() => this.setState({ showModal: null })}
            onConfirm={this.remove}
            title={'Suppression d\'un ouvrage'}
          />
        );
      case 'deleted':
        return (
          <InformationModal
            message={'L\'ouvrage a été supprimé.'}
            onClick={() => browserHistory.push('/search')}
            title="Ouvrage supprimé"
          />
        );
      case 'reserve':
        return (
          <SearchModal
            {...this.props}
            disableArchive
            onCancel={() => this.setState({ activeCopy: null, showModal: null })}
            onRowClick={this.reserve}
            type="parent"
          />
        );
      case 'reserveWarning':
        return (
          <ConfirmModal
            message={'Attention! Il y a des exemplaires en stock Voulez-vous vraiment réserver l\'ouvrage ?'}
            onCancel={() => this.setState({ showModal: null })}
            onConfirm={() => this.setState({ showModal: 'reserve' })}
            title={'Réservation d\'un ouvrage'}
          />
        );
      case 'storage':
        return (
          <InputModal
            message={'Veuillez entrer les caisses de rangements, séparé par ;'}
            onCancel={() => this.setState({ showModal: null })}
            onSave={this.updateStorage}
            title={'Modifier les caisses de rangements'}
            value={item.storage.join('; ')}
          />
        );
      default:
        return null;
    }
  }

  render() {
    return this.state.item ? (
      <ItemView
        data={this.state.item}
        actions={this.getActions()}
        modal={this.getModal()}
        onReservationDeleted={this.removeReservation}
      />
    ) : (<Spinner />);
  }
}

ItemViewContainer.propTypes = {
  params: React.PropTypes.shape(),
};
