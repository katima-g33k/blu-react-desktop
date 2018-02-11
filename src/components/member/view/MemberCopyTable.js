import React, { Component } from 'react';

import CopyTable from '../../../containers/CopyTableContainer';
import highlightSearchResults from '../../../lib/highlightSearchResults';
import I18n from '../../../lib/i18n';
import { link } from '../../../lib/link';
import { sortNumber, sortString } from '../../../lib/sort';

export default class MemberCopyTable extends Component {
  columns = [
    {
      dataField: 'id',
      hidden: true,
      isKey: true,
    },
    {
      dataField: 'name',
      dataFormat: (cell, { item }, extra = {}) => {
        const label = highlightSearchResults(item.name, extra.highlight);
        return link(`/item/view/${item.id}`, label);
      },
      dataSort: true,
      defaultSort: true,
      formatExtraData: { props: ['highlight'] },
      label: I18n('TableColumns.memberCopy.title'),
      sortFunc: (a, b, order) => sortString(a.item.name, b.item.name, order),
      tdStyle: { whiteSpace: 'normal' },
    },
    {
      dataField: 'editor',
      dataFormat: (cell, { item }, extra = {}) => highlightSearchResults(item.editor, extra.highlight),
      dataSort: true,
      formatExtraData: { props: ['highlight'] },
      label: I18n('TableColumns.memberCopy.editor'),
      sortFunc: (a, b, order) => sortString(a.item.editor, b.item.editor, order),
      tdStyle: { whiteSpace: 'normal' },
      width: '170px',
    },
    {
      dataField: 'edition',
      dataFormat: (cell, { item }) => item.edition,
      dataSort: true,
      label: I18n('TableColumns.memberCopy.edition'),
      sortFunc: (a, b, order) => sortNumber(a.item.edition, b.item.edition, order),
      width: '85px',
    },
  ]

  formatRow = (row) => {
    if (row.item.status && row.item.status.REMOVED) {
      return 'removed';
    }

    return null;
  }

  render() {
    return (
      <CopyTable
        columns={this.columns}
        formatRow={this.formatRow}
      />
    );
  }
}
