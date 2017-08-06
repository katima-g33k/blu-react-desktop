import React, { Component } from 'react';
import { Col, Panel, Row } from 'react-bootstrap';

import API from '../../lib/API';
import I18n from '../../lib/i18n/i18n';
import { InformationModal } from '../general/modals';
import Item from '../../lib/models/Item';
import Spinner from '../general/Spinner';
import statusHelper from '../../lib/statusHelper';
import TableLayout from '../general/TableLayout';

const columns = [
  {
    dataField: 'id',
    isKey: true,
    hidden: true,
  },
  {
    dataField: 'name',
    label: 'Titre',
    dataSort: true,
  },
  {
    dataField: 'publication',
    label: 'Publication',
    dataSort: true,
    width: '105px',
  },
  {
    dataField: 'edition',
    label: 'Édition',
    dataSort: true,
    width: '80px',
  },
  {
    dataField: 'editor',
    label: 'Éditeur',
    dataSort: true,
  },
  {
    dataField: 'author',
    label: 'Auteur.e.s',
    dataSort: true,
    dataFormat: (field, item) => item.authorString,
  },
  {
    dataField: 'subject',
    label: 'Matière',
    width: '200px',
    dataSort: true,
    dataFormat: ({ name }) => name.replace(/\(.+\)/, '').trim(),
  },
  {
    dataField: 'status',
    label: 'Status',
    width: '90px',
    dataSort: true,
    dataFormat: statusHelper.getLabel,
    exportDataFormat: status => status,
  },
];

export default class ItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      items: [],
    };

    this.columns = columns;
    this.renderModal = this.renderModal.bind(this);
  }

  componentWillMount() {
    API.item.list((error, res) =>
      this.setState({
        error,
        items: error ? [] : res.map(data => new Item(data)),
        loading: false,
      })
    );
  }

  renderModal() {
    const { error } = this.state;

    if (error) {
      return (
        <InformationModal
          message={error.message}
          onClick={() => this.setState({ error: null })}
          title={`Erreur ${error.code}`}
        />
      );
    }

    return null;
  }

  render() {
    const { items, loading } = this.state;

    return (
      <Panel header={I18n.t('Admin.itemList.title')}>
        <Row>
          <Col md={12}>
            {!loading ? (
              <TableLayout
                columns={this.columns}
                data={items}
                exportable
                placeholder={'Aucun ouvrage dans le système'}
                title={`Liste des ouvrages (${items.length})`}
              />
            ) : (<Spinner/>)}
          </Col>
        </Row>
        {this.renderModal()}
      </Panel>
    );
  }
}
