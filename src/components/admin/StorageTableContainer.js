import React, { Component } from 'react';
import { Link } from 'react-router';

import { ConfirmModal } from '../general/modals';
import HTTP from '../../lib/HTTP';
import Storage from '../../lib/models/Storage';
import settings from '../../settings';
import TableLayout from '../general/TableLayout';

const actions = [
  {
    bsStyle: 'danger',
    icon: 'trash',
    label: 'Vider',
    name: 'delete-storage',
  },
];

const columns = [
  {
    dataField: 'no',
    isKey: true,
    label: 'Numéro de caisse',
    width: '150',
  },
  {
    dataField: 'content',
    label: 'Contenu',
    dataFormat(field, storage) {
      return (
        <div>
          {storage.item.map(item => (
            <div key={`${storage.no}_${item.id}`}>
              <Link to={{ pathname: `/item/view/${item.id}` }}>
                {item.name}
              </Link>
            </div>
          ))}
        </div>
      );
    },
  },
];

export default class StorageTableContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storage: [],
      showModal: false,
    };

    this.deleteStorage = this.deleteStorage.bind(this);
    this.getModal = this.getModal.bind(this);

    this.actions = actions;
    actions.find(action => action.name === 'delete-storage').onClick = () => {
      this.setState({ showModal: true });
    };
  }

  componentWillMount() {
    HTTP.post(`${settings.apiUrl}/storage/select`, {}, (err, res) => {
      if (err) {
        // TODO: Display erorr message
        return;
      }

      const storage = Object.keys(res).map(key => {
        const item = res[key].sort((a, b) => a.name < b.name ? -1 : 1);
        return new Storage({ no: key, item });
      });
      this.setState({ storage });
    });
  }

  deleteStorage() {
    HTTP.post(`${settings.apiUrl}/storage/delete`, {}, (err) => {
      if (err) {
        // TODO: Display erorr message
        return;
      }

      this.setState({ storage: [], showModal: false });
    });
  }

  getModal() {
    return this.state.showModal ? (
      <ConfirmModal
        message={'Êtes-vous certains de vouloir vider les caisses de rangement ?'}
        onCancel={() => this.setState({ showModal: false })}
        onConfirm={this.deleteStorage}
        title={'Vider les caisses de rangement'}
      />
    ) : null;
  }

  render() {
    return (
      <TableLayout
        actions={actions}
        columns={columns}
        data={this.state.storage}
        modal={this.getModal()}
        placeholder={'Aucune réservation dans le système'}
        title={'Liste des caisses de rangement'}
      />
    );
  }
}
