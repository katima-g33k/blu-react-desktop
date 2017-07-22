import React, { Component } from 'react';
import moment from 'moment';

import API from '../../../lib/API';
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
    this.decreaseStatus = this.decreaseStatus.bind(this);
    this.increaseStatus = this.increaseStatus.bind(this);
    this.reserve = this.reserve.bind(this);
    this.removeReservation = this.removeReservation.bind(this);
    this.renewParentAccount = this.renewParentAccount.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.updateStorage = this.updateStorage.bind(this);
    this.getActions = this.getActions.bind(this);
    this.getModal = this.getModal.bind(this);
  }

  componentWillMount() {
    this.getItem(this.props.params.id);
  }

  componentWillReceiveProps(props) {
    this.getItem(props.params.id);
  }

  getItem(id) {
    API.item.select(id, {}, (error, res) => {
      if (error) {
        this.setState({ error });
        return;
      }

      this.setState({ item: new Item(res) });
    });
  }

  decreaseStatus() {
    const newStatus = this.state.item.isValid ? Item.STATUS.OUTDATED : Item.STATUS.REMOVED;
    this.updateStatus(newStatus);
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

  increaseStatus() {
    const newStatus = this.state.item.isRemoved ? Item.STATUS.OUTDATED : Item.STATUS.VALID;
    this.updateStatus(newStatus);
  }

  renewParentAccount(no) {
    API.member.renew(no);
  }

  reserve(parent) {
    const { item } = this.state;

    API.reservation.insert(parent.no, item.id, (error, res) => {
      if (error) {
        this.setState({ error, showModal: null });
        return;
      }

      this.renewParentAccount(parent.no);
      item.reservation.push({
        id: res.id,
        date: moment().format(),
        item,
        parent: new Member(parent),
      });

      this.setState({ item, showModal: null });
    });
  }

  updateStatus(newStatus) {
    API.item.updateStatus(this.props.params.id, newStatus, (error) => {
      if (error) {
        this.setState({ error });
        return;
      }

      const { item } = this.state;
      item.updateStatus(newStatus);
      this.setState({ item });
    });
  }

  updateStorage(event, value) {
    const storage = value.replace(/\D+/g, ' ').split(/\D/).sort((a, b) => a - b);

    API.item.updateStorage(this.props.params.id, storage, (error) => {
      if (error) {
        this.setState({ error, showModal: null });
        return;
      }

      const { item } = this.state;
      item.storage = storage;
      this.setState({ item, showModal: null });
    });
  }

  getActions() {
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
          disabled: this.state.item.isValid || this.state.item.isRemoved,
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
    ];
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
      case 'reserve':
        return (
          <SearchModal
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
    ) : (<Spinner/>);
  }
}

ItemViewContainer.propTypes = {
  params: React.PropTypes.shape(),
};
