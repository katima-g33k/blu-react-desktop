import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import { Copy } from '../../../lib/models';
import { formatShortDate } from '../../../lib/dateHelper';
import I18n from '../../../lib/i18n';
import { sortDate, sortNumber } from '../../../lib/sort';
import { TableLayout } from '../../general';

const DEFAULT_FILTER_TYPE = 'checkbox';
const SEARCH_FILTER_TYPE = 'input';
const STRIPED_ROW_CLASS = 'striped-row';

export default class CopyTable extends Component {
  static propTypes = {
    cancelReservation: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    data: PropTypes.arrayOf(PropTypes.instanceOf(Copy)).isRequired,
    deleteCopy: PropTypes.func.isRequired,
    filters: PropTypes.shape().isRequired,
    formatRow: PropTypes.func.isRequired,
    refundCopy: PropTypes.func.isRequired,
    reserveCopy: PropTypes.func.isRequired,
    sellCopy: PropTypes.func.isRequired,
    sellCopyHalfPrice: PropTypes.func.isRequired,
    updateCopy: PropTypes.func.isRequired,
    updateFilter: PropTypes.func.isRequired,
  };

  get filters() {
    return Object.keys(this.props.filters).map(filter => ({
      id: filter,
      label: I18n(`CopyTable.filters.${filter}`),
      onChange: this.props.updateFilter,
      value: this.props.filters[filter],
      type: filter === 'search' ? SEARCH_FILTER_TYPE : DEFAULT_FILTER_TYPE,
    }));
  }

  get columns() {
    return this.props.columns.concat([
      {
        dataField: 'dateAdded',
        label: I18n('TableColumns.memberCopy.added'),
        dataSort: true,
        width: '120px',
        dataFormat: date => formatShortDate(date),
        sortFunc: (a, b, order) => sortDate(a.dateAdded, b.dateAdded, order),
      },
      {
        dataField: 'dateSold',
        label: I18n('TableColumns.memberCopy.sold'),
        dataSort: true,
        width: '120px',
        dataFormat: date => formatShortDate(date),
        sortFunc: (a, b, order) => sortDate(a.dateSold, b.dateSold, order),
      },
      {
        dataField: 'datePaid',
        label: I18n('TableColumns.memberCopy.paid'),
        dataSort: true,
        width: '120px',
        dataFormat: date => formatShortDate(date),
        sortFunc: (a, b, order) => sortDate(a.datePaid, b.datePaid, order),
      },
      {
        dataField: 'priceString',
        label: I18n('TableColumns.memberCopy.price'),
        dataSort: true,
        width: '60px',
        sortFunc: (a, b, order) => sortNumber(a.price, b.price, order),
        dataFormat: (price, copy) => (
          <Button
            bsStyle="link"
            onClick={() => this.props.updateCopy(copy)}
            disabled={copy.isPaid || copy.isSold || copy.isReserved}
          >
            {price}
          </Button>
        ),
      },
    ]);
  }

  getRowActions = (copy) => {
    if (copy.isPaid) {
      return [];
    }

    if (copy.isSold) {
      return [
        {
          bsStyle: 'danger',
          glyph: 'ban-circle',
          help: I18n('CopyTable.help.cancelSell'),
          onClick: this.props.refundCopy,
        },
      ];
    }

    if (copy.isReserved) {
      return [
        {
          bsStyle: 'primary',
          glyph: 'ban-circle',
          help: I18n('CopyTable.help.cancelReservation'),
          onClick: this.props.cancelReservation,
        },
        {
          help: I18n('CopyTable.help.sellHalfPrice'),
          label: '$',
          onClick: this.props.sellCopyHalfPrice,
        },
      ];
    }

    return [
      {
        bsStyle: 'primary',
        glyph: 'user',
        help: I18n('CopyTable.help.reserve'),
        onClick: this.props.reserveCopy,
      },
      {
        help: I18n('CopyTable.help.sellHalfPrice'),
        label: '$',
        onClick: this.props.sellCopyHalfPrice,
      },
      {
        bsStyle: 'success',
        help: I18n('CopyTable.help.sell'),
        label: '$$',
        onClick: this.props.sellCopy,
      },
      {
        bsStyle: 'danger',
        glyph: 'trash',
        help: I18n('CopyTable.help.delete'),
        onClick: this.props.deleteCopy,
      },
    ];
  }

  formatRow = (copy, index) => this.props.formatRow(copy) || (index % 2 ? STRIPED_ROW_CLASS : '')

  render() {
    return (
      <TableLayout
        columns={this.columns}
        data={this.props.data}
        filters={this.filters}
        noStrip
        rowActions={this.getRowActions}
        rowClass={this.formatRow}
        title={I18n('MemberView.copies.title')}
      />
    );
  }
}
