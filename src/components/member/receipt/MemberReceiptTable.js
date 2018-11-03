import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Copy } from '../../../lib/models';
import { formatShortDate } from '../../../lib/dateHelper';
import i18n from '../../../lib/i18n';
import { sortString } from '../../../lib/sort';
import { Table } from '../../general';

export default class MemberReceiptTable extends Component {
  static propTypes = {
    copies: PropTypes.arrayOf(PropTypes.instanceOf(Copy)),
  };

  static defaultProps = {
    copies: [],
  };

  columns = [
    {
      dataField: 'id',
      hidden: true,
      isKey: true,
    },
    {
      dataField: 'name',
      dataFormat: (cell, { item }) => item.name,
      label: i18n('MemberReceipt.table.columns.title'),
      sortFunc: sortString,
      tdStyle: { whiteSpace: 'normal' },
    },
    {
      dataField: 'author',
      dataFormat: (cell, { item }) => item.authorString,
      label: i18n('MemberReceipt.table.columns.author'),
      tdStyle: { whiteSpace: 'normal' },
    },
    {
      dataField: 'dateAdded',
      label: i18n('MemberReceipt.table.columns.dateAdded'),
      dataFormat: formatShortDate,
      width: '67px',
    },
    {
      dataField: 'dateSold',
      label: i18n('MemberReceipt.table.columns.dateSold'),
      dataFormat: formatShortDate,
      width: '75px',
    },
    {
      dataField: 'datePaid',
      label: i18n('MemberReceipt.table.columns.datePaid'),
      dataFormat: formatShortDate,
      width: '120px',
    },
    {
      dataField: 'priceString',
      label: i18n('MemberReceipt.table.columns.price'),
      width: '30px',
    },
  ];

  render() {
    return (
      <Table
        columns={this.columns}
        data={this.props.copies}
        options={{
          defaultSortName: 'name',
          defaultSortOrder: 'asc',
        }}
        placeholder={i18n('MemberReceipt.table.placeholder')}
      />
    );
  }
}
