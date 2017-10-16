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
    dataField: 'inStock',
    label: 'En Stock',
    dataSort: true,
    width: '100px',
    dataFormat: (_, item) => item.stats.inStock,
  },
  {
    dataField: 'status',
    label: 'Status',
    width: '90px',
    dataSort: true,
    dataFormat: (field, item) => statusHelper.getLabel(item),
    exportDataFormat: (field, item) => item.getStatusString(),
  },
];

export default class ItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      error: null,
      filters: {
        valid: true,
        outdated: true,
        removed: true,
        subject: null,
      },
      items: [],
      loading: true,
    };

    this.columns = columns;
    this.updateFilters = this.updateFilters.bind(this);
    this.getFilteredData = this.getFilteredData.bind(this);
    this.getFilters = this.getFilters.bind(this);
    this.renderModal = this.renderModal.bind(this);
  }

  componentWillMount() {
    API.category.select((error, res) => {
      this.setState({
        error,
        categories: error ? [] : res.map(data => ({
          label: data.name,
          options: data.subject.map(({ id, name }) => ({ label: name, value: id })),
        })),
      });
    });

    API.item.list((error, res) =>
      this.setState({
        error,
        items: error ? [] : res.map(data => new Item(data)),
        loading: false,
      }),
    );
  }

  getFilteredData() {
    const { items } = this.state;
    const { outdated, removed, subject, valid } = this.state.filters;

    return items.filter((item) => {
      const { isRemoved, isOutdated, isValid } = item;
      const status = (removed && isRemoved) || (outdated && isOutdated) || (valid && isValid);

      return subject ? status && subject === item.subject.id : status;
    });
  }

  updateFilters(key, value) {
    const { filters } = this.state;
    filters[key] = value;
    this.setState({ filters });
  }

  getFilters() {
    const { outdated, removed, subject, valid } = this.state.filters;

    return [
      {
        key: 'subject',
        label: 'Matière',
        type: 'select',
        optgroups: this.state.categories,
        value: subject || '',
        onChange: event => this.updateFilters('subject', +event.target.value),
      },
      {
        key: 'valid',
        label: 'Valide',
        type: 'checkbox',
        checked: valid,
        onChange: event => this.updateFilters('valid', event.target.checked),
      },
      {
        key: 'outdated',
        label: 'Désuet',
        type: 'checkbox',
        checked: outdated,
        onChange: event => this.updateFilters('outdated', event.target.checked),
      },
      {
        key: 'removed',
        label: 'Retiré',
        type: 'checkbox',
        checked: removed,
        onChange: event => this.updateFilters('removed', event.target.checked),
      },
    ];
  }

  renderModal() {
    const { error } = this.state;

    return error && (
      <InformationModal
        message={error.message}
        onClick={() => this.setState({ error: null })}
        title={`Erreur ${error.code}`}
      />
    );
  }

  render() {
    const { loading } = this.state;
    const items = this.getFilteredData();

    return (
      <Panel header={I18n.t('Admin.itemList.title')}>
        <Row>
          <Col md={12}>
            {!loading ? (
              <TableLayout
                columns={this.columns}
                data={items}
                filters={this.getFilters()}
                exportable
                placeholder={'Aucun ouvrage dans le système'}
                title={`Liste des ouvrages (${items.length})`}
              />
            ) : (<Spinner />)}
          </Col>
        </Row>
        {this.renderModal()}
      </Panel>
    );
  }
}
