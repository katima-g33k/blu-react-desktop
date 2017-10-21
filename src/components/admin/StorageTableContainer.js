import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import { ConfirmModal, InformationModal } from '../general/modals';
import Storage from '../../lib/models/Storage';
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
    width: '150px',
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
      error: null,
      storage: [],
      showModal: false,
    };

    this.actions = actions;
    actions.find(action => action.name === 'delete-storage').onClick = () => {
      this.setState({ showModal: true });
    };
  }

  static propTypes = {
    api: PropTypes.shape().isRequired,
  }

  async componentWillMount() {
    try {
      const res = await this.props.api.item.storage.list();
      const storage = Object.keys(res).map((key) => {
        const item = res[key].sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }

          return 1;
        });
        return new Storage({ no: key, item });
      });
      this.setState({ storage });
    } catch (error) {
      this.setState({ error });
    }
  }

  deleteStorage = async () => {
    try {
      await this.props.api.item.storage.clear();
      this.setState({ storage: [], showModal: false });
    } catch (error) {
      this.setState({ error });
    }
  }

  getModal = () => {
    const { error, showModal } = this.state;
    // eslint-disable-next-line max-len
    const message = 'Êtes-vous certains de vouloir vider les caisses de rangement ? Ceci est IRRÉVERSIBLE. Ne le faîtes pas à moins d\'être certain de ne plus avoir besoin des caisses présentement enregistrées.';

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
