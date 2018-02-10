import React, { Component } from 'react';

import CopyTable from '../../../containers/CopyTableContainer';
import highlightSearchResults from '../../../lib/highlightSearchResults';
import I18n from '../../../lib/i18n';
import { link } from '../../../lib/link';
import { sortNumber, sortString } from '../../../lib/sort';

export default class MemberCopyTable extends Component {
  get columns() {
    return [
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
        label: I18n('TableColumns.memberCopy.title'),
        formatExtraData: { props: ['highlight'] },
        sortFunc: (a, b, order) => sortString(a.item.name, b.item.name, order),
        tdStyle: { whiteSpace: 'normal' },
      },
      {
        dataField: 'editor',
        label: I18n('TableColumns.memberCopy.editor'),
        tdStyle: { whiteSpace: 'normal' },
        width: '170px',
        dataSort: true,
        formatExtraData: { props: ['highlight'] },
        dataFormat: (cell, { item }, extra = {}) => highlightSearchResults(item.editor, extra.highlight),
        sortFunc: (a, b, order) => sortString(a.item.editor, b.item.editor, order),
      },
      {
        dataField: 'edition',
        label: I18n('TableColumns.memberCopy.edition'),
        dataSort: true,
        width: '85px',
        dataFormat: (cell, { item }) => item.edition,
        sortFunc: (a, b, order) => sortNumber(a.item.edition, b.item.edition, order),
      },
    ];
  }

  render() {
    return (
      <CopyTable
        {...this.props}
        columns={this.columns}
        rowActions={this.rowActions}
      />
    );
  }
}
