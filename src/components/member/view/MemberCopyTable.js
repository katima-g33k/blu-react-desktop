import React, { Component } from 'react';

import highlightSearchResults from '../../../lib/highlightSearchResults';
import i18n from '../../../lib/i18n';
import { sortString } from '../../../lib/sort';

import CopyTable from '../../../containers/CopyTableContainer';

export default class MemberCopyTable extends Component {
  columns = [
    {
      dataField: 'id',
      hidden: true,
      isKey: true,
    },
    {
      dataField: 'name',
      dataFormat: (cell, { item }, extra = {}) => (
        <div>
          <a href={`/item/view/${item.id}`}>
            {highlightSearchResults(item.name, extra.highlight)}
          </a>
          <div>
            {i18n('TableColumns.memberCopy.editor', { editor: item.editor })}
          </div>
          <div>
            {i18n('TableColumns.memberCopy.edition', { edition: item.edition })}
          </div>
        </div>
      ),
      dataSort: true,
      defaultSort: true,
      formatExtraData: { props: ['highlight'] },
      label: i18n('TableColumns.memberCopy.title'),
      sortFunc: (a, b, order) => sortString(a.item.name, b.item.name, order),
      tdStyle: { whiteSpace: 'normal' },
    },
  ];

  formatRow = (row) => {
    if (row.item.status && row.item.status.REMOVED) {
      return 'removed';
    }

    return null;
  };

  render() {
    return (
      <CopyTable
        columns={this.columns}
        formatRow={this.formatRow}
      />
    );
  }
}
