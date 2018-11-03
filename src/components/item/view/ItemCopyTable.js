import React, { Component } from 'react';

import CopyTable from '../../../containers/CopyTableContainer';
import highlightSearchResults from '../../../lib/highlightSearchResults';
import I18n from '../../../lib/i18n';
import { link } from '../../../lib/link';
import { sortString } from '../../../lib/sort';

export default class ItemCopyTable extends Component {
  columns = [
    {
      dataField: 'id',
      isKey: true,
      hidden: true,
    },
    {
      dataField: 'member',
      defaultSort: true,
      dataSort: true,
      formatExtraData: { props: ['highlight'] },
      label: I18n('TableColumns.itemCopy.member'),
      dataFormat: (member, copy, extra = {}) => {
        const label = `${copy.isDonated ? 'BLU - ' : ''}${member.name}`;
        return link(`/member/view/${member.no}`, highlightSearchResults(label, extra.highlight));
      },
      sortFunc: sortString,
      tdStyle: { whiteSpace: 'normal' },
    },
  ];

  formatRow = ({ member }) => {
    if (!member.account.isActive) {
      return 'inactive';
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
