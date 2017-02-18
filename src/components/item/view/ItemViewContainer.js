import React, { Component } from 'react';

import HTTP from '../../../lib/HTTP';
import InputModal from '../../general/modals/InputModal';
import Item from '../../../lib/models/Item';
import ItemView from './ItemView';
import settings from '../../../settings';

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
      item: null,
      showModal: null,
    };

    this.decreaseStatus = this.decreaseStatus.bind(this);
    this.increaseStatus = this.increaseStatus.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.updateStorage = this.updateStorage.bind(this);
    this.getActions = this.getActions.bind(this);
    this.getModal = this.getModal.bind(this);
  }

  componentWillMount() {
    const data = {
      id: this.props.params.id,
    };

    HTTP.post(`${settings.apiUrl}/item/select`, data, (err, res) => {
      if (res) {
        this.setState({ item: new Item(res) });
      }
    });
  }

  decreaseStatus() {
    const newStatus = this.state.item.isValid ? Item.STATUS.OUTDATED : Item.STATUS.REMOVED;
    this.updateStatus(newStatus);
  }

  increaseStatus() {
    const newStatus = this.state.item.isRemoved ? Item.STATUS.OUTDATED : Item.STATUS.VALID;
    this.updateStatus(newStatus);
  }

  updateStatus(newStatus) {
    const data = {
      id: this.props.params.id,
      status: newStatus,
    };

    HTTP.post(`${settings.apiUrl}/item/updateStatus`, data, (err) => {
      if (err) {
        // TODO: Display erorr message
        return;
      }

      const item = this.state.item;
      item.updateStatus(newStatus);
      this.setState({ item });
    });
  }

  updateStorage(event, value) {
    const storage = value.replace(/\D+/g, ' ').split(/\D/).sort((a, b) => a - b);
    const data = {
      id: this.props.params.id,
      storage,
    };

    HTTP.post(`${settings.apiUrl}/item/update_storage`, data, (err) => {
      if (err) {
        // TODO: Display erorr message
        return;
      }

      const item = this.state.item;
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
    ];
  }

  getModal() {
    return this.state.showModal === 'storage' ? (
      <InputModal
        message={'Veuillez entrer les caisses de rangements, séparé par ;'}
        onCancel={() => this.setState({ showModal: null })}
        onSave={this.updateStorage}
        title={'Modifier les caisses de rangements'}
        value={this.state.item.storage.join('; ')}
      />
    ) : null;
  }

  render() {
    return this.state.item ? (
      <ItemView
        data={this.state.item}
        actions={this.getActions()}
        modal={this.getModal()}
      />
    ) : null;
  }
}

ItemViewContainer.propTypes = {
  params: React.PropTypes.shape(),
};
