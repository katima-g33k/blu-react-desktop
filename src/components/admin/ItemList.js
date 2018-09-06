/* eslint class-methods-use-this: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Panel, Row } from 'react-bootstrap';

import i18n from '../../lib/i18n';
import { Item } from '../../lib/models';
import Spinner from '../general/Spinner';
import statusHelper from '../../lib/statusHelper';
import SubjectSelector from '../../containers/SubjectSelectorContainer';
import TableLayout from '../general/TableLayout';

export default class ItemList extends Component {
  static propTypes = {
    fetch: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.instanceOf(Item)),
  }

  static defaultProps = {
    items: [],
    isLoading: false,
  }

  state = {
    valid: true,
    outdated: true,
    removed: true,
    subject: 0,
  };

  componentDidMount() {
    this.props.fetch();
  }

  get columns() {
    return [
      {
        dataField: 'id',
        isKey: true,
        hidden: true,
      },
      {
        dataField: 'name',
        label: i18n('Admin.itemList.table.columns.name'),
        dataSort: true,
      },
      {
        dataField: 'publication',
        label: i18n('Admin.itemList.table.columns.publication'),
        dataSort: true,
        width: '105px',
      },
      {
        dataField: 'edition',
        label: i18n('Admin.itemList.table.columns.edition'),
        dataSort: true,
        width: '80px',
      },
      {
        dataField: 'editor',
        label: i18n('Admin.itemList.table.columns.editor'),
        dataSort: true,
      },
      {
        dataField: 'author',
        label: i18n('Admin.itemList.table.columns.author'),
        dataSort: true,
        dataFormat: (field, item) => item.authorString,
      },
      {
        dataField: 'subject',
        label: i18n('Admin.itemList.table.columns.subject'),
        width: '200px',
        dataSort: true,
        dataFormat: ({ name }) => name.replace(/\(.+\)/, '').trim(),
      },
      {
        dataField: 'inStock',
        label: i18n('Admin.itemList.table.columns.inStock'),
        dataSort: true,
        width: '100px',
        dataFormat: (_, item) => item.stats.inStock,
      },
      {
        dataField: 'status',
        label: i18n('Admin.itemList.table.columns.status'),
        width: '90px',
        dataSort: true,
        dataFormat: (field, item) => statusHelper.getLabel(item),
        exportDataFormat: (field, item) => item.getStatusString(),
      },
    ];
  }

  getFilteredData = () => {
    const { outdated, removed, subject, valid } = this.state;

    return this.props.items.filter((item) => {
      const statusOk = (removed && item.isRemoved) || (outdated && item.isOutdated) || (valid && item.isValid);
      const subjectOk = !subject || subject === item.subject.id;

      return subjectOk && statusOk;
    });
  }

  get filters() {
    const checkboxFilters = ['valid', 'outdated', 'removed'];

    return [
      {
        component: (<SubjectSelector onChange={this.handleOnSubjectChange} />),
        key: 'subject',
      },
      ...checkboxFilters.map(key => ({
        key,
        label: i18n(`Admin.itemList.table.filters.${key}`),
        type: 'checkbox',
        checked: this.state[key],
        onChange: this.handleOnFilterChange,
      })),
    ];
  }

  handleOnFilterChange = event => this.setState({ [event.target.id]: event.target.checked })

  handleOnSubjectChange = (event, { id }) => this.setState({ subject: id })

  render() {
    const items = this.getFilteredData();

    return (
      <Panel header={i18n('Admin.itemList.title')}>
        <Row>
          <Col md={12}>
            {!this.props.isLoading ? (
              <TableLayout
                columns={this.columns}
                data={items}
                filters={this.filters}
                exportable
                placeholder={i18n('Admin.itemList.table.placeholder')}
                title={i18n('Admin.itemList.table.title', { items: items.length })}
              />
            ) : (<Spinner />)}
          </Col>
        </Row>
      </Panel>
    );
  }
}
