import React, { Component } from 'react';
import { I18n, Translate } from 'react-i18nify';

import Table from '../../general/Table';

export default class CopyTable extends Component {
  constructor(props) {
    super(props);
    this.formatRow = this.formatRow.bind(this);
  }

  formatRow(row, index) {
    if (row.item && row.item.status && row.item.status.REMOVED) {
      return 'removed';
    }

    if ((row.member && !row.member.account.isActive) ||
        (row.item && row.item.status && row.item.status.OUTDATED)) {
      return 'archived';
    }

    // Striped
    return index % 2 === 0 ? 'striped-row' : '';
  }


  render() {
    return (
      <section>
        <h4>
          <Translate value="MemberView.copies.title" />
        </h4>
        <Table
          columns={this.props.columns}
          data={this.props.data}
          options={{
            defaultSortName: this.props.columns.find(column => column.defaultSort).dataField,
            defaultSortOrder: 'asc',
          }}
          placeholder={I18n.t('MemberView.copies.none')}
          sortable
          rowClass={this.formatRow}
        />
        {this.props.modal}
      </section>
    );
  }
}

CopyTable.propTypes = {
  columns: React.PropTypes.array.isRequired,
  data: React.PropTypes.array.isRequired,
  modal: React.PropTypes.shape(),
};
